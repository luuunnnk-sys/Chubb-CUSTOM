// ✅ Types des équipements (y compris gomme, calibration et zone)
export type EquipmentType =
  | "smoke-detector"
  | "manual-trigger"
  | "sounder"
  | "flash"
  | "vesda"
  | "tubing"
  | "ia"
  | "ssi"
  | "tre"
  | "thermovelocimetrique"
  | "flamme"
  | "note"
  | "eraser"
  | "calibration"
  | "zone"
  | "argon-cylinder"; // ✅ bouteille d'Argon

export type Equipment =
  | {
    id: string;
    type:
    | "smoke-detector"
    | "manual-trigger"
    | "sounder"
    | "flash"
    | "vesda"
    | "ia"
    | "ssi"
    | "tre"
    | "thermovelocimetrique"
    | "flamme"
    | "argon-cylinder";
    x: number;
    y: number;
    rotation?: number;
    zone?: string;
  }
  | {
    id: string;
    type: "tubing";
    points: { x: number; y: number }[];
    color: string;
    segmentLengths?: number[]; // ✅ Longueurs en mètres pour chaque segment (visible uniquement dans l'app)
  }
  | {
    id: string;
    type: "note";
    x: number;
    y: number;
    comment: string;
    index: number;
  }
  | {
    id: string;
    type: "zone"; // ✅ zone colorée
    points: { x: number; y: number }[];
    color: string; // couleur choisie
    label: string; // nom donné par l’utilisateur
  };

// ✅ Un étage / plan unique
export interface FloorPlan {
  id: string;
  name: string;
  backgroundImage: string | null;
  equipment: Equipment[];

  backgroundSize: { width: number; height: number };
  backgroundOffset: { x: number; y: number };
}

// ✅ Données du cartouche
export interface CartoucheData {
  project: string;
  phase: string;
  revision: string;
  date: string;
  modification: string;
  drawer: string;
  verifier: string;
  approver: string;
  projetNum: string;
  daoNum: string;
  scale: string;
  folio: string;
  address: string;
  // Agence sélectionnée
  agency?: "sophia" | "aix";
  customAgencyText?: string;
}

// ✅ Projet global
export interface Project {
  id: string;
  name: string;
  building: string;
  date: string;
  scale: number;
  context?: string;
  sector: "tertiaire" | "industrie";

  floor?: string;
  backgroundImage?: string | null;
  equipment?: Equipment[];

  floors: FloorPlan[];
  cartouche: CartoucheData;
}

// ✅ Catalogue des équipements
export interface EquipmentDefinition {
  type: EquipmentType;
  name: string;
  iconSrc: string;
  color: string;
  description: string;
  symbol: string;
  page?: number;

  size?: number;
  width?: number;
  height?: number;

  realSizeCm?: number;
  realWidthCm?: number;
  realHeightCm?: number;
}
