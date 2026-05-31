import Link from 'next/link';

export default function Footer() {
  return (
    <>
      <footer className="bg-gray-900 text-gray-300 text-sm pt-12 pb-6 border-t-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Kontak */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base uppercase tracking-wide border-b border-gray-700 pb-2">Kontak Kami</h4>
            <p className="text-xs leading-relaxed text-gray-400">
              <strong className="text-white">Kelurahan Kedamin Hilir</strong><br/>
              Kecamatan Pakem, Kabupaten Sleman<br/>Daerah Istimewa Yogyakarta
            </p>
            <ul className="text-xs space-y-2 text-gray-400">
              <li><i className="fas fa-map-marker-alt text-yellow-400 mr-2"></i> Jl. Kaliurang Km. 17, Kedamin Hilir, Pakem, Sleman 55582</li>
              <li><i className="fas fa-phone text-yellow-400 mr-2"></i> (0274) 895123</li>
              <li><i className="fas fa-envelope text-yellow-400 mr-2"></i> kedaminhilir@slemankab.go.id</li>
              <li><i className="fas fa-clock text-yellow-400 mr-2"></i> Senin–Jumat: 08.00–16.00 WIB</li>
            </ul>
            <div className="flex gap-3 pt-2">
              <Link href="#" className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition"><i className="fab fa-facebook text-xs"></i></Link>
              <Link href="#" className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-500 transition"><i className="fab fa-instagram text-xs"></i></Link>
              <Link href="#" className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500 transition"><i className="fab fa-youtube text-xs"></i></Link>
            </div>
          </div>
          {/* Tautan */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base uppercase tracking-wide border-b border-gray-700 pb-2">Tautan Cepat</h4>
            <ul className="text-xs space-y-2 grid grid-cols-1 sm:grid-cols-2">
              <li><Link href="/" className="hover:text-yellow-400 transition"><i className="fas fa-chevron-right text-[10px] mr-1"></i> Beranda</Link></li>
              <li><Link href="/profil" className="hover:text-yellow-400 transition"><i className="fas fa-chevron-right text-[10px] mr-1"></i> Profil Kelurahan</Link></li>
              <li><Link href="/berita" className="hover:text-yellow-400 transition"><i className="fas fa-chevron-right text-[10px] mr-1"></i> Berita</Link></li>
              <li><Link href="/layanan" className="hover:text-yellow-400 transition"><i className="fas fa-chevron-right text-[10px] mr-1"></i> Layanan</Link></li>
              <li><Link href="/potensi" className="hover:text-yellow-400 transition"><i className="fas fa-chevron-right text-[10px] mr-1"></i> Potensi Desa</Link></li>
              <li><Link href="/galeri" className="hover:text-yellow-400 transition"><i className="fas fa-chevron-right text-[10px] mr-1"></i> Galeri</Link></li>
              <li><Link href="/kontak" className="hover:text-yellow-400 transition"><i className="fas fa-chevron-right text-[10px] mr-1"></i> Hubungi Kami</Link></li>
              <li><Link href="#" className="hover:text-yellow-400 transition"><i className="fas fa-chevron-right text-[10px] mr-1"></i> Pemkab Sleman</Link></li>
            </ul>
          </div>
          {/* Peta */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base uppercase tracking-wide border-b border-gray-700 pb-2">Lokasi Kantor</h4>
            <div className="w-full h-36 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-400 overflow-hidden relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.0!2d110.42!3d-7.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMzknMDAuMCJTIDExMMKwMjUnMTIuMCJF!5e0!3m2!1sid!2sid!4v1"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                title="Google Maps Lokasi Kelurahan Kedamin Hilir"
              >
              </iframe>
            </div>
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="inline-block text-xs text-yellow-400 hover:underline">
              <i className="fas fa-external-link-alt mr-1"></i> Buka di Google Maps
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-2">
          <p>© {new Date().getFullYear()} Kelurahan Kedamin Hilir, Kecamatan Pakem, Kabupaten Sleman. All Rights Reserved.</p>
          <p>Dikembangkan oleh Tim IT Kelurahan Kedamin Hilir</p>
        </div>
      </footer>
    </>
  );
}
