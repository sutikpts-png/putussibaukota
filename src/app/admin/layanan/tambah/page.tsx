'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function TambahLayanan() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama_layanan: '',
    deskripsi: '',
    persyaratan: '',
    ikon_url: ''
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('layanan').insert([{ ...formData }]);
    setLoading(false);

    if (error) {
      alert('Gagal menambah layanan: ' + error.message);
    } else {
      router.push('/admin/layanan');
      router.refresh();
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/layanan" className="text-gray-500 hover:text-green-700">
          <i className="fas fa-arrow-left"></i>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Tambah Layanan Baru</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Layanan *</label>
            <input 
              type="text" name="nama_layanan" required 
              value={formData.nama_layanan} onChange={handleChange}
              placeholder="Contoh: Surat Pengantar KTP"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">URL Ikon (Opsional)</label>
            <input 
              type="url" name="ikon_url" 
              value={formData.ikon_url} onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi Singkat</label>
            <textarea 
              name="deskripsi" required rows={2}
              value={formData.deskripsi} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none" 
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Persyaratan (Gunakan tag HTML dasar untuk list)</label>
            <textarea 
              name="persyaratan" rows={6}
              value={formData.persyaratan} onChange={handleChange}
              placeholder="<ul><li>Fotokopi KK</li><li>Surat Pengantar RT/RW</li></ul>"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm" 
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">Gunakan &lt;ul&gt; dan &lt;li&gt; untuk format daftar persyaratan.</p>
          </div>
          <div className="flex justify-end pt-4">
            <button 
              type="submit" disabled={loading}
              className="bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              {loading ? 'Menyimpan...' : 'Simpan Layanan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
