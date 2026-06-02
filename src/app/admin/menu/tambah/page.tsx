'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function TambahMenu() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [parentMenus, setParentMenus] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    nama: '',
    link: '',
    parent_id: '',
    urutan: 0
  });

  useEffect(() => {
    async function fetchParentMenus() {
      // Fetch only top-level menus (where parent_id is null)
      const { data } = await supabase.from('menu_navigasi').select('*').is('parent_id', null).order('urutan', { ascending: true });
      if (data) setParentMenus(data);
    }
    fetchParentMenus();
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const submitData = {
      nama: formData.nama,
      link: formData.link,
      parent_id: formData.parent_id === '' ? null : parseInt(formData.parent_id),
      urutan: parseInt(formData.urutan.toString())
    };

    const { error } = await supabase.from('menu_navigasi').insert([submitData]);
    setLoading(false);

    if (error) {
      alert('Gagal menambah menu: ' + error.message);
    } else {
      if (formData.parent_id) {
        router.push('/admin/menu/sub');
      } else {
        router.push('/admin/menu/main');
      }
      router.refresh();
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href={isSubMenu ? "/admin/menu/sub" : "/admin/menu/main"} className="text-gray-500 hover:text-green-700">
          <i className="fas fa-arrow-left"></i>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isSubMenu ? 'Tambah Sub Menu' : 'Tambah Main Menu'}
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Menu</label>
            <input 
              type="text" name="nama" required 
              value={formData.nama} onChange={handleChange}
              placeholder="Contoh: Tentang Kami"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Link URL</label>
            <input 
              type="text" name="link" required 
              value={formData.link} onChange={handleChange}
              placeholder="Contoh: /profil atau https://google.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm" 
            />
            <p className="text-xs text-gray-500 mt-1">Gunakan awalan / untuk link halaman internal (misal: /layanan).</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Jadikan Sub-Menu dari: (Opsional)</label>
            <select 
              name="parent_id" 
              value={formData.parent_id} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">-- Menu Utama (Bukan Sub-Menu) --</option>
              {parentMenus.map((parent) => (
                <option key={parent.id} value={parent.id}>{parent.nama}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Pilih menu induk jika menu ini akan menjadi dropdown.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Urutan</label>
            <input 
              type="number" name="urutan" required min="0"
              value={formData.urutan} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
            />
            <p className="text-xs text-gray-500 mt-1">Angka lebih kecil akan tampil lebih kiri/atas.</p>
          </div>
          
          <div className="flex justify-end pt-4">
            <button 
              type="submit" disabled={loading}
              className="bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              {loading ? 'Menyimpan...' : 'Simpan Menu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
