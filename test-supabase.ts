import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://plywgbbehmrpsnurhuos.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_7_zP7jPir0BvWuAeMkqvVA_O61XXgnY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase.from("memories").insert([{
    status: "PENDING",
    submitter_name: "Test",
    grad_year: "1988",
    honoree_name: null,
    title: "Test",
    memory_text: "Test memory text 50 chars 123456789012345678901234567890",
    photo_url: null,
    submitter_email: "test@test.com"
  }]);
  console.log("Error:", error);
}
test();