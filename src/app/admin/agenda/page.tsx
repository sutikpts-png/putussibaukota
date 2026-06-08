'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminAgenda() {
  const [agendas, setAgendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgenda();
  }, []);

  async function fetchAgenda() {
    const { data, error } = await supabase
      .from('agenda')
      .select('*')
      .order('tanggal', { ascending: false });
    
    if (data) setAgendas(data);
    setLoading(false);
  }

  async function hapusAgenda(id: string) {
    if (confirm('Yakin ingin menghapus agenda ini?')) {
      await supabase.from('agenda').delete().eq('id', id);
      fetchAgenda();
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Agenda Pimpinan</h1>
          <p className="text-slate-500 mt-1">Kelola jadwal kegiatan pimpinan kelurahan.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/agenda/tambah" className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-bold shadow-lg transition-all active:scale-95">
            <i className="fas fa-plus"></i>
            <span>Tambah Agenda</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="text-center text-slate-500 py-12 font-medium italic">Memuat data...</div>
        ) : agendas.length === 0 ? (
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-700 uppercase">
                   <tr>
                      <th className="px-6 py-4 font-black tracking-widest">Judul <span className="text-blue-500 ml-1">▲</span></th>
                      <th className="px-6 py-4 font-black tracking-widest">Tanggal <span className="text-slate-300 ml-1">◆</span></th>
                      <th className="px-6 py-4 font-black tracking-widest">Waktu <span className="text-slate-300 ml-1">◆</span></th>
                      <th className="px-6 py-4 font-black tracking-widest">Lokasi <span className="text-slate-300 ml-1">◆</span></th>
                      <th className="px-6 py-4 font-black tracking-widest text-right">Aksi</th>
                   </tr>
                </thead>
             </table>
             <div className="p-12 text-center text-slate-400 font-medium italic">Belum ada agenda pimpinan.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-700 uppercase">
                <tr>
                  <th className="px-6 py-4 font-black tracking-widest">Judul <span className="text-blue-500 ml-1">▲</span></th>
                  <th className="px-6 py-4 font-black tracking-widest">Tanggal <span className="text-slate-300 ml-1">◆</span></th>
                  <th className="px-6 py-4 font-black tracking-widest">Waktu <span className="text-slate-300 ml-1">◆</span></th>
                  <th className="px-6 py-4 font-black tracking-widest">Lokasi <span className="text-slate-300 ml-1">◆</span></th>
                  <th className="px-6 py-4 font-black tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {agendas.map((item) => (
                  <tr key={item.id} className="bg-white hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{item.judul}</td>
                    <td className="px-6 py-4 font-medium text-slate-500">
                      {new Date(item.tanggal).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-500">{item.waktu || '-'}</td>
                    <td className="px-6 py-4 font-medium text-slate-500">{item.lokasi || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Link 
                          href={`/admin/agenda/edit/${item.id}`}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button 
                          onClick={() => hapusAgenda(item.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Hapus"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
