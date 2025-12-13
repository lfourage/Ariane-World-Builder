import { Navbar } from "@ui/NavBar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar></Navbar>
      {children}
    </>
  );
}
