import { useState } from "react";
import { useSession } from "next-auth/react";

/**
 * Authentication hook for managing user session and auth modal state
 *
 * @returns {Object} Authentication state and controls
 * @returns {Session | null} session - Current user session
 * @returns {string} status - Session loading status ("loading" | "authenticated" | "unauthenticated")
 * @returns {boolean} showAuthModal - Whether auth modal is visible
 * @returns {"login" | "register"} authMode - Current auth modal mode
 * @returns {Function} openAuthModal - Opens auth modal in specified mode
 * @returns {Function} closeAuthModal - Closes auth modal
 *
 * @example
 * const { session, openAuthModal, closeAuthModal } = useAuth();
 *
 * if (!session) {
 *   openAuthModal("login");
 * }
 */
export function useAuth() {
  const { data: session, status } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const openAuthModal = (mode: "login" | "register") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  return {
    session,
    status,
    showAuthModal,
    authMode,
    openAuthModal,
    closeAuthModal,
  };
}
