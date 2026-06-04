'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

export default function PengaturanSlider() {
  const [sliders, setSliders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSliders();
  }, []);

  async function fetchSliders() {
    setLoading(true);
    const { data, error } = await supabase
      .from('slider_banner')
      .select('*')
      .order('urutan', { ascending: true });
    
    if (data) {
      setSliders(data);
    } else {
      console.error("Error fetching sliders:", error);
    }
    setLoading(false);
  }

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus slide ini?')) {
      const { error } = await supabase.from('slider_banner').delete().eq('id', id);
      if (error) {
        alert('Gagal menghapus slide: ' + error.message);
      } else {
        alert('Slide berhasil dihapus!');
        fetchSliders();
      }
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    const { error } = await supabase
      .from('slider_banner')
      .update({ is_active: !currentStatus })
      .eq('id', id);
      
    if (error) {
      alert('Gagal mengubah status: ' + error.message);
    } else {
      fetchSliders();
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pengelolaan Slider / Banner Utama</h1>
        <Link href="/admin/slider/tambah" className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition shadow-sm">
          <i className="fas fa-plus"></i> Tambah Slide
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm">
                <th className="p-4 font-semibold text-gray-600">Background</th>
                <th className="p-4 font-semibold text-gray-600">Text Atas</th>
                <th className="p-4 font-semibold text-gray-600">Text Bawah</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Aktif</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Urutan</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">Memuat data slider...</td>
                </tr>
              ) : sliders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    <i className="fas fa-images text-3xl mb-3 text-gray-300 block"></i>
                    Belum ada data slide. Klik "Tambah Slide" untuk memulai.
                  </td>
                </tr>
              ) : (
                sliders.map((slide) => (
                  <tr key={slide.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="w-32 h-20 relative rounded overflow-hidden shadow-sm bg-gray-100">
                        {slide.image_url ? (
                          <img src={slide.image_url} alt="Slide Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="font-semibold text-sm text-gray-900 line-clamp-2" dangerouslySetInnerHTML={{ __html: slide.judul || '-' }} />
                    </td>
                    <td className="p-4 align-top">
                      <p className="text-sm text-gray-600 line-clamp-2">{slide.deskripsi || '-'}</p>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => toggleStatus(slide.id, slide.is_active)}
                        className={`text-sm font-bold px-3 py-1 rounded-full ${slide.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                      >
                        {slide.is_active ? 'Y' : 'N'}
                      </button>
                    </td>
                    <td className="p-4 text-center font-semibold text-gray-700">
                      {slide.urutan}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/admin/slider/edit/${slide.id}`} className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition" title="Edit">
                          <i className="fas fa-pencil-alt text-xs"></i>
                        </Link>
                        <button onClick={() => handleDelete(slide.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition" title="Hapus">
                          <i className="fas fa-trash-alt text-xs"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
