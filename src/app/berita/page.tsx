import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export const revalidate = 60; // Regenerate every 60s for performance

export default async function BeritaPage() {
  const { data: berita, error } = await supabase
    .from('berita')
    .select('*')
    .order('tanggal_publikasi', { ascending: false });

  if (error) {
    console.error('Error fetching berita:', error);
  }

  const beritaList = berita || [];

  return (
    <>
      {/* PAGE HERO */}
      <section className="page-hero text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-green-300 mb-3">
            <Link href="/" className="hover:text-white">Beranda</Link>
            <i className="fas fa-chevron-right text-[10px]"></i>
            <span className="text-white">Berita</span>
          </div>
          <h2 className="text-3xl font-extrabold">Berita & Informasi</h2>
          <p className="text-green-200 mt-2 text-sm">Informasi terkini seputar kegiatan dan pembangunan Kelurahan Kedamin Hilir.</p>
        </div>
      </section>

      {/* BERITA CONTENT */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-2 mb-8">
          <button className="px-4 py-2 bg-green-700 text-white text-xs font-semibold rounded-full">Semua</button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-semibold rounded-full hover:bg-green-50 hover:border-green-300 transition">Kegiatan</button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-semibold rounded-full hover:bg-green-50 hover:border-green-300 transition">Sosial</button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-semibold rounded-full hover:bg-green-50 hover:border-green-300 transition">Infrastruktur</button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-semibold rounded-full hover:bg-green-50 hover:border-green-300 transition">Budaya</button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-semibold rounded-full hover:bg-green-50 hover:border-green-300 transition">Pengumuman</button>
        </div>

        {beritaList.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
            <i className="fas fa-newspaper text-4xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-bold text-gray-600">Belum ada berita</h3>
            <p className="text-sm text-gray-400">Berita yang dipublikasikan akan muncul di sini.</p>
          </div>
        ) : (
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
                    <Link href={`/berita/${item.slug}`}>{item.judul}</Link>
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-3 flex-grow">{item.konten}</p>
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 mt-auto">
                    <span><i className="far fa-calendar mr-1"></i> {new Date(item.tanggal_publikasi).toLocaleDateString('id-ID')}</span>
                    <Link href={`/berita/${item.slug}`} className="text-green-600 font-semibold hover:underline">Baca →</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
