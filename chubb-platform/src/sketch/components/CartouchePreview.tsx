// src/components/CartouchePreview.tsx
import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";
import { CartoucheData } from "../types/types";

/** Présélections d'agences */
const AGENCIES = {
  sophia: {
    id: "sophia",
    label: "Sophia Antipolis",
    lines: [
      "CHUBB FRANCE",
      "25, allée Pierre Ziller – ZAC des Bouillides",
      "06560 SOPHIA ANTIPOLIS",
      "TÉL. : 04.93.74.10.10  •  FAX : 04.93.74.49.78",
    ],
  },
  aix: {
    id: "aix",
    label: "Aix-en-Provence",
    lines: [
      "CHUBB FRANCE - Agence d’Aix-en-Provence",
      "Bâtiment J - Parc Cézanne 2 - 290, Av. Galilée CS 50462",
      "13592 AIX EN PROVENCE CEDEX 3",
      "TEL : 04 42 90 23 00  •  FAX : 04 42 90 23 01",
    ],
  },
} as const;

type AgencyKey = keyof typeof AGENCIES;

interface CartouchePreviewProps {
  cartouche: CartoucheData;
  onUpdateCartouche: (updates: Partial<CartoucheData>) => void;
  planZoom?: number;
  /** "edit" = champs éditables (UI) | "display" = texte statique (export) */
  mode?: "edit" | "display";
}

const CartouchePreview = forwardRef<any, CartouchePreviewProps>(
  ({ cartouche, onUpdateCartouche, planZoom = 1, mode = "edit" }, ref) => {
    const rootRef = useRef<HTMLDivElement>(null);

    // Use agency from cartouche data with fallback to sophia
    const agencyId = (cartouche.agency || "sophia") as AgencyKey;
    const [editAgency, setEditAgency] = useState(false);

    const agencyText = useMemo(() => {
      if (cartouche.customAgencyText) return cartouche.customAgencyText;
      return AGENCIES[agencyId].lines.join("\n");
    }, [agencyId, cartouche.customAgencyText]);

    useImperativeHandle(ref, () => ({
      getCartoucheData: () => cartouche,
      getElement: () => rootRef.current,
    }));

    const handleChangeAgency = (key: AgencyKey) => {
      onUpdateCartouche({ agency: key, customAgencyText: undefined });
      setEditAgency(false);
    };

    const handleCustomAgencyChange = (text: string) => {
      onUpdateCartouche({ customAgencyText: text });
    };

    // Styles de fige (largeur fixe) + contre-zoom éventuel
    const FIXED_WIDTH = 820; // px — ajuste si besoin
    const counterScale = 1 / (planZoom || 1);
    const fixedStyles: React.CSSProperties = {
      boxSizing: "border-box",
      width: FIXED_WIDTH,
      transform: counterScale !== 1 ? `scale(${counterScale})` : undefined,
      transformOrigin: "top left",
    };

    const isEdit = mode === "edit";

    return (
      <div className="overflow-auto">
        <div
          id="cartouche-preview"
          ref={rootRef}
          className="border border-black text-[10px] bg-white flex-none mx-auto"
          style={fixedStyles}
        >
          {/* Ligne supérieure */}
          <div className="flex border-b border-black">
            {/* Logo + Agence + Adresse chantier */}
            <div className="w-52 flex flex-col border-r border-black p-2">
              <div className="flex items-center justify-center">
                <img src="/chubbfs.png" alt="Chubb Logo" className="w-32 mb-1" />
              </div>

              {/* Barre d’outils agence — seulement en mode EDIT */}
              {isEdit && (
                <div className="cartouche-toolbar flex items-center justify-between mb-1">
                  <select
                    value={agencyId}
                    onChange={(e) => handleChangeAgency(e.target.value as AgencyKey)}
                    className="border text-[9px] px-1 py-0.5"
                    title="Choisir l’agence"
                  >
                    <option value="sophia">{AGENCIES.sophia.label}</option>
                    <option value="aix">{AGENCIES.aix.label}</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => setEditAgency((v) => !v)}
                    className="px-2 py-0.5 border rounded text-[9px] hover:bg-gray-100"
                    title="Modifier le bloc agence"
                  >
                    {editAgency ? "OK" : "Modifier"}
                  </button>
                </div>
              )}

              {/* Bloc agence (affichage ou édition) */}
              {!editAgency || !isEdit ? (
                <pre className="text-[8px] leading-tight text-center whitespace-pre-wrap font-sans">
                  {agencyText}
                </pre>
              ) : (
                <textarea
                  className="text-[8px] leading-tight border w-full h-20 p-1"
                  value={agencyText}
                  onChange={(e) => handleCustomAgencyChange(e.target.value)}
                />
              )}

              {/* Adresse chantier */}
              {isEdit ? (
                <input
                  value={cartouche.address}
                  onChange={(e) => onUpdateCartouche({ address: e.target.value })}
                  className="mt-1 border text-[8px] w-full text-center"
                  placeholder="Adresse chantier"
                />
              ) : (
                <div className="mt-1 text-[8px] text-center">{cartouche.address}</div>
              )}
            </div>

            {/* Phase + N° Projet (indépendant du titre central) */}
            <div className="flex flex-col w-32 border-r border-black">
              <div className="border-b border-black p-1">
                <span className="font-bold">PHASE :</span>
                {isEdit ? (
                  <input
                    value={cartouche.phase}
                    onChange={(e) => onUpdateCartouche({ phase: e.target.value })}
                    className="ml-1 border text-[9px] w-16"
                    placeholder="Phase"
                  />
                ) : (
                  <span className="ml-1">{cartouche.phase}</span>
                )}
              </div>
              <div className="p-1 font-bold">
                {isEdit ? (
                  <input
                    value={cartouche.projetNum}
                    onChange={(e) => onUpdateCartouche({ projetNum: e.target.value })}
                    className="border text-[9px] w-full"
                    placeholder="N° PROJET"
                  />
                ) : (
                  <div className="text-[9px]">{cartouche.projetNum}</div>
                )}
              </div>
            </div>

            {/* Titre central + NOM DU PROJET */}
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-700 border-r border-black py-1">
              <div
                className="cartouche-title text-sm font-bold text-white"
                style={{ color: "#ffffff" }}
              >
                SYSTÈME DE SÉCURITÉ INCENDIE
              </div>

              {isEdit ? (
                <input
                  value={cartouche.project}
                  onChange={(e) => onUpdateCartouche({ project: e.target.value })}
                  placeholder="NOM DU PROJET"
                  aria-label="Nom du projet"
                  className="cartouche-project mt-0.5 w-[90%] text-center bg-transparent border-b border-white/40 focus:border-white focus:outline-none text-white text-[11px] leading-tight tracking-wider uppercase placeholder-white/60"
                  style={{ color: "#ffffff" }}
                />
              ) : (
                <div
                  className="cartouche-project text-white text-[11px] leading-tight tracking-wider uppercase mt-0.5 text-center"
                  style={{ color: "#ffffff" }}
                >
                  {cartouche.project?.trim() ? cartouche.project.trim() : "NOM DU PROJET"}
                </div>
              )}
            </div>

            {/* Tableau révisions */}
            <div className="w-64 flex flex-col">
              {"EDCBA".split("").map((rev) => (
                <div key={rev} className="flex border-b border-black h-6 items-center">
                  <div className="w-6 text-center border-r border-black">{rev}</div>
                  <div className="flex-1 border-r border-black text-center">
                    {rev === "A" ? cartouche.date : ""}
                  </div>
                  <div className="flex-1 border-r border-black text-center">
                    {rev === "A" ? "CREATION" : ""}
                  </div>
                  <div className="w-16 border-r border-black text-center text-[8px]">
                    {rev === "A" &&
                      (isEdit ? (
                        <input
                          value={cartouche.drawer}
                          onChange={(e) => onUpdateCartouche({ drawer: e.target.value })}
                          className="border text-[8px] w-full"
                          placeholder="Dessinateur"
                        />
                      ) : (
                        <span>{cartouche.drawer}</span>
                      ))}
                  </div>
                  <div className="w-16 border-r border-black text-center text-[8px]">
                    {rev === "A" &&
                      (isEdit ? (
                        <input
                          value={cartouche.verifier}
                          onChange={(e) => onUpdateCartouche({ verifier: e.target.value })}
                          className="border text-[8px] w-full"
                          placeholder="Vérif."
                        />
                      ) : (
                        <span>{cartouche.verifier}</span>
                      ))}
                  </div>
                  <div className="w-16 text-center text-[8px]">
                    {rev === "A" &&
                      (isEdit ? (
                        <input
                          value={cartouche.approver}
                          onChange={(e) => onUpdateCartouche({ approver: e.target.value })}
                          className="border text-[8px] w-full"
                          placeholder="Approb."
                        />
                      ) : (
                        <span>{cartouche.approver}</span>
                      ))}
                  </div>
                </div>
              ))}

              {/* En-têtes du tableau */}
              <div className="flex text-[8px] font-bold">
                <div className="w-6 border-r border-black text-center">Rev.</div>
                <div className="flex-1 border-r border-black text-center">DATE</div>
                <div className="flex-1 border-r border-black text-center">MODIFICATIONS</div>
                <div className="w-16 border-r border-black text-center">DESS. PAR</div>
                <div className="w-16 border-r border-black text-center">VERIF. PAR</div>
                <div className="w-16 text-center">APPRO. PAR</div>
              </div>
            </div>
          </div>

          {/* Ligne inférieure - centrée verticalement */}
          <div className="flex border-t border-black text-[9px]">
            <div className="flex-1 border-r border-black p-1 flex items-center">
              N° PROJET :
              {isEdit ? (
                <input
                  value={cartouche.projetNum}
                  onChange={(e) => onUpdateCartouche({ projetNum: e.target.value })}
                  className="ml-1 border text-[8px] w-24"
                />
              ) : (
                <span className="ml-1">{cartouche.projetNum}</span>
              )}
            </div>
            <div className="flex-1 border-r border-black p-1 flex items-center">
              N° DAO :
              {isEdit ? (
                <input
                  value={cartouche.daoNum}
                  onChange={(e) => onUpdateCartouche({ daoNum: e.target.value })}
                  className="ml-1 border text-[8px] w-24"
                />
              ) : (
                <span className="ml-1">{cartouche.daoNum}</span>
              )}
            </div>
            <div className="w-32 border-r border-black p-1 flex items-center">
              ECHELLE :
              {isEdit ? (
                <input
                  value={cartouche.scale}
                  onChange={(e) => onUpdateCartouche({ scale: e.target.value })}
                  className="ml-1 border text-[8px] w-12"
                />
              ) : (
                <span className="ml-1">{cartouche.scale}</span>
              )}
            </div>
            <div className="w-24 p-1 flex items-center">
              FOLIO :
              {isEdit ? (
                <input
                  value={cartouche.folio}
                  onChange={(e) => onUpdateCartouche({ folio: e.target.value })}
                  className="ml-1 border text-[8px] w-12"
                />
              ) : (
                <span className="ml-1">{cartouche.folio}</span>
              )}
            </div>
          </div>

          {/* Mention légale - centrée verticalement */}
          <div id="cartouche-legal" className="text-[7px] text-center border-t border-black p-1 flex items-center justify-center">
            LES INFORMATIONS CONTENUES DANS CE DOCUMENT SONT LA PROPRIÉTÉ
            INTELLECTUELLE DE CHUBB FRANCE
          </div>
        </div>
      </div>
    );
  }
);

CartouchePreview.displayName = "CartouchePreview";
export default CartouchePreview;
