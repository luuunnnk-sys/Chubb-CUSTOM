// src/utils/export/legend.ts
import jsPDF from "jspdf";
import { Project, FloorPlan } from "../../types/types";
import { getEquipmentDefinitions } from "../equipmentDefinitions";

// Convertit un asset (icône) en DataURL pour jsPDF
async function fetchAsDataURL(url: string): Promise<{ dataUrl: string, format: string }> {
  const blob = await fetch(url, { credentials: "omit", mode: "cors" }).then((r) => r.blob());
  const dataUrl = await new Promise<string>((ok) => {
    const fr = new FileReader();
    fr.onload = () => ok(fr.result as string);
    fr.readAsDataURL(blob);
  });

  // Détecter le format à partir de l'extension ou du type MIME
  let format = "PNG";
  if (url.endsWith(".svg") || blob.type === "image/svg+xml") {
    format = "SVG";
  } else if (url.endsWith(".jpg") || url.endsWith(".jpeg") || blob.type === "image/jpeg") {
    format = "JPEG";
  }

  return { dataUrl, format };
}

// Convertir SVG en PNG via canvas pour jsPDF (qui ne supporte pas SVG natif)
async function svgToDataUrl(svgUrl: string, size: number = 64): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, size, size);
        resolve(canvas.toDataURL("image/png"));
      } else {
        reject(new Error("Canvas context unavailable"));
      }
    };
    img.onerror = reject;
    img.src = svgUrl;
  });
}

const conformityRules: Record<Project["sector"], string[]> = {
  tertiaire: [
    "Conformité au Code du Travail (DUERP, extincteurs, formation)",
    "Respect du Règlement ERP (plans, évacuation, désenfumage)",
    "Norme NF X 08-070 (plans & consignes affichés)",
    "Norme EN 54 (détection & alarme certifiée)",
  ],
  industrie: [
    "Maintenance & Contrôles périodiques",
    "Respect des ICPE (Installations Classées)",
    "Règles APSAD / NF C 15-100 (extinction auto, électricité)",
    "Norme SSI NF S 61-931 (conception et maintenance)",
  ],
};

export async function renderLegendAndCompliance(
  pdf: jsPDF,
  project: Project,
  floor: FloorPlan,
  opts: { x: number; y: number; width: number; planWidth: number; planBottomY: number }
): Promise<void> {
  const x0 = opts.x;
  let y = opts.y;
  const colW = opts.width;

  const defs = getEquipmentDefinitions();
  const equipment = floor.equipment ?? [];

  // LIGNES FINES homogènes
  pdf.setLineWidth(0.3);
  pdf.setDrawColor(0);

  // Titre Légende
  pdf.setFont("helvetica", "bold").setFontSize(12);
  pdf.text("Légende du plan", x0, y);
  y += 4;
  pdf.setDrawColor(150);
  pdf.line(x0, y, x0 + colW, y);
  y += 8;

  // Icônes: 28px -> mm
  const ICON_BOX_MM = 28 * 0.264583;

  // Définitions utilisées (on ignore les notes en liste principale)
  const usedDefs = defs.filter((d) => equipment.some((eq) => eq.type === d.type && d.type !== "note"));

  for (const def of usedDefs) {
    const count = equipment.filter((eq) => eq.type === def.type).length;

    // Uniform icon column width for alignment
    const iconColWidth = ICON_BOX_MM;

    // Custom sizes for specific equipment icons (within uniform column)
    let iconW = ICON_BOX_MM;
    let iconH = ICON_BOX_MM;
    let iconOffsetX = 0; // For centering smaller icons

    if (def.type === "vesda") {
      // VESDA is wider than tall (rectangle) - scale to fit in column
      iconW = ICON_BOX_MM;
      iconH = ICON_BOX_MM * 0.55;
    }

    if (def.type === "tubing") {
      // Trait rouge pour tubing
      pdf.setDrawColor(255, 0, 0);
      pdf.setLineWidth(1);
      pdf.line(x0, y + iconColWidth / 2, x0 + iconColWidth, y + iconColWidth / 2);
      pdf.setDrawColor(0);
      pdf.setLineWidth(0.3);
    } else if (def.iconSrc) {
      try {
        let iconData: string;
        // Gérer les SVG en les convertissant en PNG
        if (def.iconSrc.endsWith(".svg")) {
          iconData = await svgToDataUrl(def.iconSrc, 64);
        } else {
          const result = await fetchAsDataURL(def.iconSrc);
          iconData = result.dataUrl;
        }
        // Center icon vertically within the row
        const iconY = y + (iconColWidth - iconH) / 2;
        pdf.addImage(iconData, "PNG", x0 + iconOffsetX, iconY, iconW, iconH);
      } catch (e) {
        console.warn("Icon load failed for", def.type, e);
        pdf.setDrawColor(0);
        pdf.rect(x0, y, iconColWidth, iconColWidth);
      }
    }

    // Uniform label X position for all equipment
    const labelX = x0 + iconColWidth + 4;
    const centerY = y + iconColWidth / 2 + 1;

    pdf.setFont("helvetica", "normal").setFontSize(10);
    const symbol = def.symbol ?? "—";
    pdf.text(`${def.name} (${symbol}) : ${count}`, labelX, centerY);

    y += iconColWidth + 4;
  }

  // Statistiques
  pdf.setDrawColor(150);
  pdf.line(x0, y, x0 + colW, y);
  y += 6;

  pdf.setFont("helvetica", "bold").setFontSize(10);
  pdf.text("Statistiques", x0, y);
  y += 6;

  pdf.setFont("helvetica", "normal").setFontSize(8);
  const totalEquip = (equipment || []).filter((eq: any) => eq.type !== "note" && eq.type !== "tubing").length;
  pdf.text(`Total équipements : ${totalEquip}`, x0, y);
  y += 6;

  const distinctTypes = usedDefs.filter((d) => d.type !== "tubing").length;
  pdf.text(`Types différents : ${distinctTypes}`, x0, y);
  y += 10;

  // Conformité
  pdf.setDrawColor(150);
  pdf.line(x0, y, x0 + colW, y);
  y += 6;

  pdf.setFont("helvetica", "bold").setFontSize(10);
  pdf.text("Conformité", x0, y);
  y += 6;

  pdf.setFont("helvetica", "normal").setFontSize(6);
  for (const rule of conformityRules[project.sector]) {
    pdf.setFillColor(0, 200, 0);
    pdf.circle(x0 + 1.5, y - 1.5, 1.2, "F");
    const wrapped = pdf.splitTextToSize(rule, colW - 8);
    pdf.text(wrapped, x0 + 6, y);
    y += wrapped.length * 4;
  }

  // Pastilles de commentaire (section dédiée, comme avant)
  const notes = (equipment || []).filter((eq) => eq.type === "note");
  if (notes.length > 0) {
    y += 6;
    pdf.setDrawColor(150);
    pdf.line(x0, y, x0 + colW, y);
    y += 8;

    pdf.setFont("helvetica", "bold").setFontSize(10);
    pdf.text("Pastilles de commentaire", x0, y);
    y += 8;

    pdf.setFont("helvetica", "normal").setFontSize(8);
    notes.forEach((note, idx) => {
      const shownIndex = (note as any).index ?? idx + 1;
      // pastille
      pdf.setFillColor(255, 128, 0);
      pdf.circle(x0 + 3, y - 1.5, 2.5, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(7);
      pdf.text(String(shownIndex), x0 + 3, y - 1.2, { align: "center", baseline: "middle" });
      pdf.setTextColor(0, 0, 0);
      // texte
      const text = (note as any).comment || "(Sans texte)";
      const wrapped = pdf.splitTextToSize(text, colW - 14);
      pdf.setFontSize(9);
      pdf.text(wrapped, x0 + 10, y);
      y += Math.max(12, wrapped.length * 4 + 4);
    });
  }

  // === Séparateur vertical + Contexte projet à droite de la légende ===
  const gap = 10; // écart entre légende et contexte (comme avant)
  const ctxX = x0 + colW + gap;

  // Trait vertical homogène (du haut de la colonne à sous le plan)
  pdf.setDrawColor(150);
  pdf.setLineWidth(0.3);
  const vTop = opts.y - 4; // un poil au-dessus du titre
  const vBottom = Math.max(opts.planBottomY, y + 6); // jusqu'au bas utile
  pdf.line(ctxX - (gap / 2), vTop, ctxX - (gap / 2), vBottom);

  if ((project as any).context && String((project as any).context).trim() !== "") {
    const ctxTitleY = opts.y; // aligné au titre "Légende du plan"
    pdf.setFont("helvetica", "bold").setFontSize(12);
    pdf.text("Contexte du projet", ctxX, ctxTitleY);
    pdf.setDrawColor(150);
    pdf.line(ctxX, ctxTitleY + 2, ctxX + colW, ctxTitleY + 2);

    const ctxTextY = ctxTitleY + 10;
    pdf.setFont("helvetica", "normal").setFontSize(10);
    const wrapped = pdf.splitTextToSize(String((project as any).context), colW);
    pdf.text(wrapped, ctxX, ctxTextY);
  }
}
