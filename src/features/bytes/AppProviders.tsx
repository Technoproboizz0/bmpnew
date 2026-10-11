import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import type { ReactNode } from 'react';
export function AppProviders({ children }: { children: ReactNode }) {
  return <AuthProvider><PlayerProvider>{children}</PlayerProvider></AuthProvider>;
}
