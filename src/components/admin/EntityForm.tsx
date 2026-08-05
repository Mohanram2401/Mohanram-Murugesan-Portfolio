import { Plus, X } from "lucide-react";
import { useState } from "react";

export type FieldType = "text" | "textarea" | "number" | "list" | "url" | "checkbox";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  help?: string;
}

export const inputClass =
  "w-full rounded-xl border border-border/70 bg-secondary/30 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/20";

export const labelClass =
  "mb-1.5 block font-mono text-[11px] tracking-wider text-muted-foreground uppercase";

/* ------------------------------------------------------------------ */
/* Tag / string list editor                                            */
/* ------------------------------------------------------------------ */

export function ListEditor({
  items,
  onChange,
  placeholder = "Add an item…",
}: {
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string | undefined;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const next = draft.trim();
    if (!next) return;
    onChange([...items, next]);
    setDraft("");
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          className={inputClass}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button
          type="button"
          onClick={add}
          className="grid size-9 shrink-0 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary transition-colors hover:bg-primary/20"
          aria-label="Add"
        >
          <Plus className="size-4" />
        </button>
      </div>
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-secondary/40 px-2.5 py-1 text-xs text-foreground"
            >
              {item}
              <button
                type="button"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="text-muted-foreground transition-colors hover:text-destructive"
                aria-label={`Remove ${item}`}
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Generic field grid                                                  */
/* ------------------------------------------------------------------ */

export function EntityForm({
  fields,
  value,
  onChange,
}: {
  fields: FieldDef[];
  value: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  const set = (key: string, v: unknown) => onChange({ ...value, [key]: v });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => {
        const wide = f.type === "textarea" || f.type === "list";
        return (
          <div key={f.key} className={wide ? "sm:col-span-2" : ""}>
            <label className={labelClass}>
              {f.label}
              {f.required ? <span className="ml-1 text-destructive">*</span> : null}
            </label>

            {f.type === "textarea" ? (
              <textarea
                className={`${inputClass} min-h-28 resize-y`}
                placeholder={f.placeholder ?? ""}
                value={(value[f.key] as string) ?? ""}
                onChange={(e) => set(f.key, e.target.value)}
              />
            ) : f.type === "list" ? (
              <ListEditor
                items={Array.isArray(value[f.key]) ? (value[f.key] as string[]) : []}
                onChange={(next) => set(f.key, next)}
                placeholder={f.placeholder}
              />
            ) : f.type === "number" ? (
              <input
                className={inputClass}
                type="number"
                placeholder={f.placeholder ?? ""}
                value={(value[f.key] as number | undefined) ?? ""}
                onChange={(e) =>
                  set(f.key, e.target.value === "" ? undefined : Number(e.target.value))
                }
              />
            ) : f.type === "checkbox" ? (
              <button
                type="button"
                role="switch"
                aria-checked={Boolean(value[f.key])}
                onClick={() => set(f.key, !value[f.key])}
                className={`flex h-7 w-12 items-center rounded-full border px-0.5 transition-colors ${
                  value[f.key] ? "border-primary bg-primary" : "border-border/70 bg-secondary/50"
                }`}
              >
                <span
                  className={`size-5 rounded-full bg-background shadow transition-transform ${
                    value[f.key] ? "translate-x-5" : ""
                  }`}
                />
              </button>
            ) : (
              <input
                className={inputClass}
                type={f.type === "url" ? "url" : "text"}
                placeholder={f.placeholder ?? ""}
                value={(value[f.key] as string) ?? ""}
                onChange={(e) => set(f.key, e.target.value)}
              />
            )}

            {f.help ? <p className="mt-1.5 text-xs text-muted-foreground">{f.help}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
