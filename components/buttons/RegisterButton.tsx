import { button } from "@tv/button";

interface registerButtonProps {
    handleClick: () => void;
}

export const RegisterButton = ({ handleClick }: registerButtonProps ) => {

    return <button className={button({ intent: "nature", size: "md" })}
    onClick={handleClick}>
        Register
    </button>
}