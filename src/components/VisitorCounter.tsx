'use client';

import { useState, useEffect } from 'react';

export default function VisitorCounter() {
  const [stats, setStats] = useState({ harian: 0, bulanan: 0, tahunan: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch once per session to avoid overcounting if possible, 
    // or just fetch every time it mounts (simple approach).
    fetch('/api/kunjungan')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching stats:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <ul className="text-xs space-y-3 text-gray-400">
        <li className="flex justify-between items-center border-b border-gray-800 pb-1">
          <span><i className="fas fa-users text-yellow-400 mr-2"></i> Hari Ini</span>
          <span className="font-mono bg-gray-800 px-2 py-0.5 rounded text-white animate-pulse">...</span>
        </li>
        <li className="flex justify-between items-center border-b border-gray-800 pb-1">
          <span><i className="fas fa-chart-line text-yellow-400 mr-2"></i> Bulan Ini</span>
          <span className="font-mono bg-gray-800 px-2 py-0.5 rounded text-white animate-pulse">...</span>
        </li>
        <li className="flex justify-between items-center border-b border-gray-800 pb-1">
          <span><i className="fas fa-globe text-yellow-400 mr-2"></i> Total Tahun Ini</span>
          <span className="font-mono bg-gray-800 px-2 py-0.5 rounded text-white animate-pulse">...</span>
        </li>
      </ul>
    );
  }

  return (
    <ul className="text-xs space-y-3 text-gray-400">
      <li className="flex justify-between items-center border-b border-gray-800 pb-1">
        <span><i className="fas fa-users text-yellow-400 mr-2"></i> Hari Ini</span>
        <span className="font-mono bg-gray-800 px-2 py-0.5 rounded text-white">{stats.harian.toLocaleString('id-ID')}</span>
      </li>
      <li className="flex justify-between items-center border-b border-gray-800 pb-1">
        <span><i className="fas fa-chart-line text-yellow-400 mr-2"></i> Bulan Ini</span>
        <span className="font-mono bg-gray-800 px-2 py-0.5 rounded text-white">{stats.bulanan.toLocaleString('id-ID')}</span>
      </li>
      <li className="flex justify-between items-center border-b border-gray-800 pb-1">
        <span><i className="fas fa-globe text-yellow-400 mr-2"></i> Total Tahun Ini</span>
        <span className="font-mono bg-gray-800 px-2 py-0.5 rounded text-white">{stats.tahunan.toLocaleString('id-ID')}</span>
      </li>
    </ul>
  );
}
