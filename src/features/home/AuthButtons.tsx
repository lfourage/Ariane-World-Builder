import { useRouter } from "next/navigation";
import { button } from "@styles";

interface AuthButtonsProps {
  isAuthenticated: boolean;
  lastWorld: { id: string; name: string } | null;
  onOpenAuthModal: (mode: "login" | "register") => void;
}

export function AuthButtons({ isAuthenticated, lastWorld, onOpenAuthModal }: AuthButtonsProps) {
  const router = useRouter();

  const handleOpenLastWorld = () => {
    if (lastWorld) {
      router.push(`/${lastWorld.id}/schematizer`);
    } else {
      router.push("/worlds");
    }
  };

  if (isAuthenticated) {
    return (
      <div className="space-y-4">
        <button onClick={handleOpenLastWorld} className={button({ intent: "nature", size: "lg" })}>
          {lastWorld ? `Continue: ${lastWorld.name}` : "Create Your First World"}
        </button>
        <p className="text-gray-500 text-sm">
          or{" "}
          <button
            onClick={() => router.push("/worlds")}
            className="text-green-500 hover:text-green-400 underline"
          >
            view all your worlds
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => onOpenAuthModal("register")}
          className={button({ intent: "nature", size: "lg" })}
        >
          Get Started
        </button>
        <button
          onClick={() => onOpenAuthModal("login")}
          className={button({ intent: "ghost", size: "lg" })}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
