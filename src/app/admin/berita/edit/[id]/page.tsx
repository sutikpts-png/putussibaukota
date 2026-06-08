'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import RichTextEditor from '@/components/RichTextEditor';

export default function EditBerita() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    judul: '',
    kategori: 'Kegiatan',
    konten: '',
    gambar_url: ''
  });

  useEffect(() => {
    if (id) fetchBerita(id as string);
  }, [id]);

  async function fetchBerita(id: string) {
    const { data, error } = await supabase.from('berita').select('*').eq('id', id).single();
    if (data) {
      setFormData({
        judul: data.judul,
        kategori: data.kategori,
        konten: data.konten,
        gambar_url: data.gambar_url || ''
      });
    }
    setFetching(false);
  }

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    const slug = formData.judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let finalGambarUrl = formData.gambar_url;

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('gambar').upload(fileName, file);

      if (uploadError) {
        alert('Gagal mengupload gambar: ' + uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage.from('gambar').getPublicUrl(fileName);
      finalGambarUrl = data.publicUrl;
    }

    const { error } = await supabase.from('berita').update({ ...formData, slug, gambar_url: finalGambarUrl }).eq('id', id);
    setLoading(false);

    if (error) {
      alert('Gagal memperbarui berita: ' + error.message);
    } else {
      router.push('/admin/berita');
      router.refresh();
    }
  };

  if (fetching) return <div className="p-8 text-center">Memuat data...</div>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/berita" className="text-gray-500 hover:text-green-700">
          <i className="fas fa-arrow-left"></i>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Berita</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Berita</label>
            <input 
              type="text" name="judul" required 
              value={formData.judul} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori</label>
            <select 
              name="kategori" required 
              value={formData.kategori} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="Kegiatan">Kegiatan</option>
              <option value="Pengumuman">Pengumuman</option>
              <option value="Infrastruktur">Infrastruktur</option>
              <option value="Sosial">Sosial</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Gambar (Opsional, biarkan kosong jika tidak diubah)</label>
            {formData.gambar_url && (
              <div className="mb-2">
                <img src={formData.gambar_url} alt="Preview" className="h-20 rounded border object-cover" />
              </div>
            )}
            <input 
              type="file" accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) setFile(e.target.files[0]);
                else setFile(null);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Konten Berita</label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <RichTextEditor 
                value={formData.konten} 
                onChange={(val) => setFormData({ ...formData, konten: val })}
                placeholder="Tulis konten berita di sini..."
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button 
              type="submit" disabled={loading}
              className="bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
