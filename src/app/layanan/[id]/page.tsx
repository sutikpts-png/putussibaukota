import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export default async function LayananDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { data: layanan } = await supabase
    .from('layanan')
    .select('*')
    .eq('id', id)
    .single();

  if (!layanan) {
    notFound();
  }

  return (
    <>
      <section className="page-hero text-white py-12 px-4 bg-green-900">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-green-300 mb-4">
            <Link href="/" className="hover:text-white">Beranda</Link>
            <i className="fas fa-chevron-right text-[10px]"></i>
            <Link href="/layanan" className="hover:text-white">Layanan</Link>
            <i className="fas fa-chevron-right text-[10px]"></i>
            <span className="text-white truncate">{layanan.nama_layanan}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
              {layanan.ikon_url ? (
                <Image src={layanan.ikon_url} alt="icon" width={40} height={40} className="object-contain" />
              ) : (
                <i className="fas fa-file-alt text-3xl text-white"></i>
              )}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">{layanan.nama_layanan}</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-4">Deskripsi Layanan</h3>
            <p className="text-gray-700 leading-relaxed mb-8">
              {layanan.deskripsi}
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-4">Persyaratan</h3>
            <div 
              className="prose prose-green max-w-none text-gray-700 bg-gray-50 p-6 rounded-xl border border-gray-100"
              dangerouslySetInnerHTML={{ __html: layanan.persyaratan || '<p>Tidak ada persyaratan khusus.</p>' }} 
            />
          </div>
          
          <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-between items-center">
            <Link href="/layanan" className="text-green-700 font-semibold hover:text-green-800 transition flex items-center gap-2">
              <i className="fas fa-arrow-left"></i> Kembali ke Daftar Layanan
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
