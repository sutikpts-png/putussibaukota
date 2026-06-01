'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AkunAdmin() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    admin_username: '',
    admin_password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchAkun();
  }, []);

  async function fetchAkun() {
    const { data, error } = await supabase
      .from('pengaturan_web')
      .select('admin_username, admin_password')
      .eq('id', 1)
      .single();
    
    if (data) {
      setFormData({
        admin_username: data.admin_username || 'admin',
        admin_password: data.admin_password || 'admin123'
      });
    } else {
      console.error("Error fetching akun:", error);
    }
    setFetching(false);
  }

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('pengaturan_web')
      .update({
        admin_username: formData.admin_username,
        admin_password: formData.admin_password
      })
      .eq('id', 1);

    setLoading(false);

    if (error) {
      alert('Gagal menyimpan pengaturan akun: ' + error.message);
    } else {
      alert('Pengaturan akun berhasil disimpan!');
    }
  };

  if (fetching) {
    return <div className="p-8 text-center text-gray-500">Memuat data akun...</div>;
  }

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pengaturan Admin</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* AKUN ADMIN */}
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-red-100 text-red-600 px-3 py-1 rounded-bl-lg text-xs font-bold uppercase tracking-wider shadow-sm">
            Area Sensitif
          </div>
          <h2 className="text-lg font-bold text-red-800 mb-4 border-b border-red-100 pb-2">Pengaturan Akun Admin</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Username Admin</label>
              <input type="text" name="admin_username" required value={formData.admin_username} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
              <p className="text-xs text-gray-500 mt-1">Digunakan untuk login ke panel admin.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password Admin</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="admin_password" 
                  required 
                  value={formData.admin_password} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none pr-10" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-red-600 focus:outline-none"
                >
                  <i className={`fas fa-eye${showPassword ? '-slash' : ''}`}></i>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Disarankan menggunakan kombinasi yang kuat dan unik.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition">
            {loading ? 'Menyimpan...' : 'Simpan Pengaturan Akun'}
          </button>
        </div>
      </form>
    </div>
  );
}
