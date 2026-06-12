import dynamic from 'next/dynamic';

const DynamicRichTextEditor = dynamic(() => import('./RichTextEditorBase'), {
  ssr: false,
  loading: () => <div className="w-full h-[350px] bg-gray-100 animate-pulse rounded-lg border border-gray-300 flex items-center justify-center text-gray-400">Memuat Editor...</div>
});

export default DynamicRichTextEditor;
