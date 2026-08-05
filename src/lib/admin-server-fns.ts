import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import { toSnakeCaseKeys } from "./utils";

/**
 * Server functions for authenticated Supabase writes.
 */

const TokenSchema = z.object({ token: z.string().min(1) });

function getSupabaseServerClient(token: string) {
  // Read from process.env (Node server context) or import.meta.env
  const supabaseUrl = process.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || "";
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}

async function verifyToken(token: string) {
  const client = getSupabaseServerClient(token);
  const { data: { user }, error } = await client.auth.getUser(token);
  if (error || !user) throw new Error("Unauthorized");
  return client;
}

/* ------------------------------------------------------------------ */
/* Settings                                                             */
/* ------------------------------------------------------------------ */

const SaveSettingsInput = TokenSchema.extend({
  settings: z.record(z.unknown()),
});

export const saveSettingsOnServer = createServerFn({ method: "POST" })
  .validator((data: unknown) => SaveSettingsInput.parse(data))
  .handler(async ({ data }) => {
    const client = await verifyToken(data.token);
    const dbData = toSnakeCaseKeys<Record<string, unknown>>(data.settings);
    
    const { error } = await client
      .from("settings")
      .upsert({
        id: "profile",
        ...dbData,
        updated_at: new Date().toISOString(),
      });
      
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Generic content item (projects / skills / experience / education /  */
/* certifications / resumes)                                            */
/* ------------------------------------------------------------------ */

const SaveItemInput = TokenSchema.extend({
  collection: z.enum([
    "projects",
    "skills",
    "experience",
    "education",
    "certifications",
    "resumes",
  ]),
  /** When provided the item is updated; otherwise a new document is created. */
  id: z.string().optional(),
  data: z.record(z.unknown()),
});

export const saveItemOnServer = createServerFn({ method: "POST" })
  .validator((data: unknown) => SaveItemInput.parse(data))
  .handler(async ({ data }) => {
    const client = await verifyToken(data.token);
    const dbData = toSnakeCaseKeys<Record<string, unknown>>(data.data);
    
    if (data.id) {
      const { error } = await client
        .from(data.collection)
        .update(dbData)
        .eq("id", data.id);
        
      if (error) throw new Error(error.message);
      return { id: data.id };
    } else {
      const { data: inserted, error } = await client
        .from(data.collection)
        .insert(dbData)
        .select("id")
        .single();
        
      if (error) throw new Error(error.message);
      return { id: inserted.id };
    }
  });

const DeleteItemInput = TokenSchema.extend({
  collection: z.enum([
    "projects",
    "skills",
    "experience",
    "education",
    "certifications",
    "resumes",
  ]),
  id: z.string(),
});

export const deleteItemOnServer = createServerFn({ method: "POST" })
  .validator((data: unknown) => DeleteItemInput.parse(data))
  .handler(async ({ data }) => {
    const client = await verifyToken(data.token);
    const { error } = await client
      .from(data.collection)
      .delete()
      .eq("id", data.id);
      
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Diagnostic test write                                                */
/* ------------------------------------------------------------------ */

export const testWriteOnServer = createServerFn({ method: "POST" })
  .validator((data: unknown) => TokenSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const client = await verifyToken(data.token);
      const { error } = await client
        .from("settings")
        .upsert({
          id: "profile",
          updated_at: new Date().toISOString(),
        });
      if (error) throw error;
      return { result: "write-ok (server-side)" };
    } catch (e) {
      return { result: `write-fail: ${e instanceof Error ? e.message : "unknown"}` };
    }
  });
