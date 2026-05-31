'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* TOP BAR */}
      <div className="bg-green-900 text-white text-xs py-2 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span><i className="fas fa-phone mr-1 text-green-300"></i> (0274) 895123</span>
            <span><i className="fas fa-envelope mr-1 text-green-300"></i> kedaminhilir@slemankab.go.id</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-green-300 transition"><i className="fab fa-facebook"></i></Link>
            <Link href="#" className="hover:text-green-300 transition"><i className="fab fa-instagram"></i></Link>
            <Link href="#" className="hover:text-green-300 transition"><i className="fab fa-youtube"></i></Link>
            <span className="border-l border-green-700 pl-4 text-green-200">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="bg-white sticky top-0 z-50 shadow-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-green-700 flex items-center justify-center rounded-full text-white font-bold text-xs text-center leading-tight px-1 shadow">
              KEDAMIN<br/>HILIR
            </div>
            <div>
              <h1 className="text-base font-bold text-green-900 uppercase tracking-tight leading-tight">Kelurahan Kedamin Hilir</h1>
              <p className="text-xs text-gray-500 font-medium">Kecamatan Pakem · Kabupaten Sleman · DIY</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden text-gray-700 focus:outline-none"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
          
          <nav className="hidden md:flex flex-wrap justify-center gap-1 text-sm font-semibold text-gray-700">
            <Link href="/" className="px-3 py-2 hover:text-green-600 transition">Beranda</Link>
            <div className="relative group dropdown">
              <button className="px-3 py-2 hover:text-green-600 flex items-center gap-1 cursor-pointer">
                Profil <i className="fas fa-chevron-down text-xs"></i>
              </button>
              <div className="absolute left-0 mt-1 hidden group-hover:block bg-white border border-gray-200 shadow-lg rounded py-2 w-48 z-50">
                <Link href="/profil#sejarah" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 text-xs">Sejarah Kelurahan</Link>
                <Link href="/profil#visi-misi" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 text-xs">Visi & Misi</Link>
                <Link href="/profil#struktur" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 text-xs">Struktur Organisasi</Link>
                <Link href="/profil#wilayah" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 text-xs">Data Wilayah</Link>
              </div>
            </div>
            <Link href="/berita" className="px-3 py-2 hover:text-green-600 transition">Berita</Link>
            <Link href="/layanan" className="px-3 py-2 hover:text-green-600 transition">Layanan</Link>
            <Link href="/potensi" className="px-3 py-2 hover:text-green-600 transition">Potensi</Link>
            <Link href="/galeri" className="px-3 py-2 hover:text-green-600 transition">Galeri</Link>
            <Link href="/kontak" className="px-3 py-2 hover:text-green-600 transition">Kontak</Link>
          </nav>
        </div>
        
        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4">
            <Link href="/" className="block py-2 text-gray-700 font-semibold text-sm border-b border-gray-100">Beranda</Link>
            <Link href="/profil" className="block py-2 text-gray-700 font-semibold text-sm border-b border-gray-100">Profil</Link>
            <Link href="/berita" className="block py-2 text-gray-700 font-semibold text-sm border-b border-gray-100">Berita</Link>
            <Link href="/layanan" className="block py-2 text-gray-700 font-semibold text-sm border-b border-gray-100">Layanan</Link>
            <Link href="/potensi" className="block py-2 text-gray-700 font-semibold text-sm border-b border-gray-100">Potensi</Link>
            <Link href="/galeri" className="block py-2 text-gray-700 font-semibold text-sm border-b border-gray-100">Galeri</Link>
            <Link href="/kontak" className="block py-2 text-gray-700 font-semibold text-sm">Kontak</Link>
          </div>
        )}
      </header>
    </>
  );
}
