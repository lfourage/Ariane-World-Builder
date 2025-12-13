import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@lib/auth/config";
import WorldsPage from "@features/worlds/WorldsPage";

export default async function Worlds() {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    redirect("/");
  }

  return <WorldsPage />;
}
