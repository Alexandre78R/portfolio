import { useEffect } from "react";
import { useRouter, NextRouter } from "next/router";
import { useUser, UserContextType } from "@/context/UserContext/UserContext";

/**
 * Hook pour protéger les pages admin qui nécessitent un changement de mot de passe
 * Redirige automatiquement vers la page de changement de mot de passe si nécessaire
 */
export const useRequirePasswordChange = (): void => {
  const router: NextRouter = useRouter();
  const { user, loading }: UserContextType = useUser();

  useEffect((): void => {
    if (!loading) {
      if (!user) {
        // L'utilisateur n'est pas connecté, rediriger vers login
        router.replace("/admin/auth/login");
      } else if (user.isPasswordChange === false) {
        // L'utilisateur doit changer son mot de passe
        router.replace("/admin/auth/change-password");
      }
    }
  }, [user, loading, router]);
};
