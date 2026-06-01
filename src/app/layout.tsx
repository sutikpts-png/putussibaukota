import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PublicOnly from "@/components/PublicOnly";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kelurahan Kedamin Hilir - Kecamatan Pakem, Sleman",
  description: "Portal resmi Kelurahan Kedamin Hilir",
  icons: {
    icon: '/icon.png?v=2',
    shortcut: '/favicon.ico?v=2',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={`${inter.className} bg-gray-50 text-gray-800 font-sans min-h-screen flex flex-col`}>
        <PublicOnly>
          <Navbar />
        </PublicOnly>
        <main className="flex-grow">
          {children}
        </main>
        <PublicOnly>
          <Footer />
        </PublicOnly>
      </body>
    </html>
  );
}
