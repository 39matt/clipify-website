'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface LayoutContextType {
  discordUsername: string | null;
  setDiscordUsername: (value: string | null) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [discordUsername, setDiscordUsername] = useState<string | null>(null);

  return (
    <LayoutContext.Provider value={{ discordUsername, setDiscordUsername }}>
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