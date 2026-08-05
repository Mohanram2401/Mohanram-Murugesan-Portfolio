import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2, Upload, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useSettings } from "@/hooks/usePortfolioData";
import { saveSettings, testFirestoreWrite, uploadAvatarAsBase64 } from "@/lib/content-service";
import type { Settings, Stat } from "@/lib/types";
import { inputClass, labelClass, ListEditor } from "./EntityForm";

/* ------------------------------------------------------------------ */
/* Avatar upload (base64, stored in the settings doc)                   */
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

  const handleFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const dataUrl = await uploadAvatarAsBase64(file);
        onUploaded(dataUrl);
        toast.success('Photo ready — click "Save changes" to persist.');
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
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-60"
        >
          <Upload className="size-4" />
          {uploading ? "Processing…" : "Upload photo"}
        </button>
        <p className="mt-2 text-xs text-muted-foreground">
          Max 10 MB — resized to 400×400 and stored in the database.
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
/* Stats editor                                                         */
/* ------------------------------------------------------------------ */

function StatsEditor({ stats, onChange }: { stats: Stat[]; onChange: (next: Stat[]) => void }) {
  const set = (i: number, patch: Partial<Stat>) =>
    onChange(stats.map((s, j) => (j === i ? { ...s, ...patch } : s)));

  return (
    <div className="space-y-3">
      {stats.map((stat, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="grid flex-1 gap-2 sm:grid-cols-2">
            <input
              className={inputClass}
              placeholder="Label"
              value={stat.label}
              onChange={(e) => set(i, { label: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Value"
              value={stat.value}
              onChange={(e) => set(i, { value: e.target.value })}
            />
          </div>
          <button
            type="button"
            onClick={() => onChange(stats.filter((_, j) => j !== i))}
            className="grid size-9 shrink-0 place-items-center rounded-xl border border-border/70 text-muted-foreground transition-colors hover:border-destructive/60 hover:text-destructive"
            aria-label="Remove stat"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...stats, { label: "", value: "" }])}
        className="inline-flex items-center gap-2 rounded-xl border border-border/70 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
      >
        <Plus className="size-4" /> Add stat
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main editor                                                          */
/* ------------------------------------------------------------------ */

export function ProfileSettings() {
  const queryClient = useQueryClient();
  const { data } = useSettings();
  const [draft, setDraft] = useState<Settings | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (data) setDraft(data);
  }, [data]);

  const save = useMutation({
    mutationFn: (values: Settings) => {
      if (!values.name.trim()) throw new Error("Name is required");
      return saveSettings(values);
    },
    onSuccess: async () => {
      toast.success("Profile & hero saved");
      await queryClient.invalidateQueries({ queryKey: ["settings"] as const });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const runTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await testFirestoreWrite();
      setTestResult(result);
    } catch (e) {
      setTestResult(`test-error: ${e instanceof Error ? e.message : "unknown"}`);
    } finally {
      setTesting(false);
    }
  };

  if (!draft) return null;

  const set = (patch: Partial<Settings>) => setDraft({ ...draft, ...patch });

  return (
    <section className="space-y-6">
      {/* Connection test */}
      <div className="rounded-2xl border border-border/60 bg-secondary/30 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">Firestore connection</h2>
            <p className="text-sm text-muted-foreground">
              Verifies an authenticated server-side write against your Firebase project. Run this
              first if saving fails.
            </p>
          </div>
          <button
            type="button"
            onClick={runTest}
            disabled={testing}
            className="inline-flex items-center gap-2 rounded-xl border border-accent3/40 bg-accent3/10 px-4 py-2 text-sm font-medium text-accent3 transition-colors hover:bg-accent3/20 disabled:opacity-50"
          >
            {testing ? <Loader2 className="size-4 animate-spin" /> : null}
            Test Firestore write
          </button>
        </div>
        {testResult ? (
          <div
            className={`mt-3 rounded-xl border p-3.5 font-mono text-xs break-all ${
              testResult.startsWith("write-ok")
                ? "border-accent3/40 bg-accent3/10 text-accent3"
                : "border-destructive/40 bg-destructive/10 text-destructive"
            }`}
          >
            {testResult.startsWith("write-ok")
              ? "OK — server-side write succeeded. Saving will work."
              : `Failed: ${testResult}`}
          </div>
        ) : null}
      </div>

      {/* Profile & hero */}
      <div className="rounded-2xl border border-border/60 bg-secondary/30 p-5">
        <h2 className="font-display text-lg font-bold text-foreground">Profile & hero</h2>
        <div className="mt-5 space-y-4">
          <AvatarUpload
            name={draft.name}
            src={draft.avatar}
            onUploaded={(avatar) => set({ avatar })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Name *</label>
              <input
                className={inputClass}
                value={draft.name}
                onChange={(e) => set({ name: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Title *</label>
              <input
                className={inputClass}
                value={draft.title}
                onChange={(e) => set({ title: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Roles</label>
            <ListEditor
              items={draft.roles}
              onChange={(roles) => set({ roles })}
              placeholder="Add a role…"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Tagline</label>
              <input
                className={inputClass}
                value={draft.tagline}
                onChange={(e) => set({ tagline: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input
                className={inputClass}
                value={draft.location}
                onChange={(e) => set({ location: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="rounded-2xl border border-border/60 bg-secondary/30 p-5">
        <h2 className="font-display text-lg font-bold text-foreground">Links</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Email</label>
            <input
              className={inputClass}
              value={draft.email}
              onChange={(e) => set({ email: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>GitHub</label>
            <input
              className={inputClass}
              value={draft.github}
              onChange={(e) => set({ github: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>LinkedIn</label>
            <input
              className={inputClass}
              value={draft.linkedin}
              onChange={(e) => set({ linkedin: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Resume URL</label>
            <input
              className={inputClass}
              placeholder="https://…"
              value={draft.resumeUrl}
              onChange={(e) => set({ resumeUrl: e.target.value })}
            />
          </div>
        </div>
        <label className="mt-5 flex cursor-pointer items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={draft.showResume}
            onClick={() => set({ showResume: !draft.showResume })}
            className={`flex h-7 w-12 items-center rounded-full border px-0.5 transition-colors ${
              draft.showResume ? "border-primary bg-primary" : "border-border/70 bg-secondary/50"
            }`}
          >
            <span
              className={`size-5 rounded-full bg-background shadow transition-transform ${
                draft.showResume ? "translate-x-5" : ""
              }`}
            />
          </button>
          <span className="text-sm text-foreground">Show "View Resume" button in the hero</span>
        </label>
      </div>

      {/* About & stats */}
      <div className="rounded-2xl border border-border/60 bg-secondary/30 p-5">
        <h2 className="font-display text-lg font-bold text-foreground">About & stats</h2>
        <div className="mt-5 space-y-6">
          <div>
            <label className={labelClass}>About paragraphs</label>
            <ListEditor
              items={draft.about}
              onChange={(about) => set({ about })}
              placeholder="Add a paragraph…"
            />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className={labelClass}>Hero stats</label>
              <button
                type="button"
                role="switch"
                aria-checked={draft.showStats}
                onClick={() => set({ showStats: !draft.showStats })}
                className={`flex h-7 w-12 items-center rounded-full border px-0.5 transition-colors ${
                  draft.showStats ? "border-primary bg-primary" : "border-border/70 bg-secondary/50"
                }`}
              >
                <span
                  className={`size-5 rounded-full bg-background shadow transition-transform ${
                    draft.showStats ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
            <StatsEditor stats={draft.stats} onChange={(stats) => set({ stats })} />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => save.mutate(draft)}
          disabled={save.isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-background disabled:opacity-60"
        >
          {save.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          Save changes
        </button>
      </div>
    </section>
  );
}
