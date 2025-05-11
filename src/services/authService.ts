const API_URL = 'http://localhost:5000/api';

export const authService = {
  async loginWithFirebase(firebaseToken: string) {
    const response = await fetch(`${API_URL}/firebaselogin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ firebaseToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate with backend');
    }

    return response.json();
  },

  async logout() {
    console.log('Logging out');
    const response = await fetch(`${API_URL}/userLogout`, {
      credentials: 'include',   // <-- THIS sends cookies (token)
    });
    
    if (!response.ok) {
      throw new Error('Failed to logout');
    }
    return response.json();
  },

  async getUserProfile() {
    console.log('Getting user profile');
    const response = await fetch(`${API_URL}/userProfile`, {
      credentials: 'include',
    });
    console.log("[Profile API Response]:", response);
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    const data = await response.json();
    console.log("[Profile Data]:", {
      username: data.username,
      email: data.email,
      authProvider: data.authProvider,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
    return data;
  }
};