import { createClient } from "@supabase/supabase-js";

// Fallback to hardcoded values if Vite fails to inject environment variables during the production build
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://plywgbbehmrpsnurhuos.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_7_zP7jPir0BvWuAeMkqvVA_O61XXgnY';

console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("VITE_SUPABASE_ANON_KEY set:", !!import.meta.env.VITE_SUPABASE_ANON_KEY);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
