import { tv } from "tailwind-variants";

export const flowNode = tv({
  slots: {
    container: "shadow-lg rounded-lg border-2 relative",
    header: "font-bold",
    description: "text-sm line-clamp-2",
    actions: "absolute top-2 right-2 flex gap-1 transition-opacity z-10",
    actionButton: "p-1 rounded shadow-sm",
  },
  variants: {
    variant: {
      default: {
        container: "bg-gray-200 border-green-500",
        header: "text-gray-900",
        description: "text-gray-600",
        actionButton: "bg-gray-300",
      },
      primary: {
        container: "bg-blue-100 border-blue-500",
        header: "text-blue-900",
        description: "text-blue-700",
        actionButton: "bg-blue-200",
      },
      success: {
        container: "bg-green-100 border-green-500",
        header: "text-green-900",
        description: "text-green-700",
        actionButton: "bg-green-200",
      },
      warning: {
        container: "bg-yellow-100 border-yellow-500",
        header: "text-yellow-900",
        description: "text-yellow-700",
        actionButton: "bg-yellow-200",
      },
      danger: {
        container: "bg-red-100 border-red-500",
        header: "text-red-900",
        description: "text-red-700",
        actionButton: "bg-red-200",
      },
    },
    size: {
      sm: {
        container: "px-3 py-2 min-w-[150px] max-w-[250px]",
      },
      md: {
        container: "px-4 py-3 min-w-[200px] max-w-[300px]",
      },
      lg: {
        container: "px-5 py-4 min-w-[250px] max-w-[400px]",
      },
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});
