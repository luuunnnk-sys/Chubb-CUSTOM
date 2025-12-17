import React from "react";
import { Equipment, Project } from "../types/types";
import { getEquipmentDefinitions } from "../utils/equipmentDefinitions";

interface LegendProps {
  equipment: Equipment[];
  project: Project;
  isTablet?: boolean;
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

const Legend: React.FC<LegendProps> = ({ equipment, project, isTablet = false }) => {
  const equipmentDefinitions = getEquipmentDefinitions();

  const equipmentCounts = equipment.reduce((counts, eq) => {
    if (eq.type !== "tubing" && eq.type !== "note" && eq.type !== "zone") {
      counts[eq.type] = (counts[eq.type] || 0) + 1;
    }
    return counts;
  }, {} as Record<string, number>);

  const usedEquipment = equipmentDefinitions.filter((def) => {
    if (def.type === "tubing") return equipment.some((eq) => eq.type === "tubing");
    if (def.type === "note") return equipment.some((eq) => eq.type === "note");
    if (def.type === "zone") return equipment.some((eq) => eq.type === "zone");
    return equipmentCounts[def.type] > 0;
  });

  const notes = equipment.filter((eq) => eq.type === "note");
  const zones = equipment.filter((eq) => eq.type === "zone") as any[];

  const ICON_BOX = 32;

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Légende du Plan
      </h3>

      {usedEquipment.length === 0 && zones.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-sm">Aucun élément placé</p>
          <p className="text-xs text-gray-400 mt-1">
            La légende s'affichera ici automatiquement
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Symboles */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Symboles
            </h4>
            <div className="space-y-3">
              {usedEquipment.map((def) => {
                if (def.type === "tubing") {
                  return (
                    <div key={def.type} className="flex items-center space-x-3">
                      <div
                        className="flex items-center justify-center"
                        style={{ width: ICON_BOX, height: ICON_BOX }}
                      >
                        <svg width="28" height="6">
                          <line
                            x1="0"
                            y1="3"
                            x2="28"
                            y2="3"
                            stroke="red"
                            strokeWidth="3"
                          />
                        </svg>
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-sm font-medium text-gray-900">
                          {def.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {def.symbol}
                        </span>
                      </div>
                    </div>
                  );
                }

                if (def.type === "note" || def.type === "zone") return null;

                const count = equipmentCounts[def.type] || 0;

                // Custom sizes for specific equipment icons (within a uniform container)
                let iconWidth = ICON_BOX - 6;
                let iconHeight = ICON_BOX - 6;
                if (def.type === "vesda") {
                  // VESDA is wider than tall (rectangle) - scale to fit in container
                  iconWidth = ICON_BOX;
                  iconHeight = ICON_BOX * 0.55; // Keep aspect ratio
                }

                return (
                  <div key={def.type} className="flex items-center space-x-3">
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        width: ICON_BOX,
                        height: ICON_BOX,
                        minWidth: ICON_BOX
                      }}
                    >
                      <img
                        src={def.iconSrc}
                        alt={def.name}
                        className="object-contain"
                        style={{
                          width: iconWidth,
                          height: iconHeight,
                        }}
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-sm font-medium text-gray-900">
                        {def.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {def.symbol} - Quantité: {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ✅ Zones */}
          {zones.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Zonage
              </h4>
              <div className="space-y-2">
                {zones.map((zone) => (
                  <div key={zone.id} className="flex items-center gap-2">
                    <div
                      style={{
                        backgroundColor: zone.color,
                        width: 20,
                        height: 20,
                      }}
                      className="border"
                    ></div>
                    <span className="text-sm">{zone.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Statistiques
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total équipements:</span>
                <span className="font-semibold">
                  {equipment.filter(
                    (eq) => eq.type !== "tubing" && eq.type !== "note" && eq.type !== "zone"
                  ).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Types différents:</span>
                <span className="font-semibold">
                  {usedEquipment.filter(
                    (def) => def.type !== "tubing" && def.type !== "note" && def.type !== "zone"
                  ).length}
                </span>
              </div>
              {equipment.some((eq) => eq.type === "tubing") && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Ensemble tubulure:</span>
                  <span className="font-semibold">1</span>
                </div>
              )}
              {zones.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Zones colorées:</span>
                  <span className="font-semibold">{zones.length}</span>
                </div>
              )}
            </div>
          </div>

          {/* Conformité */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Conformité ({project.sector === "industrie" ? "Industrie" : "Tertiaire"})
            </h4>
            <div className="space-y-2">
              {conformityRules[project.sector].map((rule, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-2 text-xs text-green-600"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {notes.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Pastilles de commentaire
              </h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {notes.map((note, idx) => (
                  <div key={note.id} className="flex items-center space-x-2">
                    <div className="w-5 h-5 flex items-center justify-center rounded-full bg-orange-500 text-white text-xs font-bold">
                      {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Legend;
