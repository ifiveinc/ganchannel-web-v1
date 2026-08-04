import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// service_role キーを使う専用クライアント。RLSをバイパスするため、
// クライアントバンドルへの混入を避ける必要がある（*.server.ts で隔離、CLAUDE.md参照）。
let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (client) {
    return client;
  }

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY が設定されていません（.env参照）。"
    );
  }

  client = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });

  return client;
}
