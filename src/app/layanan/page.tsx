import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

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
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4">
                  {item.ikon_url ? (
                    <img src={item.ikon_url} alt="icon" className="w-8 h-8 object-contain" />
                  ) : (
                    <i className="fas fa-file-alt text-xl"></i>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.nama_layanan}</h3>
                <p className="text-sm text-gray-600 mb-4">{item.deskripsi}</p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">Persyaratan:</h4>
                  <div className="text-sm text-gray-600 prose prose-sm" dangerouslySetInnerHTML={{ __html: item.persyaratan || '-' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
