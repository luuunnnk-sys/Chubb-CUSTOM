import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Project, FloorPlan } from "../../types/types";
import { drawPlanToCanvas } from "./drawing";
import { renderLegendAndCompliance } from "./legend";
import { renderGlobalQuantitiesTable } from "./summaryTable";

/**
 * Capture le cartouche tel qu'affiché à l'écran, en remplaçant les <input>
 * par des <span> sans bordure et avec centrage vertical du texte.
 * Retourne une dataURL PNG HD prête à être ajoutée au PDF.
 */
async function captureCartoucheDataURL(): Promise<string | null> {
  const liveEl = document.getElementById("cartouche-preview");
  if (!liveEl) return null;

  // Clone du cartouche pour snapshot hors-écran
  const clone = liveEl.cloneNode(true) as HTMLElement;

  // ✅ Cacher les éléments d'édition (toolbar, bouton Modifier, select agence)
  clone.querySelectorAll(".cartouche-toolbar").forEach((el) => {
    (el as HTMLElement).style.display = "none";
  });
  clone.querySelectorAll("select").forEach((el) => {
    (el as HTMLElement).style.display = "none";
  });
  clone.querySelectorAll("button").forEach((el) => {
    (el as HTMLElement).style.display = "none";
  });

  // Remplacer tous les inputs par des spans (valeur visible, sans bordure, centrée)
  clone.querySelectorAll("input").forEach((inp) => {
    const i = inp as HTMLInputElement;
    const cs = getComputedStyle(i);
    const value = i.value ?? "";
    const isProjectTitle = i.classList.contains("cartouche-project");

    const h = parseFloat(cs.height) || i.clientHeight || 16;
    const fs = parseFloat(cs.fontSize) || 10;
    const pad = Math.max(0, (h - fs) / 2);

    const span = document.createElement("span");

    // Pour le titre du projet : blanc, majuscules, gras
    if (isProjectTitle) {
      span.textContent = value.toUpperCase();
      span.style.cssText = `
        display: inline-block;
        box-sizing: border-box;
        width: ${cs.width};
        height: ${h}px;
        font-size: 13px;
        font-weight: bold;
        color: #ffffff !important;
        letter-spacing: 1px;
        text-align: center;
        vertical-align: middle;
        padding-top: ${pad}px;
        border: none;
        background: transparent;
      `;
    } else {
      span.textContent = value;
      // Dimensions équivalentes à l'input pour garder la grille/alignements
      span.style.display = "inline-block";
      span.style.boxSizing = "border-box";
      span.style.width = cs.width;
      span.style.height = h + "px";
      // Texte centré verticalement, sans bordure
      span.style.fontSize = fs + "px";
      span.style.lineHeight = fs + "px";
      span.style.paddingTop = pad + "px";
      span.style.paddingBottom = pad + "px";
      span.style.paddingLeft = "2px";
      span.style.paddingRight = "2px";
      span.style.border = "none";
      span.style.background = "transparent";
      span.style.color = cs.color || "#000";
      span.style.textAlign = (i.style.textAlign as any) || cs.textAlign || "left";
      span.style.verticalAlign = "middle";
    }

    i.replaceWith(span);
  });

  // ✅ Titre SSI (déjà un div, pas un input)
  const ssiTitles = clone.querySelectorAll(".cartouche-title");
  ssiTitles.forEach((el) => {
    const elem = el as HTMLElement;
    elem.style.cssText = "font-size: 11px; color: white !important;";
  });

  // -- Mention légale : juste un peu plus haut --
  const legal = clone.querySelector("#cartouche-legal") as HTMLElement | null;
  if (legal) {
    legal.style.marginTop = "-2px";
    legal.style.paddingTop = "2px";
    legal.style.paddingBottom = "2px";
  }

  // Conteneur offscreen pour snapshot
  const holder = document.createElement("div");
  holder.style.position = "fixed";
  holder.style.left = "-99999px";
  holder.style.top = "0";
  holder.style.width = liveEl.clientWidth + "px";
  holder.style.background = "#ffffff";
  holder.appendChild(clone);
  document.body.appendChild(holder);

  try {
    const canvas = await html2canvas(clone, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
    });
    return canvas.toDataURL("image/png");
  } finally {
    document.body.removeChild(holder);
  }
}

/**
 * Fonction principale d'export PDF
 */
export async function exportToPDF(project: Project) {
  const pdf = new jsPDF("landscape", "mm", "a3");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;
  const contentHeight = pageHeight - margin * 2;

  const comfortScale = (project as any).comfortScale ?? 1;
  const activeFloors: FloorPlan[] = (project.floors || []).filter((f: any) => !f?.deleted);

  for (let i = 0; i < activeFloors.length; i++) {
    const floor = activeFloors[i];
    if (i > 0) pdf.addPage();

    // En-tête
    pdf.setFontSize(18).setFont("helvetica", "bold").text("Implantation DI", margin, margin + 8);
    pdf.setFontSize(11).setFont("helvetica", "normal");
    pdf.text(`Projet: ${project.name}`, margin, margin + 18);
    if ((project as any).building) {
      pdf.text(`Bâtiment: ${(project as any).building}`, margin, margin + 25);
    }
    pdf.text(`Étage/Zone: ${floor.name}`, margin, margin + 32);
    const dateStr = project.date
      ? new Date(project.date).toLocaleDateString("fr-FR")
      : new Date().toLocaleDateString("fr-FR");
    pdf.text(`Date: ${dateStr}`, margin, margin + 39);

    // Plan à gauche
    let planWidth = 0,
      planHeight = 0,
      planY = margin + 50;

    if (floor.backgroundImage) {
      const { canvas, width, height } = await drawPlanToCanvas(
        floor.backgroundImage,
        floor.equipment ?? [],
        (floor as any).scale ?? project.scale,
        comfortScale
      );
      const aspect = width / height;
      const planMaxHeight = contentHeight - 50;
      planWidth = contentWidth * 0.5;
      planHeight = planWidth / aspect;
      if (planHeight > planMaxHeight) {
        planHeight = planMaxHeight;
        planWidth = planHeight * aspect;
      }
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", margin, planY, planWidth, planHeight);
    }

    // Colonne droite (légende + stats + conformité + pastilles + contexte)
    const legendX = margin + contentWidth * 0.55;
    const legendWidth = contentWidth * 0.2;
    await renderLegendAndCompliance(pdf, project, floor, {
      x: legendX,
      y: margin + 60,
      width: legendWidth,
      planWidth,
      planBottomY: planY + planHeight,
    });

    // Cartouche (image du DOM capturé) - positionné en bas de page sur toute la largeur
    const cartoucheDataURL = await captureCartoucheDataURL();
    if (cartoucheDataURL) {
      // Charger l'image pour obtenir ses dimensions réelles
      const img = new Image();
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.src = cartoucheDataURL;
      });

      // Calculer les dimensions - pleine largeur, hauteur ajustée
      const maxCartoucheHeight = 55; // 55mm de hauteur
      const aspectRatio = img.height / img.width;

      // Utiliser la pleine largeur du contenu
      let cartoucheWidth = contentWidth; // Touche presque les bords
      let cartoucheHeight = cartoucheWidth * aspectRatio;

      // Si la hauteur dépasse le max, la limiter
      if (cartoucheHeight > maxCartoucheHeight) {
        cartoucheHeight = maxCartoucheHeight;
        // Garder quand même la pleine largeur (le cartouche sera un peu compressé verticalement)
      }

      // Position : aligné à gauche avec la marge
      const cartoucheX = margin;

      // Positionner pour que le BAS du cartouche soit au niveau de la marge basse
      const cartoucheY = pageHeight - margin - cartoucheHeight;

      pdf.addImage(cartoucheDataURL, "PNG", cartoucheX, cartoucheY, cartoucheWidth, cartoucheHeight);
    }
  }

  // Page finale (quantitatif global)
  renderGlobalQuantitiesTable(pdf, project);

  const fileName = `Implantation_DI_${project.name.replace(/[^a-z0-9]/gi, "_")}_${Date.now()}.pdf`;
  pdf.save(fileName);
}
