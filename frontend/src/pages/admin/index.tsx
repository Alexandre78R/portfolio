import React, { useEffect, type ReactElement } from "react";
import { useRouter, type NextRouter } from "next/router";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import { useUser, type UserContextType } from "@/context/UserContext/UserContext";

const AdminIndexPage = (): ReactElement => {

  const { user, loading }: UserContextType = useUser();

  const router: NextRouter = useRouter();

  useEffect((): void => {
    if (!loading) {
      if (user) {
        if (user.isPasswordChange === false) {
          router.replace("/admin/auth/change-password");
        } else {
          router.replace("/admin/dashboard");
        }
      } else {
        router.replace("/admin/auth/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center h-screen" data-testid="admin-index-page">
      <LoadingCustom />
    </div>
  );
};

AdminIndexPage.displayName = "AdminIndexPage";

export default AdminIndexPage;