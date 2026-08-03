import { X } from "lucide-react";
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

const inputClass =
  "w-full rounded-xl border border-border/70 bg-secondary/30 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/20";

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
            <label className="mb-1.5 block font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
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
                items={(value[f.key] as string[]) ?? []}
                onChange={(items) => set(f.key, items)}
                placeholder={f.placeholder ?? "Add item and press Enter"}
              />
            ) : f.type === "checkbox" ? (
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  className="size-4 accent-[var(--primary)]"
                  checked={Boolean(value[f.key])}
                  onChange={(e) => set(f.key, e.target.checked)}
                />
                Enabled
              </label>
            ) : (
              <input
                className={inputClass}
                type={f.type === "number" ? "number" : "text"}
                placeholder={f.placeholder ?? ""}
                value={(value[f.key] as string | number | undefined) ?? ""}
                onChange={(e) =>
                  set(f.key, f.type === "number" ? Number(e.target.value) : e.target.value)
                }
              />
            )}

            {f.help ? <p className="mt-1 text-[11px] text-muted-foreground">{f.help}</p> : null}
          </div>
        );
      })}
    </div>
  );
}

function ListEditor({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...items, v]);
    setDraft("");
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          className={inputClass}
          placeholder={placeholder}
          value={draft}
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
          className="shrink-0 rounded-xl border border-primary/30 bg-primary/10 px-4 text-sm text-primary"
        >
          Add
        </button>
      </div>
      {items.length > 0 ? (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-secondary/40 px-2.5 py-1 text-xs text-foreground"
            >
              {item}
              <button
                type="button"
                aria-label={`Remove ${item}`}
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                className="text-muted-foreground hover:text-destructive"
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