'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/RichTextEditor';

export default function EditProfil() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    sejarah: '',
    visi: '',
    misi: '',
    wilayah: '',
    struktur_organisasi_url: ''
  });

  useEffect(() => {
    async function fetchProfil() {
      const { data, error } = await supabase.from('profil').select('*').single();
      if (data) {
        setFormData({
          sejarah: data.sejarah || '',
          visi: data.visi || '',
          misi: data.misi || '',
          wilayah: data.wilayah || '',
          struktur_organisasi_url: data.struktur_organisasi_url || ''
        });
      } else if (error && error.code !== 'PGRST116') {
        // Not found error (PGRST116) is fine, it means empty table
        setMessage({ text: 'Gagal mengambil data profil', type: 'error' });
      }
      setLoading(false);
    }
    fetchProfil();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    let finalImageUrl = formData.struktur_organisasi_url;

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `struktur-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('gambar')
        .upload(fileName, imageFile);

      if (uploadError) {
        setMessage({ text: 'Gagal mengupload gambar: ' + uploadError.message, type: 'error' });
        setSaving(false);
        return;
      }

      const { data } = supabase.storage.from('gambar').getPublicUrl(fileName);
      finalImageUrl = data.publicUrl;
    }

    const payload = { ...formData, struktur_organisasi_url: finalImageUrl };

    // Check if row exists
    const { data: existingData } = await supabase.from('profil').select('id').single();

    let result;
    if (existingData) {
      result = await supabase.from('profil').update(payload).eq('id', existingData.id);
    } else {
      result = await supabase.from('profil').insert([payload]);
    }

    if (result.error) {
      setMessage({ text: 'Gagal menyimpan profil: ' + result.error.message, type: 'error' });
      alert('Gagal menyimpan profil!');
    } else {
      setMessage({ text: 'Profil berhasil disimpan!', type: 'success' });
      alert('Data profil berhasil disimpan!');
      router.refresh();
    }
    setSaving(false);
  };

  if (loading) return <div>Memuat data profil...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pengelolaan Profil Kelurahan</h1>
          <p className="text-gray-600 text-sm mt-1">Data ini akan ditampilkan pada Halaman Utama &gt; Profil Kelurahan.</p>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 mb-6 rounded-lg ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Sejarah Kelurahan</label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <RichTextEditor 
                value={formData.sejarah} 
                onChange={(val) => setFormData({ ...formData, sejarah: val })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Visi</label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <RichTextEditor 
                value={formData.visi} 
                onChange={(val) => setFormData({ ...formData, visi: val })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Misi</label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <RichTextEditor 
                value={formData.misi} 
                onChange={(val) => setFormData({ ...formData, misi: val })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Data Batas Wilayah</label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <RichTextEditor 
                value={formData.wilayah} 
                onChange={(val) => setFormData({ ...formData, wilayah: val })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Gambar Struktur Organisasi</label>
            {formData.struktur_organisasi_url && (
              <div className="mb-2">
                <img src={formData.struktur_organisasi_url} alt="Struktur Organisasi" className="max-h-48 rounded border border-gray-200" />
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => {
                if (e.target.files) setImageFile(e.target.files[0]);
                else setImageFile(null);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" 
            />
            <p className="text-xs text-gray-500 mt-2">Pilih gambar dari komputer Anda. Kosongkan jika tidak ingin mengubah gambar yang sudah ada.</p>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button 
              type="submit" 
              disabled={saving}
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Simpan Profil'}
            </button>
            {message.text && (
              <div className={`px-4 py-2 rounded-lg text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {message.text}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
