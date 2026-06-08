'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function EditGaleri() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    judul: '',
    kategori: 'Foto',
    deskripsi: '',
    gambar_url: ''
  });

  useEffect(() => {
    if (id) fetchGaleri(id as string);
  }, [id]);

  async function fetchGaleri(id: string) {
    const { data, error } = await supabase.from('galeri').select('*').eq('id', id).single();
    if (data) {
      setFormData({
        judul: data.judul,
        kategori: data.kategori,
        deskripsi: data.deskripsi || '',
        gambar_url: data.gambar_url
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

    let finalGambarUrl = formData.gambar_url;

    if (formData.kategori === 'Foto') {
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('gambar').upload(fileName, file);

        if (uploadError) {
          alert('Gagal mengupload file: ' + uploadError.message);
          setLoading(false);
          return;
        }

        const { data } = supabase.storage.from('gambar').getPublicUrl(fileName);
        finalGambarUrl = data.publicUrl;
      }
    } else {
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('gambar').upload(fileName, file);

        if (uploadError) {
          alert('Gagal mengupload file video: ' + uploadError.message);
          setLoading(false);
          return;
        }

        const { data } = supabase.storage.from('gambar').getPublicUrl(fileName);
        finalGambarUrl = data.publicUrl;
      }
      if (!finalGambarUrl) {
        alert('File Video ATAU URL YouTube wajib ada!');
        setLoading(false);
        return;
      }
    }

    if (!finalGambarUrl && formData.kategori === 'Foto') {
      alert('File Media wajib ada!');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('galeri').update({ ...formData, gambar_url: finalGambarUrl }).eq('id', id);
    setLoading(false);

    if (error) {
      alert('Gagal memperbarui galeri: ' + error.message);
    } else {
      router.push('/admin/galeri');
      router.refresh();
    }
  };

  if (fetching) return <div className="p-8 text-center">Memuat data...</div>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/galeri" className="text-gray-500 hover:text-green-700">
          <i className="fas fa-arrow-left"></i>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Media Galeri</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Media</label>
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
              <option value="Foto">Foto</option>
              <option value="Video">Video</option>
            </select>
          </div>
          {formData.kategori === 'Foto' ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">File Foto (Biarkan kosong jika tidak diubah)</label>
              {formData.gambar_url && formData.kategori === 'Foto' && (
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
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">File Video (Opsional, biarkan kosong jika tidak diubah atau menggunakan URL)</label>
                {formData.gambar_url && formData.kategori === 'Video' && formData.gambar_url.match(/\.(mp4|webm|ogg)$/i) && (
                  <div className="mb-2">
                    <video src={formData.gambar_url} controls className="h-32 rounded border bg-black"></video>
                  </div>
                )}
                <input 
                  type="file" accept="video/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) setFile(e.target.files[0]);
                    else setFile(null);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" 
                />
              </div>
              <div className="text-center text-sm font-bold text-gray-500">ATAU</div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">URL YouTube (Opsional, hapus jika menggunakan file Video)</label>
                <input 
                  type="url" name="gambar_url"
                  value={formData.gambar_url} onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                />
                {formData.gambar_url && (formData.gambar_url.includes('youtube.com') || formData.gambar_url.includes('youtu.be')) && (
                  <div className="mt-2">
                    <iframe 
                      className="w-full aspect-video rounded border" 
                      src={formData.gambar_url.includes('youtu.be') ? formData.gambar_url.replace('youtu.be/', 'youtube.com/embed/') : formData.gambar_url.replace('watch?v=', 'embed/')} 
                      allowFullScreen>
                    </iframe>
                  </div>
                )}
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi Singkat</label>
            <textarea 
              name="deskripsi" rows={3}
              value={formData.deskripsi} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none" 
            ></textarea>
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
