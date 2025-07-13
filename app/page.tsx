"use client";

import { useState } from "react";
import { LoginForm } from "@/app/ui/forms/LoginForm";
import { LoginButton } from "@/app/ui/buttons/LoginButton";

export default function Home() {
  const [loginFormToggle, setLoginFormToggle] = useState(false);

  const handleClick = () => {
    setLoginFormToggle((prev) => !prev);
  }

  return (
    <>
      {loginFormToggle && <LoginForm handleClick={handleClick}/>}
      <LoginButton handleClick={handleClick} />
    </>
  );
}
