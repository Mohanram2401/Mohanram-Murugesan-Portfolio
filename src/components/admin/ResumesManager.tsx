import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Loader2, Pencil, Plus, Trash2, X, Upload, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useResumes } from "@/hooks/usePortfolioData";
import { createResume, deleteResume, updateResume } from "@/lib/content-service";
import type { Resume } from "@/lib/types";
import { inputClass, labelClass } from "./EntityForm";

type Draft = Omit<Resume, "id"> & { id?: string };

const blank: Draft = { name: "", fileUrl: "", fileName: "", fileType: "", active: true, order: 0 };

export function ResumesManager() {
  const queryClient = useQueryClient();
  const { data: resumes = [], isLoading } = useResumes();

  const [editing, setEditing] = useState<Draft | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [uploading, setUploading] = useState(false);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["resumes"] as const });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset || cloudName.includes("your-cloud-name") || uploadPreset.includes("your-unsigned")) {
        throw new Error("Please configure VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env.local");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error?.message || "Cloudinary upload failed");
      }

      const data = await res.json();
      if (draft) {
        setDraft({
          ...draft,
          fileUrl: data.secure_url,
          fileName: file.name,
          fileType: file.type || "application/pdf",
          // Auto-fill Name if it's currently empty
          name: draft.name || file.name.replace(/\.[^/.]+$/, ""), 
        });
      }
      toast.success("File uploaded to Cloudinary successfully!");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = useMutation({
    mutationFn: async (values: Draft) => {
      if (!values.name.trim()) throw new Error("Name is required");
      if (!values.fileUrl.trim()) throw new Error("Please upload a resume file first");
      const { id, ...rest } = values;
      if (id) {
        await updateResume(id, rest);
      } else {
        await createResume(rest);
      }
    },
    onSuccess: async () => {
      toast.success("Resume saved");
      setDraft(null);
      setEditing(null);
      await invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteResume(id),
    onSuccess: async () => {
      toast.success("Resume deleted");
      setDraft(null);
      setEditing(null);
      await invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Resumes</h2>
          <p className="text-sm text-muted-foreground">
            Upload and manage your resume files.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setDraft(blank);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-background transition-transform hover:scale-[1.02]"
        >
          <Plus className="size-4" /> New Resume
        </button>
      </div>

      {isLoading ? (
        <div className="grid place-items-center py-16 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {resumes.map((resume) => (
              <motion.div
                key={resume.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="rounded-2xl border border-border/60 bg-secondary/30 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                      <FileText className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{resume.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {resume.fileName || "Uploaded file"}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase ${
                        resume.active
                          ? "bg-accent3/10 text-accent3"
                          : "bg-secondary text-muted-foreground"
                       }`}
                    >
                      {resume.active ? "Active" : "Hidden"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(resume);
                        setDraft(resume);
                      }}
                      className="grid size-8 place-items-center rounded-lg border border-border/70 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                      aria-label="Edit"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete "${resume.name}"?`)) remove.mutate(resume.id);
                      }}
                      className="grid size-8 place-items-center rounded-lg border border-border/70 text-muted-foreground transition-colors hover:border-destructive/60 hover:text-destructive"
                      aria-label="Delete"
                    >
                      {remove.isPending ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="size-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {editing?.id === resume.id && draft ? (
                  <div className="mt-4 rounded-xl border border-border/60 bg-background/40 p-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className={labelClass}>Upload Resume File *</label>
                        <div className="mt-1 flex flex-col gap-2 rounded-xl border border-dashed border-border/80 p-4 text-center">
                          {draft.fileUrl ? (
                            <div className="flex items-center justify-center gap-2 text-xs text-emerald-400">
                              <CheckCircle2 className="size-4 shrink-0" />
                              <span>Current file: <strong>{draft.fileName || "resume.pdf"}</strong></span>
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground">Select your resume PDF or Word file to upload</p>
                          )}
                          <div className="flex items-center justify-center gap-3">
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileUpload}
                              disabled={uploading}
                              className="text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                            />
                            {uploading && <Loader2 className="size-4 animate-spin text-primary" />}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Display Name *</label>
                        <input
                          className={inputClass}
                          placeholder="e.g. Cybersecurity Engineer Resume"
                          value={draft.name}
                          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Sort Order</label>
                        <input
                          className={inputClass}
                          type="number"
                          value={draft.order ?? 0}
                          onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    <label className="mt-4 flex cursor-pointer items-center gap-3">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={draft.active}
                        onClick={() => setDraft({ ...draft, active: !draft.active })}
                        className={`flex h-7 w-12 items-center rounded-full border px-0.5 transition-colors ${
                          draft.active
                            ? "border-primary bg-primary"
                            : "border-border/70 bg-secondary/50"
                        }`}
                      >
                        <span
                          className={`size-5 rounded-full bg-background shadow transition-transform ${
                            draft.active ? "translate-x-5" : ""
                          }`}
                        />
                      </button>
                      <span className="text-sm text-foreground">Active (shown to visitors)</span>
                    </label>

                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(null);
                          setDraft(null);
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-border/70 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-border hover:text-foreground"
                      >
                        <X className="size-4" /> Cancel
                      </button>
                      <button
                        type="button"
                        disabled={save.isPending || uploading || !draft.fileUrl}
                        onClick={() => save.mutate(draft)}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-background disabled:opacity-60"
                      >
                        {save.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                        Save
                      </button>
                    </div>
                  </div>
                ) : null}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* New resume form — shown when "New" is clicked (draft has no id) */}
          {draft && !draft.id ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-primary/40 bg-secondary/30 p-5 ring-1 ring-primary/20"
            >
              <p className="mb-4 font-display text-sm font-bold text-foreground">New Resume</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Upload Resume File *</label>
                  <div className="mt-1 flex flex-col gap-2 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-5 text-center">
                    {draft.fileUrl ? (
                      <div className="flex items-center justify-center gap-2 text-xs text-emerald-400">
                        <CheckCircle2 className="size-4 shrink-0" />
                        <span>File uploaded: <strong>{draft.fileName || "resume.pdf"}</strong></span>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">Select your resume PDF or Word file to upload to Cloudinary</p>
                    )}
                    <div className="flex items-center justify-center gap-3">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                      />
                      {uploading && <Loader2 className="size-4 animate-spin text-primary" />}
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Display Name *</label>
                  <input
                    className={inputClass}
                    placeholder="e.g. Cybersecurity Engineer Resume"
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className={labelClass}>Sort Order</label>
                  <input
                    className={inputClass}
                    type="number"
                    value={draft.order ?? 0}
                    onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setDraft(null);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-border/70 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-border hover:text-foreground"
                >
                  <X className="size-4" /> Cancel
                </button>
                <button
                  type="button"
                  disabled={save.isPending || uploading || !draft.fileUrl}
                  onClick={() => save.mutate(draft)}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-background disabled:opacity-60"
                >
                  {save.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                  Save
                </button>
              </div>
            </motion.div>
          ) : null}
        </div>
      )}
    </section>
  );
}
