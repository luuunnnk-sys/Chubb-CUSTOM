import React from "react";
import { Equipment, EquipmentType } from "../../types/types";

interface EquipmentDefinition {
  type: EquipmentType;
  name: string;
  iconSrc: string;
  size?: number;
  realSizeCm?: number;
  realWidthCm?: number;
  realHeightCm?: number;
}

type Point = { x: number; y: number };

interface EquipmentLayerProps {
  equipment: Equipment[];
  selectedTool: EquipmentType | null;
  selectedEquipmentId: string | null;
  draggingId: string | null;
  offsetX: number;
  offsetY: number;
  planZoom: number;
  scale: number;
  comfortScale: number;
  previewPos: Point | null;
  currentDef: EquipmentDefinition | null;
  equipmentDefinitions: EquipmentDefinition[];
  onRemoveEquipment: (id: string) => void;
  onUpdateEquipment: (id: string, updates: Partial<Equipment>) => void;
  setDraggingId: (id: string | null) => void;
  setSelectedEquipmentId: (id: string | null) => void;
}

const getScaledSize = (
  def: EquipmentDefinition | null | undefined,
  pxPerMeter: number,
  comfortScale: number
) => {
  if (!def) return { width: 32 * comfortScale, height: 32 * comfortScale };
  if ((def as any).realSizeCm) {
    const sizePx = ((def as any).realSizeCm / 100) * pxPerMeter * comfortScale;
    return { width: sizePx, height: sizePx };
  }
  if ((def as any).realWidthCm && (def as any).realHeightCm) {
    return {
      width: ((def as any).realWidthCm / 100) * pxPerMeter * comfortScale,
      height: ((def as any).realHeightCm / 100) * pxPerMeter * comfortScale,
    };
  }
  const size = (def as any).size ?? 32;
  return { width: size * comfortScale, height: size * comfortScale };
};

const EquipmentLayer: React.FC<EquipmentLayerProps> = ({
  equipment,
  selectedTool,
  selectedEquipmentId,
  draggingId,
  offsetX,
  offsetY,
  planZoom,
  scale,
  comfortScale,
  previewPos,
  currentDef,
  equipmentDefinitions,
  onRemoveEquipment,
  onUpdateEquipment,
  setDraggingId,
  setSelectedEquipmentId,
}) => {
  return (
    <div className="absolute inset-0" style={{ pointerEvents: "none" }}>
      {equipment
        .filter((eq) => eq.type !== "tubing")
        .map((el) => {
          if (el.type === "note") {
            const left = offsetX + (el as any).x * planZoom - 12;
            const top = offsetY + (el as any).y * planZoom - 12;
            return (
              <div
                key={el.id}
                className="absolute flex items-center justify-center text-white text-xs font-bold rounded-full bg-orange-500"
                style={{
                  left,
                  top,
                  width: 24,
                  height: 24,
                  pointerEvents: "auto",
                  cursor: selectedTool === "eraser" ? "not-allowed" : "pointer",
                  boxShadow:
                    selectedEquipmentId === el.id
                      ? "0 0 0 2px rgba(59,130,246,0.8)"
                      : undefined,
                }}
                title="Note"
                onClick={(e) => {
                  e.stopPropagation();
                  if (selectedTool === "eraser") {
                    onRemoveEquipment(el.id);
                    return;
                  }
                  const current = (el as any).comment || "";
                  const newText = window.prompt("Texte de la note :", current);
                  if (newText !== null) {
                    onUpdateEquipment(el.id, { comment: newText });
                  }
                  setSelectedEquipmentId(el.id);
                }}
              >
                {(el as any).index}
              </div>
            );
          }

          const def = equipmentDefinitions.find((d) => d.type === el.type);
          const { width, height } = getScaledSize(def, scale, comfortScale);
          const left = offsetX + (el as any).x * planZoom - width / 2;
          const top = offsetY + (el as any).y * planZoom - height / 2;
          const angle = (el as any).rotation || 0;

          return (
            <div
              key={el.id}
              className={`absolute flex items-center justify-center transition-transform ${selectedEquipmentId === el.id ? "ring-2 ring-blue-500 rounded-md" : ""
                }`}
              style={{
                left,
                top,
                width,
                height,
                pointerEvents: "auto",
                transform: `rotate(${angle}deg)`,
                cursor:
                  selectedTool === "eraser"
                    ? "not-allowed"
                    : draggingId === el.id
                      ? "grabbing"
                      : "grab",
                touchAction: "none", // Prevent browser touch gestures
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                if (selectedTool === "eraser") {
                  onRemoveEquipment(el.id);
                  return;
                }
                setDraggingId(el.id);
                setSelectedEquipmentId(el.id);
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                if (selectedTool === "eraser") {
                  onRemoveEquipment(el.id);
                  return;
                }
                // Select on touch, drag is handled by TouchActionWheel
                setSelectedEquipmentId(el.id);
              }}
              title={def?.name}
            >
              <img
                src={def?.iconSrc}
                alt={def?.name}
                style={{ width, height, pointerEvents: "none", userSelect: "none" }}
                draggable={false}
              />
            </div>
          );
        })}

      {/* Ghost de prévisualisation */}
      {previewPos &&
        currentDef &&
        selectedTool &&
        !["tubing", "note", "eraser", "calibration"].includes(selectedTool) && (() => {
          const { width, height } = getScaledSize(currentDef, scale, comfortScale);
          const left = offsetX + previewPos.x * planZoom - width / 2;
          const top = offsetY + previewPos.y * planZoom - height / 2;
          return (
            <div className="absolute pointer-events-none opacity-50" style={{ left, top, width, height }}>
              <img src={currentDef.iconSrc} alt={currentDef.name} style={{ width, height, pointerEvents: "none", userSelect: "none" }} draggable={false} />
            </div>
          );
        })()}
    </div>
  );
};

export default EquipmentLayer;
