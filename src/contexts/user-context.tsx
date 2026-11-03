import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { MOCK_USERS } from "../lib/mockData";
import { getAuth, setAuth, removeAuth } from "../lib/storage";

export type UserAuth = {
  email: string;
  role: "docente" | "discente";
} | null;

type UserContextType = {
  user: UserAuth;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

function getUserFromToken(token: string | null): UserAuth {
  if (!token) return null;
  try {
    const [email] = atob(token).split(":");
    if (!email) return null;
    const role = email.endsWith("@docente.com") ? "docente" : "discente";
    return { email, role };
  } catch {
    return null;
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAuth>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const stored = await getAuth();
    let token: string | null = null;
    if (stored) {
      try {
        token = JSON.parse(stored)?.token ?? null;
      } catch {
        token = null;
      }
    }
    setUser(getUserFromToken(token));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    if (!email.trim() || !password.trim()) return false;
    if (!MOCK_USERS.has(email)) return false;
    if (MOCK_USERS.get(email) !== password) return false;
    const token = btoa(`${email}:${password}`);
    await setAuth(JSON.stringify({ token }));
    await refreshUser();
    return true;
  }, [refreshUser]);

  const logout = useCallback(() => {
    removeAuth();
    setUser(null);
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}