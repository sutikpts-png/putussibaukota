'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';

export default function HeroSection({ web, sliders }: { web: any, sliders: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Fallback to global setting if no sliders active
  const hasSliders = sliders && sliders.length > 0;
  
  // Current text to display based on active slide or fallback
  let currentTitle = web?.hero_title || 'Selamat Datang di<br/><span class="text-yellow-300">Kelurahan Kedamin Hilir</span>';
  let currentSubtitle = web?.hero_subtitle || 'Melayani masyarakat dengan tulus, transparan, dan profesional demi terwujudnya kelurahan yang maju, sejahtera, dan berdaya saing.';

  if (hasSliders && sliders[activeIndex]) {
    const slide = sliders[activeIndex];
    if (slide.judul && slide.judul.trim() !== '') {
      currentTitle = slide.judul;
    }
    if (slide.deskripsi && slide.deskripsi.trim() !== '') {
      currentSubtitle = slide.deskripsi;
    }
  }

  // Determine images array
  let images = ['/assets/img/hero-bg.jpg'];
  if (hasSliders) {
    images = sliders.map(s => s.image_url || '/assets/img/hero-bg.jpg');
  } else if (web?.hero_image_url) {
    try {
      const parsed = JSON.parse(web.hero_image_url);
      if (Array.isArray(parsed) && parsed.length > 0) {
        images = parsed;
      } else if (typeof parsed === 'string') {
        images = [parsed];
      }
    } catch (e) {
      images = [web.hero_image_url];
    }
  }

  return (
    <section className="relative text-white py-20 px-4 overflow-hidden bg-green-900 transition-all duration-500">
      <div 
        className="absolute top-0 left-0 w-full h-16 z-20 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.7) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)'
        }}
      ></div>
      
      {/* BACKGROUND SLIDER */}
      <div className="absolute inset-0 z-0 bg-green-900">
        {images.length <= 1 ? (
          <div 
            className="w-full h-full opacity-100" 
            style={{ backgroundImage: `url('${images[0]}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          ></div>
        ) : (
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            speed={1500}
            autoplay={{
              delay: 8000,
              disableOnInteraction: false,
            }}
            loop={true}
            allowTouchMove={false}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="w-full h-full"
          >
            {images.map((img, index) => (
              <SwiperSlide key={index}>
                <div 
                  className="w-full h-full opacity-100" 
                  style={{ backgroundImage: `url('${img}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-green-900 via-green-900 to-teal-800 opacity-[0.65] z-0"></div>
      
      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        {/* TEXT CONTENT */}
        <div className="space-y-6 drop-shadow-md min-h-[250px] flex flex-col justify-center">
          <div>
            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
              Pemerintahan Kelurahan
            </span>
          </div>
          {/* Key on activeIndex forces re-render/animation when slide changes */}
          <div key={`text-${activeIndex}`} className="fade-in space-y-6">
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight drop-shadow-md" dangerouslySetInnerHTML={{ __html: currentTitle }}></h2>
            <p className="text-green-100 text-base md:text-lg max-w-xl drop-shadow-md">{currentSubtitle}</p>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <Link href="/layanan" className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold px-6 py-3 rounded-lg shadow-lg transition transform hover:-translate-y-0.5">
              <i className="fas fa-concierge-bell mr-2"></i>Layanan Warga
            </Link>
            <Link href="/profil" className="border border-white/40 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-lg transition">
              <i className="fas fa-info-circle mr-2"></i>Profil Kelurahan
            </Link>
          </div>
        </div>

        {/* STATISTIK SINGKAT */}
        <div className="grid grid-cols-2 gap-4">
          <div className="stat-card rounded-xl p-5 text-center border border-white/20 bg-black/20 backdrop-blur-sm hover:bg-black/40 transition">
            <i className="fas fa-users text-3xl text-yellow-300 mb-2"></i>
            <div className="text-3xl font-extrabold text-white">{web?.stat_penduduk || '12.450'}</div>
            <div className="text-xs text-green-200 mt-1">Jumlah Penduduk</div>
          </div>
          <div className="stat-card rounded-xl p-5 text-center border border-white/20 bg-black/20 backdrop-blur-sm hover:bg-black/40 transition">
            <i className="fas fa-home text-3xl text-yellow-300 mb-2"></i>
            <div className="text-3xl font-extrabold text-white">{web?.stat_kk || '3.820'}</div>
            <div className="text-xs text-green-200 mt-1">Kepala Keluarga</div>
          </div>
          <div className="stat-card rounded-xl p-5 text-center border border-white/20 bg-black/20 backdrop-blur-sm hover:bg-black/40 transition">
            <i className="fas fa-map-marked-alt text-3xl text-yellow-300 mb-2"></i>
            <div className="text-3xl font-extrabold text-white">{web?.stat_dusun || '12'}</div>
            <div className="text-xs text-green-200 mt-1">Dusun / RW</div>
          </div>
          <div className="stat-card rounded-xl p-5 text-center border border-white/20 bg-black/20 backdrop-blur-sm hover:bg-black/40 transition">
            <i className="fas fa-road text-3xl text-yellow-300 mb-2"></i>
            <div className="text-3xl font-extrabold text-white">{web?.stat_luas || '8,4 km²'}</div>
            <div className="text-xs text-green-200 mt-1">Luas Wilayah</div>
          </div>
        </div>
      </div>
    </section>
  );
}
