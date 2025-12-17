import type { EquipmentDefinition, EquipmentType } from "../types/types";

export type EquipmentCategory =
  | "DETECTEUR_AUTOMATIQUE"
  | "DETECTEUR_MANUEL"
  | "VESDA"
  | "ALARME"
  | "FLASH"
  | "EXTINCTION"
  | "DIVERS";

// 👇 Mappe tes types actuels vers les catégories d’onglet
export const CATEGORY_OF_TYPE: Record<EquipmentType, EquipmentCategory> = {
  "smoke-detector": "DETECTEUR_AUTOMATIQUE",
  "thermovelocimetrique": "DETECTEUR_AUTOMATIQUE",
  "flamme": "DETECTEUR_AUTOMATIQUE",

  "manual-trigger": "DETECTEUR_MANUEL",

  "vesda": "VESDA",
  "tubing": "VESDA",

  "sounder": "ALARME",

  "flash": "FLASH",

  // Extinction
  "argon-cylinder": "EXTINCTION", // ✅ Bouteille d'Argon

  // Divers
  "ia": "DIVERS",
  "ssi": "DIVERS",
  "tre": "DIVERS",
  "note": "DIVERS",
  "zone": "DIVERS",

  // Outils non-plaçables
  "eraser": "DIVERS",
  "calibration": "DIVERS",
};

// Libellés
export const CATEGORY_LABEL: Record<EquipmentCategory, string> = {
  DETECTEUR_AUTOMATIQUE: "Détecteur automatique",
  DETECTEUR_MANUEL: "Détecteur manuel",
  VESDA: "VESDA",
  ALARME: "Alarme",
  FLASH: "Flash",
  EXTINCTION: "Extinction",
  DIVERS: "Divers",
};

export const CATEGORIES: EquipmentCategory[] = [
  "DETECTEUR_AUTOMATIQUE",
  "DETECTEUR_MANUEL",
  "VESDA",
  "ALARME",
  "FLASH",
  "EXTINCTION",
  "DIVERS",
];

export function groupByCategory(defs: EquipmentDefinition[]) {
  const acc: Record<EquipmentCategory, EquipmentDefinition[]> = {
    DETECTEUR_AUTOMATIQUE: [],
    DETECTEUR_MANUEL: [],
    VESDA: [],
    ALARME: [],
    FLASH: [],
    EXTINCTION: [],
    DIVERS: [],
  };
  for (const d of defs) {
    const cat = CATEGORY_OF_TYPE[d.type] ?? "DIVERS";
    acc[cat].push(d);
  }
  return acc;
}
