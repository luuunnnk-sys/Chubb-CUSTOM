// src/components/ui/Button.tsx
import React from "react";
import clsx from "clsx";

type Variant = "primary" | "success" | "neutral" | "danger" | "ghost";
type Size = "sm" | "md" | "lg"; // 👈 ajoute "lg"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-sky-600 text-white border border-sky-700 shadow-sm hover:bg-sky-700 hover:shadow-md active:translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:border-slate-300 disabled:text-white disabled:shadow-none",
  success:
    "bg-emerald-600 text-white border border-emerald-700 shadow-sm hover:bg-emerald-700 hover:shadow-md active:translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:border-slate-300 disabled:text-white disabled:shadow-none",
  neutral:
    "bg-white text-slate-800 border border-slate-200 shadow-sm hover:bg-slate-50 hover:shadow-md active:translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none",
  danger:
    "bg-rose-600 text-white border border-rose-700 shadow-sm hover:bg-rose-700 hover:shadow-md active:translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:border-slate-300 disabled:text-white disabled:shadow-none",
  ghost:
    "bg-transparent text-slate-700 border border-transparent hover:bg-slate-100 active:translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:text-slate-400",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-9 px-3.5 text-sm",
  lg: "h-11 px-5 text-base", // 👈 taille “grande” pour CTA (Splash, etc.)
};

export const Button: React.FC<ButtonProps> = ({
  variant = "neutral",
  size = "md",
  className,
  children,
  iconLeft,
  iconRight,
  disabled,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl transition-all select-none",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {iconLeft ? <span className="shrink-0">{iconLeft}</span> : null}
      <span className="whitespace-nowrap">{children}</span>
      {iconRight ? <span className="shrink-0">{iconRight}</span> : null}
    </button>
  );
};

export default Button;
