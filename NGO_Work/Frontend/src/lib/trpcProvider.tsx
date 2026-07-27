import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './trpc';
import superjson from 'superjson';

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const getBaseUrl = () => {
    // 1. If explicit API URL is configured, use it
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    
    // 2. If running in browser and on local dev port (5173), fallback to port 5000
    if (typeof window !== 'undefined') {
      const { hostname, port } = window.location;
      if ((hostname === 'localhost' || hostname === '127.0.0.1') && port === '5173') {
        return 'http://localhost:5000';
      }
    }
    
    // 3. Otherwise, use relative path (e.g. same origin serving/proxying)
    return '';
  };

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson,
          async headers() {
            const token = localStorage.getItem('token') || localStorage.getItem('authToken');
            return {
              ...(token ? { authorization: `Bearer ${token}` } : {}),
            };
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
