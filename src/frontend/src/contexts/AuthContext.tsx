import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useActor } from "../hooks/useActor";

export interface AuthUser {
  username: string;
  balance: bigint;
  totalEarned: bigint;
  totalDeposited: bigint;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function hashPassword(password: string): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(hashBuffer);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { actor, isFetching } = useActor();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const storedUsername = localStorage.getItem("skl_username");

  const refreshUser = useCallback(async () => {
    if (!actor || isFetching) return;
    try {
      const account = await actor.getUserAccount();
      if (account) {
        setUser({
          username: account.username,
          balance: account.balance,
          totalEarned: account.totalEarned,
          totalDeposited: account.totalDeposited,
        });
      }
    } catch {
      // ignore
    }
  }, [actor, isFetching]);

  useEffect(() => {
    if (storedUsername && actor && !isFetching) {
      refreshUser();
    }
  }, [actor, isFetching, storedUsername, refreshUser]);

  async function login(username: string, password: string) {
    if (!actor) throw new Error("Not connected");
    setIsLoading(true);
    try {
      const hash = await hashPassword(password);
      const account = await actor.getUserAccount();
      if (!account) {
        await actor.registerUser(username, hash);
      }
      localStorage.setItem("skl_username", username);
      await refreshUser();
    } finally {
      setIsLoading(false);
    }
  }

  async function register(username: string, password: string) {
    if (!actor) throw new Error("Not connected");
    setIsLoading(true);
    try {
      const hash = await hashPassword(password);
      await actor.registerUser(username, hash);
      localStorage.setItem("skl_username", username);
      await refreshUser();
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("skl_username");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        logout,
        register,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
