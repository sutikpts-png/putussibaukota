'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SurveyPage() {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchSurveys();
  }, []);

  async function fetchSurveys() {
    setLoading(true);
    const { data, error } = await supabase
      .from('survey_kepuasan')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching surveys:', error);
    } else {
      setSurveys(data || []);
      setCurrentPage(1); // Reset to page 1 on fetch
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (confirm('Yakin ingin menghapus data survey ini?')) {
      const { error } = await supabase.from('survey_kepuasan').delete().eq('id', id);
      if (error) {
        alert('Gagal menghapus data: ' + error.message);
      } else {
        fetchSurveys();
      }
    }
  }

  // Menyiapkan data untuk grafik
  const chartDataProsedur = [
    { name: 'Sangat Baik', value: 0 },
    { name: 'Baik', value: 0 },
    { name: 'Cukup', value: 0 },
    { name: 'Kurang', value: 0 },
  ];
  const chartDataKecepatan = [
    { name: 'Sangat Baik', value: 0 },
    { name: 'Baik', value: 0 },
    { name: 'Cukup', value: 0 },
    { name: 'Kurang', value: 0 },
  ];
  const chartDataPetugas = [
    { name: 'Sangat Baik', value: 0 },
    { name: 'Baik', value: 0 },
    { name: 'Cukup', value: 0 },
    { name: 'Kurang', value: 0 },
  ];

  surveys.forEach(s => {
    const p = chartDataProsedur.find(d => d.name === s.kemudahan_prosedur);
    if (p) p.value += 1;
    
    const k = chartDataKecepatan.find(d => d.name === s.kecepatan_pelayanan);
    if (k) k.value += 1;

    const pt = chartDataPetugas.find(d => d.name === s.kesopanan_petugas);
    if (pt) pt.value += 1;
  });

  const COLORS: Record<string, string> = {
    'Sangat Baik': '#10b981', // green
    'Baik': '#3b82f6',        // blue
    'Cukup': '#f59e0b',       // yellow
    'Kurang': '#ef4444'       // red
  };

  const procData = chartDataProsedur.filter(d => d.value > 0);
  const kecData = chartDataKecepatan.filter(d => d.value > 0);
  const petData = chartDataPetugas.filter(d => d.value > 0);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = surveys.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(surveys.length / itemsPerPage);

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg text-sm">
          <p className="font-semibold text-gray-800">{payload[0].name}</p>
          <p className="text-gray-600">Jumlah: {payload[0].value} responden</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Hasil Survey Kepuasan</h1>
          <p className="text-gray-500 text-sm mt-1">Lihat dan kelola masukan dari masyarakat.</p>
        </div>
        <button onClick={fetchSurveys} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-semibold text-sm transition">
          <i className="fas fa-sync-alt mr-2"></i> Refresh
        </button>
      </div>

      {/* Statistik Grafik (Bentuk Lingkaran) */}
      {!loading && surveys.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2"><i className="fas fa-chart-pie text-blue-600 mr-2"></i>Statistik Kepuasan Masyarakat</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto">
            {/* Kemudahan Prosedur */}
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Kemudahan Prosedur</h3>
              <div className="w-full h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={procData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {procData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#ccc'} />
                      ))}
                    </Pie>
                    <Tooltip content={renderCustomTooltip} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-xs text-gray-600 text-center leading-relaxed">
                Sangat Baik = <span className="font-bold text-green-600">{chartDataProsedur[0].value}</span>,{' '}
                Baik = <span className="font-bold text-blue-600">{chartDataProsedur[1].value}</span>,{' '}
                Cukup = <span className="font-bold text-yellow-600">{chartDataProsedur[2].value}</span>,{' '}
                Kurang = <span className="font-bold text-red-600">{chartDataProsedur[3].value}</span>
              </div>
            </div>

            {/* Kecepatan Pelayanan */}
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Kecepatan Pelayanan</h3>
              <div className="w-full h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={kecData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {kecData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#ccc'} />
                      ))}
                    </Pie>
                    <Tooltip content={renderCustomTooltip} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-xs text-gray-600 text-center leading-relaxed">
                Sangat Baik = <span className="font-bold text-green-600">{chartDataKecepatan[0].value}</span>,{' '}
                Baik = <span className="font-bold text-blue-600">{chartDataKecepatan[1].value}</span>,{' '}
                Cukup = <span className="font-bold text-yellow-600">{chartDataKecepatan[2].value}</span>,{' '}
                Kurang = <span className="font-bold text-red-600">{chartDataKecepatan[3].value}</span>
              </div>
            </div>

            {/* Kesopanan Petugas */}
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Kesopanan Petugas</h3>
              <div className="w-full h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={petData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {petData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#ccc'} />
                      ))}
                    </Pie>
                    <Tooltip content={renderCustomTooltip} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-xs text-gray-600 text-center leading-relaxed">
                Sangat Baik = <span className="font-bold text-green-600">{chartDataPetugas[0].value}</span>,{' '}
                Baik = <span className="font-bold text-blue-600">{chartDataPetugas[1].value}</span>,{' '}
                Cukup = <span className="font-bold text-yellow-600">{chartDataPetugas[2].value}</span>,{' '}
                Kurang = <span className="font-bold text-red-600">{chartDataPetugas[3].value}</span>
              </div>
            </div>
          </div>
          
          {/* Custom Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
            {Object.keys(COLORS).map((key) => (
              <div key={key} className="flex items-center text-xs text-gray-600 font-medium">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[key] }}></div>
                {key}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-bold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Waktu & Tanggal</th>
                <th className="px-6 py-4">Profil Responden</th>
                <th className="px-6 py-4">Layanan</th>
                <th className="px-6 py-4">Penilaian</th>
                <th className="px-6 py-4">Kritik & Saran</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    <i className="fas fa-spinner fa-spin mr-2"></i> Memuat data...
                  </td>
                </tr>
              ) : surveys.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    <i className="fas fa-inbox text-4xl mb-3 text-gray-300 block"></i>
                    Belum ada data survey yang masuk.
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-800">{new Date(item.created_at).toLocaleDateString('id-ID')}</div>
                      <div className="text-xs text-gray-400">{new Date(item.created_at).toLocaleTimeString('id-ID')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800">{item.nama || 'Anonim'}</div>
                      <div className="text-xs text-gray-500">
                        {item.umur ? `${item.umur} thn` : '-'}, {item.jenis_kelamin}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100">
                        {item.jenis_layanan}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Prosedur:</span>
                        <span className={`font-semibold ${item.kemudahan_prosedur === 'Kurang' ? 'text-red-600' : 'text-green-600'}`}>{item.kemudahan_prosedur}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Kecepatan:</span>
                        <span className={`font-semibold ${item.kecepatan_pelayanan === 'Kurang' ? 'text-red-600' : 'text-green-600'}`}>{item.kecepatan_pelayanan}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Petugas:</span>
                        <span className={`font-semibold ${item.kesopanan_petugas === 'Kurang' ? 'text-red-600' : 'text-green-600'}`}>{item.kesopanan_petugas}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 line-clamp-3 italic">
                        {item.saran ? `"${item.saran}"` : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition" title="Hapus">
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {!loading && surveys.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="text-sm text-gray-500">
              Menampilkan <span className="font-semibold text-gray-700">{indexOfFirstItem + 1}</span> - <span className="font-semibold text-gray-700">{Math.min(indexOfLastItem, surveys.length)}</span> dari <span className="font-semibold text-gray-700">{surveys.length}</span> responden
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Sebelumnya
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
