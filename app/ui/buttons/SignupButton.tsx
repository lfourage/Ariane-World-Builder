import { button } from "@/app/lib/ui/button";

interface signupButtonProps {
    handleClick: () => void;
}

export const SignupButton = ({ handleClick }: signupButtonProps ) => {

    return <button className={button({ intent: "nature", size: "md" })}
    onClick={handleClick}>
        Sign Up
    </button>
}