import { tv } from "tailwind-variants";

export const modal = tv({
  slots: {
    overlay: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50",
    container: "bg-black rounded-lg shadow-xl border border-dark-400 z-50",
    header: "flex items-center justify-between",
    title: "font-bold text-white",
    closeButton: "text-gray-500 hover:text-gray-300 transition-colors",
    content: "",
    footer: "flex justify-center",
  },
  variants: {
    size: {
      sm: {
        container: "w-[calc(100vw-24px)] max-w-[320px] sm:max-w-sm max-h-[90vh] overflow-y-auto p-4 sm:p-5",
        header: "mb-3 sm:mb-4",
        title: "text-base sm:text-lg",
        closeButton: "-mr-1",
        content: "space-y-3 sm:space-y-4",
        footer: "mt-4 sm:mt-5",
      },
      md: {
        container: "w-[calc(100vw-24px)] max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto p-5 sm:p-6",
        header: "mb-4 sm:mb-6",
        title: "text-lg sm:text-xl",
        content: "space-y-4 sm:space-y-5",
        footer: "mt-5 sm:mt-6",
      },
      lg: {
        container: "w-[calc(100vw-24px)] max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8",
        header: "mb-5 sm:mb-7",
        title: "text-xl sm:text-2xl",
        content: "space-y-5 sm:space-y-6",
        footer: "mt-6 sm:mt-8",
      },
    },
  },
  defaultVariants: {
    size: "sm",
  },
});
