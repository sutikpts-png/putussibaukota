import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const url = 'https://ynvttzalvcdltlmgyymc.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludnR0emFsdmNkbHRsbWd5eW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMzc1MzYsImV4cCI6MjA5NTcxMzUzNn0.sOTT2Vqk4Nr22ARdcEMvHW4VBfOfpAFzBRfh-tzYFyI';
const supabase = createClient(url, key);

async function check() {
  const { data, error } = await supabase.from('pengaturan_web').select('*').limit(1);
  if (error) console.error(error);
  else console.log(Object.keys(data[0]));
}
check();
