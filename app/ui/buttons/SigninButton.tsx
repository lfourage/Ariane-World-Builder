import { button } from "@/app/lib/ui/button";

interface signinButtonProps {
    handleClick: () => void;
}

export const SigninButton = ({ handleClick }: signinButtonProps ) => {

    return <button className={button({ intent: "nature", size: "md" })}
    onClick={handleClick}>
        Sign In
    </button>
}