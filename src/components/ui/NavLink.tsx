"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { button, navlink } from "@styles";
import AuthModal from "@components/auth/AuthModal";

interface NavLinkProps {
  type?: "Register" | "Login";
  href?: string;
  label?: string;
  onClick?: () => void;
}

export function NavLink({ type, href, label, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);

  if (type) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className={button({
            intent: type === "Login" ? "ghost" : "nature",
            size: "md",
          })}
        >
          {type}
        </button>
        <AuthModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          initialMode={type === "Login" ? "login" : "register"}
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
}
