import {
  deleteItemOnServer,
  saveItemOnServer,
  saveSettingsOnServer,
  testWriteOnServer,
} from "./admin-server-fns";
import { supabase } from "./supabase";
import { mockData } from "./mock-data";
import { defaultSettings } from "./profile";
import type { Resume, Section, SectionTypeMap, Settings } from "./types";
import { toCamelCaseKeys } from "./utils";

/* ------------------------------------------------------------------ */
/* Reads (client SDK, with static fallback)                            */
/* ------------------------------------------------------------------ */

/**
 * Reads a content collection from Supabase. If the read fails (offline,
 * browser blocking, etc.) the curated mock data is returned so the portfolio
 * always renders complete content.
 */
export async function fetchSection<S extends Section>(section: S): Promise<SectionTypeMap[S][]> {
  try {
    const { data, error } = await supabase
      .from(section)
      .select("*")
      .order("order", { ascending: true });
      
    if (error) throw error;
    if (data && data.length > 0) {
      return toCamelCaseKeys<SectionTypeMap[S][]>(data);
    }
  } catch (err) {
    console.warn(`Failed to fetch section ${section} from Supabase, falling back to mock data.`, err);
  }
  return [...(mockData[section] as unknown as SectionTypeMap[S][])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );
}

const SETTINGS_DOC = "profile";

/** Merges a partial settings document over the defaults so new fields never go missing. */
function mergeSettings(partial: Partial<Settings>): Settings {
  return {
    ...defaultSettings,
    ...partial,
    visibleSections: {
      ...defaultSettings.visibleSections,
      ...(partial.visibleSections ?? {}),
    },
    stats:
      Array.isArray(partial.stats) && partial.stats.length ? partial.stats : defaultSettings.stats,
    roles: Array.isArray(partial.roles) ? partial.roles : defaultSettings.roles,
    about: Array.isArray(partial.about) ? partial.about : defaultSettings.about,
    showResume: partial.showResume ?? defaultSettings.showResume,
  };
}

/** Reads the settings document; falls back to defaults. */
export async function fetchSettings(): Promise<Settings> {
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("id", SETTINGS_DOC)
      .single();
      
    if (error) throw error;
    if (data) {
      return mergeSettings(toCamelCaseKeys<Partial<Settings>>(data));
    }
  } catch (err) {
    console.warn("Failed to fetch settings from Supabase, falling back to defaults.", err);
  }
  return defaultSettings;
}

/** Reads the `resumes` table; returns an empty list on failure. */
export async function fetchResumes(): Promise<Resume[]> {
  try {
    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .order("order", { ascending: true });
      
    if (error) throw error;
    if (data) {
      return toCamelCaseKeys<Resume[]>(data);
    }
  } catch (err) {
    console.warn("Failed to fetch resumes from Supabase.", err);
  }
  return [];
}

/* ------------------------------------------------------------------ */
/* Writes (server-side, authenticated)                                  */
/* ------------------------------------------------------------------ */

/** Returns the signed-in admin's Supabase access token, or throws a clear error. */
async function requireToken(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("You're not signed in. Sign in from /admin, then retry.");
  }
  return session.access_token;
}

/** Persists the full settings document (profile, hero, visibility). */
export async function saveSettings(settings: Settings): Promise<void> {
  const token = await requireToken();
  await saveSettingsOnServer({
    data: { token, settings: settings as unknown as Record<string, unknown> },
  });
}

export async function createItem<S extends Section>(
  section: S,
  data: Omit<SectionTypeMap[S], "id">,
): Promise<string> {
  const token = await requireToken();
  const { id } = await saveItemOnServer({
    data: {
      token,
      collection: section,
      data: data as unknown as Record<string, unknown>,
    },
  });
  return id;
}

export async function updateItem<S extends Section>(
  section: S,
  id: string,
  data: Partial<SectionTypeMap[S]>,
): Promise<void> {
  const token = await requireToken();
  const { id: _omit, ...rest } = data as Record<string, unknown> & { id?: string };
  void _omit;
  
  if (id.startsWith("m-")) {
    // This is mock data saved for the first time, perform an insert
    await saveItemOnServer({
      data: { token, collection: section, data: rest },
    });
    return;
  }
  
  await saveItemOnServer({
    data: { token, collection: section, id, data: rest },
  });
}

export async function deleteItem(section: Section, id: string): Promise<void> {
  if (id.startsWith("m-")) return; // Mock data is client-only
  const token = await requireToken();
  await deleteItemOnServer({ data: { token, collection: section, id } });
}

/* ------------------------------------------------------------------ */
/* Resumes                                                              */
/* ------------------------------------------------------------------ */

export async function createResume(data: Omit<Resume, "id">): Promise<string> {
  const token = await requireToken();
  const { id } = await saveItemOnServer({
    data: { token, collection: "resumes", data: data as unknown as Record<string, unknown> },
  });
  return id;
}

export async function updateResume(id: string, data: Partial<Resume>): Promise<void> {
  const token = await requireToken();
  const { id: _omit, ...rest } = data as Record<string, unknown> & { id?: string };
  void _omit;
  
  if (id.startsWith("m-")) {
    await saveItemOnServer({ data: { token, collection: "resumes", data: rest } });
    return;
  }
  
  await saveItemOnServer({ data: { token, collection: "resumes", id, data: rest } });
}

export async function deleteResume(id: string): Promise<void> {
  if (id.startsWith("m-")) return; // Mock data is client-only
  const token = await requireToken();
  await deleteItemOnServer({ data: { token, collection: "resumes", id } });
}

/* ------------------------------------------------------------------ */
/* Diagnostics                                                          */
/* ------------------------------------------------------------------ */

/** Runs a server-side test write so the admin UI can surface the real error. */
export async function testFirestoreWrite(): Promise<string> {
  const token = await requireToken();
  const res = await testWriteOnServer({ data: { token } });
  return res.result;
}

/* ------------------------------------------------------------------ */
/* Avatar upload (base64 data URL, no external storage)                 */
/* ------------------------------------------------------------------ */

/**
 * Resizes an image to max 400×400px and returns it as a base64 data URL.
 * The data URL is stored directly in the `settings/profile` document, so no
 * Cloudinary / Firebase Storage dependency is needed.
 */
export async function uploadAvatarAsBase64(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please select an image file.");
  if (file.size > 10 * 1024 * 1024) throw new Error("Image must be under 10 MB.");

  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the image."));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Could not load the image."));
    el.src = dataUrl;
  });

  const MAX = 400;
  const scale = Math.min(1, MAX / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.85);
}

export function getProjectId(): string {
  // Extract project ref from supabase URL for display in diagnostics
  const match = (import.meta.env.VITE_SUPABASE_URL ?? "").match(/https:\/\/([^.]+)\.supabase/);
  return match?.[1] ?? "unknown";
}
