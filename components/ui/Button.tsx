"use client";
import { button as buttonVariants } from "@lib/tv/button";

interface ButtonProps {
  handleClick?: () => void | Promise<void>;
  type?: string;
  children?: React.ReactNode;
  intent?: "primary" | "secondary" | "nature" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const Button = ({
  handleClick,
  type,
  children,
  intent = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
  className = "",
}: ButtonProps) => {
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`${buttonVariants({ intent, size, fullWidth })} ${className}`}
    >
      {children || type}
    </button>
  );
};
