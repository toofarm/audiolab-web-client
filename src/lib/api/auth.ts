import { API_URL } from "../constants";

export const register_user = async (user: RegisterUser) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Failed to register user");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const login_user = async (user: LoginUser) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Failed to login user");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

export const logout_user = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to logout user");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error logging out user:", error);
    throw error;
  }
};

export const verify_user = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to verify user");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error verifying user:", error);
    throw error;
  }
};
