'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminProdukHukum() {
  const [produk, setProduk] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProdukHukum();
  }, []);

  async function fetchProdukHukum() {
    const { data, error } = await supabase
      .from('produk_hukum')
      .select('*')
      .order('tanggal_publikasi', { ascending: false });
    
    if (data) setProduk(data);
    setLoading(false);
  }

  async function hapusProduk(id: string) {
    if (confirm('Yakin ingin menghapus produk hukum ini?')) {
      await supabase.from('produk_hukum').delete().eq('id', id);
      fetchProdukHukum();
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Produk Hukum</h1>
          <p className="text-slate-500 mt-1">Kelola arsip produk hukum dan dokumen PDF.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/produk-hukum/tambah" className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-bold shadow-lg transition-all active:scale-95">
            <i className="fas fa-plus"></i>
            <span>Tambah Produk Hukum</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="text-center text-slate-500 py-12 font-medium italic">Memuat data...</div>
        ) : produk.length === 0 ? (
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-700 uppercase">
                   <tr>
                      <th className="px-6 py-4 font-black tracking-widest">Dokumen <span className="text-slate-300 ml-1">◆</span></th>
                      <th className="px-6 py-4 font-black tracking-widest">Judul <span className="text-blue-500 ml-1">▲</span></th>
                      <th className="px-6 py-4 font-black tracking-widest">Kategori <span className="text-slate-300 ml-1">◆</span></th>
                      <th className="px-6 py-4 font-black tracking-widest">Nomor/Tahun <span className="text-slate-300 ml-1">◆</span></th>
                      <th className="px-6 py-4 font-black tracking-widest text-right">Aksi</th>
                   </tr>
                </thead>
             </table>
             <div className="p-12 text-center text-slate-400 font-medium italic">Belum ada produk hukum.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-700 uppercase">
                <tr>
                  <th className="px-6 py-4 font-black tracking-widest">Dokumen <span className="text-slate-300 ml-1">◆</span></th>
                  <th className="px-6 py-4 font-black tracking-widest">Judul <span className="text-blue-500 ml-1">▲</span></th>
                  <th className="px-6 py-4 font-black tracking-widest">Kategori <span className="text-slate-300 ml-1">◆</span></th>
                  <th className="px-6 py-4 font-black tracking-widest">Nomor/Tahun <span className="text-slate-300 ml-1">◆</span></th>
                  <th className="px-6 py-4 font-black tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {produk.map((item) => (
                  <tr key={item.id} className="bg-white hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-500">
                      {item.file_url ? (
                        <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-700 flex items-center gap-2 font-bold">
                          <i className="fas fa-file-pdf"></i> PDF
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">Tidak ada file</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">{item.judul}</td>
                    <td className="px-6 py-4 font-medium text-slate-500">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold">{item.kategori}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-500">{item.nomor_surat} / {item.tahun}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Link 
                          href={`/admin/produk-hukum/edit/${item.id}`}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button 
                          onClick={() => hapusProduk(item.id)}
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
  );
}
