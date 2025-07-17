import { getSession } from "../session";
import { SERVER_API_URL } from "../constants";

export const get_user = async () => {
  try {
    const token = await getSession();
    if (!token) {
      throw new Error("No session token found");
    }

    const response = await fetch(`${SERVER_API_URL}/auth/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const user = await response.json();

    return {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
