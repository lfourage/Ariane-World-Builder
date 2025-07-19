import { button } from "@tv/button";

interface loginButtonProps {
    handleClick: () => void;
}

export const LoginButton = ({ handleClick }: loginButtonProps ) => {

    return <button className={button({ intent: "nature", size: "md" })}
    onClick={handleClick}>
        Log In
    </button>
}