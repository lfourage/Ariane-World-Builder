import { tv } from "tailwind-variants";

export const button = tv({
  base: "rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
  variants: {
    intent: {
      primary: "bg-blue-500 text-white hover:bg-blue-600",
      secondary: "bg-gray-500 text-white hover:bg-gray-600",
      nature: "bg-green-500 text-white hover:bg-green-600",
      danger: "bg-red-500 text-white hover:bg-red-600",
      ghost: "bg-transparent text-gray-300 hover:bg-gray-800",
    },
    size: {
      sm: "px-3 py-1.5 text-xs sm:text-sm",
      md: "px-5 py-2 text-sm",
      lg: "px-6 py-2.5 sm:px-8 sm:py-3 text-base sm:text-lg",
    },
    fullWidth: {
      true: "w-full sm:w-auto",
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "md",
  },
});
