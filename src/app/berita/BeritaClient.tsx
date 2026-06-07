"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function BeritaClient() {
  const [beritaList, setBeritaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [kategori, setKategori] = useState('Semua');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const categories = ['Semua', 'Kegiatan', 'Sosial', 'Infrastruktur', 'Budaya', 'Pengumuman'];

  useEffect(() => {
    fetchBerita();
  }, [kategori, page]);

  const fetchBerita = async () => {
    setLoading(true);
    let query = supabase.from('berita').select('*', { count: 'exact' });
    
    if (kategori !== 'Semua') {
      query = query.eq('kategori', kategori);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.order('tanggal_publikasi', { ascending: false }).range(from, to);

    const { data, count, error } = await query;

    if (!error && data) {
      setBeritaList(data);
      if (count !== null) {
        setTotalPages(Math.ceil(count / limit));
      }
    } else {
      console.error('Error fetching berita:', error);
    }
    setLoading(false);
  };

  const handleCategoryChange = (cat: string) => {
    setKategori(cat);
    setPage(1); // Reset to first page when category changes
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition ${
              kategori === cat
                ? 'bg-green-700 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-green-50 hover:border-green-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
          <i className="fas fa-spinner fa-spin text-4xl text-green-600 mb-4"></i>
          <h3 className="text-lg font-bold text-gray-600">Memuat berita...</h3>
        </div>
      ) : beritaList.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
          <i className="fas fa-newspaper text-4xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-bold text-gray-600">Belum ada berita</h3>
          <p className="text-sm text-gray-400">Berita yang dipublikasikan akan muncul di sini.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {beritaList.map((item) => (
              <article key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden card-hover hover:shadow-md border border-gray-100 flex flex-col h-full">
                <div className="h-48 news-img flex items-center justify-center relative overflow-hidden">
                  {item.gambar_url ? (
                    <Image src={item.gambar_url} alt={item.judul} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  ) : (
                    <i className="fas fa-image text-6xl text-gray-300"></i>
                  )}
                  <span className="absolute top-3 left-3 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                    {item.kategori}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-grow space-y-2">
                  <h4 className="font-bold text-gray-900 hover:text-green-700 transition text-sm leading-snug">
                    <Link href={`/berita/${item.slug || item.id}`}>{item.judul}</Link>
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-3 flex-grow">{item.konten.replace(/<[^>]+>/g, '').replace(/&[a-zA-Z0-9#]+;/g, ' ')}</p>
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 mt-auto">
                    <span><i className="far fa-calendar mr-1"></i> {new Date(item.tanggal_publikasi).toLocaleDateString('id-ID')}</span>
                    <Link href={`/berita/${item.slug || item.id}`} className="text-green-600 font-semibold hover:underline">Baca →</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>
              <span className="text-sm font-semibold text-gray-600 px-4">
                Halaman {page} dari {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Berikutnya
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
