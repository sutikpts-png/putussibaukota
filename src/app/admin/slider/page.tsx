'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function PengaturanSlider() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [newHeroFiles, setNewHeroFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchSlider();
  }, []);

  async function fetchSlider() {
    const { data, error } = await supabase
      .from('pengaturan_web')
      .select('hero_image_url')
      .eq('id', 1)
      .single();
    
    if (data) {
      if (data.hero_image_url) {
        try {
          const parsed = JSON.parse(data.hero_image_url);
          if (Array.isArray(parsed)) {
            setHeroImages(parsed);
          } else if (typeof parsed === 'string') {
            setHeroImages([parsed]);
          }
        } catch (e) {
          setHeroImages([data.hero_image_url]);
        }
      }
    } else {
      console.error("Error fetching slider:", error);
    }
    setFetching(false);
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    let finalHeroImages = [...heroImages];

    // Upload New Hero Images
    if (newHeroFiles.length > 0) {
      for (const file of newHeroFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `hero-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('gambar').upload(fileName, file);

        if (uploadError) {
          alert('Gagal mengupload gambar hero: ' + uploadError.message);
          setLoading(false);
          return;
        }

        const { data } = supabase.storage.from('gambar').getPublicUrl(fileName);
        finalHeroImages.push(data.publicUrl);
      }
    }

    const { error } = await supabase
      .from('pengaturan_web')
      .update({ hero_image_url: JSON.stringify(finalHeroImages) })
      .eq('id', 1);

    setLoading(false);

    if (error) {
      alert('Gagal menyimpan pengaturan slider: ' + error.message);
    } else {
      alert('Slider berhasil disimpan!');
      setNewHeroFiles([]);
      fetchSlider(); // Refresh data to show new image URL if changed
    }
  };

  if (fetching) {
    return <div className="p-8 text-center text-gray-500">Memuat data slider...</div>;
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pengelolaan Slider / Banner Utama</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">Background Image Hero (Slider)</label>
          
          {/* Existing Images */}
          {heroImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              {heroImages.map((img, idx) => (
                <div key={idx} className="relative group rounded overflow-hidden shadow-sm aspect-video">
                  <img src={img} alt="Hero Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => setHeroImages(heroImages.filter((_, i) => i !== idx))}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md"
                    title="Hapus Gambar"
                  >
                    <i className="fas fa-trash-alt text-xs"></i>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* New Files Preview */}
          {newHeroFiles.length > 0 && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm">
              <p className="font-semibold mb-3 text-blue-800"><i className="fas fa-file-upload mr-2"></i>Gambar baru yang akan ditambahkan:</p>
              <ul className="space-y-2">
                {newHeroFiles.map((file, idx) => (
                   <li key={idx} className="flex justify-between items-center text-blue-900 bg-white px-4 py-2 rounded-lg shadow-sm">
                     <span className="truncate pr-4 font-medium">{file.name}</span>
                     <button type="button" className="text-red-500 hover:text-red-700 text-xs font-bold" onClick={() => setNewHeroFiles(newHeroFiles.filter((_, i) => i !== idx))}>
                       Batal
                     </button>
                   </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-green-50 hover:border-green-400 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={(e) => { 
                if (e.target.files) {
                  setNewHeroFiles([...newHeroFiles, ...Array.from(e.target.files)]);
                }
                e.target.value = '';
              }} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            />
            <div className="pointer-events-none">
              <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
              <p className="font-semibold text-gray-700">Klik atau seret file gambar ke sini</p>
              <p className="text-xs text-gray-500 mt-2">Pilih beberapa gambar sekaligus untuk membuat efek slider yang berganti otomatis di halaman utama.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-100 mt-6">
          <button type="submit" disabled={loading} className="bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition">
            {loading ? 'Menyimpan...' : 'Simpan Slider'}
          </button>
        </div>
      </form>
    </div>
  );
}
