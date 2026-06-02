import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import GalleryList from '@/components/GalleryList';

export const revalidate = 60;

export default async function GaleriPage() {
  const { data: galeri } = await supabase
    .from('galeri')
    .select('*')
    .order('created_at', { ascending: false });

  const galeriList = galeri || [];

  return (
    <>
      <section className="page-hero text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-green-300 mb-3">
            <Link href="/" className="hover:text-white">Beranda</Link>
            <i className="fas fa-chevron-right text-[10px]"></i>
            <span className="text-white">Galeri</span>
          </div>
          <h2 className="text-3xl font-extrabold">Galeri Dokumentasi</h2>
          <p className="text-green-200 mt-2 text-sm">Dokumentasi kegiatan dan momen penting di Kelurahan Kedamin Hilir.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <GalleryList items={galeriList} />
      </section>
    </>
  );
}
