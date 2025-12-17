// src/components/ProjectInfo.tsx
import React from "react";
import { Building, MapPin, Calendar, FileText } from "lucide-react";
import { Project } from "../types/types";
import { ChipToggle } from "./ui/ChipToggle";

interface ProjectInfoProps {
  project: Project;
  onProjectInfoChange: (field: keyof Project, value: string) => void;
  isTablet?: boolean;
}

const inputCls = (isTablet: boolean) =>
  `w-full ${isTablet ? 'h-7 text-xs' : 'h-9 text-sm'} rounded-xl border border-slate-200 bg-white px-2 ` +
  "shadow-sm hover:shadow-md transition " +
  "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2";

const textAreaCls = (isTablet: boolean) =>
  `w-full ${isTablet ? 'min-h-[60px] text-xs' : 'min-h-[96px] text-sm'} rounded-xl border border-slate-200 bg-white px-2 py-1 ` +
  "shadow-sm hover:shadow-md transition resize-none " +
  "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2";

const ProjectInfo: React.FC<ProjectInfoProps> = ({
  project,
  onProjectInfoChange,
  isTablet = false,
}) => {
  return (
    <div className={`${isTablet ? 'p-1' : 'p-3'} border-b border-slate-200`}>
      {/* ===== Titre au-dessus, boutons en dessous ===== */}
      <div className={`${isTablet ? 'mb-1' : 'mb-3'}`}>
        <h3 className={`${isTablet ? 'text-xs' : 'text-sm'} font-semibold text-slate-900 mb-1`}>
          Projet
        </h3>
        <div className="flex gap-1 flex-wrap">
          <ChipToggle
            active={project.sector === "tertiaire"}
            onClick={() => onProjectInfoChange("sector", "tertiaire")}
          >
            {isTablet ? 'T' : 'Tertiaire'}
          </ChipToggle>
          <ChipToggle
            active={project.sector === "industrie"}
            onClick={() => onProjectInfoChange("sector", "industrie")}
          >
            {isTablet ? 'I' : 'Industrie'}
          </ChipToggle>
        </div>
      </div>

      <div className={`space-y-${isTablet ? '1' : '3'}`}>
        {/* Nom projet */}
        <div>
          <label className={`block ${isTablet ? 'text-[10px]' : 'text-xs'} font-medium text-slate-700 mb-0.5`}>
            Nom
          </label>
          <input
            type="text"
            value={project.name}
            onChange={(e) => onProjectInfoChange("name", e.target.value)}
            className={inputCls(isTablet)}
            placeholder="Nom du projet"
          />
        </div>

        {/* Bâtiment */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            <Building className="inline w-4 h-4 mr-1" />
            Bâtiment
          </label>
          <input
            type="text"
            value={project.building}
            onChange={(e) => onProjectInfoChange("building", e.target.value)}
            className={inputCls(isTablet)}
            placeholder="Nom ou adresse du bâtiment"
          />
        </div>

        {/* Étage/Zone */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            <MapPin className="inline w-4 h-4 mr-1" />
            Étage/Zone
          </label>
          <input
            type="text"
            value={project.floor}
            onChange={(e) => onProjectInfoChange("floor", e.target.value)}
            className={inputCls(isTablet)}
            placeholder="Ex: RDC, 1er étage, Sous-sol"
          />
        </div>

        {/* Date */}
        <div>
          <label className={`block ${isTablet ? 'text-[10px]' : 'text-xs'} font-medium text-slate-700 mb-0.5`}>
            <Calendar className={`inline ${isTablet ? 'w-3 h-3' : 'w-4 h-4'} mr-1`} />
            Date
          </label>
          <input
            type="date"
            value={project.date}
            onChange={(e) => onProjectInfoChange("date", e.target.value)}
            className={`${inputCls(isTablet)} ${isTablet ? 'max-w-[120px] text-[10px] px-1' : ''}`}
          />
        </div>

        {/* Contexte */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            <FileText className="inline w-4 h-4 mr-1" />
            Contexte du projet
          </label>
          <textarea
            value={project.context || ""}
            onChange={(e) => onProjectInfoChange("context", e.target.value)}
            placeholder="Décrivez ici le déroulé du chantier ou de l’étude..."
            className={textAreaCls(isTablet)}
          />
        </div>
      </div>

      {/* Infos projet (tu peux supprimer ce bloc si tu n’en veux pas) */}
      <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
        <div className="text-xs text-slate-700">
          <div className="flex justify-between">
            <span>Projet ID:</span>
            <span className="font-mono">{project.id.slice(-8)}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Dernière modif:</span>
            <span>
              {new Date().toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;
