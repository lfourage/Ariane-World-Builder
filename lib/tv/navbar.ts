import { tv } from "tailwind-variants";

export const navbar = tv({
  slots: {
    container: "fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-dark-400",
    inner: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    content: "flex items-center justify-between h-16",
    logo: "flex items-center gap-2",
    logoText: "text-xl sm:text-2xl font-bold text-white",
    logoIcon: "w-8 h-8 text-green-500",
    nav: "hidden md:flex items-center gap-4",
    actions: "flex items-center gap-2 sm:gap-3",
    user: "hidden sm:flex items-center gap-3",
    userName: "text-sm text-gray-300",
    userAvatar: "w-8 h-8 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center text-green-500 font-semibold",
    mobileMenuButton: "md:hidden p-2 text-gray-400 hover:text-white transition-colors",
    mobileMenu: "md:hidden border-t border-dark-400 bg-black/98",
    mobileMenuContent: "px-4 py-4 space-y-3",
  },
  variants: {
    transparent: {
      true: {
        container: "bg-transparent border-transparent backdrop-blur-none",
      },
    },
  },
});
