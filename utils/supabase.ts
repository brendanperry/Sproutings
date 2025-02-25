import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = __DEV__ ? "http://127.0.0.1:54321" : "https://vklicafhichaymstvwqi.supabase.co";
const supabaseAnonKey = __DEV__ ? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbGljYWZoaWNoYXltc3R2d3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg4NjUzMDEsImV4cCI6MjA1NDQ0MTMwMX0.fb-exDPYSO0je_nmKgE8h_2YwWG7K3nGTygeLDDWi0Q";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
