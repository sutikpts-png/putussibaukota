'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
export default function BeritaSlider({ latestBerita }: { latestBerita: any[] }) {
  if (!latestBerita || latestBerita.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-xl border border-gray-100 h-full flex flex-col items-center justify-center">
        <i className="fas fa-newspaper text-3xl text-gray-300 mb-3"></i>
        <p className="text-sm text-gray-400">Belum ada berita terbaru.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {latestBerita.map((item) => (
        <div key={item.id} className="h-full">
          <article className="bg-white rounded-xl shadow-sm overflow-hidden card-hover hover:shadow-md border border-gray-100 flex flex-col h-full">
            <div className="h-48 news-img flex items-center justify-center relative overflow-hidden bg-gray-100">
              {item.gambar_url ? (
                <Image src={item.gambar_url} alt={item.judul} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              ) : (
                <i className="fas fa-image text-6xl text-gray-300"></i>
              )}
              <span className="absolute top-3 left-3 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                {item.kategori || 'Info'}
              </span>
            </div>
            <div className="p-5 flex flex-col flex-grow space-y-2">
              <h4 className="font-bold text-gray-900 hover:text-green-700 transition text-sm leading-snug">
                <Link href={`/berita/${item.slug || item.id}`}>{item.judul}</Link>
              </h4>
              <p className="text-xs text-gray-500 line-clamp-3 flex-grow">{item.konten.replace(/<[^>]+>/g, '').replace(/&[a-zA-Z0-9#]+;/g, ' ')}</p>
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 mt-auto">
                <span><i className="far fa-calendar mr-1"></i> {new Date(item.created_at || item.tanggal_publikasi).toLocaleDateString('id-ID')}</span>
                <Link href={`/berita/${item.slug || item.id}`} className="text-green-600 font-semibold hover:underline">Baca →</Link>
              </div>
            </div>
          </article>
        </div>
      ))}
    </div>
  );
}
