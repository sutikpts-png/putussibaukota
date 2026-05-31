'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminPotensi() {
  const [potensi, setPotensi] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPotensi();
  }, []);

  async function fetchPotensi() {
    const { data, error } = await supabase
      .from('potensi')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (data) setPotensi(data);
    setLoading(false);
  }

  async function hapusPotensi(id: string) {
    if (confirm('Yakin ingin menghapus potensi ini?')) {
      await supabase.from('potensi').delete().eq('id', id);
      fetchPotensi();
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Potensi</h1>
        <Link href="/admin/potensi/tambah" className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
          <i className="fas fa-plus mr-2"></i> Tambah Potensi
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat data...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="p-4 font-semibold">Nama Potensi</th>
                <th className="p-4 font-semibold">Deskripsi Singkat</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {potensi.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">Belum ada potensi terdaftar.</td>
                </tr>
              ) : (
                potensi.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 text-sm font-medium text-gray-900">{item.nama_potensi}</td>
                    <td className="p-4 text-sm text-gray-500 truncate max-w-xs">{item.deskripsi.substring(0, 50)}...</td>
                    <td className="p-4 text-right">
                      <button onClick={() => hapusPotensi(item.id)} className="text-red-500 hover:text-red-700 p-2">
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
