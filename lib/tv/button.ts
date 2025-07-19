import { tv } from "tailwind-variants";

export const button = tv({
  base: "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  variants: {
    intent: {
      nature: "bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-300",
      outline: "border border-emerald-500 text-emerald-700 hover:bg-emerald-50 focus:ring-emerald-300",
      ghost: "text-emerald-600 hover:bg-emerald-100 focus:ring-emerald-300",
    },
    size: {
      sm: "text-sm py-1 px-3",
      md: "text-base py-2 px-4",
      lg: "text-lg py-3 px-5",
    },
    fullWidth: {
      true: "w-full",
      false: "",
    },
  },
  defaultVariants: {
    intent: "nature",
    size: "md",
    fullWidth: false,
  },
});
