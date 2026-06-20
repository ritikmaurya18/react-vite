import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getFromStorage, setToStorage, removeFromStorage } from "@/lib/localStorage";

interface AuthUser {
  email: string;
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER = {
  email: "admin@example.com",
  password: "password123",
  name: "Admin User",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() =>
    getFromStorage<AuthUser | null>("auth_user", null)
  );

  useEffect(() => {
    if (user) {
      setToStorage("auth_user", user);
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      const authUser: AuthUser = { email: DEMO_USER.email, name: DEMO_USER.name };
      setUser(authUser);
      setToStorage("auth_user", authUser);
      setToStorage("auth_token", "demo-jwt-token-" + Date.now());
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    removeFromStorage("auth_user");
    removeFromStorage("auth_token");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
