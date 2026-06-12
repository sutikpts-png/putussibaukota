'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Captcha state
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  
  const router = useRouter();

  // Generate captcha on load
  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setCaptchaAnswer('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (parseInt(captchaAnswer) !== num1 + num2) {
      setErrorMsg('Jawaban Captcha salah. Silakan coba lagi.');
      setLoading(false);
      generateCaptcha();
      return;
    }

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
        // Set cookie for middleware authentication
        document.cookie = "admin_auth=true; path=/; max-age=86400"; // 1 day
        router.push('/admin');
      } else {
        setErrorMsg('Login gagal. Periksa kembali Username dan Password Anda.');
        setLoading(false);
        generateCaptcha();
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
          <div className="bg-green-900 p-6 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-full p-2 mb-3 shadow-md flex items-center justify-center overflow-hidden">
              <Image src="/icon.png" alt="Logo" width={60} height={60} className="object-contain" />
            </div>
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
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Verifikasi Keamanan (Captcha)</label>
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 text-green-800 font-bold px-4 py-2 rounded-lg text-lg select-none">
                    {num1} + {num2} = ?
                  </div>
                  <input 
                    type="number" 
                    required 
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
                    placeholder="Hasil"
                  />
                </div>
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
            <p>di Kembangkan Oleh Dinas Komunikasi, Informatika dan Statistik Kabupaten Kapuas Hulu</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
