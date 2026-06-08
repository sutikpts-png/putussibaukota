import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import GallerySlider from "@/components/GallerySlider";
import HeroSection from "@/components/HeroSection";
import FloatingSurveyButton from "@/components/FloatingSurveyButton";
export const revalidate = 60;

export default async function Home() {
  const [
    { data: web },
    { data: sliders },
    { data: latestBerita },
    { data: latestFoto },
    { data: latestVideo },
    { data: layananList }
  ] = await Promise.all([
    supabase.from('pengaturan_web').select('*').eq('id', 1).single(),
    supabase.from('slider_banner').select('*').eq('is_active', true).order('urutan', { ascending: true }),
    supabase.from('berita').select('*').order('tanggal_publikasi', { ascending: false }).limit(3),
    supabase.from('galeri').select('*').eq('kategori', 'Foto').order('created_at', { ascending: false }).limit(8),
    supabase.from('galeri').select('*').eq('kategori', 'Video').order('created_at', { ascending: false }).limit(6),
    supabase.from('layanan').select('*').order('created_at', { ascending: true }).limit(4)
  ]);

  return (
    <>
      {/* HERO SECTION */}
      <HeroSection web={web} sliders={sliders || []} />

      {/* BERITA TERKINI */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-gray-50/50">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-green-900">Berita</h3>
          <p className="text-gray-500 text-sm mt-2">Cepat, Akurat, dan Terpercaya dalam Menyampaikan Informasi</p>
          <div className="w-16 h-1 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {(!latestBerita || latestBerita.length === 0) ? (
          <div className="text-center py-10 bg-white rounded-xl border border-gray-100">
            <i className="fas fa-newspaper text-3xl text-gray-300 mb-3"></i>
            <p className="text-sm text-gray-400">Belum ada berita terbaru.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestBerita.map((item) => (
              <article key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden card-hover hover:shadow-md border border-gray-100 flex flex-col h-full">
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
                    <span><i className="far fa-calendar mr-1"></i> {new Date(item.tanggal_publikasi).toLocaleDateString('id-ID')}</span>
                    <Link href={`/berita/${item.slug || item.id}`} className="text-green-600 font-semibold hover:underline">Baca →</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link href="/berita" className="inline-block px-6 py-3 bg-white border border-green-600 text-green-700 font-bold text-sm rounded-lg hover:bg-green-50 transition">
            Lihat Semua Berita
          </Link>
        </div>
      </section>

      {/* GALERI */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-green-900">Galeri Kelurahan</h3>
          <p className="text-gray-500 text-sm mt-2">Dokumentasi kegiatan dan potensi Kelurahan Putussibau Kota.</p>
          <div className="w-16 h-1 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
        </div>
        
        <GallerySlider latestFoto={latestFoto || []} latestVideo={latestVideo || []} />
        
        <div className="text-center mt-10">
          <Link href="/galeri" className="inline-block px-6 py-3 bg-white border border-green-600 text-green-700 font-bold text-sm rounded-lg hover:bg-green-50 transition">
            Lihat Semua Galeri
          </Link>
        </div>
      </section>

      {/* LAYANAN UTAMA */}
      <section id="layanan" className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-green-900">Layanan Administrasi Warga</h3>
          <p className="text-gray-500 text-sm mt-2">Akses cepat berbagai layanan administrasi kependudukan dan surat-menyurat kelurahan.</p>
          <div className="w-16 h-1 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {(!layananList || layananList.length === 0) ? (
            <div className="col-span-2 md:col-span-4 text-center py-8 text-gray-500">
              Belum ada layanan tersedia.
            </div>
          ) : (
            layananList.map((item) => (
              <Link key={item.id} href={`/layanan/${item.id}`} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center card-hover hover:shadow-md hover:border-green-200 group flex flex-col h-full">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 group-hover:text-white transition">
                  {item.ikon_url ? (
                    <Image src={item.ikon_url} alt="icon" width={32} height={32} className="object-contain" />
                  ) : (
                    <i className="fas fa-file-alt text-xl"></i>
                  )}
                </div>
                <h4 className="font-bold text-gray-800 text-sm group-hover:text-green-700 transition">{item.nama_layanan}</h4>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.deskripsi.replace(/<[^>]+>/g, '').replace(/&[a-zA-Z0-9#]+;/g, ' ')}</p>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* POTENSI KELURAHAN */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-white">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-green-900">Potensi Kelurahan</h3>
          <p className="text-gray-500 text-sm mt-2">Kekayaan alam, budaya, dan ekonomi yang menjadi keunggulan Kelurahan Putussibau Kota.</p>
          <div className="w-16 h-1 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl overflow-hidden shadow-sm card-hover hover:shadow-md border border-gray-100">
            <div className="h-40 bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
              <i className="fas fa-seedling text-6xl text-white/80"></i>
            </div>
            <div className="p-5">
              <h4 className="font-bold text-gray-900 mb-2">Pertanian & Perkebunan</h4>
              <p className="text-xs text-gray-500 leading-relaxed">Lahan pertanian subur menghasilkan padi, sayuran, dan buah-buahan berkualitas tinggi yang menjadi sumber penghidupan utama warga.</p>
              <Link href="/potensi#pertanian" className="inline-block mt-3 text-xs text-green-600 font-semibold hover:underline">Selengkapnya →</Link>
            </div>
          </div>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm card-hover hover:shadow-md border border-gray-100">
            <div className="h-40 bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <i className="fas fa-store text-6xl text-white/80"></i>
            </div>
            <div className="p-5">
              <h4 className="font-bold text-gray-900 mb-2">UMKM & Kerajinan</h4>
              <p className="text-xs text-gray-500 leading-relaxed">Berbagai usaha mikro kecil menengah berkembang pesat, mulai dari kerajinan tangan, kuliner khas, hingga produk olahan lokal bernilai ekspor.</p>
              <Link href="/potensi#umkm" className="inline-block mt-3 text-xs text-green-600 font-semibold hover:underline">Selengkapnya →</Link>
            </div>
          </div>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm card-hover hover:shadow-md border border-gray-100">
            <div className="h-40 bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
              <i className="fas fa-mountain text-6xl text-white/80"></i>
            </div>
            <div className="p-5">
              <h4 className="font-bold text-gray-900 mb-2">Wisata Alam & Budaya</h4>
              <p className="text-xs text-gray-500 leading-relaxed">Keindahan alam lereng Merapi dan kekayaan budaya lokal menjadikan kelurahan ini sebagai destinasi wisata yang menarik bagi wisatawan.</p>
              <Link href="/potensi#wisata" className="inline-block mt-3 text-xs text-green-600 font-semibold hover:underline">Selengkapnya →</Link>
            </div>
          </div>
        </div>
      </section>

      <FloatingSurveyButton />
    </>
  );
}
