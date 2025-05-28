import "server-only";

import { cache } from "react";
import { verify_user } from "./auth";
import { getSession } from "./session";

export const verifyAuth = cache(async () => {
  const token = await getSession();

  if (!token) {
    return { isAuthenticated: false };
  } else {
    try {
      const user = await verify_user();
      if (!user) {
        return { isAuthenticated: false };
      }

      return {
        ...user,
        isAuthenticated: true,
      };
    } catch (error) {
      console.error("Error verifying user:", error);
      return { isAuthenticated: false };
    }
  }
});
