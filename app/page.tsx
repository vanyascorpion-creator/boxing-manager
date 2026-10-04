import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Dashboard } from "@/components/dashboard";

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <Dashboard />;
}
