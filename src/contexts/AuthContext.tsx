import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'paralegal' | 'attorney' | 'client';

interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  switchUser: (role: UserRole) => void;
  updateUserAvatar: (avatarUrl: string) => void; 
  removeUserAvatar: () => void; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for development
const mockUsers: Record<UserRole, User> = {
  admin: {
    id: '1',
    email: 'ope.adeyomoye@agora.com',
    role: 'admin',
    name: 'Ope Adeyomoye'
  },
  paralegal: {
    id: '2',
    email: 'sarah.chen@agora.com',
    role: 'paralegal',
    name: 'Sarah Chen'
  },
  attorney: {
    id: '3',
    email: 'michael.rodriguez@agora.com',
    role: 'attorney',
    name: 'Michael Rodriguez'
  },
  client: {
    id: '4',
    email: 'alex.turner@agora.com',
    role: 'client',
    name: 'Alex Turner'
  }
};

export const getAvatarInitials = (name: string): string => {
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On app load, check if we have a stored user role
    const storedRole = localStorage.getItem('devUserRole') as UserRole;
    const storedAvatar = localStorage.getItem('userAvatar');

    if (storedRole && mockUsers[storedRole]) {
      const userWithAvatar = { 
        ...mockUsers[storedRole], 
        avatar: storedAvatar || undefined 
      };
      setUser(userWithAvatar);
    } else {
      // Default to admin for full access during development
      const adminWithAvatar = { 
        ...mockUsers.admin, 
        avatar: storedAvatar || undefined 
      };
      setUser(adminWithAvatar);
      localStorage.setItem('devUserRole', 'admin');
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // For development, any password works
      let userRole: UserRole = 'client';
      
      if (email.includes('admin') || email.includes('ope')) userRole = 'admin';
      else if (email.includes('paralegal') || email.includes('sarah')) userRole = 'paralegal';
      else if (email.includes('attorney') || email.includes('michael')) userRole = 'attorney';
      
      const storedAvatar = localStorage.getItem('userAvatar');
      const user = { 
        ...mockUsers[userRole], 
        avatar: storedAvatar || undefined 
      };
      
      setUser(user);
      localStorage.setItem('devUserRole', userRole);

    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('devUserRole');
    // The login page will handle redirection via useAuth
  };

  const switchUser = (role: UserRole) => {
    const storedAvatar = localStorage.getItem('userAvatar');
    const newUser = { 
      ...mockUsers[role], 
      avatar: storedAvatar || undefined 
    };
    
    setUser(newUser);
    localStorage.setItem('devUserRole', role);
    // ProtectedRoute will handle redirection automatically
  };

  const updateUserAvatar = (avatarUrl: string) => {
    setUser(prev => prev ? { ...prev, avatar: avatarUrl } : null);
    localStorage.setItem('userAvatar', avatarUrl);
  };

  const removeUserAvatar = () => {
    setUser(prev => prev ? { ...prev, avatar: undefined } : null);
    localStorage.removeItem('userAvatar');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading, 
      switchUser,
      updateUserAvatar,
      removeUserAvatar
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};