import { tv } from "tailwind-variants";

export const input = tv({
  base: "w-full rounded-lg border px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-offset-2",
  variants: {
    intent: {
      nature:
        "border-emerald-300 focus:ring-emerald-400 bg-white text-emerald-900 placeholder:text-emerald-400",
      error:
        "border-red-300 focus:ring-red-400 text-red-800 placeholder:text-red-400",
      disabled: "bg-gray-100 text-gray-500 cursor-not-allowed",
    },
    size: {
      sm: "text-sm py-1.5 px-3",
      md: "text-base py-2 px-4",
      lg: "text-lg py-3 px-5",
    },
  },
  defaultVariants: {
    intent: "nature",
    size: "md",
  },
});
