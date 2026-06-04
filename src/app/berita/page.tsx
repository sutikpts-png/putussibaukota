import Link from 'next/link';
import BeritaClient from './BeritaClient';

export const metadata = {
  title: 'Berita - Kelurahan Kedamin Hilir',
};

export default function BeritaPage() {
  return (
    <>
      {/* PAGE HERO */}
      <section className="page-hero text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-green-300 mb-3">
            <Link href="/" className="hover:text-white">Beranda</Link>
            <i className="fas fa-chevron-right text-[10px]"></i>
            <span className="text-white">Berita</span>
          </div>
          <h2 className="text-3xl font-extrabold">Berita & Informasi</h2>
          <p className="text-green-200 mt-2 text-sm">Informasi terkini seputar kegiatan dan pembangunan Kelurahan Kedamin Hilir.</p>
        </div>
      </section>

      {/* BERITA CONTENT (Client Component for Pagination & Filter) */}
      <BeritaClient />
    </>
  );
}
