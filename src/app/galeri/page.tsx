import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function GaleriPage() {
  const { data: galeri } = await supabase
    .from('galeri')
    .select('*')
    .order('tanggal', { ascending: false });

  const galeriList = galeri || [];

  return (
    <>
      <section className="page-hero text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-green-300 mb-3">
            <Link href="/" className="hover:text-white">Beranda</Link>
            <i className="fas fa-chevron-right text-[10px]"></i>
            <span className="text-white">Galeri</span>
          </div>
          <h2 className="text-3xl font-extrabold">Galeri Dokumentasi</h2>
          <p className="text-green-200 mt-2 text-sm">Dokumentasi kegiatan dan momen penting di Kelurahan Kedamin Hilir.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        {galeriList.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
            <i className="fas fa-images text-4xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-bold text-gray-600">Belum ada media</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galeriList.map((item) => (
              <div key={item.id} className="gallery-item relative group bg-white shadow-sm border border-gray-100 h-64 overflow-hidden">
                {item.kategori === 'Video' || item.gambar_url.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video src={item.gambar_url} className="w-full h-full object-cover bg-black" controls />
                ) : (
                  <img src={item.gambar_url} alt={item.judul} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none">
                  <span className="text-[10px] font-bold text-white bg-green-600 px-2 py-1 rounded w-max mb-1 uppercase">{item.kategori}</span>
                  <h4 className="text-white font-bold text-sm leading-tight">{item.judul}</h4>
                  <p className="text-gray-300 text-xs mt-1 line-clamp-2">{item.deskripsi}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
