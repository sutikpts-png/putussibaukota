'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminGaleri() {
  const [galeri, setGaleri] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'Foto' | 'Video'>('Foto');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchGaleri();
  }, []);

  async function fetchGaleri() {
    const { data, error } = await supabase
      .from('galeri')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setGaleri(data);
    setLoading(false);
  }

  async function hapusGaleri(id: string) {
    if (confirm('Yakin ingin menghapus media ini?')) {
      await supabase.from('galeri').delete().eq('id', id);
      fetchGaleri();
    }
  }

  const filteredGaleri = galeri.filter(item => item.kategori === activeTab);
  const totalPages = Math.ceil(filteredGaleri.length / itemsPerPage);
  const currentItems = filteredGaleri.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Galeri</h1>
        <Link href="/admin/galeri/tambah" className="bg-[#b31237] hover:bg-[#8f0e2c] text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
          <i className="fas fa-plus mr-2"></i> Tambah Media
        </Link>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button 
          onClick={() => { setActiveTab('Foto'); setCurrentPage(1); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all ${activeTab === 'Foto' ? 'bg-[#da1b4b] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
        >
          <i className="fas fa-image"></i> Galeri Foto
        </button>
        <button 
          onClick={() => { setActiveTab('Video'); setCurrentPage(1); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all ${activeTab === 'Video' ? 'bg-[#da1b4b] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
        >
          <i className="fas fa-play-circle"></i> Galeri Video
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div className="text-center text-gray-500 py-8">Memuat data...</div>
        ) : filteredGaleri.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Belum ada {activeTab.toLowerCase()} di galeri.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                  <th className="p-4 font-semibold w-32">Foto dan Video</th>
                  <th className="p-4 font-semibold">Judul</th>
                  <th className="p-4 font-semibold">Tanggal Upload</th>
                  <th className="p-4 font-semibold text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="w-24 h-16 rounded overflow-hidden bg-gray-100 relative cursor-pointer group" onClick={() => setSelectedItem(item)}>
                        {item.kategori === 'Video' || item.gambar_url?.match(/\.(mp4|webm|ogg)$/i) ? (
                          <div className="w-full h-full relative bg-black">
                            <video src={item.gambar_url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <i className="fas fa-play text-white text-xs drop-shadow-md"></i>
                            </div>
                          </div>
                        ) : (
                          <img src={item.gambar_url} alt={item.judul} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{item.judul}</p>
                      <span className="text-[10px] font-bold text-green-700 uppercase bg-green-50 px-2 py-0.5 rounded border border-green-100">{item.kategori}</span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-center">
                        <Link 
                          href={`/admin/galeri/edit/${item.id}`}
                          className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition shadow-sm"
                          title="Edit"
                        >
                          <i className="fas fa-edit text-xs"></i>
                        </Link>
                        <button 
                          onClick={() => hapusGaleri(item.id)}
                          className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition shadow-sm"
                          title="Hapus"
                        >
                          <i className="fas fa-trash text-xs"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && filteredGaleri.length > 0 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500">
              Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredGaleri.length)} dari {filteredGaleri.length} {activeTab.toLowerCase()}
            </div>
            <div className="flex gap-1">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1}
                className="w-8 h-8 rounded flex items-center justify-center border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition"
              >
                <i className="fas fa-chevron-left text-xs"></i>
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded flex items-center justify-center text-sm font-semibold transition ${currentPage === page ? 'bg-green-700 text-white' : 'border border-gray-200 hover:bg-gray-50 text-gray-700'}`}
                >
                  {page}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded flex items-center justify-center border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition"
              >
                <i className="fas fa-chevron-right text-xs"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* LIGHTBOX MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-10" onClick={() => setSelectedItem(null)}>
          <button 
            className="absolute top-4 right-4 md:top-6 md:right-6 text-white bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center backdrop-blur transition z-10 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); setSelectedItem(null); }}
          >
            <i className="fas fa-times text-xl"></i>
          </button>
          
          <div className="relative max-w-5xl w-full max-h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {selectedItem.kategori === 'Video' || selectedItem.gambar_url?.match(/\.(mp4|webm|ogg)$/i) ? (
              <video src={selectedItem.gambar_url} className="w-full max-h-[80vh] rounded-lg shadow-2xl bg-black" controls autoPlay playsInline />
            ) : (
              <img src={selectedItem.gambar_url} alt={selectedItem.judul} className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" />
            )}
            
            <div className="mt-6 text-center text-white max-w-2xl">
              <span className="text-[10px] font-bold text-green-400 border border-green-400 px-2 py-0.5 rounded uppercase mb-2 inline-block">{selectedItem.kategori}</span>
              <h3 className="text-xl md:text-2xl font-bold">{selectedItem.judul}</h3>
              {selectedItem.deskripsi && <p className="text-gray-300 text-sm mt-2">{selectedItem.deskripsi}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
