'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminVisitorFilter() {
  const [filter, setFilter] = useState('hari'); // 'hari', 'bulan', 'tahun'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Ambil seluruh data kunjungan.
      // (Untuk website berskala besar ini perlu dilimit/paginate dari API, 
      // namun untuk skala kelurahan data masih aman diolah di client)
      const { data: rawStats, error } = await supabase
        .from('statistik_pengunjung')
        .select('tanggal, jumlah')
        .order('tanggal', { ascending: false });

      if (error || !rawStats) {
        setData([]);
        setLoading(false);
        return;
      }

      const grouped: Record<string, any> = {};

      rawStats.forEach((row) => {
        if (startDate && row.tanggal < startDate) return;
        if (endDate && row.tanggal > endDate) return;

        let key = row.tanggal; // YYYY-MM-DD
        let label = '';

        try {
          const d = new Date(row.tanggal);
          
          if (filter === 'hari') {
            key = row.tanggal;
            label = d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
          } else if (filter === 'bulan') {
            key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            label = d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
          } else if (filter === 'tahun') {
            key = `${d.getFullYear()}`;
            label = `${d.getFullYear()}`;
          }

          if (!grouped[key]) {
            grouped[key] = { label, jumlah: 0, sortKey: key };
          }
          grouped[key].jumlah += row.jumlah;
        } catch (e) {
          console.error(e);
        }
      });

      const processedData = Object.values(grouped).sort((a, b) => b.sortKey.localeCompare(a.sortKey));
      setData(processedData);
      setLoading(false);
    }
    fetchData();
  }, [filter, startDate, endDate]);

  // Helper untuk mendapatkan lebar progress bar (max 100%)
  const maxVisits = data.length > 0 ? Math.max(...data.map(d => d.jumlah)) : 1;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Detail Laporan Pengunjung</h3>
          <p className="text-xs text-gray-500">Lihat rincian data pengunjung website kelurahan.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <div className="flex items-center gap-2 text-sm bg-gray-50 border border-gray-200 p-1.5 rounded-lg">
            <span className="text-xs text-gray-500 pl-1">Dari:</span>
            <input 
              type="date" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)} 
              className="bg-transparent border-none text-gray-700 text-xs focus:ring-0 cursor-pointer" 
            />
            <span className="text-gray-400">|</span>
            <span className="text-xs text-gray-500">Sampai:</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)} 
              className="bg-transparent border-none text-gray-700 text-xs focus:ring-0 cursor-pointer" 
            />
            {(startDate || endDate) && (
              <button onClick={() => { setStartDate(''); setEndDate(''); }} className="text-red-500 hover:text-red-700 p-1 rounded-md" title="Reset Rentang Tanggal">
                <i className="fas fa-times-circle"></i>
              </button>
            )}
          </div>

          <div className="bg-gray-100 p-1 rounded-lg inline-flex">
          <button 
            onClick={() => setFilter('hari')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition ${filter === 'hari' ? 'bg-white shadow text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Harian
          </button>
          <button 
            onClick={() => setFilter('bulan')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition ${filter === 'bulan' ? 'bg-white shadow text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Bulanan
          </button>
          <button 
            onClick={() => setFilter('tahun')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition ${filter === 'tahun' ? 'bg-white shadow text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Tahunan
          </button>
        </div>
      </div>
    </div>

    <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 rounded-l-lg w-1/3">Periode</th>
              <th scope="col" className="px-4 py-3 w-1/6 text-center">Jumlah</th>
              <th scope="col" className="px-4 py-3 rounded-r-lg w-1/2">Visualisasi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
                  <i className="fas fa-spinner fa-spin mr-2"></i> Memuat data...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
                  Belum ada data kunjungan yang tercatat.
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={index} className="border-b last:border-0 border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.label}</td>
                  <td className="px-4 py-3 text-center font-bold text-green-700">{item.jumlah.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-3">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full" 
                        style={{ width: `${Math.max(1, (item.jumlah / maxVisits) * 100)}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
