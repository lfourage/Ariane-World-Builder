import { tv } from "tailwind-variants";

export const page = tv({
  slots: {
    container: "min-h-screen bg-gray-900",
    content: "max-w-6xl mx-auto p-4 sm:p-8 pt-20 sm:pt-24",
    header: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8",
    headerText: "space-y-2",
    title: "text-3xl sm:text-4xl font-bold text-white",
    subtitle: "text-gray-400",
    actions: "flex gap-2",
  },
});

export const hero = tv({
  slots: {
    container:
      "min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4",
    content: "max-w-4xl w-full text-center space-y-8",
    logo: "flex justify-center",
    title: "text-4xl sm:text-5xl font-bold text-white mb-4",
    subtitle: "text-xl text-gray-300 mb-8",
    features: "grid grid-cols-1 md:grid-cols-3 gap-6 mt-12",
    feature: "bg-gray-800/50 p-6 rounded-lg",
    featureIcon: "text-4xl mb-4",
    featureTitle: "text-lg font-semibold text-white mb-2",
    featureDescription: "text-gray-400",
  },
});
