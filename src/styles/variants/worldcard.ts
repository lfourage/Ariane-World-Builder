import { tv } from "tailwind-variants";

export const worldcard = tv({
  slots: {
    grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
    card: "bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-all border border-gray-700 flex flex-col gap-4",
    header: "flex justify-between items-start",
    title: "text-xl font-semibold text-white truncate flex-1",
    badge: "px-2 py-1 rounded text-sm bg-purple-600/20 text-purple-400",
    meta: "text-sm text-gray-400",
    actions: "flex gap-2",
  },
});

export const worldsEmpty = tv({
  slots: {
    container: "text-center py-16 max-w-md mx-auto",
    icon: "text-6xl mb-4",
    title: "text-2xl font-semibold text-white mb-2",
    description: "text-gray-400 mb-6",
  },
});

export const worldModal = tv({
  slots: {
    overlay: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",
    content: "bg-gray-800 rounded-lg p-6 max-w-md w-full space-y-4 border border-gray-700",
    title: "text-xl font-semibold text-white",
    actions: "flex gap-2 justify-end",
  },
});
