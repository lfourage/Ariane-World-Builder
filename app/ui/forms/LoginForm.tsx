import { button } from "@/app/lib/ui/button";
import { input } from "@/app/lib/ui/input";

interface loginFormProps {
  handleClick: () => void;
}

export const LoginForm = ({ handleClick }: loginFormProps) => {
  return (
    <div
      className="fixed h-full w-full flex items-center justify-center backdrop-blur-sm bg-white/10 p-6"
      onClick={handleClick}
    >
      <form
        className="flex flex-col items-center space-y-4 bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-auto"
        onClick={(e) => e.stopPropagation()}
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
            className={input()}
            placeholder="you@example.com"
          />
        </div>

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
            className={input()}
            placeholder="••••••••"
          />
        </div>

        <button
          className={button({ intent: "nature", size: "md" })}
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
