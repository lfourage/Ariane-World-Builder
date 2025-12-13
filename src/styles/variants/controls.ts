import { tv } from "tailwind-variants";

export const controls = tv({
  slots: {
    container: "flex flex-col gap-1 bg-black rounded-lg border border-gray-700 shadow-xl p-1",
    button: `
      w-8 h-8 
      flex items-center justify-center 
      bg-transparent
      hover:bg-gray-800
      text-gray-300
      hover:text-white
      rounded
      transition-colors
      border-none
      cursor-pointer
      disabled:opacity-50
      disabled:cursor-not-allowed
    `,
  },
});
