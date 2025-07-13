import { popupWrapper, formDefault, buttonDefault } from "@/app/lib/utils/tailwind-classnames";

interface loginFormProps {
    handleClick: () => void;
}

export const LoginForm = ({ handleClick }: loginFormProps ) => {
  return (
    <div className={popupWrapper} onClick={handleClick}>
      <form className={formDefault} onClick={(e) => e.stopPropagation()}>
        <button className={buttonDefault} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};
