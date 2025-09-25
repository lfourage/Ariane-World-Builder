import Link from "next/link";
import { button } from "@tv/button";

interface NavLinkProps {
  type: "Register" | "Login";
}

export const NavLink = ({ type }: NavLinkProps) => {
  let path: string = "";

  switch (type) {
    case "Register":
      path = "/register";
      break;
    case "Login":
      path = "/login";
      break;
    default:
  }

  return (
    <Link className={button({ intent: "nature", size: "md" })} href={path}>
      {type}
    </Link>
  );
};
