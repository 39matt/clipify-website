'use client';

import { useEffect } from 'react';

export function Analytics() {
  useEffect(() => {
    // Vercel Analytics will be automatically injected in production
    // This component ensures it's loaded on the client side
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      import('@vercel/analytics').then((mod) => {
        mod.inject();
      }).catch(() => {
        // Analytics failed to load, continue silently
      });
    }
  }, []);

  return null;
}

