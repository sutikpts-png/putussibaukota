'use client';

import { useState } from 'react';
import SurveyModal from './SurveyModal';

export default function FloatingSurveyButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* FLOATING SURVEY BUTTON */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed top-1/2 right-4 -translate-y-1/2 z-[9999] bg-green-800 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl shadow-green-900/30 hover:-translate-x-1 hover:shadow-2xl transition-all duration-300 group"
        title="Isi Survey Kepuasan"
      >
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white animate-pulse"></div>
        <i className="fas fa-clipboard-list text-2xl group-hover:scale-110 transition-transform"></i>
      </button>

      {/* MODAL */}
      <SurveyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
