// src/components/TabIcons.tsx
import React from "react";

type P = { className?: string; strokeWidth?: number };

const Base = ({ children, className, strokeWidth = 1.9 }: React.PropsWithChildren<P>) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor"
       strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
       width="1em" height="1em">
    {children}
  </svg>
);

export const IconAuto = (p: P) => (
  <Base {...p}><circle cx="12" cy="12" r="7"/><path d="M9 12h6M12 9v6"/></Base>
);

export const IconManual = (p: P) => (
  <Base {...p}><rect x="6" y="6" width="12" height="12" rx="2"/><circle cx="12" cy="12" r="2.2"/></Base>
);

export const IconVesda = (p: P) => (
  <Base {...p}><rect x="5" y="5" width="14" height="14" rx="3"/><path d="M7 9h10M7 12h6"/><circle cx="16.5" cy="12" r="1.2"/></Base>
);

export const IconAlarm = (p: P) => (
  <Base {...p}><path d="M9 17h6a4 4 0 0 0 4-4V9a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v4a4 4 0 0 0 4 4Z"/><path d="M4 8l-2-2M20 8l2-2"/></Base>
);

export const IconFlash = (p: P) => (
  <Base {...p}><path d="M13 2L6 14h5l-1 8 7-12h-5l1-8z"/></Base>
);

export const IconExtinct = (p: P) => (
  <Base {...p}><path d="M8 7h6a3 3 0 0 1 3 3v8a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1Z"/><path d="M12 2l6 2-6 2M12 7v3"/></Base>
);

export const IconDivers = (p: P) => (
  <Base {...p}><circle cx="6" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="18" cy="12" r="2"/></Base>
);
