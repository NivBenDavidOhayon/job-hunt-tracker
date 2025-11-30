import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Please check your .env file in the client directory.');
  console.error('Required variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
  console.error('Current values:', { 
    url: supabaseUrl || 'undefined', 
    key: supabaseAnonKey ? '***' + supabaseAnonKey.slice(-4) : 'undefined' 
  });
  // Don't throw - create a dummy client so the app can still load
  // The query will fail gracefully in App.jsx
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;