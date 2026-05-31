'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

export default function EditHalaman() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    judul: '',
    slug: '',
    konten: ''
  });

  useEffect(() => {
    async function fetchData() {
      if (params.id) {
        const { data } = await supabase.from('halaman').select('*').eq('id', params.id).single();
        if (data) {
          setFormData({
            judul: data.judul,
            slug: data.slug,
            konten: data.konten
          });
        }
      }
      setFetching(false);
    }
    fetchData();
  }, [params.id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    // We don't auto-generate slug on edit unless user explicitly edits the slug field
    setFormData({ ...formData, [name]: value });
  };

  const handleSlugBlur = () => {
    if (!formData.slug && formData.judul) {
      setFormData({ ...formData, slug: generateSlug(formData.judul) });
    } else if (formData.slug) {
      setFormData({ ...formData, slug: generateSlug(formData.slug) }); // Clean up the manual input
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

    // Check if slug is used by ANOTHER page
    const { data: existing } = await supabase
      .from('halaman')
      .select('id')
      .eq('slug', submitData.slug)
      .neq('id', params.id)
      .single();
    
    if (existing) {
      alert('URL / Slug ini sudah digunakan oleh halaman lain. Silakan ubah URL secara manual.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('halaman').update(submitData).eq('id', params.id);
    setLoading(false);

    if (error) {
      alert('Gagal memperbarui halaman: ' + error.message);
    } else {
      router.push('/admin/halaman');
      router.refresh();
    }
  };

  if (fetching) return <div className="p-8 text-center text-gray-500">Memuat data halaman...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/halaman" className="text-gray-500 hover:text-green-700 transition">
          <i className="fas fa-arrow-left"></i>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Halaman</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Halaman</label>
            <input 
              type="text" name="judul" required 
              value={formData.judul} onChange={handleChange}
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
                value={formData.slug} onChange={handleChange} onBlur={handleSlugBlur}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm" 
              />
            </div>
            <p className="text-xs text-orange-500 mt-1"><i className="fas fa-exclamation-triangle"></i> Peringatan: Mengubah URL bisa membuat link yang sudah disebarkan menjadi rusak.</p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Isi Konten Halaman</label>
            <p className="text-xs text-gray-500 mb-2">Anda bisa menggunakan tag HTML dasar seperti &lt;h2&gt;, &lt;b&gt;, &lt;br&gt;, &lt;p&gt; untuk merapikan tulisan.</p>
            <textarea 
              name="konten" required rows={15}
              value={formData.konten} onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-y" 
            ></textarea>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button 
              type="submit" disabled={loading}
              className="bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-bold py-2 px-8 rounded-lg transition shadow-sm"
            >
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
