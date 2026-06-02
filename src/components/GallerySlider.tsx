'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function GallerySlider({ latestFoto, latestVideo }: { latestFoto: any[], latestVideo: any[] }) {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  return (
    <>
      <div className="mb-12">
        <h4 className="text-xl font-bold text-green-800 mb-4 flex items-center"><i className="fas fa-camera mr-2 text-yellow-500"></i> Galeri Foto</h4>
        {(!latestFoto || latestFoto.length === 0) ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-400">Belum ada foto.</p>
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            navigation
            pagination={{ clickable: true }}
            className="pb-12"
          >
            {latestFoto.map((item) => (
              <SwiperSlide key={item.id}>
                <div 
                  className="relative group rounded-xl overflow-hidden shadow-sm aspect-square bg-gray-100 h-full cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <Image src={item.gambar_url} alt={item.judul} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4 pointer-events-none">
                    <p className="text-white text-sm font-semibold truncate">{item.judul}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      <div>
        <h4 className="text-xl font-bold text-green-800 mb-4 flex items-center"><i className="fas fa-video mr-2 text-yellow-500"></i> Galeri Video</h4>
        {(!latestVideo || latestVideo.length === 0) ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-400">Belum ada video.</p>
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            navigation
            pagination={{ clickable: true }}
            className="pb-12"
          >
            {latestVideo.map((item) => (
              <SwiperSlide key={item.id} className="h-auto">
                <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-white p-2 h-full flex flex-col cursor-pointer group" onClick={() => setSelectedItem(item)}>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden flex-shrink-0 relative">
                    {item.gambar_url.includes('youtube.com') || item.gambar_url.includes('youtu.be') ? (
                      <iframe 
                        className="w-full h-full pointer-events-none" 
                        src={item.gambar_url.includes('youtu.be') ? item.gambar_url.replace('youtu.be/', 'youtube.com/embed/') : item.gambar_url.replace('watch?v=', 'embed/')} 
                        allowFullScreen>
                      </iframe>
                    ) : (
                      <video src={item.gambar_url} className="w-full h-full object-cover opacity-80 pointer-events-none"></video>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/30 backdrop-blur rounded-full flex items-center justify-center text-white group-hover:scale-110 transition">
                        <i className="fas fa-play"></i>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 flex-grow">
                    <p className="text-gray-900 font-bold text-sm line-clamp-2">{item.judul}</p>
                    {item.deskripsi && <p className="text-gray-500 text-xs mt-1 line-clamp-2">{item.deskripsi}</p>}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
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
              selectedItem.gambar_url.includes('youtube.com') || selectedItem.gambar_url.includes('youtu.be') ? (
                <iframe 
                  className="w-full aspect-video rounded-lg shadow-2xl" 
                  src={(selectedItem.gambar_url.includes('youtu.be') ? selectedItem.gambar_url.replace('youtu.be/', 'youtube.com/embed/') : selectedItem.gambar_url.replace('watch?v=', 'embed/')) + "?autoplay=1"} 
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
