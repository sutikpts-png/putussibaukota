'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function PengaturanWeb() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [tautanCepat, setTautanCepat] = useState<{judul: string, url: string}[]>([]);
  const [formData, setFormData] = useState({
    telepon: '',
    email: '',
    nama_kelurahan: '',
    nama_kecamatan_kabupaten: '',
    logo_url: '',
    hero_title: '',
    hero_subtitle: '',
    hero_image_url: '',
    alamat: '',
    jam_operasional: '',
    link_facebook: '',
    link_instagram: '',
    link_youtube: '',
    link_gmaps: '',
    gmaps_iframe: '',
    stat_penduduk: '',
    stat_kk: '',
    stat_dusun: '',
    stat_luas: '',
    tema_warna: 'original'
  });

  useEffect(() => {
    fetchPengaturan();
  }, []);

  async function fetchPengaturan() {
    const { data, error } = await supabase
      .from('pengaturan_web')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (data) {
      setFormData({ ...data, tema_warna: data.tema_warna || 'original' });
      
      // Parse hero images array
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
      
      setFormData({ ...data, tema_warna: data.tema_warna || 'original' });

      if (data.tautan_cepat) {
        setTautanCepat(typeof data.tautan_cepat === 'string' ? JSON.parse(data.tautan_cepat) : data.tautan_cepat);
      } else {
        setTautanCepat([
          { judul: 'Beranda', url: '/' },
          { judul: 'Profil Kelurahan', url: '/profil' },
          { judul: 'Berita', url: '/berita' },
          { judul: 'Layanan', url: '/layanan' },
          { judul: 'Potensi Desa', url: '/potensi' },
          { judul: 'Galeri', url: '/galeri' },
          { judul: 'Hubungi Kami', url: '/kontak' },
          { judul: 'Pemkab Sleman', url: '#' }
        ]);
      }
    } else {
      console.error("Error fetching pengaturan:", error);
    }
    setFetching(false);
  }

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    let finalLogoUrl = formData.logo_url;
    let finalHeroImages = [...heroImages];

    // Upload Logo Image
    if (logoFile) {
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `logo-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('gambar')
        .upload(fileName, logoFile);

      if (uploadError) {
        alert('Gagal mengupload gambar logo: ' + uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage.from('gambar').getPublicUrl(fileName);
      finalLogoUrl = data.publicUrl;
    }

    const payload = { ...formData, hero_image_url: JSON.stringify(finalHeroImages), logo_url: finalLogoUrl, tautan_cepat: tautanCepat };
    
    const { error } = await supabase
      .from('pengaturan_web')
      .update(payload)
      .eq('id', 1);

    setLoading(false);

    if (error) {
      alert('Gagal menyimpan pengaturan: ' + error.message);
    } else {
      alert('Pengaturan berhasil disimpan!');
      fetchPengaturan(); // Refresh data to show new image URL if changed
    }
  };

  if (fetching) {
    return <div className="p-8 text-center text-gray-500">Memuat data pengaturan...</div>;
  }

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pengaturan Website</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* HEADER & KONTAK UMUM */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-green-800 mb-4 border-b pb-2">Header & Identitas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Kelurahan</label>
              <input type="text" name="nama_kelurahan" required value={formData.nama_kelurahan} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Kecamatan & Kabupaten</label>
              <input type="text" name="nama_kecamatan_kabupaten" required value={formData.nama_kecamatan_kabupaten} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor Telepon</label>
              <input type="text" name="telepon" required value={formData.telepon} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tema Warna Website</label>
              <select name="tema_warna" value={formData.tema_warna} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
                <option value="original">Original (Hijau)</option>
                <option value="maroon">Merah Marun Gradiasi</option>
                <option value="navy">Biru Dongker Gradiasi</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Pilih tema warna utama yang akan diterapkan pada seluruh halaman website.</p>
            </div>
          </div>
          
          <div className="mt-5 border-t border-gray-100 pt-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Logo Website (Format PNG Transparan Disarankan)</label>
            {formData.logo_url && (
              <div className="mb-2">
                <img src={formData.logo_url} alt="Logo Preview" className="h-16 w-auto object-contain bg-gray-100 rounded border p-1" />
              </div>
            )}
            <input type="file" accept="image/*" onChange={(e) => { if (e.target.files) setLogoFile(e.target.files[0]); else setLogoFile(null); }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
            <p className="text-xs text-gray-500 mt-1">Biarkan kosong jika tidak ingin mengubah logo saat ini.</p>
          </div>
        </div>
        {/* DATA STATISTIK KELURAHAN */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-green-800 mb-4 border-b pb-2">Data Statistik Kelurahan (Untuk Halaman Utama)</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Jumlah Penduduk</label>
              <input type="text" name="stat_penduduk" value={formData.stat_penduduk} onChange={handleChange} placeholder="Contoh: 12.450" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Kepala Keluarga</label>
              <input type="text" name="stat_kk" value={formData.stat_kk} onChange={handleChange} placeholder="Contoh: 3.820" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Dusun / RW</label>
              <input type="text" name="stat_dusun" value={formData.stat_dusun} onChange={handleChange} placeholder="Contoh: 12" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Luas Wilayah</label>
              <input type="text" name="stat_luas" value={formData.stat_luas} onChange={handleChange} placeholder="Contoh: 8,4 km²" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
          </div>
        </div>

        {/* HERO BANNER */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-green-800 mb-4 border-b pb-2">Hero Banner (Halaman Utama)</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Hero (Mendukung HTML dasar seperti &lt;br/&gt; atau &lt;span&gt;)</label>
              <textarea name="hero_title" required rows={2} value={formData.hero_title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm"></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Sub-judul Hero</label>
              <textarea name="hero_subtitle" required rows={2} value={formData.hero_subtitle} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"></textarea>
            </div>
            {/* Background Image Hero dipindah ke menu Content -> Slider Banner */}
          </div>
        </div>

        {/* FOOTER & SOSMED */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-green-800 mb-4 border-b pb-2">Footer & Media Sosial</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Alamat Lengkap</label>
              <textarea name="alamat" required rows={2} value={formData.alamat} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Jam Operasional</label>
              <input type="text" name="jam_operasional" required value={formData.jam_operasional} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Link Facebook</label>
              <input type="text" name="link_facebook" value={formData.link_facebook} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Link Instagram</label>
              <input type="text" name="link_instagram" value={formData.link_instagram} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Link YouTube</label>
              <input type="text" name="link_youtube" value={formData.link_youtube} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
          </div>
          
          <div className="space-y-5 border-t pt-5 border-gray-100">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">URL Google Maps (Opsional)</label>
              <input type="text" name="link_gmaps" value={formData.link_gmaps} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Iframe URL Google Maps (Untuk Footer)</label>
              <p className="text-xs text-gray-500 mb-2">Buka Google Maps &gt; Cari Lokasi &gt; Bagikan &gt; Sematkan Peta &gt; Salin HTML. Paste di sini.</p>
              <input type="text" name="gmaps_iframe" required value={formData.gmaps_iframe} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm" />
              <p className="text-xs text-gray-500 mt-1">Copy isi dari atribut src="..." saat Anda meng-embed Google Maps.</p>
            </div>
          </div>
        </div>

        {/* TAUTAN CEPAT */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h2 className="text-lg font-bold text-green-800">Tautan Cepat (Footer)</h2>
            <button type="button" onClick={() => setTautanCepat([...tautanCepat, { judul: '', url: '' }])} className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded text-sm font-semibold transition">
              + Tambah Tautan
            </button>
          </div>
          <div className="space-y-3">
            {tautanCepat.map((tautan, index) => (
              <div key={index} className="flex gap-3 items-center">
                <input 
                  type="text" 
                  placeholder="Judul Tautan (misal: Beranda)" 
                  value={tautan.judul}
                  onChange={(e) => {
                    const newTautan = [...tautanCepat];
                    newTautan[index].judul = e.target.value;
                    setTautanCepat(newTautan);
                  }}
                  required
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                />
                <input 
                  type="text" 
                  placeholder="URL (misal: /profil atau https://...)" 
                  value={tautan.url}
                  onChange={(e) => {
                    const newTautan = [...tautanCepat];
                    newTautan[index].url = e.target.value;
                    setTautanCepat(newTautan);
                  }}
                  required
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                />
                <button 
                  type="button" 
                  onClick={() => {
                    const newTautan = [...tautanCepat];
                    newTautan.splice(index, 1);
                    setTautanCepat(newTautan);
                  }}
                  className="bg-red-50 text-red-500 hover:bg-red-100 w-10 h-10 rounded-lg flex items-center justify-center transition"
                  title="Hapus Tautan"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
            {tautanCepat.length === 0 && (
              <p className="text-sm text-gray-500 italic text-center py-4">Belum ada tautan cepat. Klik "+ Tambah Tautan" untuk menambahkan.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition">
            {loading ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}
          </button>
        </div>
      </form>
    </div>
  );
}
