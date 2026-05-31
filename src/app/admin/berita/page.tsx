'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminBerita() {
  const [berita, setBerita] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBerita();
  }, []);

  async function fetchBerita() {
    const { data, error } = await supabase
      .from('berita')
      .select('*')
      .order('tanggal_publikasi', { ascending: false });
    
    if (data) setBerita(data);
    setLoading(false);
  }

  async function hapusBerita(id: string) {
    if (confirm('Yakin ingin menghapus berita ini?')) {
      await supabase.from('berita').delete().eq('id', id);
      fetchBerita();
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Berita</h1>
        <Link href="/admin/berita/tambah" className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
          <i className="fas fa-plus mr-2"></i> Tambah Berita
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat data...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="p-4 font-semibold">Judul</th>
                <th className="p-4 font-semibold">Kategori</th>
                <th className="p-4 font-semibold">Tanggal</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {berita.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">Belum ada berita.</td>
                </tr>
              ) : (
                berita.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 text-sm font-medium text-gray-900">{item.judul}</td>
                    <td className="p-4 text-sm text-gray-500">{item.kategori}</td>
                    <td className="p-4 text-sm text-gray-500">{new Date(item.tanggal_publikasi).toLocaleDateString('id-ID')}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => hapusBerita(item.id)} className="text-red-500 hover:text-red-700 p-2">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
