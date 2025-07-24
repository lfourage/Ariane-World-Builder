import { tv } from "tailwind-variants";

export const header = tv({
  base: "w-full flex items-center justify-between px-6 py-4 bg-white shadow-md border-b",
  variants: {
    padded: {
      true: "py-6",
      false: "py-2",
    },
    sticky: {
      true: "sticky top-0 z-50 bg-white",
      false: "",
    },
  },
  defaultVariants: {
    padded: true,
    sticky: false,
  },
});
