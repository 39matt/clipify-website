'use client';

import { createContext, useContext, ReactNode } from 'react'
import { User } from '@firebase/auth'
import { useAuth } from '../providers/authProvider'

interface LayoutContextType {
  user: User | null;
  loading: boolean | null;
  discordUsername: string | null;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading, discordUsername } = useAuth();

  return (
    <LayoutContext.Provider value={{ user, loading, discordUsername }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayoutContext must be used within a LayoutProvider');
  }
  return context;
};