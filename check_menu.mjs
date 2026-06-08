import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tptlzfpzpgsvtqvboxtl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwdGx6ZnB6cGdzdnRxdmJveHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3OTQ1MjEsImV4cCI6MjA5NjM3MDUyMX0.zbin6SHRisl-F6kkHy--7f4t0y0QVI4yoNSsKEYOtlo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMenu() {
  const { data, error } = await supabase.from('menu_navigasi').select('*');
  console.log('Error:', error);
  console.log('Menus:', data);
}

checkMenu();
