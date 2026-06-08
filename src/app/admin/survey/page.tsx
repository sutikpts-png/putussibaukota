'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SurveyPage() {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
  const chartData = [
    { name: 'Sangat Baik', Prosedur: 0, Kecepatan: 0, Petugas: 0 },
    { name: 'Baik', Prosedur: 0, Kecepatan: 0, Petugas: 0 },
    { name: 'Cukup', Prosedur: 0, Kecepatan: 0, Petugas: 0 },
    { name: 'Kurang', Prosedur: 0, Kecepatan: 0, Petugas: 0 },
  ];

  surveys.forEach(s => {
    const p = chartData.find(d => d.name === s.kemudahan_prosedur);
    if (p) p.Prosedur += 1;
    
    const k = chartData.find(d => d.name === s.kecepatan_pelayanan);
    if (k) k.Kecepatan += 1;

    const pt = chartData.find(d => d.name === s.kesopanan_petugas);
    if (pt) pt.Petugas += 1;
  });

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

      {/* Statistik Grafik */}
      {!loading && surveys.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4"><i className="fas fa-chart-bar text-blue-600 mr-2"></i>Statistik Kepuasan Masyarakat</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{fill: '#6b7280', fontSize: 12}} tickLine={false} axisLine={{stroke: '#d1d5db'}} />
                <YAxis tick={{fill: '#6b7280', fontSize: 12}} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'}} />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <Bar dataKey="Prosedur" fill="#3b82f6" name="Kemudahan Prosedur" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="Kecepatan" fill="#10b981" name="Kecepatan Pelayanan" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="Petugas" fill="#f59e0b" name="Kesopanan Petugas" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                surveys.map((item) => (
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
      </div>
    </div>
  );
}
