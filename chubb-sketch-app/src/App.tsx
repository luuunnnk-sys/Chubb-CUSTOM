// src/App.tsx
import React, { useRef, useState } from "react";
import Canvas from "./components/Canvas";
import EquipmentPalette from "./components/EquipmentPalette";
import Legend from "./components/Legend";
import ProjectInfo from "./components/ProjectInfo";
import ExportControls from "./components/ExportControls";
import CartouchePreview from "./components/CartouchePreview";

import TopBar from "./components/app/TopBar";
import useProject from "./hooks/useProject";
import { useDeviceMode } from "./components/DeviceToggle";
import { Equipment } from "./types/types";

/** Petit panneau/modal pour afficher/éditer le cartouche */
const CartouchePanel = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 p-4 max-w-[90vw] max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold">Cartouche</h2>
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-3 rounded-lg border bg-white hover:bg-slate-50 text-sm"
            aria-label="Fermer"
          >
            Fermer
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

function App() {
  const {
    project,
    // setProject, // (facultatif) -> non utilisé ici
    currentFloor,
    setCurrentFloor,
    selectedTool,
    setSelectedTool,
    comfortScale,
    setComfortScale,
    handleProjectInfoChange,
    handleUpdateCartouche,
    handleFileUpload, // (file: File) => Promise<void>
    handleAddEquipment,
    handleRemoveEquipment,
    handleUpdateEquipment,
    handleRotateEquipment,
    handleMoveEquipment,
    handleAddFloor,
    handleDeleteFloor,
    handleCalibrationComplete,
  } = useProject();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<any>(null);

  // État d’ouverture du panneau Cartouche
  const [showCartouchePanel, setShowCartouchePanel] = useState(false);

  // Mode device (PC ou iPad/Tablette)
  const [deviceMode, setDeviceMode] = useDeviceMode();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* TopBar */}
      <TopBar
        onClickImport={() => fileInputRef.current?.click()}
        onFileSelected={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFileUpload(file);
          e.target.value = ""; // autorise ré-import du même fichier
        }}
        fileInputRef={fileInputRef}
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        comfortScale={comfortScale}
        setComfortScale={setComfortScale}
        currentFloor={currentFloor}
        setCurrentFloor={setCurrentFloor}
        floors={project.floors}
        onAddFloor={handleAddFloor}
        onDeleteFloor={handleDeleteFloor}
        deviceMode={deviceMode}
        onDeviceModeChange={setDeviceMode}
      />

      {/* Corps */}
      <div className="flex-1 text-sm w-full gap-4 px-2 md:px-4 py-4 flex">
        {/* Panneau gauche - plus compact sur tablette */}
        <div className={`${deviceMode === 'tablet' ? 'w-48' : 'w-72'} bg-white border border-slate-200 rounded-xl shadow-sm p-2 flex flex-col overflow-hidden ${deviceMode === 'tablet' ? 'text-xs' : ''}`}>
          <ProjectInfo project={project} onProjectInfoChange={handleProjectInfoChange} isTablet={deviceMode === 'tablet'} />

          {/* Bouton Cartouche */}
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setShowCartouchePanel((v) => !v)}
              className={[
                `w-full ${deviceMode === 'tablet' ? 'h-7 text-xs' : 'h-10 text-sm'} rounded-xl border px-2`,
                showCartouchePanel
                  ? "bg-sky-600 text-white border-sky-700"
                  : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50",
              ].join(" ")}
              aria-pressed={showCartouchePanel}
              aria-label="Afficher/masquer le cartouche"
              title="Afficher/masquer le cartouche"
            >
              Cartouche
            </button>
          </div>

          <div className="mt-2 overflow-hidden">
            <EquipmentPalette selectedTool={selectedTool} onToolSelect={setSelectedTool} isTablet={deviceMode === 'tablet'} />
          </div>

          {/* Export & Sauvegarde */}
          <div className="mt-auto">
            <ExportControls project={project} />
          </div>
        </div>

        {/* Canvas (on passe les props attendues, mais on masque le cartouche ici) */}
        <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm relative overflow-hidden cartouche-hidden">
          <Canvas
            ref={canvasRef}
            project={project.floors[currentFloor]}
            selectedTool={selectedTool}
            onAddEquipment={handleAddEquipment}
            onRemoveEquipment={handleRemoveEquipment}
            onUpdateEquipment={handleUpdateEquipment}
            onRotateEquipment={handleRotateEquipment}
            onMoveEquipment={handleMoveEquipment}
            onCancelTool={() => setSelectedTool(null)}
            onCalibrationComplete={handleCalibrationComplete}
            currentFloor={currentFloor}
            scale={project.scale}
            comfortScale={comfortScale}
            // ✅ on garde ces deux props pour respecter CanvasProps
            cartouche={project.cartouche}
            onUpdateCartouche={handleUpdateCartouche}
            // Mode device (PC ou iPad)
            deviceMode={deviceMode}
          />
          {/* Masque uniquement l'instance de cartouche rendue dans la zone du plan */}
          <style>{`.cartouche-hidden #cartouche-preview{display:none!important;}`}</style>
        </div>

        {/* Légende - plus compacte sur tablette */}
        <div className={`${deviceMode === 'tablet' ? 'w-36' : 'w-56'} bg-white border border-slate-200 rounded-xl shadow-sm p-2 overflow-hidden ${deviceMode === 'tablet' ? 'text-xs' : ''}`}>
          <Legend
            project={project}
            equipment={project.floors[currentFloor].equipment as Equipment[]}
            isTablet={deviceMode === 'tablet'}
          />
        </div>
      </div>

      {/* Input fichier caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFileUpload(file);
          e.target.value = "";
        }}
        className="hidden"
      />

      {/* ====== PANNEAU CARTOUCHE (modal/panneau centré) ====== */}
      {showCartouchePanel && (
        <CartouchePanel onClose={() => setShowCartouchePanel(false)}>
          <CartouchePreview
            cartouche={project.cartouche}
            onUpdateCartouche={handleUpdateCartouche}
            mode="edit" // UI éditable
          />
        </CartouchePanel>
      )}

      {/* ====== COPIE INVISIBLE POUR L'EXPORT (toujours présente) ====== */}
      <div
        id="cartouche-export-container"
        aria-hidden="true"
        className="fixed -left-[10000px] -top-[10000px] pointer-events-none select-none"
        data-export="true"
      >
        {/* 🔒 mode=display : aucune UI, textes statiques */}
        <CartouchePreview
          cartouche={project.cartouche}
          onUpdateCartouche={handleUpdateCartouche}
          mode="display"
        />
        {/* Styles de secours export : cache toute UI, force le texte en blanc */}
        <style>{`
          [data-export="true"] .cartouche-toolbar { display: none !important; }
          [data-export="true"] select,
          [data-export="true"] button,
          [data-export="true"] textarea,
          [data-export="true"] input { display: none !important; }
          [data-export="true"] .cartouche-title,
          [data-export="true"] .cartouche-project { color: #ffffff !important; }
        `}</style>
      </div>
    </div>
  );
}

export default App;
