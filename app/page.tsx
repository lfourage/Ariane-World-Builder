"use client";

import { useState } from "react";
import { UserInterfaceLayout } from "@components/UserInterfaceLayout";
import { RegisterForm } from "@components/forms/RegisterForm";
import { LoginForm } from "@components/forms/LoginForm";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const [ registerFormToggle , setRegisterFormToggle] = useState(false);
  const [ loginFormToggle , setLoginFormToggle] = useState(false);
  const { data: session, status/*, update */} = useSession();

  const toggleLoginForm = () => {
    setLoginFormToggle((prev) => !prev);
  }

  const toggleRegisterForm = () => {
    setRegisterFormToggle((prev) => !prev);
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      {registerFormToggle && <RegisterForm handleClick={toggleRegisterForm} />}
      {loginFormToggle && <LoginForm handleClick={toggleLoginForm} />}
      <UserInterfaceLayout
        session={session}
        status={status}
        toggleRegisterForm={toggleRegisterForm}
        toggleLoginForm={toggleLoginForm}
        handleSignOut={handleSignOut}
      />
    </>
  );
}
