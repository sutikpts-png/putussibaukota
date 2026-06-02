'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function GalleryList({ items }: { items: any[] }) {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
        <i className="fas fa-images text-4xl text-gray-300 mb-4"></i>
        <h3 className="text-lg font-bold text-gray-600">Belum ada media</h3>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="gallery-item relative group bg-white shadow-sm border border-gray-100 h-64 overflow-hidden cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            {item.kategori === 'Video' || item.gambar_url?.match(/\.(mp4|webm|ogg)$/i) ? (
              <div className="w-full h-full relative bg-black">
                <video src={item.gambar_url} className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/30 backdrop-blur rounded-full flex items-center justify-center text-white">
                    <i className="fas fa-play"></i>
                  </div>
                </div>
              </div>
            ) : (
              <Image src={item.gambar_url} alt={item.judul} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none">
              <span className="text-[10px] font-bold text-white bg-green-600 px-2 py-1 rounded w-max mb-1 uppercase">{item.kategori}</span>
              <h4 className="text-white font-bold text-sm leading-tight">{item.judul}</h4>
              <p className="text-gray-300 text-xs mt-1 line-clamp-2">{item.deskripsi}</p>
            </div>
          </div>
        ))}
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
    </>
  );
}
