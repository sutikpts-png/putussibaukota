'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = localStorage.getItem('admin_auth') === 'true';
      if (!isAuth) {
        router.push('/login');
      } else {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    router.push('/login');
  };

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Memeriksa sesi login...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-green-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-green-800">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <p className="text-xs text-green-300 mt-1">Kelurahan Kedamin Hilir</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="block px-4 py-2 rounded hover:bg-green-800 transition">
            <i className="fas fa-home w-6"></i> Dashboard
          </Link>
          <Link href="/admin/berita" className="block px-4 py-2 rounded hover:bg-green-800 transition">
            <i className="fas fa-newspaper w-6"></i> Berita
          </Link>
          <Link href="/admin/layanan" className="block px-4 py-2 rounded hover:bg-green-800 transition">
            <i className="fas fa-concierge-bell w-6"></i> Layanan
          </Link>
          <Link href="/admin/potensi" className="block px-4 py-2 rounded hover:bg-green-800 transition">
            <i className="fas fa-leaf w-6"></i> Potensi
          </Link>
          <Link href="/admin/galeri" className="block px-4 py-2 rounded hover:bg-green-800 transition">
            <i className="fas fa-images w-6"></i> Galeri
          </Link>
          <Link href="/admin/profil" className="block px-4 py-2 rounded hover:bg-green-800 transition">
            <i className="fas fa-building w-6"></i> Profil
          </Link>
          <Link href="/admin/kontak" className="block px-4 py-2 rounded hover:bg-green-800 transition">
            <i className="fas fa-address-book w-6"></i> Kontak
          </Link>
          <Link href="/admin/menu" className="block px-4 py-2 rounded hover:bg-green-800 transition mt-4 bg-green-800/30">
            <i className="fas fa-bars w-6"></i> Menu Navigasi
          </Link>
          <Link href="/admin/halaman" className="block px-4 py-2 rounded hover:bg-green-800 transition">
            <i className="fas fa-file-alt w-6"></i> Halaman Web
          </Link>
          <Link href="/admin/pengaturan" className="block px-4 py-2 rounded hover:bg-green-800 transition mt-4 bg-green-800/50">
            <i className="fas fa-cog w-6"></i> Pengaturan Web
          </Link>
        </nav>
        <div className="p-4 border-t border-green-800">
          <Link href="/" className="block px-4 py-2 text-sm text-green-200 hover:text-white transition">
            <i className="fas fa-external-link-alt w-6"></i> Lihat Website
          </Link>
          <button onClick={handleLogout} className="w-full text-left block px-4 py-2 mt-2 bg-red-800 rounded hover:bg-red-700 transition">
            <i className="fas fa-sign-out-alt w-6"></i> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar mobile */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center md:hidden">
          <h1 className="font-bold text-green-900">Admin Panel</h1>
          <button onClick={handleLogout} className="text-red-600"><i className="fas fa-sign-out-alt"></i></button>
        </header>
        <div className="p-8 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
