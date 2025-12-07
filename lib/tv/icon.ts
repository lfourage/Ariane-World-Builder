import { tv } from "tailwind-variants";

export const icon = tv({
  base: "",
  variants: {
    size: {
      xs: "w-3 h-3",
      sm: "w-4 h-4 sm:w-5 sm:h-5",
      md: "w-5 h-5 sm:w-6 sm:h-6",
      lg: "w-6 h-6 sm:w-8 sm:h-8",
      xl: "w-8 h-8 sm:w-10 sm:h-10",
    },
  },
  defaultVariants: {
    size: "md",
  },
});
