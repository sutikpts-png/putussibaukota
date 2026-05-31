'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminLayanan() {
  const [layanan, setLayanan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLayanan();
  }, []);

  async function fetchLayanan() {
    const { data, error } = await supabase
      .from('layanan')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (data) setLayanan(data);
    setLoading(false);
  }

  async function hapusLayanan(id: string) {
    if (confirm('Yakin ingin menghapus layanan ini?')) {
      await supabase.from('layanan').delete().eq('id', id);
      fetchLayanan();
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Layanan</h1>
        <Link href="/admin/layanan/tambah" className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
          <i className="fas fa-plus mr-2"></i> Tambah Layanan
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat data...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="p-4 font-semibold">Nama Layanan</th>
                <th className="p-4 font-semibold">Deskripsi Singkat</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {layanan.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">Belum ada layanan.</td>
                </tr>
              ) : (
                layanan.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 text-sm font-medium text-gray-900">{item.nama_layanan}</td>
                    <td className="p-4 text-sm text-gray-500 truncate max-w-xs">{item.deskripsi}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => hapusLayanan(item.id)} className="text-red-500 hover:text-red-700 p-2">
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
