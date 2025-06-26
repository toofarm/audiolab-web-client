import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const token = await getSession();

    if (!token) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error getting session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
