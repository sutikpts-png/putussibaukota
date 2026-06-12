import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'react-quill-new/dist/quill.snow.css';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PublicOnly from "@/components/PublicOnly";
import { supabase } from "@/lib/supabase";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kelurahan Putussibau Kota - Kecamatan Putussibau Utara, Kapuas Hulu",
  description: "Portal resmi Kelurahan Putussibau Kota",
  icons: {
    icon: '/icon.png?v=2',
    shortcut: '/favicon.ico?v=2',
  },
};

export const revalidate = 60; // Cache selama 1 menit (meningkatkan performa secara signifikan)

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: web } = await supabase.from('pengaturan_web').select('tema_warna').eq('id', 1).single();
  const temaWarnaClass = web?.tema_warna ? `theme-${web.tema_warna}` : 'theme-original';

  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={`${inter.className} bg-gray-50 text-gray-800 font-sans min-h-screen flex flex-col ${temaWarnaClass}`}>
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
