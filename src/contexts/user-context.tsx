import * as Constants from "expo-constants";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { mockLogin, mockUserName } from "../lib/mock-api";
import { MOCK_USERS } from "../lib/mockData";
import { getAuth, removeAuth, setAuth } from "../lib/storage";

export type Role = "docente" | "discente" | "admin";

export type UserAuth = {
  email: string;
  name: string;
  role: Role;
} | null;

type UserContextType = {
  user: UserAuth;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

function isMockDataEnabled(): boolean {
  if (
    typeof process !== "undefined" &&
    process.env?.EXPO_PUBLIC_MOCK_DATA === "true"
  ) {
    return true;
  }
  try {
    const expoConfig = (Constants as any).expoConfig;
    return expoConfig?.extra?.MOCK_DATA === true;
  } catch {
    return false;
  }
}

const USE_MOCK = isMockDataEnabled();

function getRoleFromEmail(email: string): Role | null {
  if (email.endsWith("@docente.com")) return "docente";
  if (email.endsWith("@discente.com")) return "discente";
  if (email.endsWith("@admin.com")) return "admin";
  return null;
}

function getUserFromToken(token: string | null): UserAuth {
  if (!token) return null;
  try {
    const [email] = atob(token).split(":");
    if (!email) return null;
    const role = getRoleFromEmail(email);
    if (!role) return null;
    return {
      email,
      name: mockUserName(email),
      role,
    };
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
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    if (!email.trim() || !password.trim()) return false;

    let ok: boolean;
    if (USE_MOCK) {
      ok = await mockLogin(email, password);
    } else {
      ok = MOCK_USERS.has(email) && MOCK_USERS.get(email) === password;
    }

    if (!ok) return false;

    const token = btoa(`${email}:${password}`);
    await setAuth(JSON.stringify({ token }));
    const role = getRoleFromEmail(email);
    if (!role) return false;
    setUser({ email, name: mockUserName(email), role });
    return true;
  }, []);

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
