import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useSection } from "@/hooks/usePortfolioData";
import { createItem, deleteItem, updateItem } from "@/lib/content-service";
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
      const missing = config.fields.find((f) => f.required && !String(values[f.key] ?? "").trim());
      if (missing) throw new Error(`${missing.label} is required`);
      const { id, ...rest } = values as { id?: string };
      if (id) {
        await updateItem(config.key, id, rest);
      } else {
        await createItem(config.key, rest);
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
    mutationFn: (row: Row) => deleteItem(config.key, row.id),
    onSuccess: async () => {
      toast.success(`${config.label} deleted`);
      setEditing(null);
      await invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const blank = () =>
    Object.fromEntries(
      config.fields.map((f) => [f.key, f.type === "checkbox" ? false : ""]),
    ) as Record<string, unknown>;

  const titleOf = (row: Row) => String(row[config.titleKey] ?? "Untitled");
  const subtitleOf = (row: Row) =>
    row[config.subtitleKey] ? String(row[config.subtitleKey]) : null;

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">{config.label}</h2>
          <p className="text-sm text-muted-foreground">
            {rows.length} item{rows.length === 1 ? "" : "s"} — sorted by sort order.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setDraft(blank());
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-background transition-transform hover:scale-[1.02]"
        >
          <Plus className="size-4" /> New
        </button>
      </div>

      {isLoading ? (
        <div className="grid place-items-center py-16 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {rows.map((row) => (
              <motion.div
                key={row.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="rounded-2xl border border-border/60 bg-secondary/30 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{titleOf(row)}</p>
                    {subtitleOf(row) ? (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {subtitleOf(row)}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(row);
                        setDraft(row);
                      }}
                      className="grid size-8 place-items-center rounded-lg border border-border/70 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                      aria-label="Edit"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete "${titleOf(row)}"?`)) remove.mutate(row);
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

                {editing?.id === row.id && draft ? (
                  <div className="mt-4 rounded-xl border border-border/60 bg-background/40 p-4">
                    <EntityForm fields={config.fields} value={draft} onChange={setDraft} />
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
                        disabled={save.isPending}
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

          {/* New item form — shown when "New" is clicked (draft has no id) */}
          {draft && !("id" in draft) ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-primary/40 bg-secondary/30 p-5 ring-1 ring-primary/20"
            >
              <p className="mb-4 font-display text-sm font-bold text-foreground">
                New {config.label} item
              </p>
              <EntityForm fields={config.fields} value={draft} onChange={setDraft} />
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
                  disabled={save.isPending}
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
