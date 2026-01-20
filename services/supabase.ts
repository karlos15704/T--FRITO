import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your actual Supabase project credentials
// You can find these in your Supabase Dashboard -> Project Settings -> API
const SUPABASE_URL = ''; 
const SUPABASE_ANON_KEY = '';

// Only create the client if credentials are provided to prevent runtime errors
export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export const checkDbConnection = () => {
  if (!supabase) {
    console.warn('Supabase is not configured. Please check services/supabase.ts');
    return false;
  }
  return true;
};
