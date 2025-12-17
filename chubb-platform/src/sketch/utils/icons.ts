// src/utils/icons.ts
export const ICONS: Record<string, string> = {
  "manual-trigger": "/icons/dm.png",        // Déclencheur manuel (DM)
  "smoke-detector": "/icons/smoke.png",     // Détecteur de fumée
  "sounder": "/icons/sounder.png",          // Diffuseur sonore
  "flash": "/icons/flash.png",              // Diffuseur visuel
  "vesda": "/icons/vesda.png",              // VESDA
  "ia": "/icons/ia.png",                    // Indicateur d’actions
  "ssi": "/icons/ssi.png",                  // Centrale SSI
  "note": "/icons/note.png",
  "argon-cylinder": "/icons/argon-cylinder.svg", // ✅ Bouteille d'Argon


  // Autres (tu peux les garder ou les retirer selon besoin)
  "tubing": "/icons/tube.png",
  "tre": "/icons/tre.png",
  "thermovelocimetrique": "/icons/thermo.png",
  "flamme": "/icons/flamme.png",
};

// Helper: charger une image en <img> utilisable sur canvas
export const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
