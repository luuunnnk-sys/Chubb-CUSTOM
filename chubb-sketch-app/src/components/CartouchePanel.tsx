// src/components/CartouchePanel.tsx
import React from "react";

export default function CartouchePanel({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* contenu */}
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
}
