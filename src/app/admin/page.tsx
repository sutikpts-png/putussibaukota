export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Admin</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Berita</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">--</h3>
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
              <h3 className="text-2xl font-bold text-gray-900 mt-1">--</h3>
            </div>
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-xl">
              <i className="fas fa-concierge-bell"></i>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Galeri Foto</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">--</h3>
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
              <h3 className="text-2xl font-bold text-gray-900 mt-1">--</h3>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-xl">
              <i className="fas fa-leaf"></i>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center">
        <i className="fas fa-cogs text-5xl text-gray-300 mb-4"></i>
        <h2 className="text-xl font-bold text-gray-800">Selamat datang di Panel Admin!</h2>
        <p className="text-gray-500 mt-2">
          Gunakan menu di sebelah kiri untuk mengelola konten website kelurahan.
        </p>
      </div>
    </div>
  );
}
