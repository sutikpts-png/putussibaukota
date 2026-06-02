'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminMainMenu() {
  const [parentMenus, setParentMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenus();
  }, []);

  async function fetchMenus() {
    const { data, error } = await supabase
      .from('menu_navigasi')
      .select('*')
      .is('parent_id', null)
      .order('urutan', { ascending: true });
    
    if (data) {
      setParentMenus(data);
    }
    setLoading(false);
  }

  async function hapusMenu(id: string) {
    if (confirm('Yakin ingin menghapus Main Menu ini? (Sub-menu yang terhubung mungkin akan error atau ikut terhapus)')) {
      await supabase.from('menu_navigasi').delete().eq('id', id);
      fetchMenus();
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Main Menu</h1>
          <p className="text-slate-500 mt-1">Kelola menu utama website.</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <i className="fas fa-folder text-[#00a676]"></i> Daftar Main Menu
          </h2>
          <Link href="/admin/menu/tambah" className="flex items-center space-x-2 bg-[#00a676] hover:bg-[#008f65] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95">
            <i className="fas fa-plus"></i>
            <span>Tambah Main Menu</span>
          </Link>
        </div>
        
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          {loading ? (
            <div className="text-center text-slate-500 py-12 font-medium italic">Memuat data...</div>
          ) : parentMenus.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-medium italic">Belum ada Main Menu.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-700 uppercase">
                  <tr>
                    <th className="px-6 py-4 font-black tracking-widest">Nama <span className="text-blue-500 ml-1">▲</span></th>
                    <th className="px-6 py-4 font-black tracking-widest">Link <span className="text-slate-300 ml-1">◆</span></th>
                    <th className="px-6 py-4 font-black text-center tracking-widest">Urutan <span className="text-slate-300 ml-1">◆</span></th>
                    <th className="px-6 py-4 font-black tracking-widest">Class <span className="text-slate-300 ml-1">◆</span></th>
                    <th className="px-6 py-4 font-black tracking-widest text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parentMenus.map((item) => (
                    <tr key={item.id} className="bg-white hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">{item.nama}</td>
                      <td className="px-6 py-4 font-medium text-slate-500">{item.link}</td>
                      <td className="px-6 py-4 font-mono text-slate-700 text-center">{item.urutan}</td>
                      <td className="px-6 py-4 text-slate-500">{item.class || '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Link 
                            href={`/admin/menu/edit/${item.id}`}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>
                          <button 
                            onClick={() => hapusMenu(item.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Hapus"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
