import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

// Fetch the page data directly in the server component
export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { data: halaman } = await supabase
    .from('halaman')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .single();

  if (!halaman) {
    notFound(); // Triggers 404 page if slug is not in DB
  }

  return (
    <div className="bg-gray-50">
      {/* Page Header */}
      <div className="bg-green-900 py-16 text-center px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{halaman.judul}</h1>
        <div className="w-16 h-1 bg-yellow-400 mx-auto rounded-full mt-4"></div>
      </div>
      
      {/* Page Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
          {/* 
            We use dangerouslySetInnerHTML to render the HTML tags that the admin might have used.
            Since this is from our own trusted admin, it's safe.
          */}
          <div 
            className="prose prose-green max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed"
            dangerouslySetInnerHTML={{ __html: halaman.konten }}
          />
        </div>
      </div>
    </div>
  );
}
