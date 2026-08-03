import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useSection } from "@/hooks/usePortfolioData";
import { createItem, deleteItem, updateItem } from "@/lib/content-service";
import { isFirebaseConfigured } from "@/lib/firebase";
import { EntityForm } from "./EntityForm";
import type { SectionConfig } from "./sections-config";

type Row = Record<string, unknown> & { id: string };

export function SectionManager({ config }: { config: SectionConfig }) {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useSection(config.key);
  const rows = data as unknown as Row[];

  const [editing, setEditing] = useState<Row | null>(null);
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["content", config.key] as const });

  const save = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const missing = config.fields.find(
        (f) => f.required && !String(values[f.key] ?? "").trim(),
      );
      if (missing) throw new Error(`${missing.label} is required`);
      const { id, ...rest } = values as { id?: string };
      if (id) {
        await updateItem(config.key, id, rest as never);
      } else {
        await createItem(config.key, rest as never);
      }
    },
    onSuccess: async () => {
      toast.success(`${config.label} saved`);
      setDraft(null);
      setEditing(null);
      await invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteItem(config.key, id),
    onSuccess: async () => {
      toast.success("Entry deleted");
      await invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const openNew = () => {
    setEditing(null);
    setDraft({});
  };
  const openEdit = (row: Row) => {
    setEditing(row);
    setDraft({ ...row });
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">{config.label}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} {rows.length === 1 ? "entry" : "entries"}
            {!isFirebaseConfigured ? " · showing demo content" : ""}
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-background"
        >
          <Plus className="size-4" /> New {config.label.replace(/s$/, "")}
        </button>
      </div>

      {isLoading ? (
        <div className="grid place-items-center py-16 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-3">
          {rows.map((row) => (
            <motion.div
              key={row.id}
              layout
              className="flex items-center justify-between gap-4 rounded-2xl p-4 glass glow-hover"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {String(row[config.titleKey] ?? "Untitled")}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {String(row[config.subtitleKey] ?? "")}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => openEdit(row)}
                  aria-label="Edit"
                  className="grid size-9 place-items-center rounded-lg border border-border/70 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  onClick={() => remove.mutate(row.id)}
                  aria-label="Delete"
                  className="grid size-9 place-items-center rounded-lg border border-border/70 text-muted-foreground transition-colors hover:border-destructive/60 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {draft && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-70 grid place-items-center bg-background/80 p-4 backdrop-blur-md"
            onClick={() => setDraft(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-7 glass shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {editing ? "Edit" : "Add"} {config.label.replace(/s$/, "")}
                </h3>
                <button
                  onClick={() => setDraft(null)}
                  aria-label="Close"
                  className="grid size-9 place-items-center rounded-lg border border-border/70 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>

              <EntityForm fields={config.fields} value={draft} onChange={setDraft} />

              <div className="mt-7 flex justify-end gap-3">
                <button
                  onClick={() => setDraft(null)}
                  className="rounded-xl border border-border/70 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={() => save.mutate(draft)}
                  disabled={save.isPending}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-background disabled:opacity-70"
                >
                  {save.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                  Save changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}