import React from "react";
import { Equipment } from "../../types/types";

interface ZoneLayerProps {
  equipment: Equipment[];
  planToScreen: (x: number, y: number) => { sx: number; sy: number };
  currentZone: { x: number; y: number }[];
  previewPos: { x: number; y: number } | null;
  selectedZoneColor: string;
  onDeleteZone: (id: string) => void;
  onEditZone: (id: string) => void;
}

const ZoneLayer: React.FC<ZoneLayerProps> = ({
  equipment,
  planToScreen,
  currentZone,
  previewPos,
  selectedZoneColor,
  onDeleteZone,
  onEditZone,
}) => {
  const zones = equipment.filter((eq) => eq.type === "zone") as any[];

  return (
    <>
      {zones.map((zone) => (
        <svg
          key={zone.id}
          className="absolute left-0 top-0 w-full h-full"
        >
          <polygon
            points={zone.points
              .map((p: any) => {
                const { sx, sy } = planToScreen(p.x, p.y);
                return `${sx},${sy}`;
              })
              .join(" ")}
            fill={zone.color}
            stroke={zone.color.replace("0.3", "1")}
            strokeWidth={2}
            onClick={(e) => {
              e.stopPropagation();
              const action = window.prompt(
                "Tape '1' pour supprimer, '2' pour modifier",
                "2"
              );
              if (action === "1") onDeleteZone(zone.id);
              if (action === "2") onEditZone(zone.id);
            }}
          />
        </svg>
      ))}

      {/* Zone en cours */}
      {currentZone.length > 0 && (
        <svg className="absolute left-0 top-0 w-full h-full pointer-events-none">
          <polygon
            points={[
              ...currentZone.map((p) => {
                const { sx, sy } = planToScreen(p.x, p.y);
                return `${sx},${sy}`;
              }),
              ...(previewPos
                ? [
                    `${planToScreen(previewPos.x, previewPos.y).sx},${
                      planToScreen(previewPos.x, previewPos.y).sy
                    }`,
                  ]
                : []),
            ].join(" ")}
            fill={selectedZoneColor}
            stroke={selectedZoneColor.replace("0.3", "1")}
            strokeWidth={2}
          />
        </svg>
      )}
    </>
  );
};

export default ZoneLayer;
