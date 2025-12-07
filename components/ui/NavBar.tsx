"use client";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { navbar } from "@lib/tv/navbar";
import { button } from "@lib/tv/button";
import { NavLink } from "./NavLink";

export const Navbar = () => {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const styles = navbar();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className={styles.container()}>
      <div className={styles.inner()}>
        <div className={styles.content()}>
          <Link href="/" className={styles.logo()}>
            <svg
              className={styles.logoIcon()}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className={styles.logoText()}>Ariane World Builder</span>
          </Link>

          {status === "authenticated" && (
            <nav className={styles.nav()}>
              <NavLink href="/dashboard" label="Dashboard" />
              <NavLink href="/projects" label="Projects" />
              <NavLink href="/settings" label="Settings" />
            </nav>
          )}

          <div className={styles.actions()}>
            {status === "loading" && (
              <div className="w-20 h-8 bg-dark-400 animate-pulse rounded-md" />
            )}

            {status === "unauthenticated" && (
              <>
                <NavLink type="Register" />
                <NavLink type="Login" />
              </>
            )}

            {status === "authenticated" && (
              <div className={styles.user()}>
                <span className={styles.userName()}>
                  {session?.user?.name}
                </span>
                <div className={styles.userAvatar()}>
                  {getInitials(session?.user?.name || "U")}
                </div>
                <button
                  onClick={() => signOut()}
                  className={button({ intent: "ghost", size: "sm" })}
                >
                  Sign out
                </button>
              </div>
            )}

            {status === "authenticated" && (
              <button
                className={styles.mobileMenuButton()}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            )}
          </div>
        </div>

        {mobileMenuOpen && status === "authenticated" && (
          <div className={styles.mobileMenu()}>
            <div className={styles.mobileMenuContent()}>
              <NavLink
                href="/dashboard"
                label="Dashboard"
                onClick={() => setMobileMenuOpen(false)}
              />
              <NavLink
                href="/projects"
                label="Projects"
                onClick={() => setMobileMenuOpen(false)}
              />
              <NavLink
                href="/settings"
                label="Settings"
                onClick={() => setMobileMenuOpen(false)}
              />
              <div className="pt-3 border-t border-dark-400">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                  className={button({
                    intent: "danger",
                    size: "sm",
                    fullWidth: true,
                  })}
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
