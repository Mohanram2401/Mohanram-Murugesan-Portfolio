import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useSettings } from "@/hooks/usePortfolioData";
import { saveSettings } from "@/lib/content-service";
import type { Settings, VisibleSectionKey } from "@/lib/types";

const sections: { key: VisibleSectionKey; label: string; hint: string }[] = [
  { key: "about", label: "About", hint: "Intro card with your summary and focus areas." },
  {
    key: "skills",
    label: "Skills",
    hint: "Tech marquee below the hero and the skill bars inside About.",
  },
  { key: "experience", label: "Experience", hint: "Work history timeline." },
  { key: "education", label: "Education", hint: "Education timeline." },
  { key: "projects", label: "Projects", hint: "Project grid with case studies." },
  { key: "certifications", label: "Certifications", hint: "Certification cards." },
  { key: "contact", label: "Contact", hint: "Contact section with links and the message form." },
];

export function VisibilitySettings() {
  const queryClient = useQueryClient();
  const { data } = useSettings();
  const [draft, setDraft] = useState<Settings | null>(null);

  useEffect(() => {
    if (data) setDraft(data);
  }, [data]);

  const save = useMutation({
    mutationFn: (values: Settings) => saveSettings(values),
    onSuccess: async () => {
      toast.success("Visibility saved");
      await queryClient.invalidateQueries({ queryKey: ["settings"] as const });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!draft) return null;

  return (
    <section className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">Visibility</h2>
        <p className="text-sm text-muted-foreground">
          Choose which sections appear on the portfolio and in the navigation.
        </p>
      </div>

      <div className="space-y-3">
        {sections.map(({ key, label, hint }) => {
          const on = draft.visibleSections[key];
          return (
            <div
              key={key}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-secondary/30 p-4"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{hint}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                onClick={() =>
                  setDraft({
                    ...draft,
                    visibleSections: { ...draft.visibleSections, [key]: !on },
                  })
                }
                className={`flex h-7 w-12 shrink-0 items-center rounded-full border px-0.5 transition-colors ${
                  on ? "border-primary bg-primary" : "border-border/70 bg-secondary/50"
                }`}
              >
                <span
                  className={`size-5 rounded-full bg-background shadow transition-transform ${
                    on ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          );
        })}
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
