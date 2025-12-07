import { tv } from "tailwind-variants";

export const navlink = tv({
  base: "font-medium transition-colors relative",
  variants: {
    variant: {
      default: "text-gray-300 hover:text-white",
      active: "text-white",
      button: "",
    },
    size: {
      sm: "text-sm px-3 py-1.5",
      md: "text-sm sm:text-base px-4 py-2",
    },
    underline: {
      true: "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-green-500 after:scale-x-100",
      false: "hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:right-0 hover:after:h-0.5 hover:after:bg-green-500 hover:after:scale-x-0 hover:after:hover:scale-x-100 hover:after:transition-transform",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    underline: false,
  },
});
