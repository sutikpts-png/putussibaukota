import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function AdminDashboard() {
  // Ambil data jumlah dari tabel-tabel utama
  const [
    { count: countBerita },
    { count: countLayanan },
    { count: countGaleri },
    { count: countPotensi }
  ] = await Promise.all([
    supabase.from('berita').select('*', { count: 'exact', head: true }),
    supabase.from('layanan').select('*', { count: 'exact', head: true }),
    supabase.from('galeri').select('*', { count: 'exact', head: true }),
    supabase.from('potensi').select('*', { count: 'exact', head: true }),
  ]);

  // Statistik Pengunjung
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const todayStr = today.toISOString().split('T')[0];

  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);
  const lastWeekStr = lastWeek.toISOString().split('T')[0];

  const startMonth = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
  const startYear = `${currentYear}-01-01`;

  // Fetch semua statistik kunjungan yang masuk rentang tahun ini untuk diolah
  const { data: rawStats } = await supabase
    .from('statistik_pengunjung')
    .select('tanggal, jumlah')
    .gte('tanggal', startYear)
    .lte('tanggal', todayStr);

  const stats = rawStats || [];

  let countHariIni = 0;
  let countMingguIni = 0;
  let countBulanIni = 0;
  let countTahunIni = 0;

  stats.forEach((row) => {
    countTahunIni += row.jumlah;
    
    if (row.tanggal >= startMonth) {
      countBulanIni += row.jumlah;
    }
    
    if (row.tanggal >= lastWeekStr) {
      countMingguIni += row.jumlah;
    }
    
    if (row.tanggal === todayStr) {
      countHariIni += row.jumlah;
    }
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Admin</h1>
      
      {/* SECTION: RINGKASAN KONTEN */}
      <h2 className="text-lg font-bold text-gray-800 mb-4">Ringkasan Konten</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Berita</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{countBerita || 0}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl">
              <i className="fas fa-newspaper"></i>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Layanan</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{countLayanan || 0}</h3>
            </div>
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-xl">
              <i className="fas fa-concierge-bell"></i>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Galeri Media</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{countGaleri || 0}</h3>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-xl">
              <i className="fas fa-images"></i>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Potensi</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{countPotensi || 0}</h3>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-xl">
              <i className="fas fa-leaf"></i>
            </div>
          </div>
        </div>
      </div>
      
      {/* SECTION: STATISTIK PENGUNJUNG */}
      <h2 className="text-lg font-bold text-gray-800 mb-4">Statistik Pengunjung Website</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl border border-teal-100 shadow-sm bg-gradient-to-br from-white to-teal-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-teal-700">Hari Ini</p>
              <h3 className="text-3xl font-extrabold text-teal-900 mt-1">{countHariIni.toLocaleString('id-ID')}</h3>
            </div>
            <div className="w-14 h-14 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-2xl shadow-inner">
              <i className="fas fa-user-clock"></i>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm bg-gradient-to-br from-white to-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">7 Hari Terakhir</p>
              <h3 className="text-3xl font-extrabold text-blue-900 mt-1">{countMingguIni.toLocaleString('id-ID')}</h3>
            </div>
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl shadow-inner">
              <i className="fas fa-users"></i>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm bg-gradient-to-br from-white to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-700">Bulan Ini</p>
              <h3 className="text-3xl font-extrabold text-indigo-900 mt-1">{countBulanIni.toLocaleString('id-ID')}</h3>
            </div>
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl shadow-inner">
              <i className="fas fa-chart-bar"></i>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-rose-100 shadow-sm bg-gradient-to-br from-white to-rose-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-rose-700">Tahun Ini</p>
              <h3 className="text-3xl font-extrabold text-rose-900 mt-1">{countTahunIni.toLocaleString('id-ID')}</h3>
            </div>
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-2xl shadow-inner">
              <i className="fas fa-globe"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center">
        <i className="fas fa-cogs text-5xl text-gray-300 mb-4"></i>
        <h2 className="text-xl font-bold text-gray-800">Panel Pengelolaan Kelurahan</h2>
        <p className="text-gray-500 mt-2">
          Gunakan menu di sebelah kiri untuk mengelola konten dan pengaturan website kelurahan.
        </p>
      </div>
    </div>
  );
}
