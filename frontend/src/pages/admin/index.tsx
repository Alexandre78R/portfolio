import { useEffect } from "react"
import { useRouter } from "next/router"
import LoadingCustom from "@/components/Loading/LoadingCustom"
import { useUser } from "@/context/UserContext/UserContext";

const AdminIndexPage = (): React.ReactElement => {
  const { user, loading } = useUser();
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/admin/dashboard")
      } else {
        router.replace("/admin/auth/login")
      }
    }
  }, [user, loading, router])

  return (
    <div className="flex items-center justify-center h-screen">
      <LoadingCustom />
    </div>
  )
}

export default AdminIndexPage;