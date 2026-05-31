import Link from "next/link";
import { supabase } from "@/lib/supabase";
import GallerySlider from "@/components/GallerySlider";
import HeroSlider from "@/components/HeroSlider";

export const revalidate = 0;

export default async function Home() {
  const { data: web } = await supabase.from('pengaturan_web').select('*').eq('id', 1).single();
  const { data: latestBerita } = await supabase.from('berita').select('*').order('tanggal_publikasi', { ascending: false }).limit(3);
  const { data: latestFoto } = await supabase.from('galeri').select('*').eq('kategori', 'Foto').order('created_at', { ascending: false }).limit(8);
  const { data: latestVideo } = await supabase.from('galeri').select('*').eq('kategori', 'Video').order('created_at', { ascending: false }).limit(6);

  const heroTitle = web?.hero_title || 'Selamat Datang di<br/><span class="text-yellow-300">Kelurahan Kedamin Hilir</span>';
  const heroSubtitle = web?.hero_subtitle || 'Melayani masyarakat dengan tulus, transparan, dan profesional demi terwujudnya kelurahan yang maju, sejahtera, dan berdaya saing.';

  let heroBgArr = ['/assets/img/hero-bg.jpg'];
  if (web?.hero_image_url) {
    try {
      const parsed = JSON.parse(web.hero_image_url);
      if (Array.isArray(parsed) && parsed.length > 0) {
        heroBgArr = parsed;
      } else if (typeof parsed === 'string') {
        heroBgArr = [parsed];
      }
    } catch (e) {
      heroBgArr = [web.hero_image_url];
    }
  }

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative text-white py-20 px-4 overflow-hidden bg-green-900">
        <div 
          className="absolute top-0 left-0 w-full h-16 z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.7) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)'
          }}
        ></div>
        <HeroSlider images={heroBgArr} />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900 via-green-900 to-teal-800 opacity-[0.65] z-0"></div>
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          <div className="space-y-6 fade-in drop-shadow-md">
            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">Pemerintahan Kelurahan</span>
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight drop-shadow-md" dangerouslySetInnerHTML={{ __html: heroTitle }}></h2>
            <p className="text-green-100 text-base md:text-lg max-w-xl drop-shadow-md">{heroSubtitle}</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/layanan" className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold px-6 py-3 rounded-lg shadow-lg transition transform hover:-translate-y-0.5">
                <i className="fas fa-concierge-bell mr-2"></i>Layanan Warga
              </Link>
              <Link href="/profil" className="border border-white/40 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-lg transition">
                <i className="fas fa-info-circle mr-2"></i>Profil Kelurahan
              </Link>
            </div>
          </div>
          {/* Statistik Singkat */}
          <div className="grid grid-cols-2 gap-4">
            <div className="stat-card rounded-xl p-5 text-center border border-white/20">
              <i className="fas fa-users text-3xl text-yellow-300 mb-2"></i>
              <div className="text-3xl font-extrabold text-white">{web?.stat_penduduk || '12.450'}</div>
              <div className="text-xs text-green-200 mt-1">Jumlah Penduduk</div>
            </div>
            <div className="stat-card rounded-xl p-5 text-center border border-white/20">
              <i className="fas fa-home text-3xl text-yellow-300 mb-2"></i>
              <div className="text-3xl font-extrabold text-white">{web?.stat_kk || '3.820'}</div>
              <div className="text-xs text-green-200 mt-1">Kepala Keluarga</div>
            </div>
            <div className="stat-card rounded-xl p-5 text-center border border-white/20">
              <i className="fas fa-map-marked-alt text-3xl text-yellow-300 mb-2"></i>
              <div className="text-3xl font-extrabold text-white">{web?.stat_dusun || '12'}</div>
              <div className="text-xs text-green-200 mt-1">Dusun / RW</div>
            </div>
            <div className="stat-card rounded-xl p-5 text-center border border-white/20">
              <i className="fas fa-road text-3xl text-yellow-300 mb-2"></i>
              <div className="text-3xl font-extrabold text-white">{web?.stat_luas || '8,4 km²'}</div>
              <div className="text-xs text-green-200 mt-1">Luas Wilayah</div>
            </div>
          </div>
        </div>
      </section>

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
                    <img src={item.gambar_url} alt={item.judul} className="w-full h-full object-cover" />
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
                  <p className="text-xs text-gray-500 line-clamp-3 flex-grow">{item.konten}</p>
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
          <p className="text-gray-500 text-sm mt-2">Dokumentasi kegiatan dan potensi Kelurahan Kedamin Hilir.</p>
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
          {/* Card Layanan */}
          <Link href="/layanan#ktp" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center card-hover hover:shadow-md hover:border-green-200 group">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 group-hover:text-white transition">
              <i className="fas fa-id-card text-xl"></i>
            </div>
            <h4 className="font-bold text-gray-800 text-sm">Surat KTP</h4>
            <p className="text-xs text-gray-400 mt-1">Pengantar pembuatan KTP</p>
          </Link>
          <Link href="/layanan#kk" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center card-hover hover:shadow-md hover:border-green-200 group">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
              <i className="fas fa-users text-xl"></i>
            </div>
            <h4 className="font-bold text-gray-800 text-sm">Kartu Keluarga</h4>
            <p className="text-xs text-gray-400 mt-1">Pengantar perubahan KK</p>
          </Link>
          <Link href="/layanan#domisili" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center card-hover hover:shadow-md hover:border-green-200 group">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-600 group-hover:text-white transition">
              <i className="fas fa-house-user text-xl"></i>
            </div>
            <h4 className="font-bold text-gray-800 text-sm">Surat Domisili</h4>
            <p className="text-xs text-gray-400 mt-1">Keterangan tempat tinggal</p>
          </Link>
          <Link href="/layanan#usaha" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center card-hover hover:shadow-md hover:border-green-200 group">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600 group-hover:text-white transition">
              <i className="fas fa-store text-xl"></i>
            </div>
            <h4 className="font-bold text-gray-800 text-sm">Surat Usaha</h4>
            <p className="text-xs text-gray-400 mt-1">Keterangan izin usaha</p>
          </Link>
        </div>
      </section>

      {/* POTENSI KELURAHAN */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-white">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-green-900">Potensi Kelurahan</h3>
          <p className="text-gray-500 text-sm mt-2">Kekayaan alam, budaya, dan ekonomi yang menjadi keunggulan Kelurahan Kedamin Hilir.</p>
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
    </>
  );
}
