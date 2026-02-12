"use client";

import { ReactNode } from "react";

interface ButtonProps {
  variant: "primary" | "outline" | "secondary";
  className?: string;
  onClick?: () => void;
  size: "lg" | "sm" | "md";
  children: ReactNode;
  disabled?: boolean;
}

export const Button = ({
  size = "md",
  variant,
  className = "",
  onClick,
  children,
  disabled = false,
}: ButtonProps) => {
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    cursor-pointer
  `;

  const sizeStyles = {
    sm: "px-4 py-2 text-sm rounded-lg gap-1.5",
    md: "px-5 py-2.5 text-sm rounded-xl gap-2",
    lg: "px-6 py-3 text-base rounded-xl gap-2",
  };

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-violet-600 to-blue-600
      hover:from-violet-500 hover:to-blue-500
      text-white
      shadow-lg shadow-violet-500/25
      hover:shadow-xl hover:shadow-violet-500/30
      hover:scale-[1.02]
      active:scale-[0.98]
      focus:ring-violet-500
    `,
    secondary: `
      bg-zinc-800
      hover:bg-zinc-700
      text-white
      border border-zinc-700
      hover:border-zinc-600
      shadow-sm
      hover:shadow-md
      active:scale-[0.98]
      focus:ring-zinc-500
    `,
    outline: `
      bg-transparent
      hover:bg-white/5
      text-zinc-300
      hover:text-white
      border border-zinc-700
      hover:border-zinc-500
      active:scale-[0.98]
      focus:ring-zinc-500
    `,
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
