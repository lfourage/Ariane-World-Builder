"use client";

import { useState } from "react";
import { RegisterForm } from "@components/forms/RegisterForm";
import { LoginForm } from "@components/forms/LoginForm";
import { RegisterButton } from "@components/buttons/RegisterButton";
import { LoginButton } from "@components/buttons/LoginButton";

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
