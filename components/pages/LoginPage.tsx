"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ZodError } from "zod";
import { loginSchema } from "@schemas/userSchema";
import { parseZodErrors } from "@utils/parseZodErrors";
import { parseSigninErrors } from "@utils/parseSigninErrors";
import { button } from "@tv/button";
import { input } from "@tv/input";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const parsed = loginSchema.parse(formData);
      setErrors({});

      const result = await signIn("credentials", {
        email: parsed.email,
        password: parsed.password,
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setErrors(parseSigninErrors(result.error));
        return;
      } else { 
        router.push(callbackUrl);
      }
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        setErrors(parseZodErrors(error));
      } else setErrors({ general: "Unknow error" });
    }
  };

  return (
    <div className="fixed h-full w-full flex items-center justify-center backdrop-blur-sm bg-white/10 p-6">
      <form
        className="flex flex-col items-center space-y-4 bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-auto"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div>
          <label
            htmlFor="email"
            className="block text-sm text-emerald-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={handleChange}
            className={input()}
            placeholder="you@example.com"
          />
        </div>
        {errors.email && <p className="text-red-500">{errors.email}</p>}

        <div>
          <label
            htmlFor="password"
            className="block text-sm text-emerald-700 mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
            className={input()}
            placeholder="••••••••"
          />
        </div>
        {errors.password && <p className="text-red-500">{errors.password}</p>}

        <button
          className={button({ intent: "nature", size: "md" })}
          type="submit"
        >
          Submit
        </button>
        {errors.form && <p className="text-red-500">{errors.form}</p>}
      </form>
    </div>
  );
}
