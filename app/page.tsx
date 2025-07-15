"use client";

import { useState } from "react";
import { SigninForm } from "@/app/ui/forms/SigninForm";
import { LoginForm } from "@/app/ui/forms/LoginForm";
import { SigninButton } from "@/app/ui/buttons/SigninButton";
import { LoginButton } from "@/app/ui/buttons/LoginButton";

export default function Home() {
  const [ signinFormToggle , setSigninFormToggle] = useState(false);
  const [ loginFormToggle , setLoginFormToggle] = useState(false);

  const toggleLoginForm = () => {
    setLoginFormToggle((prev) => !prev);
  }

  const toggleSigninForm = () => {
    setSigninFormToggle((prev) => !prev);
  }

  return (
    <>
      {signinFormToggle && <SigninForm handleClick={toggleSigninForm}/>}
      {loginFormToggle && <LoginForm handleClick={toggleLoginForm}/>}
      <SigninButton handleClick={toggleSigninForm} />
      <LoginButton handleClick={toggleLoginForm} />
    </>
  );
}
