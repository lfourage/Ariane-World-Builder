"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { button } from "@tv/button";

interface NavLinkProps {
  type: "Register" | "Login";
}

export const NavLink = ({ type }: NavLinkProps) => {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register")
    return ;

  const targetUrl = `${type.toLowerCase()}?callbackUrl=${pathname}`;

  return (
    <Link className={button({ intent: "nature", size: "md" })} href={targetUrl}>
      {type}
    </Link>
  );
};
