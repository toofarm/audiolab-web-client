"use server";

import { register_user, login_user, logout_user } from "@/lib/auth";
import { createSession, destroySession, getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const registerAuth = async (data: FormData): Promise<void> => {
  try {
    const username = data.get("username") as string;
    const password = data.get("password") as string;
    const first_name = data.get("first_name") as string;
    const last_name = data.get("last_name") as string;

    if (!username || !password || !first_name || !last_name) {
      throw new Error("Required fields are missing");
    }

    const res = await register_user({
      email: username,
      password,
      first_name,
      last_name,
    } as RegisterUser);

    if (!res.access_token) {
      throw new Error("Unable to register user");
    }
    const token = res.access_token;
    await createSession(token);
  } catch (error) {
    console.error("Error verifying user:", error);
    throw new Error("Failed to verify user");
  } finally {
    redirect("/");
  }
};

export const logoutAuth = async (): Promise<void> => {
  try {
    const token = await getSession();

    if (!token) {
      throw new Error("No token found");
    }

    await logout_user(token);
    await destroySession();
  } catch (error) {
    console.error("Error logging out user:", error);
    throw new Error("Failed to log out user");
  } finally {
    redirect("/login");
  }
};

export const loginAuth = async (data: FormData): Promise<void> => {
  let didError = false;
  try {
    const username = data.get("username") as string;
    const password = data.get("password") as string;

    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    const res = await login_user({ username, password } as LoginUser);

    if (!res.access_token) {
      throw new Error("Invalid credentials");
    }
    const token = res.access_token;
    await createSession(token);
  } catch (error) {
    didError = true;
    console.error("Error verifying user:", error);
    throw new Error("Failed to verify user");
  } finally {
    const next = data.get("next") as string;
    redirect(didError ? "/login?error=true" : next || "/dashboard");
  }
};
