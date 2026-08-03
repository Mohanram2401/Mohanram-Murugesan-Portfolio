import { motion } from "framer-motion";
import { CheckCircle2, Github, Linkedin, Loader2, Mail, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { profile } from "@/lib/profile";
import { Reveal, SectionHeading } from "./Reveal";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  message: z.string().trim().min(10, "Message should be at least 10 characters").max(1000),
});

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("sent");
    toast.success("Message ready to send — opening your mail client.");
    const subject = encodeURIComponent(`Portfolio enquiry from ${parsed.data.name}`);
    const body = encodeURIComponent(`${parsed.data.message}\n\n— ${parsed.data.name} (${parsed.data.email})`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    window.setTimeout(() => {
      setStatus("idle");
      setForm({ name: "", email: "", message: "" });
    }, 2600);
  };

  const field =
    "w-full rounded-xl border border-border/70 bg-secondary/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/20";

  return (
    <section id="contact" className="relative scroll-mt-24 py-24 sm:py-32">
      <div
        className="pointer-events-none absolute left-1/2 bottom-0 -z-10 size-[38rem] -translate-x-1/2 rounded-full bg-primary/12 blur-[160px]"
        aria-hidden
      />
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Contact"
          title="Let's secure something together"
          description="Open to SOC engineering roles, detection consulting and penetration testing engagements."
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <Reveal className="space-y-4">
            {[
              { Icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
              { Icon: Github, label: "GitHub", value: "@Mohanram2401", href: profile.github },
              {
                Icon: Linkedin,
                label: "LinkedIn",
                value: "mohanram-murugesan",
                href: profile.linkedin,
              },
            ].map(({ Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 rounded-2xl p-5 glass glow-hover"
              >
                <span className="grid size-11 place-items-center rounded-xl border border-primary/25 bg-primary/8">
                  <Icon className="size-4 text-primary" />
                </span>
                <span>
                  <span className="block font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                    {label}
                  </span>
                  <span className="block text-sm text-foreground">{value}</span>
                </span>
              </a>
            ))}
          </Reveal>

          <Reveal delay={0.1} className="rounded-3xl p-7 glass">
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  className={field}
                  placeholder="Your name"
                  maxLength={100}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  className={field}
                  placeholder="you@company.com"
                  type="email"
                  maxLength={255}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <textarea
                className={`${field} min-h-40 resize-y`}
                placeholder="Tell me about the role or engagement…"
                maxLength={1000}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <motion.button
                type="submit"
                disabled={status !== "idle"}
                whileTap={{ scale: 0.98 }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-background shadow-[0_16px_50px_-20px_var(--primary)] disabled:opacity-80"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Sending…
                  </>
                ) : status === "sent" ? (
                  <>
                    <CheckCircle2 className="size-4" /> Message sent
                  </>
                ) : (
                  <>
                    <Send className="size-4" /> Send message
                  </>
                )}
              </motion.button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}