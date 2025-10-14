import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { GetMeQuery, useGetMeQuery } from "@/types/graphql";

export interface UserContextType {
  user: GetMeQuery["me"] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { data, loading, error, refetch } = useGetMeQuery() as {
    data?: GetMeQuery;
    loading: boolean;
    error?: Error;
    refetch: () => void;
  };

  const [user, setUser] = useState<GetMeQuery["me"] | null>(null);

  useEffect((): void => {
    if (data?.me) {
      setUser(data.me);
    } else {
      setUser(null);
    }
  }, [data]);

  const contextValue: UserContextType = {
    user,
    loading,
    error: error ?? null,
    refetch,
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