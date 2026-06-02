import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export default async function BeritaDetail({ params }: { params: any }) {
  const { slug } = await params;

  // Try to find by slug
  let { data: berita } = await supabase
    .from('berita')
    .select('*')
    .eq('slug', slug)
    .single();

  // If not found by slug, maybe it was linked by id
  if (!berita) {
    const { data: byId } = await supabase
      .from('berita')
      .select('*')
      .eq('id', slug)
      .single();
    
    if (byId) {
      berita = byId;
    }
  }

  if (!berita) {
    notFound();
  }

  // Fetch recent news for sidebar
  const { data: latestBerita } = await supabase
    .from('berita')
    .select('id, slug, judul, tanggal_publikasi, gambar_url')
    .neq('id', berita.id)
    .order('tanggal_publikasi', { ascending: false })
    .limit(5);

  return (
    <>
      <section className="page-hero text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-green-300 mb-3">
            <Link href="/" className="hover:text-white">Beranda</Link>
            <i className="fas fa-chevron-right text-[10px]"></i>
            <Link href="/berita" className="hover:text-white">Berita</Link>
            <i className="fas fa-chevron-right text-[10px]"></i>
            <span className="text-white truncate max-w-xs">{berita.judul}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight max-w-3xl">{berita.judul}</h2>
          <div className="flex items-center gap-4 mt-4 text-sm text-green-200">
            <span><i className="far fa-calendar mr-2"></i>{new Date(berita.tanggal_publikasi).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="bg-green-600 px-2 py-1 rounded text-white text-[10px] uppercase font-bold">{berita.kategori}</span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* MAIN CONTENT */}
          <article className="lg:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {berita.gambar_url && (
              <div className="w-full aspect-video relative">
                <Image src={berita.gambar_url} alt={berita.judul} fill priority sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
              </div>
            )}
            <div className="p-8">
              {berita.konten.includes('<p>') || berita.konten.includes('<div>') ? (
                <div className="prose prose-green max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: berita.konten }} />
              ) : (
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{berita.konten}</div>
              )}
            </div>
            
            <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-between items-center">
               <span className="text-sm text-gray-500 font-semibold">Bagikan artikel ini:</span>
               <div className="flex gap-2">
                 <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition"><i className="fab fa-facebook-f"></i></button>
                 <button className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition"><i className="fab fa-twitter"></i></button>
                 <button className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition"><i className="fab fa-whatsapp"></i></button>
               </div>
            </div>
          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3 space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4 flex items-center"><i className="fas fa-fire mr-2 text-orange-500"></i> Berita Terbaru</h3>
              <div className="space-y-4">
                {latestBerita && latestBerita.length > 0 ? (
                  latestBerita.map((item: any) => (
                    <div key={item.id} className="flex gap-3 group">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                        {item.gambar_url ? (
                          <Image src={item.gambar_url} alt={item.judul} fill sizes="80px" className="object-cover group-hover:scale-110 transition duration-300" />
                        ) : (
                          <i className="fas fa-image text-2xl text-gray-300 w-full h-full flex items-center justify-center"></i>
                        )}
                      </div>
                      <div className="flex flex-col justify-center">
                        <Link href={`/berita/${item.slug || item.id}`} className="font-semibold text-gray-800 text-sm hover:text-green-700 transition line-clamp-2 leading-snug">
                          {item.judul}
                        </Link>
                        <span className="text-xs text-gray-400 mt-1"><i className="far fa-calendar mr-1"></i> {new Date(item.tanggal_publikasi).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">Belum ada berita lain.</p>
                )}
              </div>
            </div>
            
            <div className="bg-green-50 rounded-xl border border-green-100 p-6 text-center">
               <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl mx-auto mb-3">
                 <i className="fas fa-envelope-open-text"></i>
               </div>
               <h4 className="font-bold text-green-900 mb-2">Punya pertanyaan?</h4>
               <p className="text-sm text-green-800 mb-4">Hubungi layanan masyarakat kelurahan untuk informasi lebih lanjut.</p>
               <Link href="/kontak" className="inline-block px-4 py-2 bg-green-600 text-white text-sm font-bold rounded hover:bg-green-700 transition">Hubungi Kami</Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
