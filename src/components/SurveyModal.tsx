'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SurveyModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    umur: '',
    jenis_kelamin: 'Laki-laki',
    jenis_layanan: 'Administrasi Kependudukan (KTP/KK)',
    kemudahan_prosedur: 'Baik',
    kecepatan_pelayanan: 'Baik',
    kesopanan_petugas: 'Baik',
    saran: ''
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('survey_kepuasan').insert([
      {
        nama: formData.nama || 'Anonim',
        umur: formData.umur ? parseInt(formData.umur) : null,
        jenis_kelamin: formData.jenis_kelamin,
        jenis_layanan: formData.jenis_layanan,
        kemudahan_prosedur: formData.kemudahan_prosedur,
        kecepatan_pelayanan: formData.kecepatan_pelayanan,
        kesopanan_petugas: formData.kesopanan_petugas,
        saran: formData.saran
      }
    ]);

    setLoading(false);

    if (error) {
      alert('Terjadi kesalahan saat mengirim survey: ' + error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({
          nama: '', umur: '', jenis_kelamin: 'Laki-laki',
          jenis_layanan: 'Administrasi Kependudukan (KTP/KK)',
          kemudahan_prosedur: 'Baik', kecepatan_pelayanan: 'Baik',
          kesopanan_petugas: 'Baik', saran: ''
        });
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col relative animate-fade-in-up">
        {/* Header */}
        <div className="bg-[#243d8c] text-white p-5 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i className="fas fa-clipboard-list text-xl"></i>
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Survey Kepuasan Masyarakat</h3>
              <p className="text-blue-100 text-xs">Kelurahan Putussibau Kota</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition text-white">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-check text-4xl"></i>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Terima Kasih!</h4>
              <p className="text-gray-500">Masukan dan saran Anda sangat berharga untuk peningkatan kualitas pelayanan kami.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                Bantu kami meningkatkan kualitas pelayanan dengan mengisi survey singkat di bawah ini.
              </p>

              {/* Data Diri (Opsional) */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                <h5 className="font-bold text-gray-800 text-sm border-b pb-2">Data Pengunjung (Opsional)</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Nama Lengkap</label>
                    <input type="text" name="nama" value={formData.nama} onChange={handleChange} placeholder="Biarkan kosong jika ingin anonim" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Umur</label>
                      <input type="number" name="umur" value={formData.umur} onChange={handleChange} placeholder="Tahun" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Jenis Kelamin</label>
                      <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pertanyaan Survey */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1">1. Jenis Layanan yang Diurus <span className="text-red-500">*</span></label>
                  <select name="jenis_layanan" required value={formData.jenis_layanan} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="Administrasi Kependudukan (KTP/KK)">Administrasi Kependudukan (KTP/KK)</option>
                    <option value="Surat Keterangan Usaha (SKU)">Surat Keterangan Usaha (SKU)</option>
                    <option value="Surat Keterangan Tidak Mampu (SKTM)">Surat Keterangan Tidak Mampu (SKTM)</option>
                    <option value="Surat Keterangan Pindah">Surat Keterangan Pindah</option>
                    <option value="Surat Pengantar Nikah">Surat Pengantar Nikah</option>
                    <option value="Layanan Lainnya">Layanan Lainnya</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <label className="block text-sm font-bold text-gray-800 mb-3">2. Kemudahan Prosedur Layanan <span className="text-red-500">*</span></label>
                    <div className="space-y-2">
                      {['Sangat Baik', 'Baik', 'Cukup', 'Kurang'].map(val => (
                        <label key={`prosedur-${val}`} className={`flex items-center p-2 rounded cursor-pointer border transition ${formData.kemudahan_prosedur === val ? 'bg-blue-50 border-blue-200' : 'border-transparent hover:bg-gray-50'}`}>
                          <input type="radio" name="kemudahan_prosedur" value={val} checked={formData.kemudahan_prosedur === val} onChange={handleChange} className="mr-3 text-blue-600 focus:ring-blue-500" required />
                          <span className="text-sm text-gray-700">{val}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <label className="block text-sm font-bold text-gray-800 mb-3">3. Kecepatan Waktu Pelayanan <span className="text-red-500">*</span></label>
                    <div className="space-y-2">
                      {['Sangat Baik', 'Baik', 'Cukup', 'Kurang'].map(val => (
                        <label key={`kecepatan-${val}`} className={`flex items-center p-2 rounded cursor-pointer border transition ${formData.kecepatan_pelayanan === val ? 'bg-blue-50 border-blue-200' : 'border-transparent hover:bg-gray-50'}`}>
                          <input type="radio" name="kecepatan_pelayanan" value={val} checked={formData.kecepatan_pelayanan === val} onChange={handleChange} className="mr-3 text-blue-600 focus:ring-blue-500" required />
                          <span className="text-sm text-gray-700">{val}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200 md:col-span-2">
                    <label className="block text-sm font-bold text-gray-800 mb-3">4. Sikap dan Kesopanan Petugas <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {['Sangat Baik', 'Baik', 'Cukup', 'Kurang'].map(val => (
                        <label key={`kesopanan-${val}`} className={`flex items-center justify-center p-2 rounded cursor-pointer border transition text-center ${formData.kesopanan_petugas === val ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                          <input type="radio" name="kesopanan_petugas" value={val} checked={formData.kesopanan_petugas === val} onChange={handleChange} className="hidden" required />
                          <span className="text-sm">{val}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1">5. Kritik, Saran, & Masukan</label>
                  <textarea name="saran" rows={3} value={formData.saran} onChange={handleChange} placeholder="Tuliskan masukan Anda di sini..." className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition">Batal</button>
                <button type="submit" disabled={loading} className="px-6 py-2 text-sm font-bold text-white bg-[#243d8c] hover:bg-blue-900 rounded-lg shadow disabled:opacity-50 transition flex items-center">
                  {loading ? (
                    <><i className="fas fa-spinner fa-spin mr-2"></i> Mengirim...</>
                  ) : (
                    <><i className="fas fa-paper-plane mr-2"></i> Kirim Survey</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
