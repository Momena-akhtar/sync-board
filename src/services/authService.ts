const API_URL = 'http://localhost:5000/api';

export const authService = {
  async loginWithFirebase(firebaseToken: string) {
    const response = await fetch(`${API_URL}/firebaselogin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
    const response = await fetch(`${API_URL}/userProfile`);
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    return response.json();
  }
};