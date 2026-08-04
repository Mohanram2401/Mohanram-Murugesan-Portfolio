import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2, Upload, User, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useSettings } from "@/hooks/usePortfolioData";
import { saveSettings, testFirestoreWrite, uploadFile } from "@/lib/content-service";
import { getFirebaseAuth, isCloudinaryConfigured, isFirebaseConfigured } from "@/lib/firebase";
import type { Settings, Stat } from "@/lib/types";
import { inputClass, ListEditor } from "./EntityForm";

const labelClass =
  "mb-1.5 block font-mono text-[11px] tracking-wider text-muted-foreground uppercase";

/* ------------------------------------------------------------------ */
/* File upload helper                                                  */
/* ------------------------------------------------------------------ */

function AvatarUpload({
  name,
  src,
  onUploaded,
}: {
  name: string;
  src: string;
  onUploaded: (url: string) => void;
}) {
  const [error, setError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const pick = useCallback(() => inputRef.current?.click(), []);

  const handleFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be under 5 MB.");
        return;
      }
      setUploading(true);
      try {
        const url = await uploadFile("avatars", file);
        onUploaded(url);
        toast.success("Photo uploaded");
        setError(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [onUploaded],
  );

  return (
    <div className="flex items-center gap-5">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-full border border-primary/30 bg-secondary/50 shadow-[0_0_24px_-8px_var(--primary)]">
        {src && !error ? (
          <img
            src={src}
            alt="Profile preview"
            className="size-full object-cover"
            onError={() => setError(true)}
          />
        ) : (
          <div className="grid size-full place-items-center font-display text-2xl font-bold text-gradient">
            {name.charAt(0) || <User className="size-6" />}
          </div>
        )}
        {uploading ? (
          <div className="absolute inset-0 grid place-items-center bg-background/70">
            <Loader2 className="size-5 animate-spin text-primary" />
          </div>
        ) : null}
      </div>
      <div>
        <button
          type="button"
          onClick={pick}
          disabled={uploading || !isCloudinaryConfigured}
          className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/15 disabled:opacity-50"
        >
          <Upload className="size-4" />
          {uploading ? "Uploading…" : src && !error ? "Change photo" : "Upload photo"}
        </button>
        {src && !error ? (
          <button
            type="button"
            onClick={() => onUploaded("")}
            className="ml-2 inline-flex items-center gap-1 rounded-xl border border-border/70 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-destructive/60 hover:text-destructive"
          >
            <X className="size-3" /> Remove
          </button>
        ) : null}
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          {!isCloudinaryConfigured
            ? "Set VITE_CLOUDINARY_CLOUD_NAME & VITE_CLOUDINARY_UPLOAD_PRESET to enable uploads."
            : "JPG, PNG or WebP. Max 5 MB. Uploaded via Cloudinary (free tier)."}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stats editor                                                        */
/* ------------------------------------------------------------------ */

function StatsEditor({ stats, onChange }: { stats: Stat[]; onChange: (stats: Stat[]) => void }) {
  const update = (i: number, key: "label" | "value", v: string) =>
    onChange(stats.map((s, idx) => (idx === i ? { ...s, [key]: v } : s)));

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        The hero stats row (e.g. "Alerts triaged — 12k+"). Change the text or remove cards entirely.
      </p>
      {stats.length > 0 ? (
        <div className="grid gap-3">
          {stats.map((s, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1.2fr_auto]">
              <input
                className={inputClass}
                placeholder="Value, e.g. 12k+"
                value={s.value}
                onChange={(e) => update(i, "value", e.target.value)}
              />
              <input
                className={inputClass}
                placeholder="Label, e.g. Alerts triaged"
                value={s.label}
                onChange={(e) => update(i, "label", e.target.value)}
              />
              <button
                type="button"
                onClick={() => onChange(stats.filter((_, idx) => idx !== i))}
                aria-label="Remove stat"
                className="grid size-10 place-items-center self-center rounded-xl border border-border/70 text-muted-foreground transition-colors hover:border-destructive/60 hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-border/60 bg-secondary/30 p-3.5 text-sm text-muted-foreground">
          No stats configured — the stats row is hidden until you add one.
        </p>
      )}
      <button
        type="button"
        onClick={() => onChange([...stats, { label: "", value: "" }])}
        className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
      >
        <Plus className="size-4" /> Add stat
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Profile settings                                                    */
/* ------------------------------------------------------------------ */

export function ProfileSettings() {
  const queryClient = useQueryClient();
  const { data } = useSettings();
  const [draft, setDraft] = useState<Settings | null>(null);
  const [testStatus, setTestStatus] = useState<{
    running: boolean;
    result?: string;
  }>({ running: false });

  useEffect(() => {
    if (data) setDraft(data);
  }, [data]);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));

  const save = useMutation({
    mutationFn: (values: Settings) => {
      if (!values.name.trim()) throw new Error("Name is required");
      // Fail fast with a clear message if Firebase Auth is not signed in.
      const auth = getFirebaseAuth();
      if (!auth?.currentUser) {
        throw new Error(
          "You're not signed in to Firebase Auth. Please sign out and sign in again, then retry.",
        );
      }
      return saveSettings(values);
    },
    onSuccess: async () => {
      toast.success("Profile & hero saved");
      await queryClient.invalidateQueries({ queryKey: ["settings"] as const });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const runTest = async () => {
    setTestStatus({ running: true });
    const result = await testFirestoreWrite();
    setTestStatus({ running: false, result });
  };

  if (!draft) {
    return (
      <div className="grid place-items-center py-16 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">Profile & Hero</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Personal details, social links and the hero section content.
          {!isFirebaseConfigured ? " · Firebase isn't configured — changes won't persist." : ""}
        </p>
      </div>

      {/* Profile */}
      <div className="space-y-5 rounded-2xl p-6 glass">
        <h3 className="font-display text-sm font-semibold tracking-wide text-foreground uppercase">
          Profile
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <AvatarUpload
              name={draft.name}
              src={draft.avatar}
              onUploaded={(url) => set("avatar", url)}
            />
          </div>

          <div>
            <label className={labelClass}>Name</label>
            <input
              className={inputClass}
              value={draft.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Job title</label>
            <input
              className={inputClass}
              value={draft.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Roles to show</label>
            <ListEditor
              items={draft.roles}
              onChange={(roles) => set("roles", roles)}
              placeholder="Add a role and press Enter"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Tagline</label>
            <textarea
              className={`${inputClass} min-h-24 resize-y`}
              value={draft.tagline}
              onChange={(e) => set("tagline", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input
              className={inputClass}
              value={draft.location}
              onChange={(e) => set("location", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              className={inputClass}
              type="email"
              value={draft.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>GitHub URL</label>
            <input
              className={inputClass}
              placeholder="https://github.com/..."
              value={draft.github}
              onChange={(e) => set("github", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>LinkedIn URL</label>
            <input
              className={inputClass}
              placeholder="https://linkedin.com/in/..."
              value={draft.linkedin}
              onChange={(e) => set("linkedin", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>About (one paragraph per line)</label>
            <textarea
              className={`${inputClass} min-h-32 resize-y`}
              value={draft.about.join("\n")}
              onChange={(e) =>
                set(
                  "about",
                  e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean),
                )
              }
            />
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="space-y-5 rounded-2xl p-6 glass">
        <h3 className="font-display text-sm font-semibold tracking-wide text-foreground uppercase">
          Hero
        </h3>

        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border/60 bg-secondary/30 p-4">
          <span>
            <span className="block text-sm font-medium text-foreground">Show stats row</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              The "Alerts triaged / Detections shipped / ..." cards under the hero intro.
            </span>
          </span>
          <input
            type="checkbox"
            className="size-4 accent-[var(--primary)]"
            checked={draft.showStats}
            onChange={(e) => set("showStats", e.target.checked)}
          />
        </label>

        {draft.showStats ? (
          <StatsEditor stats={draft.stats} onChange={(stats) => set("stats", stats)} />
        ) : null}

        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border/60 bg-secondary/30 p-4">
          <span>
            <span className="block text-sm font-medium text-foreground">
              Show "View Resume" button
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              Links to the active resume. Upload resumes in the Resumes tab.
            </span>
          </span>
          <input
            type="checkbox"
            className="size-4 accent-[var(--primary)]"
            checked={draft.showResume}
            onChange={(e) => set("showResume", e.target.checked)}
          />
        </label>
      </div>

      {/* Firestore diagnostics */}
      <div className="space-y-3 rounded-2xl border border-border/60 p-6">
        <h3 className="font-display text-sm font-semibold tracking-wide text-foreground uppercase">
          Firestore connection test
        </h3>
        <p className="text-xs text-muted-foreground">
          Checks whether a write to your Firestore project actually works. Run this if saving fails
          with "Missing or insufficient permissions".
        </p>
        <button
          type="button"
          onClick={runTest}
          disabled={testStatus.running}
          className="inline-flex items-center gap-2 rounded-xl border border-accent3/40 bg-accent3/10 px-4 py-2 text-sm font-medium text-accent3 transition-colors hover:bg-accent3/20 disabled:opacity-50"
        >
          {testStatus.running ? <Loader2 className="size-4 animate-spin" /> : null}
          Test Firestore write
        </button>
        {testStatus.result ? (
          <div
            className={`rounded-xl border p-3.5 font-mono text-xs break-all ${
              testStatus.result === "ok"
                ? "border-accent3/40 bg-accent3/10 text-accent3"
                : "border-destructive/40 bg-destructive/10 text-destructive"
            }`}
          >
            {testStatus.result === "ok"
              ? "OK — write succeeded. Saving should work now."
              : `Failed: ${testStatus.result}`}
          </div>
        ) : null}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => save.mutate(draft)}
          disabled={save.isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-background disabled:opacity-70"
        >
          {save.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          Save changes
        </button>
      </div>
    </div>
  );
}
