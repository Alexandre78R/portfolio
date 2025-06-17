import { useUser } from "@/context/UserContext/UserContext";
import { useEffect } from "react";
import { useRouter } from "next/router";

const AdminDashboard = () => {
  const { user, loading, error } = useUser();
  const router = useRouter();

  useEffect(() => {
    console.log("user avant if", user);
    if (!loading) {
      if (!user) {
        console.log("user !user", user);
        // router.push("/admin/auth/login");
      } else if (user.role !== "admin") {
        console.log("user !== role", user);
        // router.push("/400");
      }
    }
  }, [user, loading, router]);

//   if (loading) {
//     return <p className="text-center mt-10">Chargement...</p>;
//   }

//   if (error) {
//     return <p className="text-center mt-10 text-red-500">Erreur : {error.message}</p>;
//   }

//   if (!user || user.role !== "admin") {
//     return null;
//   }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Tableau de bord Admin</h1>
      <p className="text-primary">Bienvenue, {user?.firstname} {user?.lastname} !</p>
      <p className="text-primary">Email : {user?.email}</p>
      <p className="text-primary">Rôle : {user?.role}</p>
      <p className="text-primary">Rôle : {user?.role}</p>
      <p className="text-primary">Rôle : {user?.role}</p>
      <p className="text-primary">Rôle : {user?.role}</p>
      <p className="text-primary">Rôle : {user?.role}</p>
    </div>
  );
};

export default AdminDashboard;