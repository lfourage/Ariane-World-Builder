"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ZodError } from "zod";
import { loginSchema, registerSchema } from "@schemas/userSchema";
import { modal, formField, button, icon } from "@styles";
import { mapErrorToField, mapZodErrors } from "@utils/errorMapper";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

type Mode = "login" | "register";

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const router = useRouter();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>({});

  const [isLoading, setIsLoading] = useState(false);

  const modalStyles = modal({ size: "sm" });
  const fieldStyles = formField({ size: "sm" });
  const iconStyles = icon({ size: "sm" });

  const [modalPos, setModalPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setModalPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  }, []);

  // Reset mode when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (mode === "login") {
      setLoginData((prev) => ({ ...prev, [name]: value }));
      if (loginErrors[name]) {
        const newErrs = { ...loginErrors };
        delete newErrs[name];
        setLoginErrors(newErrs);
      }
    } else {
      setRegisterData((prev) => ({ ...prev, [name]: value }));
      if (registerErrors[name]) {
        const newErrs = { ...registerErrors };
        delete newErrs[name];
        setRegisterErrors(newErrs);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "login") {
        // Login
        const parsed = loginSchema.parse(loginData);
        setLoginErrors({});

        const result = await signIn("credentials", {
          email: parsed.email,
          password: parsed.password,
          redirect: false,
        });

        if (result?.error) {
          const mappedError = mapErrorToField(result.error);
          setLoginErrors({ [mappedError.field]: mappedError.message });
        } else {
          onClose();
          router.push("/worlds");
          router.refresh();
        }
      } else {
        // Register
        const parsed = registerSchema.parse(registerData);
        setRegisterErrors({});

        const res = await fetch("/api/auth/user/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed),
        });

        if (!res.ok) {
          const errBody = await res.json();

          // Handle specific API errors
          if (errBody?.error) {
            const { message, code } = errBody.error;
            const mappedError = mapErrorToField(message, code);
            setRegisterErrors({ [mappedError.field]: mappedError.message });
          } else {
            setRegisterErrors({ general: "An error occurred" });
          }
          return;
        }

        // Auto-login after successful registration
        const loginResult = await signIn("credentials", {
          email: parsed.email,
          password: parsed.password,
          redirect: false,
        });

        if (loginResult?.error) {
          const mappedError = mapErrorToField(loginResult.error);
          setRegisterErrors({ [mappedError.field]: mappedError.message });
        } else {
          onClose();
          router.push("/worlds");
          router.refresh();
        }
      }
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        const mappedErrors = mapZodErrors(err.issues);
        if (mode === "login") {
          setLoginErrors(mappedErrors);
        } else {
          setRegisterErrors(mappedErrors);
        }
      } else {
        const msg = "An unexpected error occurred";
        if (mode === "login") {
          setLoginErrors({ general: msg });
        } else {
          setRegisterErrors({ general: msg });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset errors when mode changes
  useEffect(() => {
    setLoginErrors({});
    setRegisterErrors({});
  }, [mode]);

  if (!isOpen) return null;

  const data = mode === "login" ? loginData : registerData;
  const errors = mode === "login" ? loginErrors : registerErrors;
  const registerFormData = mode === "register" ? registerData : null;

  return (
    <>
      <div className={modalStyles.overlay()} onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className={modalStyles.container()}
        style={{
          position: "fixed",
          left: `${modalPos.x}px`,
          top: `${modalPos.y}px`,
          transform: "translate(-50%, -50%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={modalStyles.header()}>
          <h2 className={modalStyles.title()}>{mode === "login" ? "Sign In" : "Create Account"}</h2>
          <button type="button" onClick={onClose} className={modalStyles.closeButton()}>
            <svg className={iconStyles} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className={modalStyles.content()}>
          {errors.general && (
            <div className="p-3 bg-red-500/10 border border-red-500 rounded-md text-red-500 text-sm">
              {errors.general}
            </div>
          )}

          {mode === "register" && (
            <div className={fieldStyles.wrapper()}>
              <label htmlFor="name" className={fieldStyles.label()}>
                Name
              </label>
              <input
                type="text"
                name="name"
                value={registerFormData?.name}
                onChange={handleChange}
                className={fieldStyles.input()}
                placeholder="John Doe"
              />
              {errors.name && <p className={fieldStyles.error()}>{errors.name}</p>}
            </div>
          )}

          <div className={fieldStyles.wrapper()}>
            <label htmlFor="email" className={fieldStyles.label()}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              className={fieldStyles.input()}
              placeholder="you@example.com"
            />
            {errors.email && <p className={fieldStyles.error()}>{errors.email}</p>}
          </div>

          <div className={fieldStyles.wrapper()}>
            <label htmlFor="password" className={fieldStyles.label()}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              className={fieldStyles.input()}
              placeholder="••••••••"
            />
            {errors.password && <p className={fieldStyles.error()}>{errors.password}</p>}
          </div>

          {mode === "register" && (
            <div className={fieldStyles.wrapper()}>
              <label htmlFor="confirmPassword" className={fieldStyles.label()}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={registerFormData?.confirmPassword}
                onChange={handleChange}
                className={fieldStyles.input()}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className={fieldStyles.error()}>{errors.confirmPassword}</p>
              )}
            </div>
          )}
        </div>

        <div className={modalStyles.footer()}>
          <button
            type="submit"
            disabled={
              isLoading ||
              (mode === "login"
                ? !data.email || !data.password
                : !data.email ||
                  !data.password ||
                  !registerFormData?.name ||
                  !registerFormData?.confirmPassword)
            }
            className={button({
              intent: "nature",
              size: "md",
              fullWidth: true,
            })}
          >
            {isLoading
              ? mode === "login"
                ? "Signing in..."
                : "Creating account..."
              : mode === "login"
                ? "Sign In"
                : "Create Account"}
          </button>
        </div>

        <div className="text-center mt-4 text-sm text-gray-400">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                className="text-green-500 hover:text-green-400 font-medium"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-green-500 hover:text-green-400 font-medium"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </form>
    </>
  );
}
