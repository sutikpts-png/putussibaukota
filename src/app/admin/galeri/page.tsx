'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminGaleri() {
  const [galeri, setGaleri] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGaleri();
  }, []);

  async function fetchGaleri() {
    const { data, error } = await supabase
      .from('galeri')
      .select('*')
      .order('tanggal', { ascending: false });
    
    if (data) setGaleri(data);
    setLoading(false);
  }

  async function hapusGaleri(id: string) {
    if (confirm('Yakin ingin menghapus foto ini?')) {
      await supabase.from('galeri').delete().eq('id', id);
      fetchGaleri();
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Galeri</h1>
        <Link href="/admin/galeri/tambah" className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
          <i className="fas fa-plus mr-2"></i> Tambah Foto
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div className="text-center text-gray-500 py-8">Memuat data...</div>
        ) : galeri.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Belum ada foto di galeri.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galeri.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden group relative">
                <img src={item.gambar_url} alt={item.judul} className="w-full h-40 object-cover" />
                <div className="p-3 bg-white">
                  <p className="text-xs font-bold text-green-700 mb-1">{item.kategori}</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{item.judul}</p>
                </div>
                <button 
                  onClick={() => hapusGaleri(item.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition shadow hover:bg-red-600 flex items-center justify-center"
                >
                  <i className="fas fa-trash text-xs"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
