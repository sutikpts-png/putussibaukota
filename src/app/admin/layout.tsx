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
  const [isContentMenuOpen, setIsContentMenuOpen] = useState(false);
  const [isNavigasiMenuOpen, setIsNavigasiMenuOpen] = useState(false);
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
          <p className="text-xs text-green-300 mt-1">Kelurahan Putussibau Kota</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="block px-4 py-2 rounded hover:bg-green-800 transition">
            <i className="fas fa-home w-6"></i> Dashboard
          </Link>
          
          <div>
            <button 
              onClick={() => setIsContentMenuOpen(!isContentMenuOpen)}
              className="w-full text-left flex items-center justify-between px-4 py-2 rounded hover:bg-green-800 transition focus:outline-none"
            >
              <div>
                <i className="fas fa-edit w-6"></i> Content
              </div>
              <i className={`fas fa-chevron-${isContentMenuOpen ? 'up' : 'down'} text-xs`}></i>
            </button>
            
            {isContentMenuOpen && (
              <div className="mt-1 space-y-1 bg-green-950/30 py-2 rounded">
                <Link href="/admin/berita" className="block px-4 py-2 pl-10 rounded hover:bg-green-800 transition text-sm">
                  <i className="fas fa-angle-right w-4"></i> Berita
                </Link>
                <Link href="/admin/agenda" className="block px-4 py-2 pl-10 rounded hover:bg-green-800 transition text-sm">
                  <i className="fas fa-angle-right w-4"></i> Agenda Pimpinan
                </Link>
                <Link href="/admin/slider" className="block px-4 py-2 pl-10 rounded hover:bg-green-800 transition text-sm">
                  <i className="fas fa-angle-right w-4"></i> Slider Banner
                </Link>
                <Link href="/admin/produk-hukum" className="block px-4 py-2 pl-10 rounded hover:bg-green-800 transition text-sm">
                  <i className="fas fa-angle-right w-4"></i> Produk Hukum
                </Link>
                <Link href="/admin/layanan" className="block px-4 py-2 pl-10 rounded hover:bg-green-800 transition text-sm">
                  <i className="fas fa-angle-right w-4"></i> Layanan
                </Link>
                <Link href="/admin/potensi" className="block px-4 py-2 pl-10 rounded hover:bg-green-800 transition text-sm">
                  <i className="fas fa-angle-right w-4"></i> Potensi
                </Link>
                <Link href="/admin/galeri" className="block px-4 py-2 pl-10 rounded hover:bg-green-800 transition text-sm">
                  <i className="fas fa-angle-right w-4"></i> Galeri
                </Link>
                <Link href="/admin/profil" className="block px-4 py-2 pl-10 rounded hover:bg-green-800 transition text-sm">
                  <i className="fas fa-angle-right w-4"></i> Profil
                </Link>
                <Link href="/admin/kontak" className="block px-4 py-2 pl-10 rounded hover:bg-green-800 transition text-sm">
                  <i className="fas fa-angle-right w-4"></i> Kontak
                </Link>

              </div>
            )}
          </div>
          <div>
            <button 
              onClick={() => setIsNavigasiMenuOpen(!isNavigasiMenuOpen)}
              className="w-full text-left flex items-center justify-between px-4 py-2 rounded hover:bg-green-800 transition focus:outline-none mt-4 bg-green-800/30"
            >
              <div>
                <i className="fas fa-bars w-6"></i> Menu Navigasi
              </div>
              <i className={`fas fa-chevron-${isNavigasiMenuOpen ? 'up' : 'down'} text-xs`}></i>
            </button>
            
            {isNavigasiMenuOpen && (
              <div className="mt-1 space-y-1 bg-green-950/30 py-2 rounded">
                <Link href="/admin/menu/main" className="block px-4 py-2 pl-10 rounded hover:bg-green-800 transition text-sm">
                  <i className="fas fa-angle-right w-4"></i> Main Menu
                </Link>
                <Link href="/admin/menu/sub" className="block px-4 py-2 pl-10 rounded hover:bg-green-800 transition text-sm">
                  <i className="fas fa-angle-right w-4"></i> Sub Menu
                </Link>
              </div>
            )}
          </div>
          <Link href="/admin/halaman" className="block px-4 py-2 rounded hover:bg-green-800 transition">
            <i className="fas fa-file-alt w-6"></i> Halaman Web
          </Link>
          <Link href="/admin/pengaturan" className="block px-4 py-2 rounded hover:bg-green-800 transition mt-4 bg-green-800/50">
            <i className="fas fa-cog w-6"></i> Pengaturan Web
          </Link>
          <Link href="/admin/akun" className="block px-4 py-2 rounded hover:bg-green-800 transition">
            <i className="fas fa-user-shield w-6"></i> Pengaturan Admin
          </Link>
          <Link href="/admin/survey" className="block px-4 py-2 rounded hover:bg-green-800 transition">
            <i className="fas fa-clipboard-list w-6"></i> Survey Warga
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
