import React from "react";
import clsx from "clsx";

export const ChipToggle: React.FC<{
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;         // <--- NEW
}> = ({ active, onClick, children, className }) => (
  <button
    onClick={onClick}
    className={clsx(
      "h-9 px-3 rounded-full border transition-all text-sm", // h-9 un peu plus haut
      "shadow-sm hover:shadow-md active:translate-y-[1px]",
      "leading-none",                // <--- évite que le texte “descende”
      "flex items-center",           // <--- centre vertical
      active
        ? "bg-sky-600 text-white border-sky-700"
        : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50",
      className
    )}
  >
    {children}
  </button>
);
