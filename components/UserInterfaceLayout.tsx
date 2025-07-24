"use client";

import { Session } from "next-auth";
import { RegisterButton } from "@components/buttons/RegisterButton";
import { LoginButton } from "@components/buttons/LoginButton";
import { header } from "@tv/header";
import { SignOutButton } from "./buttons/SignOutButton";

interface UserInterfaceLayoutProps {
  session: Session | null;
  status: "authenticated" | "loading" | "unauthenticated";
  toggleRegisterForm: () => void;
  toggleLoginForm: () => void;
  handleSignOut: () => void;
}

export const UserInterfaceLayout = ({
  session,
  status,
  toggleRegisterForm,
  toggleLoginForm,
  handleSignOut,
}: UserInterfaceLayoutProps) => {
  return (
    <header className={header()}>
      {(status === "loading" || status === "unauthenticated") && (
        <>
          <RegisterButton handleClick={toggleRegisterForm} />
          <LoginButton handleClick={toggleLoginForm} />
        </>
      )}
      {status === "authenticated" && <><p>Welcome: {session?.user?.name}</p>
      <SignOutButton handleClick={handleSignOut}/>
      </>}
    </header>
  );
};
