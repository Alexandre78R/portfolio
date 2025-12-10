import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { GetMeQuery, useGetMeQuery } from "@/types/graphql";

export interface UserContextType {
  user: GetMeQuery["me"] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  checkToken: () => void;
}

export interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<GetMeQuery["me"] | null>(null);
  const [hasToken, setHasToken] = useState<boolean>(false);
  
  // Vérifier le token au montage
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setHasToken(!!token);
  }, []);
  
  const { data, loading, error, refetch } = useGetMeQuery({
    skip: !hasToken, // Ne pas exécuter la requête s'il n'y a pas de token
  }) as {
    data?: GetMeQuery;
    loading: boolean;
    error?: Error;
    refetch: () => void;
  };

  useEffect((): void => {
    if (data?.me) {
      setUser(data.me);
    } else {
      setUser(null);
    }
  }, [data]);
  
  // Écouter les changements du localStorage (utile pour la synchronisation entre onglets)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      setHasToken(!!token);
      if (!token) {
        setUser(null);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  // Fonction pour vérifier manuellement le token (utile après logout dans le même onglet)
  const checkToken = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setHasToken(!!token);
    if (!token) {
      setUser(null);
    }
  };

  const contextValue: UserContextType = {
    user,
    loading,
    error: error ?? null,
    refetch,
    checkToken,
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};