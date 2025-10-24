import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client — uses SUPABASE_SERVICE_ROLE_KEY (server only)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
});

export default supabaseAdmin;
