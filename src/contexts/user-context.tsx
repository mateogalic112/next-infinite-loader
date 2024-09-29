"use client";

import { GithubUser, PaginatedResponse } from "@/models/api";
import { createContext, ReactNode, use } from "react";

type UsersPromise = Promise<PaginatedResponse<GithubUser[]>>;

// Create the context
const UsersContext = createContext<UsersPromise>(new Promise(() => {}));

export function UsersProvider({
  children,
  usersPromise,
}: {
  children: ReactNode;
  usersPromise: UsersPromise;
}) {
  return (
    <UsersContext.Provider value={usersPromise}>
      {children}
    </UsersContext.Provider>
  );
}

// Custom hook to use the UsersContext
export function useUsers() {
  const usersPromise = use(UsersContext);
  if (!usersPromise) {
    throw new Error("useUser must be used within a UserProvider");
  }
  const users = use(usersPromise);
  return users;
}
