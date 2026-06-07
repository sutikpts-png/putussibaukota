'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase
        .from('pengaturan_web')
        .select('admin_username, admin_password')
        .eq('id', 1)
        .single();

      if (error) throw error;

      // Check against DB credentials or fallback to default if DB returns null/undefined
      const validUsername = data?.admin_username || 'admin';
      const validPassword = data?.admin_password || 'admin123';

      if (username === validUsername && password === validPassword) {
        localStorage.setItem('admin_auth', 'true');
        router.push('/admin');
      } else {
        setErrorMsg('Login gagal. Periksa kembali Username dan Password Anda.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Terjadi kesalahan sistem saat login.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-green-900 p-6 text-center">
            <h2 className="text-2xl font-bold text-white">Login Admin</h2>
            <p className="text-green-200 mt-1 text-sm">Kelurahan Putussibau Kota</p>
          </div>
          
          <div className="p-8">
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
                {errorMsg}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                <input 
                  type="text" 
                  required 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
                  placeholder="Masukkan username"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
                  placeholder="••••••••"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                {loading ? 'Memeriksa...' : 'Masuk ke Dashboard'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-green-700 hover:underline">
                <i className="fas fa-arrow-left mr-1"></i> Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#f4f7f9] border-t border-gray-200 py-6 px-4 md:px-12 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <p className="font-bold text-gray-800 mb-1">KELURAHAN PUTUSSIBAU KOTA</p>
            <p className="text-gray-600">© 2026 Pemerintah Kabupaten Kapuas Hulu. Hak Cipta Dilindungi.</p>
          </div>
          <div className="flex space-x-6 text-gray-600">
            <p>di Kembangkan Diskominfotik Kab. Kapuas Hulu</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
