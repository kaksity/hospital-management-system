import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'radiology' | 'laboratory' | 'customer_service' | 'doctor' | 'accounts' | 'mortuary';

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
  radiology: {
    id: '2',
    email: 'radiology@agora.com',
    role: 'radiology',
    name: 'Radiology Department'
  },
  laboratory: {
    id: '7',
    email: 'laboratory@agora.com',
    role: 'laboratory',
    name: 'Laboratory Services'
  },
  customer_service: {
    id: '3',
    email: 'cs@agora.com',
    role: 'customer_service',
    name: 'Customer Service'
  },
  doctor: {
    id: '4',
    email: 'doctor@agora.com',
    role: 'doctor',
    name: 'Dr. Michael Adebayo'
  },
  accounts: {
    id: '5',
    email: 'accounts@agora.com',
    role: 'accounts',
    name: 'Accounts Department'
  },
  mortuary: {
    id: '6',
    email: 'mortuary@agora.com',
    role: 'mortuary',
    name: 'Mortuary Services'
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
      let userRole: UserRole = 'customer_service';

      if (email.includes('admin') || email.includes('ope')) userRole = 'admin';
      else if (email.includes('radiology')) userRole = 'radiology';
      else if (email.includes('laboratory')) userRole = 'laboratory';
      else if (email.includes('doctor')) userRole = 'doctor';
      else if (email.includes('accounts')) userRole = 'accounts';

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