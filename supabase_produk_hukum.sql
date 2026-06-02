-- SQL Script untuk membuat tabel produk_hukum
-- Jalankan di SQL Editor Supabase

CREATE TABLE IF NOT EXISTS public.produk_hukum (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    judul TEXT NOT NULL,
    kategori TEXT NOT NULL,
    nomor_surat TEXT,
    tahun TEXT,
    file_url TEXT,
    tanggal_publikasi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Atur RLS (Row Level Security) agar tabel bisa diakses publik (Read-only)
ALTER TABLE public.produk_hukum ENABLE ROW LEVEL SECURITY;

-- Kebijakan (Policy) agar siapa saja bisa melihat produk hukum
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.produk_hukum FOR SELECT 
USING ( true );

-- Kebijakan (Policy) agar siapa saja bisa insert, update, delete
-- Karena panel admin saat ini tidak menggunakan Supabase Auth secara penuh
CREATE POLICY "Enable insert for all" 
ON public.produk_hukum FOR INSERT 
WITH CHECK ( true );

CREATE POLICY "Enable update for all" 
ON public.produk_hukum FOR UPDATE 
USING ( true );

CREATE POLICY "Enable delete for all" 
ON public.produk_hukum FOR DELETE 
USING ( true );

-- JANGAN LUPA: 
-- Anda juga harus membuat BUCKET di menu Storage Supabase dengan nama: "dokumen"
-- Dan pastikan bucket "dokumen" tersebut di set "Public" agar file PDF bisa didownload.

-- ==========================================
-- POLICIES UNTUK STORAGE BUCKET (DOKUMEN)
-- ==========================================
-- Jalankan ini agar Anda bisa mengunggah (insert) file ke bucket "dokumen"

CREATE POLICY "Izinkan semua orang melihat dokumen" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'dokumen' );

CREATE POLICY "Izinkan upload dokumen" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'dokumen' );

CREATE POLICY "Izinkan update dokumen" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'dokumen' );

CREATE POLICY "Izinkan hapus dokumen" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'dokumen' );
