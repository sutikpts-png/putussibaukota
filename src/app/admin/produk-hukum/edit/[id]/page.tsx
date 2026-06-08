'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function EditProdukHukum() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [existingFileUrl, setExistingFileUrl] = useState('');
  const [formData, setFormData] = useState({
    judul: '',
    kategori: 'Peraturan Kelurahan',
    nomor_surat: '',
    tahun: ''
  });

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  async function fetchData() {
    const { data, error } = await supabase
      .from('produk_hukum')
      .select('*')
      .eq('id', id)
      .single();

    if (data) {
      setFormData({
        judul: data.judul,
        kategori: data.kategori,
        nomor_surat: data.nomor_surat,
        tahun: data.tahun
      });
      setExistingFileUrl(data.file_url || '');
    } else if (error) {
      alert('Data tidak ditemukan!');
      router.push('/admin/produk-hukum');
    }
    setFetching(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let finalFileUrl = existingFileUrl;

    if (file) {
      const fileExt = file.name.split('.').pop();
      if (fileExt?.toLowerCase() !== 'pdf') {
        alert('File harus berupa PDF!');
        setLoading(false);
        return;
      }

      const fileName = `produk-hukum-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('dokumen')
        .upload(fileName, file);

      if (uploadError) {
        alert('Gagal mengupload dokumen: ' + uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage.from('dokumen').getPublicUrl(fileName);
      finalFileUrl = data.publicUrl;
    }

    const { error } = await supabase
      .from('produk_hukum')
      .update({ ...formData, file_url: finalFileUrl })
      .eq('id', id);

    setLoading(false);

    if (error) {
      alert('Gagal memperbarui produk hukum: ' + error.message);
    } else {
      router.push('/admin/produk-hukum');
      router.refresh();
    }
  };

  if (fetching) {
    return <div className="text-center py-12 text-slate-500 italic">Memuat data produk hukum...</div>;
  }

  return (
    <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/produk-hukum" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm border border-slate-200 transition-all hover:scale-105 active:scale-95">
          <i className="fas fa-arrow-left"></i>
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-900">Edit Produk Hukum</h1>
          <p className="text-slate-500 mt-1">Perbarui detail atau ganti dokumen PDF.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2 ml-1">Judul / Nama Produk</label>
            <input 
              type="text" name="judul" required 
              value={formData.judul} onChange={handleChange}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2 ml-1">Kategori</label>
              <select 
                name="kategori" required 
                value={formData.kategori} onChange={handleChange}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700 appearance-none"
              >
                <option value="Peraturan Kelurahan">Peraturan Kelurahan</option>
                <option value="Keputusan Lurah">Keputusan Lurah</option>
                <option value="Surat Edaran">Surat Edaran</option>
                <option value="Instruksi Lurah">Instruksi Lurah</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2 ml-1">Nomor</label>
                  <input 
                    type="text" name="nomor_surat" required
                    value={formData.nomor_surat} onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2 ml-1">Tahun</label>
                  <input 
                    type="text" name="tahun" required
                    value={formData.tahun} onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700" 
                  />
                </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2 ml-1">File Dokumen (PDF)</label>
            {existingFileUrl && !file && (
              <div className="mb-4 p-4 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200">
                <div className="flex items-center gap-3">
                   <i className="fas fa-file-pdf text-2xl text-red-500"></i>
                   <div>
                     <p className="text-sm font-bold text-slate-700">Dokumen Saat Ini</p>
                     <a href={existingFileUrl} target="_blank" className="text-xs font-medium text-blue-500 hover:underline">Lihat PDF</a>
                   </div>
                </div>
              </div>
            )}
            
            <div className="w-full px-6 py-8 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl text-center hover:bg-slate-100 transition-colors relative cursor-pointer">
              <input 
                type="file" accept=".pdf"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="pointer-events-none flex flex-col items-center justify-center space-y-3">
                <i className="fas fa-file-pdf text-4xl text-red-400"></i>
                <span className="font-bold text-slate-600">
                  {file ? file.name : "Klik/Drop untuk GANTI file PDF (opsional)"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button 
              type="submit" disabled={loading}
              className={`bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
