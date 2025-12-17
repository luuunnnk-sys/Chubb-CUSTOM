import { Equipment } from "../../types/types";
import { getEquipmentDefinitions } from "../equipmentDefinitions";

/** Helper local pour charger une image (DataURL ou URL publique) */
const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

/** Même logique d’échelle que le Canvas */
export const getScaledSize = (def: any, pxPerMeter: number, comfortScale = 1) => {
  if (!def) return { width: 32 * comfortScale, height: 32 * comfortScale };
  if (def.realSizeCm) {
    const s = (def.realSizeCm / 100) * pxPerMeter * comfortScale;
    return { width: s, height: s };
  }
  if (def.realWidthCm && def.realHeightCm) {
    return {
      width: (def.realWidthCm / 100) * pxPerMeter * comfortScale,
      height: (def.realHeightCm / 100) * pxPerMeter * comfortScale,
    };
  }
  const size = def.size ?? 32;
  return { width: size * comfortScale, height: size * comfortScale };
};

/** Dessine tous les équipements sur un contexte 2D déjà positionné sur le fond */
export async function drawEquipmentOnCtx(
  ctx: CanvasRenderingContext2D,
  equipment: Equipment[],
  pxPerMeter: number,
  comfortScale: number
) {
  const defs = getEquipmentDefinitions();
  const defMap = new Map(defs.map((d) => [d.type, d]));

  // ✅ AJOUT : Dessin des zones colorées avant les équipements
  const zones = equipment.filter((eq) => eq.type === "zone") as any[];
  zones.forEach((zone) => {
    if (!zone.points?.length) return;

    ctx.beginPath();
    ctx.moveTo(zone.points[0].x, zone.points[0].y);
    for (let i = 1; i < zone.points.length; i++) {
      ctx.lineTo(zone.points[i].x, zone.points[i].y);
    }
    ctx.closePath();

    ctx.fillStyle = zone.color || "rgba(0,128,255,0.25)";
    ctx.strokeStyle = (zone.color || "#0080ff").replace("0.3", "1");
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    // Nom centré de la zone
    const cx = zone.points.reduce((acc: number, p: { x: number; y: number }) => acc + p.x, 0) / zone.points.length;
    const cy = zone.points.reduce((acc: number, p: { x: number; y: number }) => acc + p.y, 0) / zone.points.length;
    ctx.fillStyle = "#000";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(zone.label || "Zone", cx, cy);
  });
  // ✅ fin de l’ajout zoning

  // Précharger les icônes réellement utilisées (hors tubing/note)
  const usedTypes = Array.from(
    new Set(
      equipment
        .filter((eq) => eq.type !== "tubing" && eq.type !== "note")
        .map((eq) => eq.type)
    )
  );

  const iconMap = new Map<string, HTMLImageElement>();
  await Promise.all(
    usedTypes.map(async (t) => {
      const def = defMap.get(t);
      if (def?.iconSrc) {
        try {
          const im = await loadImage(def.iconSrc);
          iconMap.set(t, im);
        } catch {
          // icône manquante : on dessinera un fallback
        }
      }
    })
  );

  // Dessin
  const notes = equipment.filter((e) => e.type === "note");

  for (const eq of equipment) {
    if (eq.type === "tubing" && Array.isArray((eq as any).points)) {
      const pts = (eq as any).points as { x: number; y: number }[];
      ctx.strokeStyle = "red";
      ctx.lineWidth = 3;
      ctx.beginPath();
      pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.stroke();
      continue;
    }

    if (eq.type === "note") {
      const x = (eq as any).x;
      const y = (eq as any).y;
      const shownIndex = (eq as any).index ?? notes.findIndex((n) => n.id === eq.id) + 1;

      ctx.fillStyle = "orange";
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "white";
      ctx.font = "bold 10px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(shownIndex), x, y);
      continue;
    }

    const def = defMap.get(eq.type);
    const x = (eq as any).x;
    const y = (eq as any).y;
    const angle = (eq as any).rotation || 0;

    const { width, height } = getScaledSize(def, pxPerMeter, comfortScale);
    const icon = iconMap.get(eq.type);

    if (icon) {
      ctx.save();
      if (angle) {
        ctx.translate(x, y);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.drawImage(icon, -width / 2, -height / 2, width, height);
      } else {
        ctx.drawImage(icon, x - width / 2, y - height / 2, width, height);
      }
      ctx.restore();
    } else {
      // Fallback si pas d’icône
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(x ?? 0, y ?? 0, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/**
 * Construit un canvas (fond + équipements) et retourne { canvas, width, height }
 */
export async function drawPlanToCanvas(
  bgDataURL: string,
  equipment: Equipment[],
  pxPerMeter: number,
  comfortScale: number
): Promise<{ canvas: HTMLCanvasElement; width: number; height: number }> {
  const bg = await loadImage(bgDataURL);

  const canvas = document.createElement("canvas");
  canvas.width = bg.width;
  canvas.height = bg.height;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bg, 0, 0);

  await drawEquipmentOnCtx(ctx, equipment, pxPerMeter, comfortScale);

  return { canvas, width: bg.width, height: bg.height };
}
