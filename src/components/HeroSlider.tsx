'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';

export default function HeroSlider({ images }: { images: string[] }) {
  if (!images || images.length === 0) {
    return <div className="absolute inset-0 bg-green-900"></div>;
  }

  // If there's only one image, just display it statically
  if (images.length === 1) {
    return (
      <div 
        className="absolute inset-0 opacity-100" 
        style={{ backgroundImage: `url('${images[0]}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      ></div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 bg-green-900">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={2500} // Very smooth, slow transition
        autoplay={{
          delay: 8000, // 8 seconds per slide (slower)
          disableOnInteraction: false,
        }}
        loop={true}
        allowTouchMove={false}
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
    </div>
  );
}
