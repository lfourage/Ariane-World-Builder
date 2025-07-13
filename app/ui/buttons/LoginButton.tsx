import { buttonDefault } from "@/app/lib/utils/tailwind-classnames";

interface loginButtonProps {
    handleClick: () => void;
}

export const LoginButton = ({ handleClick }: loginButtonProps ) => {

    return <button className={buttonDefault}
    onClick={handleClick}>
        Log In
    </button>
}