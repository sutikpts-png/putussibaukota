import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import VisitorCounter from './VisitorCounter';

export const revalidate = 0;

export default async function Footer() {
  const { data: web } = await supabase.from('pengaturan_web').select('*').eq('id', 1).single();

  const kelurahan = web?.nama_kelurahan || 'Putussibau Kota';
  const kecKab = web?.nama_kecamatan_kabupaten || 'Kecamatan Putussibau Utara · Kabupaten Kapuas Hulu · Kalbar';
  const alamat = web?.alamat || 'Jl. Putussibau, Putussibau Kota, Kapuas Hulu';
  const telepon = web?.telepon || '-';
  const email = web?.email || 'putussibauk@kapuashulukab.go.id';
  const jam_operasional = web?.jam_operasional || 'Senin–Jumat: 08.00–16.00 WIB';
  const fb = web?.link_facebook || '#';
  const ig = web?.link_instagram || '#';
  const yt = web?.link_youtube || '#';
  const gmapsLink = web?.link_gmaps || 'https://maps.google.com';
  
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
    // Jika salah (paste link biasa), gunakan alamat umum sebagai fallback embed
    else {
      const queryMap = `${kelurahan} ${kecKab.replace(' · ', ', ').replace(' · ', ', ')}`;
      gmapsIframe = `https://maps.google.com/maps?q=${encodeURIComponent(queryMap)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
    }
  }
  
  const tautanCepat = web?.tautan_cepat ? 
    (typeof web.tautan_cepat === 'string' ? JSON.parse(web.tautan_cepat) : web.tautan_cepat) : 
    [
      { judul: 'Beranda', url: '/' },
      { judul: 'Profil Kelurahan', url: '/profil' },
      { judul: 'Berita', url: '/berita' },
      { judul: 'Layanan', url: '/layanan' },
      { judul: 'Potensi Desa', url: '/potensi' },
      { judul: 'Galeri', url: '/galeri' },
      { judul: 'Hubungi Kami', url: '/kontak' },
      { judul: 'Pemkab Sleman', url: '#' }
    ];

  return (
    <>
      <footer className="bg-gray-900 text-gray-300 text-sm pt-12 pb-6 border-t-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Kontak */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base uppercase tracking-wide border-b border-gray-700 pb-2">Kontak Kami</h4>
            <p className="text-xs leading-relaxed text-gray-400">
              <strong className="text-white">Kelurahan {kelurahan}</strong><br/>
              {kecKab.replace(' · ', ', ').replace(' · ', ', ')}
            </p>
            <ul className="text-xs space-y-2 text-gray-400">
              <li><i className="fas fa-map-marker-alt text-yellow-400 mr-2"></i> {alamat}</li>
              <li><i className="fas fa-phone text-yellow-400 mr-2"></i> {telepon}</li>
              <li className="break-all"><i className="fas fa-envelope text-yellow-400 mr-2"></i> {email}</li>
              <li><i className="fas fa-clock text-yellow-400 mr-2"></i> {jam_operasional}</li>
            </ul>
            <div className="flex gap-3 pt-2">
              {fb !== '#' && fb !== '' && <Link href={fb} target="_blank" className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition"><i className="fab fa-facebook text-xs"></i></Link>}
              {ig !== '#' && ig !== '' && <Link href={ig} target="_blank" className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-500 transition"><i className="fab fa-instagram text-xs"></i></Link>}
              {yt !== '#' && yt !== '' && <Link href={yt} target="_blank" className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500 transition"><i className="fab fa-youtube text-xs"></i></Link>}
            </div>
          </div>
          {/* Tautan */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base uppercase tracking-wide border-b border-gray-700 pb-2">Tautan Cepat</h4>
            <ul className="text-xs space-y-2 grid grid-cols-1 sm:grid-cols-2">
              {tautanCepat.map((tautan: any, idx: number) => {
                let finalUrl = tautan.url.trim();
                
                // Jika tidak diawali http, /, atau #, asumsikan itu link luar (misal: kapuashulukab.go.id)
                if (!finalUrl.startsWith('http') && !finalUrl.startsWith('/') && !finalUrl.startsWith('#')) {
                  finalUrl = `https://${finalUrl}`;
                } else if (finalUrl.startsWith('www.')) {
                  finalUrl = `https://${finalUrl}`;
                }

                const isExternal = finalUrl.startsWith('http');

                return (
                  <li key={idx}>
                    {isExternal ? (
                      <a href={finalUrl} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition">
                        <i className="fas fa-chevron-right text-[10px] mr-1"></i> {tautan.judul}
                      </a>
                    ) : (
                      <Link href={finalUrl} className="hover:text-yellow-400 transition">
                        <i className="fas fa-chevron-right text-[10px] mr-1"></i> {tautan.judul}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          {/* Peta */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base uppercase tracking-wide border-b border-gray-700 pb-2">Lokasi Kantor</h4>
            <div className="w-full h-36 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-400 overflow-hidden relative">
              <iframe
                src={gmapsIframe}
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                title={`Google Maps Lokasi Kelurahan ${kelurahan}`}
              >
              </iframe>
            </div>
            {gmapsLink !== '#' && gmapsLink !== '' && (
              <a href={gmapsLink} target="_blank" rel="noopener noreferrer" className="inline-block text-xs text-yellow-400 hover:underline">
                <i className="fas fa-external-link-alt mr-1"></i> Buka di Google Maps
              </a>
            )}
          </div>
          {/* Statistik Pengunjung */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base uppercase tracking-wide border-b border-gray-700 pb-2">Statistik Pengunjung</h4>
            <VisitorCounter />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-2 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Kelurahan {kelurahan}, {kecKab.replace(' · ', ', ').replace(' · ', ', ')}. All Rights Reserved.</p>
          <p>di Kembangkan Oleh Dinas Komunikasi, Informatika dan Statistik Kabupaten Kapuas Hulu</p>
        </div>
      </footer>
    </>
  );
}
