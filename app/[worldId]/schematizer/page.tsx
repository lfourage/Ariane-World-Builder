import { getServerSession } from "next-auth";
import { authConfig } from "@lib/auth/config";
import { redirect } from "next/navigation";
import SchematizerPage from "@features/schematizer/SchematizerPage";

export default async function Schematizer({ params }: { params: { worldId: string } }) {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    redirect("/");
  }

  return <SchematizerPage worldId={params.worldId} />;
}
