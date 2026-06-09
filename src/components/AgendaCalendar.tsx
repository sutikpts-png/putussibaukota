'use client';
import { useState } from 'react';

export default function AgendaCalendar({ agendas }: { agendas: any[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  // Get agendas for selected date
  const getAgendasForDate = (date: Date) => {
    return agendas.filter(a => {
      if (!a.tanggal) return false;
      // Handle YYYY-MM-DD safely without timezone shifts
      const parts = a.tanggal.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const day = parseInt(parts[2].split('T')[0]); // handle if there's a time part
        return year === date.getFullYear() && month === date.getMonth() && day === date.getDate();
      }
      
      const aDate = new Date(a.tanggal);
      return aDate.getDate() === date.getDate() && 
             aDate.getMonth() === date.getMonth() && 
             aDate.getFullYear() === date.getFullYear();
    });
  };

  const selectedAgendas = selectedDate ? getAgendasForDate(selectedDate) : [];

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate calendar grid
  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 md:h-12 border-b border-r border-gray-200 bg-gray-50/40"></div>);
    }
    
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const iterDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const isToday = new Date().toDateString() === iterDate.toDateString();
      const isSelected = selectedDate?.toDateString() === iterDate.toDateString();
      const dayAgendas = getAgendasForDate(iterDate);

      days.push(
        <div 
          key={i} 
          onClick={() => handleDateClick(i)}
          className={`h-10 md:h-12 border-b border-r border-gray-200 p-0.5 md:p-1 cursor-pointer transition-colors relative
            ${isSelected ? 'bg-yellow-50/60 ring-1 ring-inset ring-yellow-400 z-10' : 'hover:bg-gray-50'}
            ${isToday ? 'bg-blue-50/20' : 'bg-white'}
          `}
        >
          <div className="flex justify-end items-start mb-0.5">
            <span className={`text-[10px] md:text-xs font-medium ${isToday ? 'text-blue-600 font-bold' : 'text-gray-500'} ${isSelected ? 'text-yellow-700' : ''}`}>
              {i}
            </span>
          </div>
          <div className="space-y-0.5 overflow-y-auto max-h-[22px] md:max-h-[28px] scrollbar-none">
            {dayAgendas.map(agenda => (
              <div 
                key={agenda.id} 
                className="text-[7px] md:text-[8px] bg-[#408aab] text-white px-1 py-[1px] rounded-[2px] truncate shadow-sm cursor-pointer hover:bg-[#2b6581] transition leading-tight"
                title={agenda.judul}
              >
                {agenda.judul}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    // Calculate how many empty cells needed to complete the last row
    const totalCells = firstDayOfMonth + daysInMonth;
    const remainingCells = 7 - (totalCells % 7);
    if (remainingCells < 7) {
      for (let i = 0; i < remainingCells; i++) {
        days.push(<div key={`empty-end-${i}`} className="h-10 md:h-12 border-b border-r border-gray-200 bg-gray-50/40"></div>);
      }
    }
    
    return days;
  };

  return (
    <div className="flex flex-col gap-6 bg-transparent w-full">
      {/* Calendar Grid (Top Side) */}
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm md:text-base font-bold text-gray-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-1.5">
            <div className="flex rounded-md shadow-sm">
              <button onClick={prevMonth} className="px-2 py-1 border border-gray-300 rounded-l-md hover:bg-gray-50 text-gray-600 font-bold text-xs">
                {'<'}
              </button>
              <button onClick={nextMonth} className="px-2 py-1 border-t border-b border-r border-gray-300 rounded-r-md hover:bg-gray-50 text-gray-600 font-bold text-xs">
                {'>'}
              </button>
            </div>
            <button onClick={goToToday} className="px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-xs font-medium text-gray-600 shadow-sm">
              today
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="border-t border-l border-gray-200">
          {/* Days Header */}
          <div className="grid grid-cols-7 bg-white">
            {dayNames.map(day => (
              <div key={day} className="py-1.5 text-center text-[10px] md:text-xs font-bold text-gray-800 border-r border-b border-gray-200">
                {day}
              </div>
            ))}
          </div>
          {/* Days Grid */}
          <div className="grid grid-cols-7 bg-white">
            {renderCalendarDays()}
          </div>
        </div>
      </div>

      {/* Sidebar (Bottom Side) */}
      <div className="w-full shrink-0">
        <h3 className="text-base font-bold text-gray-800 mb-2 border-t border-gray-100 pt-4">Rincian Agenda</h3>
        
        <div className="border border-gray-200 rounded-lg p-3 md:p-4 bg-gray-50 shadow-inner flex flex-col min-h-[250px]">
          <div className="mb-4 border-b border-gray-200 pb-3">
            <h4 className="text-[11px] font-medium text-gray-500 mb-0.5">Tanggal :</h4>
            <p className="font-bold text-gray-900 text-sm">
              {selectedDate ? selectedDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-thin">
            {selectedAgendas.length > 0 ? (
              selectedAgendas.map((agenda, idx) => (
                <div key={agenda.id} className={`${idx !== 0 ? 'border-t border-gray-200 pt-4' : ''}`}>
                  <div className="mb-3">
                    <h4 className="text-[11px] font-medium text-gray-500 mb-0.5">Kegiatan :</h4>
                    <p className="text-gray-800 text-xs font-semibold leading-relaxed">{agenda.judul}</p>
                  </div>
                  
                  <div className="mb-3">
                    <h4 className="text-[11px] font-medium text-gray-500 mb-0.5">Tempat :</h4>
                    <p className="text-gray-800 text-xs leading-relaxed">{agenda.lokasi || '-'}</p>
                  </div>

                  <div className="mb-3">
                    <h4 className="text-[11px] font-medium text-gray-500 mb-0.5">Waktu :</h4>
                    <p className="text-gray-800 text-xs">{agenda.waktu || '-'}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-[11px] font-medium text-gray-500 mb-0.5">Yang Menghadiri :</h4>
                    <p className="text-gray-800 text-xs whitespace-pre-wrap leading-relaxed">{agenda.keterangan || '-'}</p>
                  </div>

                  {agenda.arsip_url && (
                    <a href={agenda.arsip_url} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-[#0c8a4b] hover:bg-green-800 text-white font-medium py-1.5 px-3 rounded text-xs shadow transition cursor-pointer">
                      <i className="fas fa-download"></i> Unduh Arsip
                    </a>
                  )}
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-6 opacity-60">
                <i className="far fa-calendar-times text-3xl text-gray-300 mb-2"></i>
                <p className="text-gray-500 text-xs">Tidak ada agenda pada tanggal ini.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
