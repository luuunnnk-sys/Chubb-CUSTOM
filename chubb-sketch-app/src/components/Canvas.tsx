import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  Equipment,
  EquipmentType,
  FloorPlan,
  CartoucheData,
} from "../types/types";
import { getEquipmentDefinitions } from "../utils/equipmentDefinitions";
import { projectPointOnSegment, applyOrthoConstraint } from "../utils/geometry";
import CartouchePreview from "./CartouchePreview";
import TubesLayer from "./canvas/TubesLayer";
import EquipmentLayer from "./canvas/EquipmentLayer";
import ZoneLayer from "./canvas/ZoneLayer";
import ZoomControl from "./canvas/ZoomControl";
import TouchActionWheel from "./TouchActionWheel";
import { useTouchGestures } from "../hooks/useTouchGestures";
import { DeviceMode } from "./DeviceToggle";

interface CanvasProps {
  project: FloorPlan;
  selectedTool: EquipmentType | null;
  onAddEquipment: (equipment: Equipment) => void;
  onRemoveEquipment: (id: string) => void;
  onUpdateEquipment: (id: string, updates: Partial<Equipment>) => void;
  onRotateEquipment: (id: string, angle: number) => void;
  onMoveEquipment: (id: string, x: number, y: number) => void;
  onCancelTool: () => void;
  onCalibrationComplete: (pixelsPerMeter: number) => void;
  currentFloor: number;
  scale: number;
  comfortScale: number;
  cartouche: CartoucheData;
  onUpdateCartouche: (updates: Partial<CartoucheData>) => void;
  // iPad mode
  deviceMode?: DeviceMode;
}

const DOOR_REAL_WIDTH_M = 0.9;

const Canvas = forwardRef<any, CanvasProps>(
  (
    {
      project,
      selectedTool,
      onAddEquipment,
      onRemoveEquipment,
      onUpdateEquipment,
      onRotateEquipment,
      onMoveEquipment,
      onCancelTool,
      onCalibrationComplete,
      scale,
      comfortScale,
      cartouche,
      onUpdateCartouche,
      deviceMode = 'pc',
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLDivElement>(null);

    const [previewPos, setPreviewPos] = useState<{ x: number; y: number } | null>(null);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
    const [tubeStart, setTubeStart] = useState<{ x: number; y: number } | null>(null);
    const [snapPoint, setSnapPoint] = useState<{ x: number; y: number } | null>(null);
    const [constrainedPreview, setConstrainedPreview] = useState<{ x: number; y: number } | null>(null);
    const [calibrationStart, setCalibrationStart] =
      useState<{ x: number; y: number } | null>(null);
    const [calibrationMessage, setCalibrationMessage] = useState<string | null>(null);
    const [planZoom, setPlanZoom] = useState<number>(1);
    const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({
      width: 0,
      height: 0,
    });
    // iPad touch drag mode
    const [isTouchDragMode, setIsTouchDragMode] = useState(false);
    // Preview position during touch drag (shows where equipment will move)
    const [touchDragPreviewPos, setTouchDragPreviewPos] = useState<{ x: number; y: number } | null>(null);

    // ✅ Zones
    const [currentZone, setCurrentZone] = useState<{ x: number; y: number }[]>([]);
    const [selectedZoneColor, setSelectedZoneColor] = useState("rgba(255,0,0,0.3)");

    const floorData = project;
    const equipmentDefinitions = getEquipmentDefinitions();
    const currentDef = selectedTool
      ? equipmentDefinitions.find((d) => d.type === selectedTool)
      : null;

    useImperativeHandle(ref, () => ({
      getCanvasElement: () => canvasRef.current,
    }));

    useEffect(() => {
      const measure = () => {
        if (!canvasRef.current) return;
        setCanvasSize({
          width: canvasRef.current.clientWidth,
          height: canvasRef.current.clientHeight,
        });
      };
      measure();
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }, []);

    const baseW = floorData.backgroundSize?.width || 0;
    const baseH = floorData.backgroundSize?.height || 0;
    const planW = baseW * planZoom;
    const planH = baseH * planZoom;
    const offsetX = (canvasSize.width - planW) / 2;
    const offsetY = (canvasSize.height - planH) / 2;

    const screenToPlan = (clientX: number, clientY: number) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      const x = (clientX - rect.left - offsetX) / planZoom;
      const y = (clientY - rect.top - offsetY) / planZoom;
      return { x, y };
    };

    const planToScreen = (x: number, y: number) => {
      return {
        sx: offsetX + x * planZoom,
        sy: offsetY + y * planZoom,
      };
    };

    // ✅ ouvrir color picker dès qu’on choisit "zone"
    useEffect(() => {
      if (selectedTool === "zone") {
        const input = document.createElement("input");
        input.type = "color";
        input.value = "#00AAFF";
        input.style.position = "fixed";
        input.style.left = "-9999px";
        document.body.appendChild(input);
        input.click();

        input.oninput = (e: any) => {
          setSelectedZoneColor(e.target.value + "4D"); // ajoute alpha
        };

        input.onchange = () => {
          input.remove();
        };
      }
    }, [selectedTool]);

    // clavier: escape, rotation ↑/↓
    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setPreviewPos(null);
          setDraggingId(null);
          setTubeStart(null);
          setSelectedEquipmentId(null);
          setCalibrationStart(null);
          setCurrentZone([]);
          onCancelTool();
        }
        if (selectedEquipmentId) {
          const eq = floorData.equipment.find((el) => el.id === selectedEquipmentId);
          const rot = (eq as any)?.rotation || 0;
          if (e.key === "ArrowUp") {
            e.preventDefault();
            onRotateEquipment(selectedEquipmentId, rot + 45);
          }
          if (e.key === "ArrowDown") {
            e.preventDefault();
            onRotateEquipment(selectedEquipmentId, rot - 45);
          }
        }
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [selectedEquipmentId, floorData.equipment]);

    // drag (mouse)
    useEffect(() => {
      const move = (e: MouseEvent) => {
        if (!draggingId) return;
        const { x, y } = screenToPlan(e.clientX, e.clientY);
        onMoveEquipment(draggingId, x, y);
      };
      const up = () => setDraggingId(null);
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
      return () => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
      };
    }, [draggingId]);

    // Touch drag (iPad) - when drag mode is active: show preview, confirm on touchend
    useEffect(() => {
      if (!isTouchDragMode || !selectedEquipmentId) {
        setTouchDragPreviewPos(null);
        return;
      }

      const handleTouchMove = (e: TouchEvent) => {
        if (!isTouchDragMode || !selectedEquipmentId) return;

        // Check if touch is on the action wheel (right side), if so ignore
        const touch = e.touches[0];
        if (touch.clientX > window.innerWidth - 180) {
          return; // Don't update preview if touching the action wheel area
        }

        e.preventDefault();
        const { x, y } = screenToPlan(touch.clientX, touch.clientY);
        setTouchDragPreviewPos({ x, y });
      };

      const handleTouchEnd = (e: TouchEvent) => {
        // Confirm the move if we have a preview position and touch ended on canvas
        if (touchDragPreviewPos && selectedEquipmentId) {
          // Check if touch ended on canvas area (not on action wheel)
          const touch = e.changedTouches[0];
          if (touch.clientX < window.innerWidth - 180) {
            onMoveEquipment(selectedEquipmentId, touchDragPreviewPos.x, touchDragPreviewPos.y);
          }
        }
        setTouchDragPreviewPos(null);
      };

      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);

      return () => {
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      };
    }, [isTouchDragMode, selectedEquipmentId, touchDragPreviewPos, onMoveEquipment]);

    // snap sur tubing et VESDA
    const snapToTubeOrVesda = (x: number, y: number) => {
      const SNAP = 15 / planZoom;
      let closest: { x: number; y: number } | null = null;
      let minDist = SNAP;
      let snappedToPoint = false;

      // Snap to existing tube endpoints
      const tubes = floorData.equipment.filter((eq) => eq.type === "tubing");
      for (const tube of tubes) {
        const points = (tube as any).points as { x: number; y: number }[];
        for (const p of points) {
          const d = Math.hypot(p.x - x, p.y - y);
          if (d < minDist) {
            minDist = d;
            closest = { x: p.x, y: p.y };
            snappedToPoint = true;
          }
        }
      }

      // Snap to VESDA equipment positions
      const vesdas = floorData.equipment.filter((eq) => eq.type === "vesda");
      for (const vesda of vesdas) {
        const vx = (vesda as any).x;
        const vy = (vesda as any).y;
        const d = Math.hypot(vx - x, vy - y);
        if (d < minDist) {
          minDist = d;
          closest = { x: vx, y: vy };
          snappedToPoint = true;
        }
      }

      // Snap to tube segments if no point snap
      if (!snappedToPoint) {
        for (const tube of tubes) {
          const points = (tube as any).points as { x: number; y: number }[];
          for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i + 1];
            const proj = projectPointOnSegment(x, y, p1.x, p1.y, p2.x, p2.y);
            const d = Math.hypot(proj.x - x, proj.y - y);
            if (d < minDist) {
              minDist = d;
              closest = proj;
            }
          }
        }
      }

      setSnapPoint(closest);
      return closest ?? { x, y };
    };

    // click canvas
    const handleCanvasClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
      if (!selectedTool) return;
      let { x, y } = screenToPlan(e.clientX, e.clientY);

      // ✅ outil zone
      if (selectedTool === "zone") {
        if (e.detail === 2 && currentZone.length > 2) {
          const label = prompt("Nom de la zone ?", "Zone de détection") || "Zone";
          onAddEquipment({
            id: Date.now().toString(),
            type: "zone",
            points: [...currentZone],
            color: selectedZoneColor,
            label,
          } as any);
          setCurrentZone([]);
        } else {
          setCurrentZone([...currentZone, { x, y }]);
        }
        return;
      }

      // calibration
      if (selectedTool === "calibration") {
        if (!calibrationStart) {
          setCalibrationStart({ x, y });
        } else {
          const dx = x - calibrationStart.x;
          const dy = y - calibrationStart.y;
          const pixelDistance = Math.hypot(dx, dy);
          const pxPerM = pixelDistance / DOOR_REAL_WIDTH_M;
          onCalibrationComplete(pxPerM);
          setCalibrationStart(null);
          setCalibrationMessage("✅ Plan calibré (porte = 90 cm)");
          setTimeout(() => setCalibrationMessage(null), 3000);
          onCancelTool();
        }
        return;
      }

      // tubing
      if (selectedTool === "tubing") {
        const snapped = snapToTubeOrVesda(x, y);
        x = snapped.x;
        y = snapped.y;
        if (!tubeStart) {
          setTubeStart({ x, y });
        } else {
          const constrained = applyOrthoConstraint(tubeStart, { x, y });
          onAddEquipment({
            id: Date.now().toString(),
            type: "tubing",
            points: [tubeStart, constrained],
            color: "red",
          } as any);
          setTubeStart(null);
          setConstrainedPreview(null);
        }
        return;
      }

      // note
      if (selectedTool === "note") {
        onAddEquipment({
          id: Date.now().toString(),
          type: "note",
          x,
          y,
          comment: "",
          index: floorData.equipment.filter((eq) => eq.type === "note").length + 1,
        });
        return;
      }

      // autres équipements
      if (selectedTool !== "eraser") {
        onAddEquipment({
          id: Date.now().toString(),
          type: selectedTool,
          x,
          y,
          rotation: 0,
        } as Equipment);
      }
    };

    // suppression zone
    const handleDeleteZone = (id: string) => {
      if (window.confirm("Supprimer cette zone ?")) {
        onRemoveEquipment(id);
      }
    };

    // édition zone
    const handleEditZone = (id: string) => {
      const eq = floorData.equipment.find(
        (z) => z.id === id && z.type === "zone"
      ) as any;
      if (!eq) return;
      const newLabel = prompt("Nouveau nom de la zone :", eq.label) || eq.label;
      const newColor = prompt("Nouvelle couleur HEX (ex: #00AAFF) :", eq.color) || eq.color;
      onUpdateEquipment(id, { label: newLabel, color: newColor });
    };

    // preview follow
    const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
      let { x, y } = screenToPlan(e.clientX, e.clientY);
      setPreviewPos({ x, y });

      // For tubing: calculate snapped position and constrained preview
      if (selectedTool === "tubing" && tubeStart) {
        const snapped = snapToTubeOrVesda(x, y);
        const constrained = applyOrthoConstraint(tubeStart, snapped);
        setConstrainedPreview(constrained);
      } else if (selectedTool === "tubing" && !tubeStart) {
        // Show snap point even before starting the tube
        snapToTubeOrVesda(x, y);
        setConstrainedPreview(null);
      } else {
        setConstrainedPreview(null);
      }
    };

    return (
      <div
        ref={canvasRef}
        id="plan-canvas"
        className="relative w-full h-full bg-gray-100 overflow-hidden"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setPreviewPos(null);
          setSnapPoint(null);
          setConstrainedPreview(null);
        }}
      >
        {calibrationMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow">
            {calibrationMessage}
          </div>
        )}

        {floorData.backgroundImage && (
          <img
            src={floorData.backgroundImage}
            alt="Plan"
            className="absolute pointer-events-none select-none"
            draggable={false}
            style={{
              left: offsetX,
              top: offsetY,
              width: planW,
              height: planH,
            }}
          />
        )}

        {/* Zones */}
        <ZoneLayer
          equipment={floorData.equipment}
          planToScreen={planToScreen}
          currentZone={currentZone}
          previewPos={previewPos}
          selectedZoneColor={selectedZoneColor}
          onDeleteZone={handleDeleteZone}
          onEditZone={handleEditZone}
        />

        {/* Tubes */}
        <TubesLayer
          equipment={floorData.equipment}
          planToScreen={planToScreen}
          tubeStart={tubeStart}
          previewPos={previewPos}
          snapPoint={snapPoint}
          constrainedPreview={constrainedPreview}
          onUpdateEquipment={onUpdateEquipment}
          onRemoveEquipment={onRemoveEquipment}
          scale={scale}
          selectedTool={selectedTool}
        />

        {/* Équipements */}
        <EquipmentLayer
          equipment={floorData.equipment}
          selectedTool={selectedTool}
          selectedEquipmentId={selectedEquipmentId}
          draggingId={draggingId}
          offsetX={offsetX}
          offsetY={offsetY}
          planZoom={planZoom}
          scale={scale}
          comfortScale={comfortScale}
          previewPos={previewPos}
          currentDef={currentDef as any}
          equipmentDefinitions={equipmentDefinitions as any}
          onRemoveEquipment={onRemoveEquipment}
          onUpdateEquipment={onUpdateEquipment}
          setDraggingId={setDraggingId}
          setSelectedEquipmentId={setSelectedEquipmentId}
        />

        {/* Cartouche */}
        {floorData.backgroundImage && (
          <div
            className="absolute"
            style={{
              left: offsetX,
              top: offsetY + planH + 10,
              width: planW,
            }}
          >
            <CartouchePreview
              cartouche={cartouche}
              onUpdateCartouche={onUpdateCartouche}
            />
          </div>
        )}

        <ZoomControl planZoom={planZoom} setPlanZoom={setPlanZoom} />

        {/* Touch Drag Preview Ghost */}
        {isTouchDragMode && touchDragPreviewPos && selectedEquipmentId && (() => {
          const eq = floorData.equipment.find((e) => e.id === selectedEquipmentId);
          if (!eq) return null;
          const def = equipmentDefinitions.find((d) => d.type === eq.type);
          if (!def) return null;
          const { width, height } = (() => {
            if ((def as any).realSizeCm) {
              const sizePx = ((def as any).realSizeCm / 100) * scale * comfortScale;
              return { width: sizePx, height: sizePx };
            }
            if ((def as any).realWidthCm && (def as any).realHeightCm) {
              return {
                width: ((def as any).realWidthCm / 100) * scale * comfortScale,
                height: ((def as any).realHeightCm / 100) * scale * comfortScale,
              };
            }
            return { width: 32 * comfortScale, height: 32 * comfortScale };
          })();
          const left = offsetX + touchDragPreviewPos.x * planZoom - width / 2;
          const top = offsetY + touchDragPreviewPos.y * planZoom - height / 2;
          const angle = (eq as any).rotation || 0;
          return (
            <div
              className="absolute pointer-events-none"
              style={{
                left,
                top,
                width,
                height,
                opacity: 0.5,
                transform: `rotate(${angle}deg)`,
                border: '2px dashed #22c55e',
                borderRadius: '4px',
                boxShadow: '0 0 12px rgba(34, 197, 94, 0.5)',
              }}
            >
              <img
                src={(def as any).iconSrc}
                alt={def.name}
                style={{ width, height, pointerEvents: 'none' }}
                draggable={false}
              />
            </div>
          );
        })()}

        {/* iPad Mode: Touch Action Wheel (rotation, delete, drag) */}
        {deviceMode === 'tablet' && selectedEquipmentId && (
          <TouchActionWheel
            currentRotation={
              (floorData.equipment.find((e) => e.id === selectedEquipmentId) as any)?.rotation || 0
            }
            onRotationChange={(angle) => {
              if (selectedEquipmentId) {
                onRotateEquipment(selectedEquipmentId, angle);
              }
            }}
            onDelete={() => {
              if (selectedEquipmentId) {
                onRemoveEquipment(selectedEquipmentId);
                setSelectedEquipmentId(null);
                setIsTouchDragMode(false);
              }
            }}
            onToggleDrag={() => {
              setIsTouchDragMode(!isTouchDragMode);
            }}
            onDeselect={() => {
              setSelectedEquipmentId(null);
              setIsTouchDragMode(false);
            }}
            isDragging={isTouchDragMode}
            visible={true}
          />
        )}
      </div>
    );
  }
);

Canvas.displayName = "Canvas";
export default Canvas;
