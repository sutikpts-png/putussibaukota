'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function EditMenu() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [parentMenus, setParentMenus] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    nama: '',
    link: '',
    parent_id: '',
    urutan: 0
  });

  useEffect(() => {
    async function fetchData() {
      // Fetch only top-level menus (where parent_id is null) for the dropdown, excluding the current menu itself
      const { data: parentsData } = await supabase
        .from('menu_navigasi')
        .select('*')
        .is('parent_id', null)
        .neq('id', id) // Cannot be parent of itself
        .order('urutan', { ascending: true });
      
      if (parentsData) setParentMenus(parentsData);

      // Fetch the current menu data
      if (id) {
        const { data: menuData } = await supabase.from('menu_navigasi').select('*').eq('id', id).single();
        if (menuData) {
          setFormData({
            nama: menuData.nama,
            link: menuData.link,
            parent_id: menuData.parent_id ? menuData.parent_id.toString() : '',
            urutan: menuData.urutan
          });
        }
      }
      setFetching(false);
    }
    fetchData();
  }, [id]);

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

    const { error } = await supabase.from('menu_navigasi').update(submitData).eq('id', id);
    setLoading(false);

    if (error) {
      alert('Gagal memperbarui menu: ' + error.message);
    } else {
      if (formData.parent_id) {
        router.push('/admin/menu/sub');
      } else {
        router.push('/admin/menu/main');
      }
      router.refresh();
    }
  };

  if (fetching) return <div className="p-8 text-center">Memuat data...</div>;

  const isSubMenu = !!formData.parent_id;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href={isSubMenu ? "/admin/menu/sub" : "/admin/menu/main"} className="text-gray-500 hover:text-green-700">
          <i className="fas fa-arrow-left"></i>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isSubMenu ? 'Edit Sub Menu' : 'Edit Main Menu'}
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Menu</label>
            <input 
              type="text" name="nama" required 
              value={formData.nama} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Link URL</label>
            <input 
              type="text" name="link" required 
              value={formData.link} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm" 
            />
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
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Urutan</label>
            <input 
              type="number" name="urutan" required min="0"
              value={formData.urutan} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
            />
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
