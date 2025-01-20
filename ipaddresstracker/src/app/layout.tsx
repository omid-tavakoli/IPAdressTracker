"use client"
import "./globals.css";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient()
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
