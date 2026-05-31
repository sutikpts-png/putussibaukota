'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// Helper to generate slug from title
const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-');     // Replace multiple - with single -
};

export default function TambahHalaman() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    judul: '',
    slug: '',
    konten: ''
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === 'judul') {
      setFormData({
        ...formData,
        judul: value,
        slug: generateSlug(value) // Auto generate slug when title changes
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const submitData = {
      judul: formData.judul,
      slug: formData.slug || generateSlug(formData.judul),
      konten: formData.konten
    };

    // Check if slug already exists
    const { data: existing } = await supabase.from('halaman').select('id').eq('slug', submitData.slug).single();
    
    if (existing) {
      alert('URL / Slug ini sudah digunakan oleh halaman lain. Silakan ubah judul atau ubah URL secara manual.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('halaman').insert([submitData]);
    setLoading(false);

    if (error) {
      alert('Gagal menambah halaman: ' + error.message);
    } else {
      router.push('/admin/halaman');
      router.refresh();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/halaman" className="text-gray-500 hover:text-green-700 transition">
          <i className="fas fa-arrow-left"></i>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Buat Halaman Baru</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Halaman</label>
            <input 
              type="text" name="judul" required 
              value={formData.judul} onChange={handleChange}
              placeholder="Contoh: Sejarah Kelurahan"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-lg font-semibold" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">URL (Slug)</label>
            <div className="flex items-center">
              <span className="bg-gray-100 border border-gray-300 border-r-0 px-4 py-2 rounded-l-lg text-gray-500 font-mono text-sm">
                /page/
              </span>
              <input 
                type="text" name="slug" required 
                value={formData.slug} onChange={handleChange}
                placeholder="sejarah-kelurahan"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm" 
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Dibuat otomatis dari judul, tapi Anda bisa mengubahnya jika mau.</p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Isi Konten Halaman</label>
            <p className="text-xs text-gray-500 mb-2">Anda bisa menggunakan tag HTML dasar seperti &lt;h2&gt;, &lt;b&gt;, &lt;br&gt;, &lt;p&gt; untuk merapikan tulisan.</p>
            <textarea 
              name="konten" required rows={15}
              value={formData.konten} onChange={handleChange}
              placeholder="Tuliskan isi halaman Anda di sini..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-y" 
            ></textarea>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button 
              type="submit" disabled={loading}
              className="bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-bold py-2 px-8 rounded-lg transition shadow-sm"
            >
              {loading ? 'Menyimpan...' : 'Terbitkan Halaman'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
