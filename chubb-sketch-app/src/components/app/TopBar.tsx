import React from "react";
import { Trash2, Upload, Ruler, Eraser, Plus } from "lucide-react";
import { FloorPlan, EquipmentType } from "../../types/types";
import { Button } from "../ui/Button";
import { ChipToggle } from "../ui/ChipToggle";

type Props = {
  onClickImport: () => void;
  onFileSelected: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;

  selectedTool: EquipmentType | null;
  setSelectedTool: (t: EquipmentType | null) => void;

  comfortScale: number;
  setComfortScale: (v: number) => void;

  currentFloor: number;
  setCurrentFloor: (i: number) => void;
  floors: FloorPlan[];
  onAddFloor: () => void;
  onDeleteFloor: () => void;
  // Device mode
  deviceMode: 'pc' | 'tablet';
  onDeviceModeChange: (mode: 'pc' | 'tablet') => void;
};

const TopBar: React.FC<Props> = ({
  onClickImport,
  onFileSelected,
  fileInputRef,
  selectedTool,
  setSelectedTool,
  comfortScale,
  setComfortScale,
  currentFloor,
  setCurrentFloor,
  floors,
  onAddFloor,
  onDeleteFloor,
  deviceMode,
  onDeviceModeChange,
}) => {
  const isTablet = deviceMode === 'tablet';

  return (
    <header className={`bg-white border-b border-slate-200 ${isTablet ? 'px-2 py-2' : 'px-4 py-3'}`}>
      <div className={`w-full flex items-center justify-between ${isTablet ? 'flex-wrap gap-2' : ''}`}>
        {/* Brand - compact on tablet */}
        <div className={`flex items-center ${isTablet ? 'gap-2' : 'gap-3'}`}>
          <img
            src="/icons/chubb-sketch.png"
            alt="Chubb Sketch"
            className={`rounded-lg shadow-sm ${isTablet ? 'w-8 h-8' : 'w-12 h-12'}`}
          />
          {!isTablet && (
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Chubb Sketch</h1>
              <p className="text-xs text-slate-500">Plans DI — édition rapide</p>
            </div>
          )}
        </div>

        {/* Actions principales - responsive */}
        <div className={`flex items-center ${isTablet ? 'gap-1 flex-wrap' : 'gap-2'}`}>
          <Button
            variant="primary"
            iconLeft={<Upload size={isTablet ? 14 : 16} />}
            onClick={onClickImport}
            className={isTablet ? 'text-xs px-2 py-1' : ''}
          >
            {isTablet ? 'Import' : 'Importer plan'}
          </Button>

          <ChipToggle
            active={selectedTool === "eraser"}
            onClick={() => setSelectedTool(selectedTool === "eraser" ? null : "eraser")}
          >
            <span className="inline-flex items-center gap-1">
              <Eraser size={isTablet ? 12 : 14} />
              {!isTablet && 'Effacer'}
            </span>
          </ChipToggle>

          <ChipToggle
            active={selectedTool === "calibration"}
            onClick={() => setSelectedTool(selectedTool === "calibration" ? null : "calibration")}
          >
            <span className="inline-flex items-center gap-1">
              <Ruler size={isTablet ? 12 : 14} />
              {!isTablet && 'Calibrer'}
            </span>
          </ChipToggle>

          {/* Echelle - simplifié sur tablet */}
          <div className={`flex items-center gap-1 rounded-xl border border-slate-200 bg-white shadow-sm ${isTablet ? 'px-2 py-1' : 'ml-3 px-3 py-2 gap-2'}`}>
            {!isTablet && <span className="text-xs font-medium text-slate-700">Échelle</span>}
            <Button size="sm" onClick={() => setComfortScale(Math.max(0, comfortScale - 0.05))}>
              –
            </Button>
            <input
              type="range"
              min={0}
              max={2}
              step={0.05}
              value={comfortScale}
              onChange={(e) => setComfortScale(parseFloat(e.target.value))}
              className={`accent-sky-600 ${isTablet ? 'w-16' : 'w-32'}`}
              title="Échelle d'affichage"
            />
            <Button size="sm" onClick={() => setComfortScale(Math.min(2, comfortScale + 0.05))}>
              +
            </Button>
          </div>

          {/* Étages - compact sur tablet */}
          <Button
            variant="success"
            iconLeft={<Plus size={isTablet ? 14 : 16} />}
            onClick={onAddFloor}
            className={isTablet ? 'text-xs px-2 py-1' : ''}
          >
            {isTablet ? '+' : 'Étage'}
          </Button>

          <Button
            variant="danger"
            iconLeft={<Trash2 size={isTablet ? 14 : 16} />}
            onClick={onDeleteFloor}
            className={isTablet ? 'text-xs px-1 py-1' : ''}
          >
            {isTablet ? '' : 'Supprimer'}
          </Button>

          <select
            value={currentFloor}
            onChange={(e) => setCurrentFloor(Number(e.target.value))}
            className={`rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm hover:shadow-md transition ${isTablet ? 'h-7 px-1 text-xs' : 'h-9 px-2 text-sm'}`}
            title="Sélectionner l'étage"
          >
            {floors.map((f, idx) => (
              <option key={f.id} value={idx}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* input caché */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={onFileSelected}
          className="hidden"
        />
      </div>
    </header>
  );
};

export default TopBar;

