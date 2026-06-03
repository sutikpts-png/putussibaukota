'use client';

import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<any>(null);

  return (
    <div className="w-full bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm relative z-0">
      <Editor
        tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.3/tinymce.min.js"
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={(newValue, editor) => {
          onChange(newValue);
        }}
        init={{
          height: 350,
          menubar: 'file edit view insert format tools table help',
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | image | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          placeholder: placeholder || 'Mulai mengetik...',
          branding: true,
          promotion: false,
          images_upload_handler: async (blobInfo: any, progress: any) => {
            try {
              const file = blobInfo.blob();
              const fileName = `editor_${Date.now()}_${blobInfo.filename()}`;
              
              const { data, error } = await supabase.storage
                .from('gambar')
                .upload(fileName, file, {
                  cacheControl: '3600',
                  upsert: false
                });

              if (error) {
                return Promise.reject('Upload failed: ' + error.message);
              }

              const { data: { publicUrl } } = supabase.storage
                .from('gambar')
                .getPublicUrl(fileName);

              return publicUrl;
            } catch (err: any) {
              return Promise.reject('Upload error: ' + err.message);
            }
          }
        }}
      />
    </div>
  );
}
