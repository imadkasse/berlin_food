import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Plus_Jakarta_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Plus_Jakarta_Sans({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Berlin Food",
  description: "Premium Berlin Food Delivery",
  manifest: "/manifest.json",
  themeColor: "#9f4200",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Berlin Food",
  },
};

import { PWAInstallPrompt } from "@/components/shared/PWAInstallPrompt";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
          <PWAInstallPrompt />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
