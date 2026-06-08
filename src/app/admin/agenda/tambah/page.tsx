'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function TambahAgenda() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    judul: '',
    tanggal: '',
    waktu: '',
    lokasi: '',
    keterangan: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('agenda').insert([formData]);

    setLoading(false);

    if (error) {
      alert('Gagal menyimpan data: ' + error.message);
    } else {
      router.push('/admin/agenda');
      router.refresh();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-4">
        <Link href="/admin/agenda" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 shadow-sm border border-slate-200 transition-all">
          <i className="fas fa-arrow-left"></i>
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-900">Tambah Agenda</h1>
          <p className="text-slate-500 mt-1">Buat jadwal kegiatan baru pimpinan kelurahan.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-700">Judul Kegiatan <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="judul" 
                required 
                value={formData.judul} 
                onChange={handleChange}
                placeholder="Contoh: Rapat Koordinasi Musrenbang"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Tanggal <span className="text-red-500">*</span></label>
              <input 
                type="date" 
                name="tanggal" 
                required 
                value={formData.tanggal} 
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Waktu</label>
              <input 
                type="text" 
                name="waktu" 
                value={formData.waktu} 
                onChange={handleChange}
                placeholder="Contoh: 09:00 WIB - Selesai"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-700">Lokasi</label>
              <input 
                type="text" 
                name="lokasi" 
                value={formData.lokasi} 
                onChange={handleChange}
                placeholder="Contoh: Aula Kelurahan Putussibau Kota"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-700">Keterangan Tambahan</label>
              <textarea 
                name="keterangan" 
                rows={4}
                value={formData.keterangan} 
                onChange={handleChange}
                placeholder="Informasi tambahan mengenai agenda..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
              ></textarea>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <Link href="/admin/agenda" className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">
              Batal
            </Link>
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <><i className="fas fa-spinner fa-spin"></i> Menyimpan...</>
              ) : (
                <><i className="fas fa-save"></i> Simpan Agenda</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
