require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkTables() {
  const { error: errHalaman } = await supabase.from('halaman').select('*').limit(1);
  console.log('Halaman error:', errHalaman);

  const { error: errMenu } = await supabase.from('menu').select('*').limit(1);
  console.log('Menu error:', errMenu);
}
checkTables();
