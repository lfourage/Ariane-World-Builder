"use client";

import { useState } from "react";
import { SignupForm } from "@/app/ui/forms/SignupForm";
import { LoginForm } from "@/app/ui/forms/LoginForm";
import { SignupButton } from "@/app/ui/buttons/SignupButton";
import { LoginButton } from "@/app/ui/buttons/LoginButton";

export default function Home() {
  const [ signupFormToggle , setSignupFormToggle] = useState(false);
  const [ loginFormToggle , setLoginFormToggle] = useState(false);

  const toggleLoginForm = () => {
    setLoginFormToggle((prev) => !prev);
  }

  const toggleSignupForm = () => {
    setSignupFormToggle((prev) => !prev);
  }

  return (
    <>
      {signupFormToggle && <SignupForm handleClick={toggleSignupForm}/>}
      {loginFormToggle && <LoginForm handleClick={toggleLoginForm}/>}
      <SignupButton handleClick={toggleSignupForm} />
      <LoginButton handleClick={toggleLoginForm} />
    </>
  );
}
