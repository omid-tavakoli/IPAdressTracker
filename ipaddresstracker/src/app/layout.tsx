"use client"
import "./globals.css";
import {  QueryClientProvider } from "react-query";
import { queryClient } from "../provider/QueryClientProvider";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <QueryClientProvider client={queryClient}>
        {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
