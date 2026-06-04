'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function EditSlider({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    is_active: true,
    urutan: 0,
    image_url: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data, error } = await supabase
      .from('slider_banner')
      .select('*')
      .eq('id', params.id)
      .single();
      
    if (data) {
      setFormData({
        judul: data.judul || '',
        deskripsi: data.deskripsi || '',
        is_active: data.is_active,
        urutan: data.urutan,
        image_url: data.image_url
      });
      setPreview(data.image_url);
    } else {
      alert('Slide tidak ditemukan!');
      router.push('/admin/slider');
    }
    setFetching(false);
  }

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = formData.image_url;

      // 1. Upload File if new file selected
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `slider-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('gambar').upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('gambar').getPublicUrl(fileName);
        finalImageUrl = urlData.publicUrl;
      }

      // 2. Update database
      const { error: dbError } = await supabase
        .from('slider_banner')
        .update({
          judul: formData.judul,
          deskripsi: formData.deskripsi,
          is_active: formData.is_active,
          urutan: parseInt(formData.urutan.toString()),
          image_url: finalImageUrl
        })
        .eq('id', params.id);

      if (dbError) throw dbError;

      alert('Slide berhasil diperbarui!');
      router.push('/admin/slider');
    } catch (error: any) {
      alert('Terjadi kesalahan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-8 text-center text-gray-500">Memuat data slide...</div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/slider" className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-green-600 transition shadow-sm">
          <i className="fas fa-arrow-left"></i>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Slide</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Background Image</label>
          {preview && (
            <div className="mb-4">
              <img src={preview} alt="Preview" className="w-full max-w-md h-auto rounded border shadow-sm aspect-video object-cover" />
            </div>
          )}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" 
          />
          <p className="text-xs text-gray-500 mt-1">Biarkan kosong jika tidak ingin mengubah gambar.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Judul (Text Atas)</label>
          <input 
            type="text" 
            name="judul" 
            value={formData.judul} 
            onChange={handleChange} 
            placeholder="Mendukung tag HTML sederhana seperti <br/>"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi (Text Bawah)</label>
          <textarea 
            name="deskripsi" 
            rows={3}
            value={formData.deskripsi} 
            onChange={handleChange} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Urutan Tampil <span className="text-red-500">*</span></label>
            <input 
              type="number" 
              name="urutan" 
              required
              value={formData.urutan} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
            />
            <p className="text-xs text-gray-500 mt-1">Angka lebih kecil tampil lebih dulu (0, 1, 2, dst).</p>
          </div>

          <div className="flex items-center mt-6">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  name="is_active" 
                  checked={formData.is_active} 
                  onChange={handleChange} 
                  className="sr-only" 
                />
                <div className={`block w-14 h-8 rounded-full transition ${formData.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${formData.is_active ? 'translate-x-6' : ''}`}></div>
              </div>
              <div className="ml-3 text-sm font-semibold text-gray-700">
                Status Aktif
              </div>
            </label>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
          <Link href="/admin/slider" className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition">
            Batal
          </Link>
          <button type="submit" disabled={loading} className="bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-bold py-2 px-8 rounded-lg shadow-sm transition">
            {loading ? 'Memperbarui...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}
