"use client";

import { useState, useEffect } from "react";
import type { User } from "@/interfaces/User";

const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  const register = (user: User) => {
    const stored = localStorage.getItem(USERS_KEY);
    const users: User[] = stored ? JSON.parse(stored) : [];

    if (users.some((u) => u.email === user.email)) {
      throw new Error("Ya existe un usuario con ese correo");
    }

    const updated = [...users, user];
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    setCurrentUser(user);
  };

  const login = (emailOrName: string, password: string) => {
    const stored = localStorage.getItem(USERS_KEY);
    const users: User[] = stored ? JSON.parse(stored) : [];

    const user = users.find(
      (u) => (u.email === emailOrName || u.name === emailOrName) && u.password === password
    );

    if (!user) throw new Error("Credenciales incorrectas");

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setCurrentUser(null);
  };

  return { currentUser, register, login, logout };
}

export default useAuth;