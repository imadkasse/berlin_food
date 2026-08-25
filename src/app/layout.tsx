import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: "برلين فود",
  description: "خدمة توصيل طعام برلين المميزة",
  manifest: "/manifest.json",
  // themeColor: "#9f4200",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "برلين فود",
  },
};

// import { PWAInstallPrompt } from "@/components/shared/PWAInstallPrompt";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} h-full antialiased`}>
      <body className="font-cairo min-h-full flex flex-col">
        {children}
          {/* <PWAInstallPrompt /> */}
        <Toaster position="top-right" richColors dir="rtl" />
      </body>
    </html>
  );
}
