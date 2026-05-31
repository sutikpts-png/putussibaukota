import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function PotensiPage() {
  const { data: potensi } = await supabase
    .from('potensi')
    .select('*')
    .order('created_at', { ascending: true });

  const potensiList = potensi || [];

  return (
    <>
      <section className="page-hero text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-green-300 mb-3">
            <Link href="/" className="hover:text-white">Beranda</Link>
            <i className="fas fa-chevron-right text-[10px]"></i>
            <span className="text-white">Potensi</span>
          </div>
          <h2 className="text-3xl font-extrabold">Potensi Kelurahan</h2>
          <p className="text-green-200 mt-2 text-sm">Jelajahi potensi alam, budaya, dan ekonomi yang menjadi keunggulan kami.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        {potensiList.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
             <i className="fas fa-leaf text-4xl text-gray-300 mb-4"></i>
             <h3 className="text-lg font-bold text-gray-600">Belum ada data potensi</h3>
           </div>
        ) : (
          <div className="space-y-12">
            {potensiList.map((item, index) => (
              <div key={item.id} className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="w-full md:w-1/2">
                  <div className="rounded-2xl overflow-hidden shadow-lg h-64 md:h-80 relative">
                    {item.gambar_url ? (
                      <img src={item.gambar_url} alt={item.nama_potensi} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-green-100 flex items-center justify-center">
                        <i className="fas fa-image text-6xl text-green-300"></i>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                  <h3 className="text-2xl font-bold text-green-900">{item.nama_potensi}</h3>
                  <div className="w-16 h-1 bg-yellow-400 rounded-full"></div>
                  <div className="text-gray-600 leading-relaxed prose prose-green" dangerouslySetInnerHTML={{ __html: item.deskripsi }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
