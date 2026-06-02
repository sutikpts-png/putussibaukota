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

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info Kontak */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-green-900 mb-6">Informasi Kontak</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Pemerintah Kelurahan Kedamin Hilir senantiasa terbuka untuk komunikasi dengan warga. Silakan hubungi kami melalui kontak di bawah ini atau kunjungi kantor kami pada jam kerja.
              </p>
            </div>
            
            <div className="space-y-6">
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
            
            <div className="pt-6 border-t border-gray-100">
              <h4 className="font-bold text-gray-900 mb-4">Media Sosial</h4>
              <div className="flex gap-3">
                <a href={web?.link_facebook || '#'} className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href={web?.link_instagram || '#'} className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href={web?.link_youtube || '#'} className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
          </div>
          
          {/* Form Pengaduan */}
          <div id="pengaduan" className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-2xl font-bold text-green-900 mb-2">Kirim Pesan / Pengaduan</h3>
            <p className="text-gray-500 text-sm mb-6">Pesan Anda akan langsung masuk ke sistem antrean pelayanan kami.</p>
            
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap *</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition" placeholder="Masukkan nama Anda" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">No. WhatsApp / HP *</label>
                  <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition" placeholder="Contoh: 08123456789" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition" placeholder="Alamat email aktif" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori Pesan *</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition" required>
                  <option value="">-- Pilih Kategori --</option>
                  <option value="pengaduan">Pengaduan Infrastruktur / Layanan</option>
                  <option value="pertanyaan">Pertanyaan Umum</option>
                  <option value="saran">Saran & Masukan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Isi Pesan *</label>
                <textarea rows={5} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition resize-none" placeholder="Tuliskan pesan atau pengaduan Anda secara detail..." required></textarea>
              </div>
              <button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-4 rounded-lg transition shadow-md hover:shadow-lg">
                <i className="fas fa-paper-plane mr-2"></i> Kirim Pesan
              </button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Peta */}
      <section className="h-96 w-full">
        <iframe
          src={web?.gmaps_iframe || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.0!2d110.42!3d-7.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMzknMDAuMCJTIDExMMKwMjUnMTIuMCJF!5e0!3m2!1sid!2sid!4v1"}
          width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
        ></iframe>
      </section>
    </>
  );
}
