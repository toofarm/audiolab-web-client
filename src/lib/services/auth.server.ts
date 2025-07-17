type User = {
  email: string;
  first_name?: string;
  last_name?: string;
};

type AuthResponse = {
  token: string;
  user: User;
};

export class AuthServerService {
  private getToken: () => Promise<string>;
  private getServerUrl: () => string;

  constructor(getToken: () => Promise<string>, getServerUrl: () => string) {
    this.getToken = getToken;
    this.getServerUrl = getServerUrl;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const response = await fetch(`${this.getServerUrl()}/auth/login`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to login user");
    }

    const data = await response.json();
    return data;
  }

  async logout(): Promise<void> {
    const token = await this.getToken();
    const response = await fetch(`${this.getServerUrl()}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to logout user");
    }
  }

  async getMe(): Promise<User> {
    const token = await this.getToken();
    const response = await fetch(`${this.getServerUrl()}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }

    const data = await response.json();
    return data;
  }
}

// Factory for server-side usage
import { getSession } from "../session";
import { SERVER_API_URL } from "../constants";

export const createServerAuthService = (): AuthServerService => {
  return new AuthServerService(
    async () => {
      const token = await getSession();
      if (!token) {
        throw new Error("No session token found");
      }
      return token;
    },
    () => SERVER_API_URL
  );
};
