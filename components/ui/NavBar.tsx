import { useSession, signOut } from "next-auth/react";
import { Button } from "@components/ui/Button";
import { NavLink } from "@components/ui/NavLink";
import { navbar } from "@tv/navbar";

export const Navbar = () => {
  const { data: session, status /*, update */ } = useSession();

  return (
    <nav className={navbar()}>
      {(status === "loading" || status === "unauthenticated") && (
        <>
          <NavLink type="Register" />
          <NavLink type="Login" />
        </>
      )}
      {status === "authenticated" && (
        <>
          <p>Welcome: {session?.user?.name}</p>
          <Button handleClick={async () => await signOut()} type="Sign out" />
        </>
      )}
    </nav>
  );
};
