import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export const revalidate = 60;

export default async function LayananPage() {
  const { data: layanan } = await supabase
    .from('layanan')
    .select('*')
    .order('created_at', { ascending: true });

  const layananList = layanan || [];

  return (
    <>
      <section className="page-hero text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-green-300 mb-3">
            <Link href="/" className="hover:text-white">Beranda</Link>
            <i className="fas fa-chevron-right text-[10px]"></i>
            <span className="text-white">Layanan</span>
          </div>
          <h2 className="text-3xl font-extrabold">Layanan Masyarakat</h2>
          <p className="text-green-200 mt-2 text-sm">Informasi persyaratan dan prosedur layanan administrasi di Kelurahan Kedamin Hilir.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        {layananList.length === 0 ? (
           <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
             <i className="fas fa-file-alt text-4xl text-gray-300 mb-4"></i>
             <h3 className="text-lg font-bold text-gray-600">Belum ada layanan terdaftar</h3>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {layananList.map(item => (
              <Link href={`/layanan/${item.id}`} key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 card-hover hover:shadow-md hover:border-green-200 transition group flex flex-col h-full">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition">
                  {item.ikon_url ? (
                    <Image src={item.ikon_url} alt="icon" width={32} height={32} className="object-contain" />
                  ) : (
                    <i className="fas fa-file-alt text-xl"></i>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-700 transition">{item.nama_layanan}</h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow">{item.deskripsi}</p>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <span className="text-xs font-semibold text-green-600 group-hover:underline">Lihat Persyaratan →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
