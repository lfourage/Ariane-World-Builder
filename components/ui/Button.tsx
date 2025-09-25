import { button } from "@tv/button";

interface ButtonProps {
  handleClick: () => void;
  type: "Sign out";
}

export const Button = ({ handleClick, type }: ButtonProps) => {
  return (
    <button
      className={button({ intent: "nature", size: "md" })}
      onClick={handleClick}
    >
      {type}
    </button>
  );
};
