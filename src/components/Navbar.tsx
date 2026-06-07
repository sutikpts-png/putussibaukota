'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const NavLink = ({ item, className }: { item: any, className: string }) => {
  let url = item.link ? item.link.trim() : '#';
  const isExternal = !url.startsWith('/') && !url.startsWith('#');
  
  if (isExternal && !url.startsWith('http')) {
    url = `https://${url}`;
  }
  
  if (isExternal) {
    return <a href={url} target="_blank" rel="noopener noreferrer" className={className}>{item.nama}</a>;
  }
  return <Link href={url} className={className}>{item.nama}</Link>;
};

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [menus, setMenus] = useState<any[]>([]);
  const [web, setWeb] = useState<any>({
    telepon: '-',
    email: 'putussibauk@kapuashulukab.go.id',
    nama_kelurahan: 'Putussibau Kota',
    nama_kecamatan_kabupaten: 'Kecamatan Putussibau Utara · Kabupaten Kapuas Hulu · Kalbar',
    link_facebook: '#',
    link_instagram: '#',
    link_youtube: '#'
  });

  useEffect(() => {
    async function fetchData() {
      // Fetch web settings
      const { data: webData } = await supabase.from('pengaturan_web').select('*').eq('id', 1).single();
      if (webData) setWeb(webData);

      // Fetch menu navigation
      const { data: menuData } = await supabase
        .from('menu_navigasi')
        .select('*')
        .order('parent_id', { ascending: true, nullsFirst: true })
        .order('urutan', { ascending: true });

      if (menuData) {
        const parentMenus = menuData.filter(m => !m.parent_id);
        const childMenus = menuData.filter(m => m.parent_id);
        
        const structuredMenus = parentMenus.map(parent => ({
          ...parent,
          children: childMenus.filter(child => child.parent_id === parent.id).sort((a, b) => a.urutan - b.urutan)
        })).sort((a, b) => a.urutan - b.urutan);

        setMenus(structuredMenus);
      }
    }
    fetchData();

    // Start live clock
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* TOP BAR */}
      <div className="bg-green-900 text-white text-xs py-2 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span><i className="fas fa-phone mr-1 text-green-300"></i> {web.telepon}</span>
            <span><i className="fas fa-envelope mr-1 text-green-300"></i> {web.email}</span>
          </div>
          <div className="flex items-center gap-4">
            {web.link_facebook !== '#' && web.link_facebook !== '' && <Link href={web.link_facebook} target="_blank" className="hover:text-green-300 transition"><i className="fab fa-facebook"></i></Link>}
            {web.link_instagram !== '#' && web.link_instagram !== '' && <Link href={web.link_instagram} target="_blank" className="hover:text-green-300 transition"><i className="fab fa-instagram"></i></Link>}
            {web.link_youtube !== '#' && web.link_youtube !== '' && <Link href={web.link_youtube} target="_blank" className="hover:text-green-300 transition"><i className="fab fa-youtube"></i></Link>}
            <span className="border-l border-green-700 pl-4 text-green-200 flex items-center">
              {currentTime ? (
                <>
                  <i className="far fa-calendar-alt mr-1"></i> 
                  <span className="hidden sm:inline">{currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span className="sm:hidden">{currentTime.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span className="mx-2 opacity-50">|</span>
                  <i className="far fa-clock mr-1"></i> 
                  {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </>
              ) : (
                <span className="opacity-50">Memuat waktu...</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="bg-white sticky top-0 z-50 shadow-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-14 flex items-center justify-center">
              {web.logo_url ? (
                <div className="relative w-full h-full">
                  <Image src={web.logo_url} alt={`Logo ${web.nama_kelurahan}`} fill sizes="48px" className="object-contain drop-shadow-sm" />
                </div>
              ) : (
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/eb/Lambang_Kapuas_Hulu.png" alt="Logo Kapuas Hulu" className="h-[48px] w-auto object-contain drop-shadow-sm" />
              )}
            </div>
            <div>
              <h1 className="text-base font-bold text-green-900 uppercase tracking-tight leading-tight">Kelurahan {web.nama_kelurahan}</h1>
              <p className="text-xs text-gray-500 font-medium">{web.nama_kecamatan_kabupaten}</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden text-gray-700 focus:outline-none"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
          
          <nav className="hidden md:flex flex-wrap justify-center gap-1 text-sm font-semibold text-gray-700">
            {menus.length === 0 ? (
              // Fallback menu when db is empty
              <Link href="/" className="px-3 py-2 hover:text-green-600 transition">Beranda</Link>
            ) : (
              menus.map((menu) => (
                menu.children && menu.children.length > 0 ? (
                  <div key={menu.id} className="relative group dropdown">
                    <button className="px-3 py-2 hover:text-green-600 flex items-center gap-1 cursor-pointer">
                      {menu.nama} <i className="fas fa-chevron-down text-xs"></i>
                    </button>
                    <div className="absolute left-0 mt-1 hidden group-hover:block bg-white border border-gray-200 shadow-lg rounded py-2 w-48 z-50">
                      {menu.children.map((child: any) => (
                        <NavLink key={child.id} item={child} className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 text-xs" />
                      ))}
                    </div>
                  </div>
                ) : (
                  <NavLink key={menu.id} item={menu} className="px-3 py-2 hover:text-green-600 transition" />
                )
              ))
            )}
          </nav>
        </div>
        
        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4">
            {menus.length === 0 ? (
               <Link href="/" className="block py-2 text-gray-700 font-semibold text-sm border-b border-gray-100">Beranda</Link>
            ) : (
              menus.map((menu) => (
                <div key={menu.id} className="border-b border-gray-100">
                  {menu.children && menu.children.length > 0 ? (
                    <div className="py-2">
                      <span className="block text-gray-900 font-bold text-sm mb-2">{menu.nama}</span>
                      <div className="pl-4 border-l-2 border-green-200 space-y-2">
                        {menu.children.map((child: any) => (
                          <NavLink key={child.id} item={child} className="block text-gray-600 hover:text-green-700 text-sm" />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="py-2">
                      <NavLink item={menu} className="text-gray-700 font-semibold text-sm block" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </header>
    </>
  );
}
