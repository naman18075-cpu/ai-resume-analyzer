import { createContext, useEffect, useMemo, useState } from "react";

import { getProfile, login as loginRequest, signup as signupRequest } from "../services/auth";

export const AuthContext = createContext(null);

const TOKEN_KEY = "resume-analyzer-token";
const USER_KEY = "resume-analyzer-user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await getProfile();
        setUser(profile);
        localStorage.setItem(USER_KEY, JSON.stringify(profile));
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const persistAuth = (payload) => {
    localStorage.setItem(TOKEN_KEY, payload.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
    setUser(payload.user);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login: async (formValues) => {
        const payload = await loginRequest(formValues);
        persistAuth(payload);
        return payload;
      },
      signup: async (formValues) => {
        const payload = await signupRequest(formValues);
        persistAuth(payload);
        return payload;
      },
      logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      },
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
