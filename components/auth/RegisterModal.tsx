"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ZodError } from "zod";
import { registerSchema } from "@schemas/userSchema";
import { parseZodErrors } from "@utils/parseZodErrors";
import { parseSigninErrors } from "@utils/parseSigninErrors";
import { modal } from "@lib/tv/modal";
import { formField } from "@lib/tv/form";
import { button } from "@lib/tv/button";
import { icon } from "@lib/tv/icon";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const modalStyles = modal({ size: "sm" });
  const fieldStyles = formField({ size: "sm" });
  const iconStyles = icon({ size: "sm" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errors[e.target.name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[e.target.name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const parsed = registerSchema.parse(formData);
      setErrors({});

      const res = await fetch("/api/auth/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      if (!res.ok) {
        setErrors(parseSigninErrors("UserAlreadyExistsError"));
        setIsLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email: parsed.email,
        password: parsed.password,
        redirect: false,
      });

      if (result?.error) {
        setErrors(parseSigninErrors(result.error));
      } else {
        onClose();
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        setErrors(parseZodErrors(error));
      } else {
        setErrors({ general: "Unknown error occurred" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={modalStyles.overlay()} onClick={onClose} />
      
      <form
        onSubmit={handleSubmit}
        className={modalStyles.container()}
        style={{
          position: "fixed",
          left: `${window.innerWidth / 2}px`,
          top: `${window.innerHeight / 2}px`,
          transform: "translate(-50%, -50%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={modalStyles.header()}>
          <h2 className={modalStyles.title()}>Create Account</h2>
          <button
            type="button"
            onClick={onClose}
            className={modalStyles.closeButton()}
          >
            <svg className={iconStyles} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={modalStyles.content()}>
          {errors.general && (
            <div className="p-3 bg-red-500/10 border border-red-500 rounded-md text-red-500 text-sm">
              {errors.general}
            </div>
          )}

          <div className={fieldStyles.wrapper()}>
            <label htmlFor="name" className={fieldStyles.label()}>
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={fieldStyles.input()}
              placeholder="John Doe"
              autoFocus
            />
            {errors.name && (
              <p className={fieldStyles.error()}>{errors.name}</p>
            )}
          </div>

          <div className={fieldStyles.wrapper()}>
            <label htmlFor="email" className={fieldStyles.label()}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={fieldStyles.input()}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className={fieldStyles.error()}>{errors.email}</p>
            )}
          </div>

          <div className={fieldStyles.wrapper()}>
            <label htmlFor="password" className={fieldStyles.label()}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={fieldStyles.input()}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className={fieldStyles.error()}>{errors.password}</p>
            )}
          </div>

          <div className={fieldStyles.wrapper()}>
            <label htmlFor="confirmPassword" className={fieldStyles.label()}>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={fieldStyles.input()}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className={fieldStyles.error()}>{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        <div className={modalStyles.footer()}>
          <button
            type="submit"
            disabled={isLoading || !formData.email || !formData.password}
            className={button({ intent: "nature", size: "md", fullWidth: true })}
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </div>

        {onSwitchToLogin && (
          <div className="text-center mt-4 text-sm text-gray-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-green-500 hover:text-green-400 font-medium"
            >
              Sign in
            </button>
          </div>
        )}
      </form>
    </>
  );
}
