import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Loader2, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

import { useResumes } from "@/hooks/usePortfolioData";
import { createResume, deleteResume, updateResume, uploadFile } from "@/lib/content-service";
import { isCloudinaryConfigured } from "@/lib/firebase";
import type { Resume } from "@/lib/types";

type Draft = Omit<Resume, "id"> & { id?: string; _file?: File };

const blank: Draft = {
  name: "",
  fileUrl: "",
  fileName: "",
  fileType: "",
  active: true,
  order: 0,
};

const inputClass =
  "w-full rounded-xl border border-border/70 bg-secondary/30 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/20";
const labelClass =
  "mb-1.5 block font-mono text-[11px] tracking-wider text-muted-foreground uppercase";

/* ------------------------------------------------------------------ */
/* Resume row                                                          */
/* ------------------------------------------------------------------ */

function ResumeRow({
  resume,
  onEdit,
  onRemove,
}: {
  resume: Resume;
  onEdit: (r: Resume) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="flex items-center justify-between gap-4 rounded-2xl p-4 glass glow-hover"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-border/60 bg-secondary/50">
            <FileText className="size-4 text-primary" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {resume.name || "Untitled"}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {resume.fileName}
              {resume.fileType ? ` · ${resume.fileType}` : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-1 font-mono text-[10px] tracking-wider uppercase ${
            resume.active
              ? "border border-accent3/30 bg-accent3/8 text-accent3"
              : "border border-border/60 bg-secondary/30 text-muted-foreground"
          }`}
        >
          {resume.active ? "Active" : "Inactive"}
        </span>
        <button
          onClick={() => onEdit(resume)}
          aria-label="Edit"
          className="grid size-9 place-items-center rounded-lg border border-border/70 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          <Pencil className="size-3.5" />
        </button>
        <button
          onClick={() => onRemove(resume.id)}
          aria-label="Delete"
          className="grid size-9 place-items-center rounded-lg border border-border/70 text-muted-foreground transition-colors hover:border-destructive/60 hover:text-destructive"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Draft modal                                                         */
/* ------------------------------------------------------------------ */

function DraftModal({
  draft,
  update,
  onClose,
  onSave,
  saving,
}: {
  draft: Draft;
  update: (fn: (prev: Draft) => Draft) => void;
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      let fileType = file.type;
      if (!fileType && ext === "pdf") fileType = "application/pdf";
      if (!fileType && ext === "docx")
        fileType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      if (!fileType && ext === "doc") fileType = "application/msword";

      update((prev) => ({ ...prev, _file: file, fileName: file.name, fileType, fileUrl: "" }));
      if (inputRef.current) inputRef.current.value = "";
    },
    [update],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] grid place-items-center bg-background/80 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-3xl p-7 glass shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-foreground">
            {draft.fileUrl || draft._file ? "Edit" : "Add"} Resume
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid size-9 place-items-center rounded-lg border border-border/70 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className={labelClass}>Resume name</label>
            <input
              className={inputClass}
              placeholder="e.g. Security Engineer Resume"
              value={draft.name}
              onChange={(e) => update((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>

          {/* File upload */}
          <div>
            <label className={labelClass}>Resume file</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
              >
                <Upload className="size-4" />
                {draft.fileName ? "Replace file" : "Choose file"}
              </button>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleFile}
              />
              {draft.fileName ? (
                <span className="truncate text-xs text-muted-foreground">{draft.fileName}</span>
              ) : null}
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              PDF, DOC or DOCX. The file is uploaded when you save.
            </p>
          </div>

          {/* Sort order */}
          <div>
            <label className={labelClass}>Sort order</label>
            <input
              className={inputClass}
              type="number"
              value={draft.order ?? 0}
              onChange={(e) => update((prev) => ({ ...prev, order: Number(e.target.value) }))}
            />
          </div>

          {/* Active toggle */}
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border/60 bg-secondary/30 p-4">
            <span>
              <span className="block text-sm font-medium text-foreground">Active</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                The active resume is linked from the "View Resume" button.
              </span>
            </span>
            <input
              type="checkbox"
              className="size-4 accent-[var(--primary)]"
              checked={draft.active}
              onChange={(e) => update((prev) => ({ ...prev, active: e.target.checked }))}
            />
          </label>
        </div>

        <div className="mt-7 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-border/70 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving || !draft.name.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-background disabled:opacity-70"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : null}
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export function ResumesManager() {
  const queryClient = useQueryClient();
  const { data: resumes = [], isLoading } = useResumes();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["resumes"] as const });

  const update = (fn: (prev: Draft) => Draft) => setDraft((prev) => (prev ? fn(prev) : prev));

  const openNew = () => setDraft({ ...blank });
  const openEdit = (r: Resume) => setDraft({ ...r });
  const close = () => setDraft(null);

  const save = async () => {
    if (!draft || !draft.name.trim()) return;
    setSaving(true);
    try {
      let fileUrl = draft.fileUrl;
      if (draft._file) {
        fileUrl = await uploadFile("resumes", draft._file);
      }
      const data: Omit<Resume, "id"> = {
        name: draft.name.trim(),
        fileUrl,
        fileName: draft.fileName,
        fileType: draft.fileType,
        active: draft.active,
        ...(draft.order != null ? { order: draft.order } : {}),
      };
      if (draft.id) {
        await updateResume(draft.id, data);
      } else {
        await createResume(data);
      }
      toast.success("Resume saved");
      close();
      await invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteResume(id);
      toast.success("Resume deleted");
      await invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">Resumes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {resumes.length} {resumes.length === 1 ? "resume" : "resumes"}
            {!isCloudinaryConfigured ? " · Cloudinary not configured" : ""}
          </p>
        </div>
        <button
          onClick={openNew}
          disabled={!isCloudinaryConfigured}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-background disabled:opacity-50"
        >
          <Plus className="size-4" /> Upload resume
        </button>
      </div>

      {!isCloudinaryConfigured ? (
        <div className="mb-4 rounded-xl border border-accent2/30 bg-accent2/8 p-3.5 text-xs text-muted-foreground">
          Cloudinary isn't configured. Resume uploads are disabled until you add
          VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your environment (see
          .env.example).
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid place-items-center py-16 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
        </div>
      ) : resumes.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-border/60 py-16 text-center">
          <FileText className="size-8 text-muted-foreground/50" />
          <p className="mt-3 text-sm text-muted-foreground">No resumes uploaded yet.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          <AnimatePresence mode="popLayout">
            {resumes.map((r) => (
              <ResumeRow key={r.id} resume={r} onEdit={openEdit} onRemove={remove} />
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {draft ? (
          <DraftModal draft={draft} update={update} onClose={close} onSave={save} saving={saving} />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
