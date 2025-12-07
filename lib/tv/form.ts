import { tv } from "tailwind-variants";

export const formField = tv({
  slots: {
    wrapper: "",
    label: "block font-medium text-gray-300 mb-1",
    input: "w-full border border-dark-500 rounded-md bg-dark-300 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder:text-gray-500",
    error: "text-red-400 text-xs mt-1",
    helper: "text-gray-400 text-xs mt-1",
  },
  variants: {
    size: {
      sm: {
        label: "text-xs sm:text-sm",
        input: "px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm",
      },
      md: {
        label: "text-sm sm:text-base",
        input: "px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base",
      },
      lg: {
        label: "text-base sm:text-lg",
        input: "px-4 py-2.5 sm:px-5 sm:py-3 text-base sm:text-lg",
      },
    },
    variant: {
      default: {},
      ghost: {
        input: "bg-transparent border-transparent hover:border-dark-500",
      },
    },
    disabled: {
      true: {
        input: "opacity-50 cursor-not-allowed",
        label: "opacity-50",
      },
    },
  },
  defaultVariants: {
    size: "sm",
    variant: "default",
  },
});

export const textarea = tv({
  base: "w-full border border-dark-500 rounded-md bg-dark-300 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder:text-gray-500 resize-none",
  variants: {
    size: {
      sm: {
        true: "px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm",
      },
      md: {
        true: "px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base",
      },
      lg: {
        true: "px-4 py-2.5 sm:px-5 sm:py-3 text-base sm:text-lg",
      },
    },
  },
  defaultVariants: {
    size: "sm",
  },
});
