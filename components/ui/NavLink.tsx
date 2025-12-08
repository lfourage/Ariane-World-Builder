"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { button } from "@lib/tv/button";
import { navlink } from "@lib/tv/navlink";
import LoginModal from "@components/auth/LoginModal";
import RegisterModal from "@components/auth/RegisterModal";

interface NavLinkProps {
  type?: "Register" | "Login";
  href?: string;
  label?: string;
  onClick?: () => void;
}

export const NavLink = ({ type, href, label, onClick }: NavLinkProps) => {
  const pathname = usePathname();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  if (type) {
    if (pathname === "/login" || pathname === "/register") return null;
    
    const isLogin = type === "Login";
    
    return (
      <>
        <button
          onClick={() => isLogin ? setShowLoginModal(true) : setShowRegisterModal(true)}
          className={button({
            intent: isLogin ? "ghost" : "nature",
            size: "md",
          })}
        >
          {type}
        </button>

        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSwitchToRegister={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />

        <RegisterModal 
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          onSwitchToLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      </>
    );
  }

  if (href && label) {
    const isActive = pathname === href;
    
    return (
      <Link
        href={href}
        onClick={onClick}
        className={navlink({
          variant: isActive ? "active" : "default",
          underline: isActive,
        })}
      >
        {label}
      </Link>
    );
  }

  return null;
};
