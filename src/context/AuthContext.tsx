import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";
import type { AuthUser } from "@/types/auth";
import { readFromStorage, writeToStorage } from "@/utils/storage";

type AuthContextValue = {
  user: AuthUser | null;
  can: (permission: "access-admin") => boolean;
  updateProfile: (data: { firstName: string; lastName: string; email: string; address: string }) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  signup: (data: {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    address: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "startkoro.authUser.v1";
const TOKEN_STORAGE_KEY = "startkoro.authToken.v1";

type AuthApiUser = {
  id: string;
  name: string;
  email: string;
  mobile_number: string;
  address: string;
  role: "user" | "admin";
  created_at?: string;
  updated_at?: string;
};

type AuthApiResponse = {
  success: boolean;
  message?: string;
  data: {
    user: AuthApiUser;
    token: string;
  };
};

type MeApiResponse = {
  success: boolean;
  data: AuthApiUser;
};

function splitName(name: string) {
  const trimmedName = name.trim();
  const [firstName = "", ...rest] = trimmedName.split(/\s+/);

  return {
    firstName,
    lastName: rest.join(" "),
  };
}

function mapApiUserToAuthUser(user: AuthApiUser): AuthUser {
  const { firstName, lastName } = splitName(user.name);

  return {
    id: user.id,
    firstName,
    lastName,
    email: user.email,
    mobileNumber: user.mobile_number,
    address: user.address,
    role: user.role,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

function canUser(user: AuthUser | null, permission: "access-admin"): boolean {
  if (permission === "access-admin") {
    return user?.role === "admin";
  }

  return false;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = readFromStorage<AuthUser>(STORAGE_KEY);
    return saved ?? null;
  });

  useEffect(() => {
    const savedToken = readFromStorage<string>(TOKEN_STORAGE_KEY);

    if (!savedToken) {
      return;
    }

    // On refresh, we re-check the logged-in user from the backend so the UI reflects a real session.
    api.defaults.headers.common.Authorization = `Bearer ${savedToken}`;

    void api
      .get<MeApiResponse>("/auth/me")
      .then((response) => {
        setUser(mapApiUserToAuthUser(response.data.data));
      })
      .catch(() => {
        delete api.defaults.headers.common.Authorization;
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
      });
  }, []);

  useEffect(() => {
    writeToStorage(STORAGE_KEY, user);
  }, [user]);

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      can: (permission) => canUser(user, permission),
      updateProfile: async ({ firstName, lastName, email, address }) => {
        const response = await api.patch<MeApiResponse>("/auth/me", {
          name: `${firstName} ${lastName}`.trim(),
          email: email.trim().toLowerCase(),
          address: address.trim(),
        });

        setUser(mapApiUserToAuthUser(response.data.data));
      },
      login: async ({ email, password }) => {
        const response = await api.post<AuthApiResponse>("/auth/login", { email, password });
        const { user: apiUser, token } = response.data.data;

        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        writeToStorage(TOKEN_STORAGE_KEY, token);
        setUser(mapApiUserToAuthUser(apiUser));
      },
      signup: async (data) => {
        // The backend stores one full name column, so we combine first and last name here before sending.
        const response = await api.post<AuthApiResponse>("/auth/register", {
          name: `${data.firstName} ${data.lastName}`.trim(),
          email: data.email.trim().toLowerCase(),
          mobile_number: data.mobileNumber.trim(),
          address: data.address.trim(),
          password: data.password,
        });

        const { user: apiUser, token } = response.data.data;

        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        writeToStorage(TOKEN_STORAGE_KEY, token);
        setUser(mapApiUserToAuthUser(apiUser));
      },
      logout: () => {
        delete api.defaults.headers.common.Authorization;
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
      },
    };
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
