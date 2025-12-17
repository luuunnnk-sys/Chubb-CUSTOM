import React, { useState } from "react";
import { Equipment, EquipmentType } from "../../types/types";

type Point = { x: number; y: number };

interface TubesLayerProps {
  equipment: Equipment[];
  planToScreen: (x: number, y: number) => { sx: number; sy: number };
  tubeStart: Point | null;
  previewPos: Point | null;
  snapPoint: Point | null;
  constrainedPreview?: Point | null;
  onUpdateEquipment?: (id: string, updates: Partial<Equipment>) => void;
  onRemoveEquipment?: (id: string) => void;
  scale?: number; // pixels per meter
  selectedTool?: EquipmentType | null; // To detect eraser tool
}

const TubesLayer: React.FC<TubesLayerProps> = ({
  equipment,
  planToScreen,
  tubeStart,
  previewPos,
  snapPoint,
  constrainedPreview,
  onUpdateEquipment,
  onRemoveEquipment,
  scale = 100, // Default: 100 pixels = 1 meter
  selectedTool,
}) => {
  const [selectedTubeId, setSelectedTubeId] = useState<string | null>(null);

  const tubes = equipment.filter((eq) => eq.type === "tubing");

  // Calculate length in meters from pixel distance
  const calculateLength = (p1: Point, p2: Point): number => {
    const pixelDist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const meters = pixelDist / scale;
    return Math.round(meters * 10) / 10; // Round to 1 decimal
  };

  // Handle tube click - select or delete with eraser
  const handleTubeClick = (e: React.MouseEvent, tubeId: string) => {
    e.stopPropagation();

    // If eraser tool is active, delete the tube
    if (selectedTool === "eraser") {
      if (onRemoveEquipment && window.confirm("Supprimer ce tube VESDA ?")) {
        onRemoveEquipment(tubeId);
      }
      return;
    }

    // Toggle selection
    setSelectedTubeId(selectedTubeId === tubeId ? null : tubeId);
  };

  // Handle delete tube via button
  const handleDeleteTube = (e: React.MouseEvent, tubeId: string) => {
    e.stopPropagation();
    if (onRemoveEquipment && window.confirm("Supprimer ce tube VESDA ?")) {
      onRemoveEquipment(tubeId);
      setSelectedTubeId(null);
    }
  };

  // Handle set/override length for a segment
  const handleSetLength = (e: React.MouseEvent, tubeId: string, segmentIndex: number, calculatedLength: number) => {
    e.stopPropagation();

    // Don't trigger length edit if eraser is active
    if (selectedTool === "eraser") return;

    const tube = tubes.find((t) => t.id === tubeId) as any;
    if (!tube || !onUpdateEquipment) return;

    const currentLength = tube.segmentLengths?.[segmentIndex] ?? calculatedLength;
    const input = prompt(
      `Longueur du segment (en mètres).\nCalculée: ${calculatedLength}m\nEntrez une nouvelle valeur ou laissez vide pour la valeur calculée:`,
      currentLength.toString()
    );

    if (input !== null) {
      const length = parseFloat(input);
      const segmentLengths = [...(tube.segmentLengths || [])];

      if (!isNaN(length) && length > 0) {
        segmentLengths[segmentIndex] = length;
        onUpdateEquipment(tubeId, { segmentLengths } as any);
      } else if (input === "") {
        // Reset to calculated value (remove override)
        segmentLengths[segmentIndex] = undefined as any;
        onUpdateEquipment(tubeId, { segmentLengths } as any);
      }
    }
  };

  // Click on SVG background to deselect
  const handleSvgClick = (e: React.MouseEvent) => {
    if ((e.target as Element).tagName === "svg") {
      setSelectedTubeId(null);
    }
  };

  // Calculate position for delete button
  const getDeleteButtonPos = (pts: Point[]) => {
    if (pts.length < 2) return null;
    const lastPt = pts[pts.length - 1];
    const { sx, sy } = planToScreen(lastPt.x, lastPt.y);
    return { x: sx + 15, y: sy - 15 };
  };

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "auto" }}
      onClick={handleSvgClick}
    >
      {tubes.map((tube) => {
        const pts = (tube as any).points as Point[];
        const segmentLengths = (tube as any).segmentLengths as number[] | undefined;
        const isSelected = selectedTubeId === tube.id;

        const pointsAttr = pts
          .map((p) => {
            const { sx, sy } = planToScreen(p.x, p.y);
            return `${sx},${sy}`;
          })
          .join(" ");

        const deletePos = getDeleteButtonPos(pts);

        return (
          <React.Fragment key={tube.id}>
            {/* Selection highlight (blue glow) */}
            {isSelected && (
              <polyline
                points={pointsAttr}
                stroke="#3b82f6"
                strokeWidth={10}
                fill="none"
                opacity={0.4}
                style={{ pointerEvents: "none" }}
              />
            )}

            {/* Main tube line - always clickable */}
            <polyline
              points={pointsAttr}
              stroke="red"
              strokeWidth={isSelected ? 5 : 3}
              fill="none"
              style={{
                cursor: selectedTool === "eraser" ? "not-allowed" : "pointer",
                pointerEvents: "stroke"
              }}
              onClick={(e) => handleTubeClick(e, tube.id)}
            />

            {/* Segment labels with auto-calculated lengths */}
            {pts.map((p1, i) => {
              if (i >= pts.length - 1) return null;
              const p2 = pts[i + 1];
              const s1 = planToScreen(p1.x, p1.y);
              const s2 = planToScreen(p2.x, p2.y);
              const midX = (s1.sx + s2.sx) / 2;
              const midY = (s1.sy + s2.sy) / 2;

              // Calculate auto length or use override
              const calculatedLength = calculateLength(p1, p2);
              const userLength = segmentLengths?.[i];
              const displayLength = userLength !== undefined ? userLength : calculatedLength;
              const isOverridden = userLength !== undefined;

              return (
                <React.Fragment key={`seg-${tube.id}-${i}`}>
                  {/* Clickable area for length edit (only when selected and not eraser) */}
                  {isSelected && selectedTool !== "eraser" && (
                    <line
                      x1={s1.sx}
                      y1={s1.sy}
                      x2={s2.sx}
                      y2={s2.sy}
                      stroke="transparent"
                      strokeWidth={25}
                      style={{ cursor: "text", pointerEvents: "stroke" }}
                      onClick={(e) => handleSetLength(e, tube.id, i, calculatedLength)}
                    />
                  )}

                  {/* Length label - only visible when tube is selected */}
                  {isSelected && (
                    <g style={{ pointerEvents: "none" }}>
                      <rect
                        x={midX - 22}
                        y={midY - 11}
                        width={44}
                        height={20}
                        rx={4}
                        fill={isOverridden ? "rgba(255,255,200,0.95)" : "rgba(255,255,255,0.95)"}
                        stroke={isOverridden ? "#f59e0b" : "#3b82f6"}
                        strokeWidth={1.5}
                      />
                      <text
                        x={midX}
                        y={midY + 4}
                        textAnchor="middle"
                        fontSize={11}
                        fontWeight="bold"
                        fill={isOverridden ? "#b45309" : "#1a1a1a"}
                      >
                        {displayLength}m
                      </text>
                    </g>
                  )}
                </React.Fragment>
              );
            })}

            {/* Delete button when selected */}
            {isSelected && deletePos && (
              <g
                onClick={(e) => handleDeleteTube(e, tube.id)}
                style={{ cursor: "pointer", pointerEvents: "auto" }}
              >
                <circle
                  cx={deletePos.x}
                  cy={deletePos.y}
                  r={14}
                  fill="#ef4444"
                  stroke="#fff"
                  strokeWidth={2}
                />
                <text
                  x={deletePos.x}
                  y={deletePos.y + 5}
                  textAnchor="middle"
                  fontSize={16}
                  fontWeight="bold"
                  fill="white"
                  style={{ pointerEvents: "none" }}
                >
                  ×
                </text>
              </g>
            )}

            {/* Endpoints markers */}
            {pts.map((p, i) => {
              const { sx, sy } = planToScreen(p.x, p.y);
              return (
                <circle
                  key={`pt-${tube.id}-${i}`}
                  cx={sx}
                  cy={sy}
                  r={isSelected ? 6 : 4}
                  fill={isSelected ? "#3b82f6" : "#dc2626"}
                  stroke="white"
                  strokeWidth={1.5}
                  style={{ pointerEvents: "none" }}
                />
              );
            })}
          </React.Fragment>
        );
      })}

      {/* Preview line during drawing */}
      {tubeStart && previewPos && (
        <>
          <line
            x1={planToScreen(tubeStart.x, tubeStart.y).sx}
            y1={planToScreen(tubeStart.x, tubeStart.y).sy}
            x2={planToScreen(constrainedPreview?.x ?? previewPos.x, constrainedPreview?.y ?? previewPos.y).sx}
            y2={planToScreen(constrainedPreview?.x ?? previewPos.x, constrainedPreview?.y ?? previewPos.y).sy}
            stroke="red"
            strokeWidth={3}
            strokeDasharray="8 4"
            style={{ pointerEvents: "none" }}
          />
          {/* Green balls at endpoints */}
          <circle
            cx={planToScreen(tubeStart.x, tubeStart.y).sx}
            cy={planToScreen(tubeStart.x, tubeStart.y).sy}
            r={10}
            fill="#22c55e"
            stroke="white"
            strokeWidth={2}
            style={{ pointerEvents: "none" }}
          />
          <circle
            cx={planToScreen(constrainedPreview?.x ?? previewPos.x, constrainedPreview?.y ?? previewPos.y).sx}
            cy={planToScreen(constrainedPreview?.x ?? previewPos.x, constrainedPreview?.y ?? previewPos.y).sy}
            r={10}
            fill="#22c55e"
            stroke="white"
            strokeWidth={2}
            style={{ pointerEvents: "none" }}
          />
          {/* Show length preview */}
          {constrainedPreview && (
            <text
              x={(planToScreen(tubeStart.x, tubeStart.y).sx + planToScreen(constrainedPreview.x, constrainedPreview.y).sx) / 2}
              y={(planToScreen(tubeStart.y, tubeStart.y).sy + planToScreen(constrainedPreview.x, constrainedPreview.y).sy) / 2 - 15}
              textAnchor="middle"
              fontSize={12}
              fontWeight="bold"
              fill="#22c55e"
              stroke="white"
              strokeWidth={3}
              paintOrder="stroke"
              style={{ pointerEvents: "none" }}
            >
              {calculateLength(tubeStart, constrainedPreview)}m
            </text>
          )}
        </>
      )}

      {/* Snap point indicator */}
      {snapPoint && (
        <circle
          cx={planToScreen(snapPoint.x, snapPoint.y).sx}
          cy={planToScreen(snapPoint.x, snapPoint.y).sy}
          r={12}
          fill="#22c55e"
          stroke="white"
          strokeWidth={3}
          opacity={0.9}
          style={{ pointerEvents: "none" }}
        />
      )}
    </svg>
  );
};

export default TubesLayer;
