'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import RichTextEditor from '@/components/RichTextEditor';

export default function TambahAgenda() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    judul: '',
    tanggal: '',
    waktu: '',
    lokasi: '',
    keterangan: '',
    arsip_url: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let finalArsipUrl = formData.arsip_url;

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('arsip')
        .upload(fileName, file);

      if (uploadError) {
        alert('Gagal mengupload arsip: ' + uploadError.message + '\n\nPastikan bucket "arsip" sudah dibuat dan public di Supabase!');
        setLoading(false);
        return;
      }

      const { data } = supabase.storage.from('arsip').getPublicUrl(fileName);
      finalArsipUrl = data.publicUrl;
    }

    const payload = { ...formData, arsip_url: finalArsipUrl };

    const { error } = await supabase.from('agenda').insert([payload]);

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
              <label className="text-sm font-bold text-slate-700">Upload Data Dukung / Arsip (Opsional)</label>
              <input 
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setFile(e.target.files[0]);
                  } else {
                    setFile(null);
                  }
                }}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100" 
              />
              <p className="text-xs text-slate-500">Unggah file PDF, Word, Excel, atau gambar sebagai arsip kegiatan.</p>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-700">Keterangan Tambahan</label>
              <RichTextEditor 
                value={formData.keterangan} 
                onChange={(val) => setFormData({ ...formData, keterangan: val })} 
                placeholder="Informasi tambahan mengenai agenda..."
              />
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
