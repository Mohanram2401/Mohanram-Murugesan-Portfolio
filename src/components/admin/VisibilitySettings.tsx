import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useSettings } from "@/hooks/usePortfolioData";
import { saveSettings } from "@/lib/content-service";
import { isFirebaseConfigured } from "@/lib/firebase";
import type { Settings, VisibleSectionKey } from "@/lib/types";

const sections: { key: VisibleSectionKey; label: string; hint: string }[] = [
  {
    key: "about",
    label: "About",
    hint: "Intro card with your summary and focus areas.",
  },
  {
    key: "skills",
    label: "Skills",
    hint: "Tech marquee below the hero and the skill bars inside About.",
  },
  {
    key: "experience",
    label: "Experience",
    hint: "Work history timeline.",
  },
  {
    key: "education",
    label: "Education",
    hint: "Education timeline.",
  },
  {
    key: "projects",
    label: "Projects",
    hint: "Project grid with case studies.",
  },
  {
    key: "certifications",
    label: "Certifications",
    hint: "Certification cards.",
  },
  {
    key: "contact",
    label: "Contact",
    hint: "Contact section with links and the message form.",
  },
];

export function VisibilitySettings() {
  const queryClient = useQueryClient();
  const { data } = useSettings();
  const [draft, setDraft] = useState<Settings | null>(null);

  useEffect(() => {
    if (data) setDraft(data);
  }, [data]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["settings"] as const });

  const save = useMutation({
    mutationFn: (values: Settings) => saveSettings(values),
    onSuccess: async () => {
      toast.success("Visibility updated");
      await invalidate();
    },
    onError: async (e: Error) => {
      toast.error(e.message);
      // Restore server state after a failed save.
      await invalidate();
    },
  });

  const toggle = (key: VisibleSectionKey) => {
    if (!draft) return;
    const next: Settings = {
      ...draft,
      visibleSections: {
        ...draft.visibleSections,
        [key]: !draft.visibleSections[key],
      },
    };
    setDraft(next);
    save.mutate(next);
  };

  if (!draft) {
    return (
      <div className="grid place-items-center py-16 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold text-foreground">Section visibility</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Toggle what shows on the portfolio — the navigation bar updates automatically.
          {!isFirebaseConfigured ? " · Firebase isn't configured — changes won't persist." : ""}
        </p>
      </div>

      <div className="grid gap-3">
        {sections.map((s) => {
          const on = draft.visibleSections[s.key];
          return (
            <div
              key={s.key}
              className="flex items-center justify-between gap-4 rounded-2xl p-4 glass glow-hover"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{s.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{s.hint}</p>
              </div>
              <button
                role="switch"
                aria-checked={on}
                aria-label={`Toggle ${s.label}`}
                onClick={() => toggle(s.key)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
                  on ? "bg-gradient-brand shadow-[0_0_14px_-2px_var(--primary)]" : "bg-secondary"
                }`}
              >
                <span
                  className={`absolute top-0.5 size-5 rounded-full bg-background shadow-md transition-all duration-300 ${
                    on ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
