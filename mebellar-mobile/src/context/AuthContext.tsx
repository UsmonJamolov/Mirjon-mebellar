import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api, setAccessToken } from "../api/client";
import type { AuthUser } from "../types";

const TOKEN_KEY = "mebellar_mobile_token";
const USER_KEY = "mebellar_mobile_user";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: (token: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const signOut = useCallback(async () => {
    setAccessToken(null);
    setUser(null);
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const data = await api.me();
      setUser(data.user);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
    } catch {
      await signOut();
    }
  }, [signOut]);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        const rawUser = await AsyncStorage.getItem(USER_KEY);
        if (token) {
          setAccessToken(token);
          if (rawUser) setUser(JSON.parse(rawUser) as AuthUser);
          await refreshUser();
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshUser]);

  const signIn = useCallback(
    async (otpToken: string, code: string) => {
      const data = await api.mobileSignIn(otpToken, code);
      setAccessToken(data.accessToken);
      setUser(data.user);
      await AsyncStorage.setItem(TOKEN_KEY, data.accessToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
    },
    []
  );

  const value = useMemo(
    () => ({ user, loading, signIn, signOut, refreshUser }),
    [user, loading, signIn, signOut, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth AuthProvider ichida ishlatiladi");
  return ctx;
}
