import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AdminPortal from "./AdminPortal";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  if (!role || !["ADMIN", "EDITOR"].includes(role)) {
    redirect("/auth/signin");
  }

  return <AdminPortal userRole={role} />;
}

