const fs = require('fs');
const path = require('path');

const files = [
  'e:/PROJEC APLIKASI/PUTUSSIBAU KOTA/src/app/admin/potensi/edit/[id]/page.tsx',
  'e:/PROJEC APLIKASI/PUTUSSIBAU KOTA/src/app/admin/menu/edit/[id]/page.tsx',
  'e:/PROJEC APLIKASI/PUTUSSIBAU KOTA/src/app/admin/layanan/edit/[id]/page.tsx',
  'e:/PROJEC APLIKASI/PUTUSSIBAU KOTA/src/app/admin/halaman/edit/[id]/page.tsx',
  'e:/PROJEC APLIKASI/PUTUSSIBAU KOTA/src/app/admin/galeri/edit/[id]/page.tsx',
  'e:/PROJEC APLIKASI/PUTUSSIBAU KOTA/src/app/admin/berita/edit/[id]/page.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  if (content.includes('const params = useParams();') && !content.includes('const id = params.id as string;')) {
    content = content.replace('const params = useParams();', 'const params = useParams();\n  const id = params.id as string;');
    fs.writeFileSync(file, content);
  }
});
console.log('Fixed missing id variable');
