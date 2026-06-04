import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);


// Fallback values to avoid crash on startup when variables are missing in env
const finalUrl = supabaseUrl || 'https://placeholder.supabase.co';
const finalAnonKey = supabaseAnonKey || 'placeholder-anon-key';

export const supabase = createClient(finalUrl, finalAnonKey);
