import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const revalidate = 60; // Regenerate every 60s

export default async function ProdukHukumPage() {
  const { data: produk, error } = await supabase
    .from('produk_hukum')
    .select('*')
    .order('tanggal_publikasi', { ascending: false });

  if (error) {
    console.error('Error fetching produk hukum:', error);
  }

  const produkList = produk || [];

  return (
    <>
      {/* PAGE HERO */}
      <section className="page-hero text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-green-300 mb-3">
            <Link href="/" className="hover:text-white">Beranda</Link>
            <i className="fas fa-chevron-right text-[10px]"></i>
            <span className="text-white">Produk Hukum</span>
          </div>
          <h2 className="text-3xl font-extrabold">Produk Hukum</h2>
          <p className="text-green-200 mt-2 text-sm">Arsip Peraturan, Keputusan, dan Surat Edaran Kelurahan Kedamin Hilir.</p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-2 mb-8">
          <button className="px-4 py-2 bg-green-700 text-white text-xs font-semibold rounded-full">Semua</button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-semibold rounded-full hover:bg-green-50 hover:border-green-300 transition">Peraturan Kelurahan</button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-semibold rounded-full hover:bg-green-50 hover:border-green-300 transition">Keputusan Lurah</button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-semibold rounded-full hover:bg-green-50 hover:border-green-300 transition">Surat Edaran</button>
        </div>

        {produkList.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
            <i className="fas fa-file-pdf text-4xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-bold text-gray-600">Belum ada produk hukum</h3>
            <p className="text-sm text-gray-400">Dokumen produk hukum yang dipublikasikan akan muncul di sini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produkList.map((item) => (
              <article key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden card-hover hover:shadow-md border border-gray-100 flex flex-col h-full">
                <div className="h-32 bg-slate-50 flex items-center justify-center relative overflow-hidden border-b border-gray-100">
                  <i className="fas fa-file-pdf text-5xl text-red-400 opacity-80"></i>
                  <span className="absolute top-3 left-3 bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow-sm">
                    {item.kategori}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-grow space-y-3">
                  <h4 className="font-bold text-gray-900 leading-snug">
                    {item.judul}
                  </h4>
                  <div className="text-xs text-gray-500 font-medium">
                    <div className="flex items-center gap-2 mb-1">
                      <i className="fas fa-hashtag w-4 text-center text-gray-400"></i> 
                      <span>Nomor: {item.nomor_surat || '-'} / Tahun: {item.tahun || '-'}</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <span className="text-xs text-gray-400"><i className="far fa-calendar mr-1"></i> {new Date(item.tanggal_publikasi).toLocaleDateString('id-ID')}</span>
                    {item.file_url ? (
                      <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                         <i className="fas fa-download"></i> PDF
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Tidak ada file</span>
                    )}
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
