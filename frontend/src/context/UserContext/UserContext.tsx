import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  GetMeQuery,
  useGetMeQuery,
} from "@/types/graphql";

interface UserContextType {
  user: GetMeQuery["me"] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data, loading, error, refetch } = useGetMeQuery();
  const [user, setUser] = useState<GetMeQuery["me"] | null>(null);

  useEffect(() => {
    console.log("data", data);
    
    if (data?.me) {
      setUser(data.me);
    } else {
      setUser(null);
    }
  }, [data]);

  return (
    <UserContext.Provider value={{ user, loading, error: error ?? null, refetch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};