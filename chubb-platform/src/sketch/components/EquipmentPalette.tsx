// src/components/EquipmentPalette.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { EquipmentType, EquipmentDefinition } from "../types/types";
import { getEquipmentDefinitions } from "../utils/equipmentDefinitions";
import {
  CATEGORIES,
  CATEGORY_LABEL,
  groupByCategory,
  EquipmentCategory,
} from "../utils/equipmentCategories";
import {
  IconAuto,
  IconManual,
  IconVesda,
  IconAlarm,
  IconFlash,
  IconExtinct,
  IconDivers,
} from "./TabIcons";

interface EquipmentPaletteProps {
  selectedTool: EquipmentType | null;
  onToolSelect: (tool: EquipmentType | null) => void;
  isTablet?: boolean;
}

const PAGE_SIZE = 6;
type ViewMode = "CATEGORIES" | "ITEMS";

const CAT_ICON: Record<EquipmentCategory, (p: { className?: string }) => JSX.Element> = {
  DETECTEUR_AUTOMATIQUE: (p) => <IconAuto {...p} />,
  DETECTEUR_MANUEL: (p) => <IconManual {...p} />,
  VESDA: (p) => <IconVesda {...p} />,
  ALARME: (p) => <IconAlarm {...p} />,
  FLASH: (p) => <IconFlash {...p} />,
  EXTINCTION: (p) => <IconExtinct {...p} />,
  DIVERS: (p) => <IconDivers {...p} />,
};

const EquipmentPalette: React.FC<EquipmentPaletteProps> = ({ selectedTool, onToolSelect, isTablet = false }) => {
  const defs = getEquipmentDefinitions();
  const grouped = useMemo(() => groupByCategory(defs), [defs]);

  const [mode, setMode] = useState<ViewMode>("CATEGORIES");
  const [activeCat, setActiveCat] = useState<EquipmentCategory>("DETECTEUR_AUTOMATIQUE");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // === Refs pour le ruban d’onglets (auto-scroll) ===
  const tabStripRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Record<EquipmentCategory, HTMLButtonElement | null>>({
    DETECTEUR_AUTOMATIQUE: null,
    DETECTEUR_MANUEL: null,
    VESDA: null,
    ALARME: null,
    FLASH: null,
    EXTINCTION: null,
    DIVERS: null,
  });

  // Persistance légère
  useEffect(() => {
    const m = (localStorage.getItem("pal_mode") as ViewMode | null) ?? "CATEGORIES";
    const c =
      (localStorage.getItem("pal_cat") as EquipmentCategory | null) ?? "DETECTEUR_AUTOMATIQUE";
    setMode(m);
    setActiveCat(c);
  }, []);
  useEffect(() => {
    localStorage.setItem("pal_mode", mode);
  }, [mode]);
  useEffect(() => {
    localStorage.setItem("pal_cat", activeCat);
  }, [activeCat]);

  // Auto-scroll vers l’onglet actif à chaque changement
  useEffect(() => {
    const el = tabRefs.current[activeCat];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeCat]);

  const onPickCat = (cat: EquipmentCategory) => {
    setActiveCat(cat);
    setPage(1);
    setMode("ITEMS");
    // Optionnel: micro “kick” pour scroller immédiatement avant le prochain rendu
    queueMicrotask(() => {
      const el = tabRefs.current[cat];
      el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    });
  };

  // Base list for current category
  const base: EquipmentDefinition[] = useMemo(
    () => grouped[activeCat] ?? [],
    [grouped, activeCat]
  );

  // Search (uniquement en vue ITEMS)
  const filtered: EquipmentDefinition[] = useMemo(() => {
    if (mode !== "ITEMS") return base;
    const q = search.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (eq) =>
        eq.name.toLowerCase().includes(q) ||
        (eq.symbol ?? "").toLowerCase().includes(q) ||
        (eq.description ?? "").toLowerCase().includes(q)
    );
  }, [mode, base, search]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    if (mode !== "ITEMS") return [];
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [mode, filtered, page]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  // Compteurs
  const counts = useMemo(() => {
    const c: Record<EquipmentCategory, number> = {
      DETECTEUR_AUTOMATIQUE: 0,
      DETECTEUR_MANUEL: 0,
      VESDA: 0,
      ALARME: 0,
      FLASH: 0,
      EXTINCTION: 0,
      DIVERS: 0,
    };
    CATEGORIES.forEach((k) => (c[k] = (grouped[k] ?? []).length));
    return c;
  }, [grouped]);

  return (
    <div className="p-3 border-t border-slate-200 mt-3">
      <div className="sticky top-0 z-20 bg-white pt-1 pb-3 shadow-sm overflow-visible">
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Équipements de Sécurité</h3>

        {/* Onglets */}
        <div
          ref={tabStripRef}
          className="flex gap-2 overflow-x-auto pb-1 scroll-smooth"
        >
          {CATEGORIES.map((cat) => {
            const Icon = CAT_ICON[cat];
            const active = cat === activeCat;
            return (
              <button
                key={cat}
                ref={(el) => (tabRefs.current[cat] = el)}
                onClick={() => onPickCat(cat)}
                className={[
                  "flex items-center gap-2 px-3 h-9 rounded-xl border text-sm whitespace-nowrap transition",
                  active
                    ? "bg-sky-600 text-white border-sky-700"
                    : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50",
                ].join(" ")}
                title={CATEGORY_LABEL[cat]}
              >
                <Icon className="w-4 h-4" />
                <span>{CATEGORY_LABEL[cat]}</span>
                <span
                  className={[
                    "ml-1 text-xs px-2 py-0.5 rounded-lg",
                    active ? "bg-white/20" : "bg-slate-100 text-slate-600",
                  ].join(" ")}
                >
                  {counts[cat] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-2 flex items-center gap-2 overflow-visible">
          {mode === "ITEMS" ? (
            <>
              <input
                type="text"
                placeholder={`Rechercher dans ${CATEGORY_LABEL[activeCat]}…`}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              />
              <button
                type="button"
                onClick={() => {
                  setMode("CATEGORIES");
                  setSearch("");
                }}
                className="relative z-10 h-9 px-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm inline-flex items-center gap-2 whitespace-nowrap leading-none hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                aria-label="Revenir aux catégories"
                title="Retour aux catégories"
              >
                <span aria-hidden="true">←</span>
                <span>Retour</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setMode("ITEMS")}
              className="h-9 px-3 rounded-xl border border-sky-700 bg-sky-600 text-white text-sm"
            >
              Voir {CATEGORY_LABEL[activeCat]}
            </button>
          )}
        </div>
      </div>

      {/* Vue CATEGORIES */}
      {mode === "CATEGORIES" && (
        <div className="grid grid-cols-2 gap-3 mt-3">
          {CATEGORIES.map((cat) => {
            const Icon = CAT_ICON[cat];
            const active = cat === activeCat;
            return (
              <button
                key={cat}
                onClick={() => onPickCat(cat)}
                className={[
                  "w-full h-24 flex flex-col items-center justify-center rounded-xl border shadow-sm transition",
                  active
                    ? "bg-sky-600 text-white border-sky-700"
                    : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50",
                ].join(" ")}
              >
                <Icon className="w-6 h-6 mb-1" />
                <div className="text-xs font-medium">{CATEGORY_LABEL[cat]}</div>
                <div
                  className={[
                    "text-[10px] mt-0.5",
                    active ? "text-white/85" : "text-slate-500",
                  ].join(" ")}
                >
                  {counts[cat]} élément(s)
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Vue ITEMS */}
      {mode === "ITEMS" && (
        <>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {pageItems.map((equipment) => {
              const isSelected = selectedTool === equipment.type;

              let width = (equipment as any).width ?? equipment.size ?? 32;
              let height = (equipment as any).height ?? equipment.size ?? 32;
              if (equipment.type === "note") {
                width = 40;
                height = 40;
              }
              if (equipment.type === "tubing") {
                width = 64;
                height = 64;
              }

              return (
                <button
                  key={equipment.type}
                  onClick={() => onToolSelect(isSelected ? null : equipment.type)}
                  title={equipment.description}
                  className={[
                    "w-full h-28 flex flex-col items-center justify-center rounded-xl border shadow-sm transition-all",
                    "hover:shadow-md active:translate-y-[1px] px-2",
                    isSelected
                      ? "bg-sky-600 text-white border-sky-700"
                      : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50",
                  ].join(" ")}
                >
                  <img
                    src={equipment.iconSrc}
                    alt={equipment.name}
                    className="object-contain mb-1"
                    style={{ width, height }}
                    draggable={false}
                  />
                  <span
                    className={[
                      "text-xs font-medium text-center truncate w-full",
                      isSelected ? "text-white/95" : "text-slate-700",
                    ].join(" ")}
                  >
                    {equipment.name}
                  </span>
                  {!isSelected && equipment.symbol ? (
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      {equipment.symbol}
                    </span>
                  ) : null}
                </button>
              );
            })}
            {pageItems.length === 0 && (
              <div className="text-slate-500 text-sm p-3">
                Aucun équipement dans cette catégorie.
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm disabled:opacity-50"
                disabled={page === 1}
              >
                Précédent
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={[
                      "h-9 min-w-9 px-2 rounded-lg border text-sm",
                      p === page
                        ? "bg-sky-600 text-white border-sky-700"
                        : "bg-white text-slate-800 border-slate-200",
                    ].join(" ")}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm disabled:opacity-50"
                disabled={page === totalPages}
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EquipmentPalette;
