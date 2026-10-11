import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env['VITE_SUPABASE_URL'] || "https://harxbzkjbvfbgobizwwn.supabase.co";
export const supabaseAnonKey = import.meta.env['VITE_SUPABASE_ANON_KEY'] || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhcnhiemtqYnZmYmdvYml6d3duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4NjE4MzAsImV4cCI6MjEwNjQzNzgzMH0.SFXwWUFwzy2u2o_Em6TnzHay-1nMiO0sq4X7kUGs97s";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const ADMIN_EMAIL = "technoproboizz@gmail.com";
