import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function ProfilPage() {
  const { data: profil } = await supabase
    .from('profil')
    .select('*')
    .single();

  return (
    <>
      <section className="page-hero text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-green-300 mb-3">
            <Link href="/" className="hover:text-white">Beranda</Link>
            <i className="fas fa-chevron-right text-[10px]"></i>
            <span className="text-white">Profil</span>
          </div>
          <h2 className="text-3xl font-extrabold">Profil Kelurahan</h2>
          <p className="text-green-200 mt-2 text-sm">Mengenal lebih dekat sejarah, visi, misi, dan wilayah Kelurahan Kedamin Hilir.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        {!profil ? (
           <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
             <i className="fas fa-info-circle text-4xl text-gray-300 mb-4"></i>
             <h3 className="text-lg font-bold text-gray-600">Data profil belum ditambahkan</h3>
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-12">
              <div id="sejarah">
                <h3 className="text-2xl font-bold text-green-900 border-b-2 border-green-100 pb-2 mb-4">Sejarah Kelurahan</h3>
                <div className="text-gray-600 leading-relaxed prose prose-green" dangerouslySetInnerHTML={{ __html: profil.sejarah }} />
              </div>
              
              <div id="visi-misi" className="bg-green-50 p-8 rounded-2xl border border-green-100">
                <h3 className="text-2xl font-bold text-green-900 text-center mb-6">Visi & Misi</h3>
                <div className="mb-8">
                  <h4 className="text-xl font-bold text-green-800 text-center mb-3">Visi</h4>
                  <div className="text-center text-lg italic text-gray-700" dangerouslySetInnerHTML={{ __html: profil.visi }} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-green-800 mb-3">Misi</h4>
                  <div className="text-gray-700 prose prose-green" dangerouslySetInnerHTML={{ __html: profil.misi }} />
                </div>
              </div>
              
              <div id="wilayah">
                <h3 className="text-2xl font-bold text-green-900 border-b-2 border-green-100 pb-2 mb-4">Data Wilayah</h3>
                <div className="text-gray-600 leading-relaxed prose prose-green" dangerouslySetInnerHTML={{ __html: profil.wilayah || 'Belum ada data wilayah.' }} />
              </div>
            </div>
            
            <div className="space-y-8">
              <div id="struktur" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Struktur Organisasi</h3>
                {profil.struktur_organisasi_url ? (
                  <Image src={profil.struktur_organisasi_url} alt="Struktur Organisasi" width={800} height={1000} className="w-full h-auto rounded-lg shadow-sm" />
                ) : (
                  <div className="bg-gray-100 h-40 rounded-lg flex items-center justify-center text-gray-400">
                    Belum ada struktur organisasi
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
