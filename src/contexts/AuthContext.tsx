// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../backend/auth/firebase"; // Adjust the import path as necessary

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
  }
  
  const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {},
    loading: true,
  });
  
  export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      });
      return () => unsubscribe();
    }, []);
  
    return (
      <AuthContext.Provider value={{ user, setUser, loading }}>
        {children}
      </AuthContext.Provider>
    );
  };

export const useAuth = () => useContext(AuthContext);
