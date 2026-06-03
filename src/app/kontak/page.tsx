import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function KontakPage() {
  const { data: web } = await supabase
    .from('pengaturan_web')
    .select('*')
    .eq('id', 1)
    .single();

  const kelurahan = web?.nama_kelurahan || 'Kedamin Hilir';
  const kecKab = web?.nama_kecamatan_kabupaten || 'Kapuas Hulu';
  const queryMap = `${kelurahan} ${kecKab}`;
  let gmapsIframe = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.0!2d110.42!3d-7.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMzknMDAuMCJTIDExMMKwMjUnMTIuMCJF!5e0!3m2!1sid!2sid!4v1';
  
  if (web?.gmaps_iframe) {
    const userInput = web.gmaps_iframe;
    // Jika user mem-paste seluruh tag <iframe>
    if (userInput.includes('<iframe') && userInput.includes('src="')) {
      const match = userInput.match(/src="([^"]+)"/);
      if (match && match[1]) {
        gmapsIframe = match[1];
      }
    } 
    // Jika user mem-paste URL embed yang benar
    else if (userInput.includes('/embed') || userInput.includes('output=embed')) {
      gmapsIframe = userInput;
    }
    // Jika salah (paste link biasa), gunakan query lokasi yang lebih umum agar tidak ditolak (X-Frame-Options)
    else {
      gmapsIframe = `https://maps.google.com/maps?q=${encodeURIComponent(queryMap)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
    }
  }

  return (
    <>
      <section className="page-hero text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-green-300 mb-3">
            <Link href="/" className="hover:text-white">Beranda</Link>
            <i className="fas fa-chevron-right text-[10px]"></i>
            <span className="text-white">Kontak</span>
          </div>
          <h2 className="text-3xl font-extrabold">Hubungi Kami</h2>
          <p className="text-green-200 mt-2 text-sm">Sampaikan aspirasi, pertanyaan, atau keluhan Anda kepada kami.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12">
          {/* Info Kontak */}
          <div className="space-y-8">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-green-900 mb-4">Informasi Kontak</h3>
              <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
                Pemerintah Kelurahan Kedamin Hilir senantiasa terbuka untuk komunikasi dengan warga. Silakan hubungi kami melalui kontak di bawah ini atau kunjungi kantor kami pada jam kerja.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-map-marker-alt text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Alamat Kantor</h4>
                  <p className="text-gray-600 text-sm mt-1">{web?.alamat || 'Jl. Kaliurang Km. 17, Kedamin Hilir, Pakem, Sleman 55582'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-phone-alt text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Telepon</h4>
                  <p className="text-gray-600 text-sm mt-1">{web?.telepon || '(0274) 895123'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-envelope text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Email</h4>
                  <p className="text-gray-600 text-sm mt-1">{web?.email || 'kedaminhilir@slemankab.go.id'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-clock text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Jam Layanan</h4>
                  <p className="text-gray-600 text-sm mt-1">{web?.jam_operasional || 'Senin - Jumat: 08:00 - 15:00 WIB'}</p>
                </div>
              </div>
            </div>
            
            <div className="pt-10 border-t border-gray-100 mt-10 text-center">
              <h4 className="font-bold text-gray-900 mb-4">Media Sosial</h4>
              <div className="flex justify-center gap-4">
                <a href={web?.link_facebook || '#'} className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-1">
                  <i className="fab fa-facebook-f text-lg"></i>
                </a>
                <a href={web?.link_instagram || '#'} className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-1">
                  <i className="fab fa-instagram text-lg"></i>
                </a>
                <a href={web?.link_youtube || '#'} className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-1">
                  <i className="fab fa-youtube text-lg"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Peta */}
      <section className="h-96 w-full">
        <iframe
          src={gmapsIframe}
          width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
        ></iframe>
      </section>
    </>
  );
}
