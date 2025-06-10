
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  session: any;
  profile: any;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({ id: '1', email: 'admin@example.com', displayName: 'Admin User' });
  const [session, setSession] = useState<any>({ user: { id: '1' } });
  const [profile, setProfile] = useState<any>({ role: 'admin' });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setUser({ id: '1', email, displayName: 'Admin User' });
      setSession({ user: { id: '1' } });
      setIsLoading(false);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
