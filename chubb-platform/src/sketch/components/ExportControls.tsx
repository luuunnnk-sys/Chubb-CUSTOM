// src/components/ExportControls.tsx
import React from "react";
import { Download, FileText } from "lucide-react";
import { Project } from "../types/types";

// On pointe vers utils/export
import { exportToPDF } from "../utils/export";

interface ExportControlsProps {
  project: Project;
}

const ExportControls: React.FC<ExportControlsProps> = ({ project }) => {
  const handleExportPDF = async () => {
    try {
      await exportToPDF(project); // un seul argument
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
      alert("Erreur lors de l'export PDF. Veuillez réessayer.");
    }
  };

  const handleSaveProject = () => {
    try {
      const dataStr = JSON.stringify(project, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.name.replace(/[^a-z0-9]/gi, "_")}_${project.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Sauvegarde JSON échouée:", e);
      alert("Erreur lors de la sauvegarde du projet.");
    }
  };

  const canExport = project.floors.some(
    (f) => !!f.backgroundImage && (f.equipment?.length ?? 0) > 0
  );

  return (
    <div className="p-4 border-t border-gray-200 mt-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Export &amp; Sauvegarde</h3>

      <div className="space-y-3">
        {/* Exporter PDF */}
        <button
          type="button"
          onClick={handleExportPDF}
          disabled={!canExport}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
          aria-label="Exporter en PDF"
          title="Exporter en PDF (Plan + Légende + Conformité + Cartouche)"
        >
          <FileText className="w-4 h-4" />
          <span>Exporter PDF</span>
        </button>

        {/* Sauvegarder Projet */}
        <button
          type="button"
          onClick={handleSaveProject}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          aria-label="Sauvegarder le projet"
          title="Sauvegarder le projet (JSON complet)"
        >
          <Download className="w-4 h-4" />
          <span>Sauvegarder Projet</span>
        </button>
      </div>
    </div>
  );
};

export default ExportControls;
