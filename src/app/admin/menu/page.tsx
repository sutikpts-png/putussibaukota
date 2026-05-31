'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminMenu() {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenus();
  }, []);

  async function fetchMenus() {
    // Fetch all menus, ordered by urutan
    const { data, error } = await supabase
      .from('menu_navigasi')
      .select('*')
      .order('parent_id', { ascending: true, nullsFirst: true })
      .order('urutan', { ascending: true });
    
    if (data) {
      // Reorganize into parent-child structure for display
      const parentMenus = data.filter(m => !m.parent_id);
      const childMenus = data.filter(m => m.parent_id);
      
      const structuredMenus = parentMenus.map(parent => ({
        ...parent,
        children: childMenus.filter(child => child.parent_id === parent.id).sort((a, b) => a.urutan - b.urutan)
      })).sort((a, b) => a.urutan - b.urutan);

      setMenus(structuredMenus);
    }
    setLoading(false);
  }

  async function hapusMenu(id: string) {
    if (confirm('Yakin ingin menghapus menu ini? (Sub-menu juga akan terhapus)')) {
      await supabase.from('menu_navigasi').delete().eq('id', id);
      fetchMenus();
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Menu Navigasi</h1>
        <Link href="/admin/menu/tambah" className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
          <i className="fas fa-plus mr-2"></i> Tambah Menu
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div className="text-center text-gray-500 py-8">Memuat data...</div>
        ) : menus.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Belum ada menu yang ditambahkan.</div>
        ) : (
          <div className="space-y-4">
            {menus.map((parent) => (
              <div key={parent.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-900">{parent.nama}</h3>
                    <p className="text-xs text-gray-500 font-mono mt-1">{parent.link} | Urutan: {parent.urutan}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link 
                      href={`/admin/menu/edit/${parent.id}`}
                      className="bg-blue-500 text-white w-8 h-8 rounded shadow hover:bg-blue-600 flex items-center justify-center"
                    >
                      <i className="fas fa-edit text-xs"></i>
                    </Link>
                    <button 
                      onClick={() => hapusMenu(parent.id)}
                      className="bg-red-500 text-white w-8 h-8 rounded shadow hover:bg-red-600 flex items-center justify-center"
                    >
                      <i className="fas fa-trash text-xs"></i>
                    </button>
                  </div>
                </div>
                
                {parent.children && parent.children.length > 0 && (
                  <div className="border-t border-gray-200 bg-white p-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">Sub Menu:</h4>
                    <div className="space-y-2">
                      {parent.children.map((child: any) => (
                        <div key={child.id} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-100 rounded">
                          <div className="flex items-center gap-3">
                            <i className="fas fa-level-up-alt rotate-90 text-gray-400"></i>
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{child.nama}</p>
                              <p className="text-xs text-gray-500 font-mono">{child.link} | Urutan: {child.urutan}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link 
                              href={`/admin/menu/edit/${child.id}`}
                              className="bg-blue-100 text-blue-600 w-7 h-7 rounded hover:bg-blue-200 flex items-center justify-center"
                            >
                              <i className="fas fa-edit text-xs"></i>
                            </Link>
                            <button 
                              onClick={() => hapusMenu(child.id)}
                              className="bg-red-100 text-red-600 w-7 h-7 rounded hover:bg-red-200 flex items-center justify-center"
                            >
                              <i className="fas fa-trash text-xs"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
