"use client";

//import { useSession } from "next-auth/react";
import { RegisterButton } from "@components/buttons/RegisterButton";
import { LoginButton } from "@components/buttons/LoginButton";
import { header } from "@tv/header";

interface UserInterfaceLayoutProps {
    toggleRegisterForm: () => void,
    toggleLoginForm: () => void,
}

export const UserInterfaceLayout = ({
    toggleRegisterForm,
    toggleLoginForm
}: UserInterfaceLayoutProps) => {
  return (
    <header className={header()}>
      <RegisterButton handleClick={toggleRegisterForm} />
      <LoginButton handleClick={toggleLoginForm} />
    </header>
  );
};
