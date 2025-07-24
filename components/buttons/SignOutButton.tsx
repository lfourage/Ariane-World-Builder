import { button } from "@tv/button";

interface SignOutButtonProps {
    handleClick: () => void;
}

export const SignOutButton = ({ handleClick }: SignOutButtonProps ) => {

    return <button className={button({ intent: "nature", size: "md" })}
    onClick={handleClick}>
        Sign out
    </button>
}