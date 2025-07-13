import { button } from "@/app/lib/ui/button";

interface loginButtonProps {
    handleClick: () => void;
}

export const LoginButton = ({ handleClick }: loginButtonProps ) => {

    return <button className={button({ intent: "nature", size: "md" })}
    onClick={handleClick}>
        Log In
    </button>
}