"use client";

import { hero } from "@styles";
import AuthModal from "@components/auth/AuthModal";
import { HeroSection, AuthButtons } from "@features/home";
import { useAuth, useLastWorld } from "@hooks";

export default function HomePage() {
  const auth = useAuth();
  const { lastWorld, isLoading } = useLastWorld(auth.status);

  const styles = hero();

  if (auth.status === "loading" || isLoading) {
    return (
      <div className={styles.container()}>
        <div className="text-gray-400 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.container()}>
      <div className={styles.content()}>
        <HeroSection />

        <div className="space-y-4">
          <AuthButtons
            isAuthenticated={auth.status === "authenticated"}
            lastWorld={lastWorld}
            onOpenAuthModal={auth.openAuthModal}
          />
        </div>
      </div>

      {auth.showAuthModal && (
        <AuthModal
          isOpen={auth.showAuthModal}
          onClose={auth.closeAuthModal}
          initialMode={auth.authMode}
        />
      )}
    </div>
  );
}
