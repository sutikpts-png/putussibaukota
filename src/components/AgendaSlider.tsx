'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

export default function AgendaSlider({ agendaList }: { agendaList: any[] }) {
  if (!agendaList || agendaList.length === 0) {
    return (
      <div className="text-center py-6">
        <i className="far fa-calendar-times text-3xl text-gray-200 mb-2"></i>
        <p className="text-sm text-gray-400 italic">Belum ada agenda terdekat.</p>
      </div>
    );
  }

  // Chunk array into groups of 4
  const chunkSize = 4;
  const chunks = [];
  for (let i = 0; i < agendaList.length; i += chunkSize) {
    chunks.push(agendaList.slice(i, i + chunkSize));
  }

  return (
    <div className="agenda-slider-wrapper relative">
      <Swiper
        modules={[Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ clickable: true }}
        className="pb-10" // Extra padding for pagination dots
      >
        {chunks.map((chunk, index) => (
          <SwiperSlide key={index}>
            <div className="space-y-4">
              {chunk.map((agenda) => (
                <div key={agenda.id} className="flex gap-3 items-start group cursor-default">
                  <div className="bg-green-50 text-green-700 rounded-lg p-2 text-center min-w-[55px] border border-green-100 group-hover:bg-green-600 group-hover:text-white transition-all shadow-sm">
                    <div className="text-[10px] font-bold uppercase tracking-wider">{new Date(agenda.tanggal).toLocaleDateString('id-ID', { month: 'short' })}</div>
                    <div className="text-xl font-black leading-none my-0.5">{new Date(agenda.tanggal).getDate()}</div>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-green-700 transition">{agenda.judul}</h5>
                    <div className="text-[11px] text-gray-500 mt-1.5 flex flex-col gap-1">
                      {agenda.waktu && <span className="flex items-center"><i className="far fa-clock w-3.5 text-gray-400"></i> {agenda.waktu}</span>}
                      {agenda.lokasi && <span className="flex items-center line-clamp-1"><i className="fas fa-map-marker-alt w-3.5 text-gray-400"></i> {agenda.lokasi}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <style jsx global>{`
        .agenda-slider-wrapper .swiper-pagination-bullet {
          background-color: #d1d5db;
          opacity: 1;
        }
        .agenda-slider-wrapper .swiper-pagination-bullet-active {
          background-color: #16a34a;
        }
        .agenda-slider-wrapper .swiper-pagination {
          bottom: 0px !important;
        }
      `}</style>
    </div>
  );
}
