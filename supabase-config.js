/**
 * Prism Study Planner & Assistant - Supabase Storage Configuration
 * 
 * Replace the placeholder values below with your Supabase credentials.
 * To get these credentials:
 * 1. Go to https://supabase.com/dashboard
 * 2. Create a free project (e.g., "prism-study")
 * 3. Go to "Project Settings" (gear icon) -> "API"
 * 4. Copy:
 *    - Project URL (e.g., "https://abcdefghijklmnopqrst.supabase.co")
 *    - Project API Key ("anon" / "public")
 * 5. In Supabase Dashboard -> "Storage":
 *    - Click "New bucket", name it "study-materials"
 *    - Turn ON "Public bucket" (so all students can view & download documents)
 */

export const supabaseConfig = {
  supabaseUrl: "https://owagtofyywcivffwocbt.supabase.co",
  supabaseAnonKey: "",
  bucketName: "study-materials"
};

/**
 * Check if the user has configured Supabase credentials
 */
export function isSupabaseConfigured() {
  return (
    supabaseConfig.supabaseUrl &&
    supabaseConfig.supabaseUrl !== "" &&
    supabaseConfig.supabaseAnonKey &&
    supabaseConfig.supabaseAnonKey !== ""
  );
}
