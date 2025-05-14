import { connectSocket, disconnectSocket } from "../sockets/socket";

connectSocket;
const API_URL = "http://localhost:5000/api";

export const authService = {
  async register(userData: {
    username: string;
    email: string;
    password: string;
  }) {
    const response = await fetch(`${API_URL}/userRegister`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    return response.json();
  },

  async login(credentials: { email: string; password: string }) {
    const response = await fetch(`${API_URL}/userLogin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }
    connectSocket();
    return response.json();
  },

  async loginWithFirebase(firebaseToken: string) {
    const response = await fetch(`${API_URL}/firebaselogin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ firebaseToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to authenticate with backend");
    }
    connectSocket();
    return response.json();
  },

  async logout() {
    console.log("Logging out");
    const response = await fetch(`${API_URL}/userLogout`, {
      credentials: "include", // <-- THIS sends cookies (token)
    });

    if (!response.ok) {
      throw new Error("Failed to logout");
    }
    disconnectSocket();
    return response.json();
  },

  async getUserProfile() {
    console.log("Getting user profile");
    const response = await fetch(`${API_URL}/userProfile`, {
      credentials: "include",
    });
    console.log("[Profile API Response]:", response);
    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }
    const data = await response.json();
    console.log("[Profile Data]:", {
      username: data.username,
      email: data.email,
      authProvider: data.authProvider,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
    return data;
  },

  async updateUserProfile(updateData: {
    username?: string;
    oldPassword?: string;
    newPassword?: string;
  }) {
    const response = await fetch(`${API_URL}/userProfile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    return response.json();
  },
};
