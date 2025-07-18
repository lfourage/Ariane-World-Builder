"use client";

import { useState } from "react";
import { RegisterForm } from "@/app/ui/forms/RegisterForm";
import { LoginForm } from "@/app/ui/forms/LoginForm";
import { RegisterButton } from "@/app/ui/buttons/RegisterButton";
import { LoginButton } from "@/app/ui/buttons/LoginButton";

export default function Home() {
  const [ registerFormToggle , setRegisterFormToggle] = useState(false);
  const [ loginFormToggle , setLoginFormToggle] = useState(false);

  const toggleLoginForm = () => {
    setLoginFormToggle((prev) => !prev);
  }

  const toggleSignupForm = () => {
    setRegisterFormToggle((prev) => !prev);
  }

  return (
    <>
      {registerFormToggle && <RegisterForm handleClick={toggleSignupForm}/>}
      {loginFormToggle && <LoginForm handleClick={toggleLoginForm}/>}
      <RegisterButton handleClick={toggleSignupForm} />
      <LoginButton handleClick={toggleLoginForm} />
    </>
  );
}
