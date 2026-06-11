"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { api } from "@/lib/api";

type User = { id: string; email: string; name: string };

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

function friendly(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (err.response?.data?.error) return String(err.response.data.error);
    if (err.code === "ERR_NETWORK")
      return "The forge is unreachable. Is the backend running?";
  }
  return "Something went wrong. Please try again";
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("df_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/api/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem("df_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("df_token", data.token);
      setUser(data.user);
    } catch (err) {
      throw new Error(friendly(err));
    }
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        const { data } = await api.post("/api/auth/register", {
          name,
          email,
          password,
        });
        localStorage.setItem("df_token", data.token);
        setUser(data.user);
      } catch (err) {
        throw new Error(friendly(err));
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("df_token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
