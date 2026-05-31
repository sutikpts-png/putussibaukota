'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminHalaman() {
  const [halaman, setHalaman] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHalaman();
  }, []);

  async function fetchHalaman() {
    const { data } = await supabase.from('halaman').select('*').order('created_at', { ascending: false });
    if (data) setHalaman(data);
    setLoading(false);
  }

  async function hapusHalaman(id: string) {
    if (confirm('Yakin ingin menghapus halaman ini? URL yang terhubung ke halaman ini akan rusak (mati).')) {
      await supabase.from('halaman').delete().eq('id', id);
      fetchHalaman();
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Halaman Web</h1>
        <Link href="/admin/halaman/tambah" className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
          <i className="fas fa-plus mr-2"></i> Buat Halaman Baru
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="text-center text-gray-500 py-8">Memuat data...</div>
        ) : halaman.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Belum ada halaman yang dibuat.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="p-4 font-semibold">Judul Halaman</th>
                <th className="p-4 font-semibold hidden md:table-cell">URL / Slug</th>
                <th className="p-4 font-semibold">Dibuat Pada</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {halaman.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <p className="font-bold text-gray-900">{item.judul}</p>
                    <p className="text-xs text-gray-500 md:hidden mt-1 font-mono">/page/{item.slug}</p>
                  </td>
                  <td className="p-4 hidden md:table-cell text-sm text-gray-600 font-mono">
                    <a href={`/page/${item.slug}`} target="_blank" className="hover:text-green-600 hover:underline">/page/{item.slug}</a>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(item.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <a href={`/page/${item.slug}`} target="_blank" className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1 rounded text-sm transition">
                        <i className="fas fa-eye"></i>
                      </a>
                      <Link href={`/admin/halaman/edit/${item.id}`} className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-1 rounded text-sm transition">
                        <i className="fas fa-edit"></i>
                      </Link>
                      <button onClick={() => hapusHalaman(item.id)} className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded text-sm transition">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
