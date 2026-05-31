import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  try {
    // Increment for today
    // We try to insert a new row for today, if it fails (already exists), we ignore.
    const { error: insertError } = await supabase
      .from('statistik_pengunjung')
      .insert([{ tanggal: todayStr, jumlah: 1 }]);

    if (insertError) {
      // Row already exists, so we fetch the current count and update it.
      // Note: This is a simple counter, vulnerable to race conditions, but adequate for simple needs.
      const { data: todayData } = await supabase
        .from('statistik_pengunjung')
        .select('jumlah')
        .eq('tanggal', todayStr)
        .single();
        
      if (todayData) {
        await supabase
          .from('statistik_pengunjung')
          .update({ jumlah: todayData.jumlah + 1 })
          .eq('tanggal', todayStr);
      }
    }

    // Now fetch stats
    // Harian
    const { data: dataHarian } = await supabase
      .from('statistik_pengunjung')
      .select('jumlah')
      .eq('tanggal', todayStr)
      .single();

    // Bulanan
    const startDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
    const endDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-31`;
    const { data: dataBulanan } = await supabase
      .from('statistik_pengunjung')
      .select('jumlah')
      .gte('tanggal', startDate)
      .lte('tanggal', endDate);

    // Tahunan
    const startYear = `${currentYear}-01-01`;
    const endYear = `${currentYear}-12-31`;
    const { data: dataTahunan } = await supabase
      .from('statistik_pengunjung')
      .select('jumlah')
      .gte('tanggal', startYear)
      .lte('tanggal', endYear);

    const harian = dataHarian ? dataHarian.jumlah : 1;
    const bulanan = dataBulanan ? dataBulanan.reduce((acc, curr) => acc + curr.jumlah, 0) : 1;
    const tahunan = dataTahunan ? dataTahunan.reduce((acc, curr) => acc + curr.jumlah, 0) : 1;

    return NextResponse.json({ harian, bulanan, tahunan });
  } catch (error) {
    console.error("Error updating visitor stats:", error);
    return NextResponse.json({ harian: 0, bulanan: 0, tahunan: 0 });
  }
}
