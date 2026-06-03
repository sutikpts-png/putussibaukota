'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function GalleryList({ items }: { items: any[] }) {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'Foto' | 'Video'>('Foto');
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 8;

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
        <i className="fas fa-images text-4xl text-gray-300 mb-4"></i>
        <h3 className="text-lg font-bold text-gray-600">Belum ada media</h3>
      </div>
    );
  }

  // Filter items based on tab
  const isVideo = (item: any) => item.kategori === 'Video' || item.gambar_url?.match(/\.(mp4|webm|ogg)$/i);
  const filteredItems = items.filter(item => activeTab === 'Video' ? isVideo(item) : !isVideo(item));
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  
  // Get items for current page
  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleTabChange = (tab: 'Foto' | 'Video') => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to page 1 when switching tabs
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-10">
        <button 
          onClick={() => handleTabChange('Foto')} 
          className={`px-8 py-3 rounded-full font-bold transition flex items-center gap-2 ${activeTab === 'Foto' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
        >
          <i className="fas fa-image"></i> Galeri Foto
        </button>
        <button 
          onClick={() => handleTabChange('Video')} 
          className={`px-8 py-3 rounded-full font-bold transition flex items-center gap-2 ${activeTab === 'Video' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
        >
          <i className="fas fa-play-circle"></i> Galeri Video
        </button>
      </div>

      {/* Grid */}
      {currentItems.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-white border border-gray-100 rounded-xl">
          <i className={`fas ${activeTab === 'Foto' ? 'fa-image' : 'fa-video'} text-4xl text-gray-300 mb-4`}></i>
          <h3 className="text-lg font-bold text-gray-600">Belum ada {activeTab.toLowerCase()}</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentItems.map((item) => (
            <div 
              key={item.id} 
              className="gallery-item relative group bg-white shadow-sm border border-gray-100 h-64 overflow-hidden cursor-pointer rounded-xl"
              onClick={() => setSelectedItem(item)}
            >
              {isVideo(item) ? (
                <div className="w-full h-full relative bg-black">
                  {item.gambar_url?.includes('youtube.com') || item.gambar_url?.includes('youtu.be') ? (
                    <iframe 
                      className="w-full h-full pointer-events-none" 
                      src={item.gambar_url.includes('youtu.be') ? item.gambar_url.replace('youtu.be/', 'youtube.com/embed/') : item.gambar_url.replace('watch?v=', 'embed/')} 
                      allowFullScreen>
                    </iframe>
                  ) : (
                    <video src={item.gambar_url} className="w-full h-full object-cover opacity-80 pointer-events-none" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/30 backdrop-blur rounded-full flex items-center justify-center text-white group-hover:scale-110 transition">
                      <i className="fas fa-play"></i>
                    </div>
                  </div>
                </div>
              ) : (
                <Image src={item.gambar_url} alt={item.judul} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none">
                <span className="text-[10px] font-bold text-white bg-green-600 px-2 py-1 rounded w-max mb-1 uppercase">{activeTab}</span>
                <h4 className="text-white font-bold text-sm leading-tight">{item.judul}</h4>
                <p className="text-gray-300 text-xs mt-1 line-clamp-2">{item.deskripsi}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition bg-white"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button 
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${currentPage === page ? 'bg-green-600 text-white shadow-md' : 'bg-white border border-gray-200 hover:bg-green-50 hover:text-green-600 text-gray-700'}`}
            >
              {page}
            </button>
          ))}

          <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition bg-white"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}

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
            {isVideo(selectedItem) ? (
              selectedItem.gambar_url?.includes('youtube.com') || selectedItem.gambar_url?.includes('youtu.be') ? (
                <iframe 
                  className="w-full aspect-video rounded-lg shadow-2xl max-h-[80vh]" 
                  src={(selectedItem.gambar_url.includes('youtu.be') ? selectedItem.gambar_url.replace('youtu.be/', 'youtube.com/embed/') : selectedItem.gambar_url.replace('watch?v=', 'embed/')) + (selectedItem.gambar_url.includes('?') ? '&autoplay=1' : '?autoplay=1')} 
                  allow="autoplay; fullscreen"
                  allowFullScreen>
                </iframe>
              ) : (
                <video src={selectedItem.gambar_url} className="w-full max-h-[80vh] rounded-lg shadow-2xl bg-black" controls autoPlay playsInline />
              )
            ) : (
              <img src={selectedItem.gambar_url} alt={selectedItem.judul} className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" />
            )}
            
            <div className="mt-6 text-center text-white max-w-2xl">
              <span className="text-[10px] font-bold text-green-400 border border-green-400 px-2 py-0.5 rounded uppercase mb-2 inline-block">{activeTab}</span>
              <h3 className="text-xl md:text-2xl font-bold">{selectedItem.judul}</h3>
              {selectedItem.deskripsi && <p className="text-gray-300 text-sm mt-2">{selectedItem.deskripsi}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
