import "server-only";
import { cookies } from "next/headers";

export const createSession = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "token",
    value: token,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
};

export const destroySession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("token");
};

export const getSession = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
};
