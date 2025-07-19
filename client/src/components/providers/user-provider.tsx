"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: number;
  auth0Id: string;
  name: string;
  email: string;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type UserContextType = {
  user: User | null;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
});

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

type UserProviderProps = {
  children: React.ReactNode;
  initialUser?: User | null;
};

export const UserProvider = ({ children, initialUser }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(initialUser || null);
  const [isLoading, setIsLoading] = useState(!initialUser);

  useEffect(() => {
    if (!initialUser) {
      // Fetch user data from API if not provided
      fetch("/api/auth/sync-user", {
        method: "POST",
      })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          const text = await res.text();
          if (!text) {
            throw new Error("Empty response");
          }
          return JSON.parse(text);
        })
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [initialUser]);

  return (
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};
