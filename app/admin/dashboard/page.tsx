import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import AdminDashboard from "@/components/admin/dashboard"

export default async function AdminDashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/admin")
  }

  return <AdminDashboard />
}
