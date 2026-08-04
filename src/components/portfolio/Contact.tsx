import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Github, Linkedin, Loader2, Mail, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Magnet } from "@/components/effects/Magnet";
import { SpotlightCard } from "@/components/effects/SpotlightCard";
import { useSettings } from "@/hooks/usePortfolioData";
import { defaultSettings } from "@/lib/profile";
import { Reveal, SectionHeading } from "./Reveal";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  message: z.string().trim().min(10, "Message should be at least 10 characters").max(1000),
});

const formatHandle = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "");

export function Contact() {
  const { data: settings } = useSettings();
  const p = settings ?? defaultSettings;
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const contactMethods = [
    {
      Icon: Mail,
      label: "Email",
      value: p.email,
      href: `mailto:${p.email}`,
    },
    {
      Icon: Github,
      label: "GitHub",
      value: formatHandle(p.github),
      href: p.github,
    },
    {
      Icon: Linkedin,
      label: "LinkedIn",
      value: formatHandle(p.linkedin),
      href: p.linkedin,
    },
  ].filter((m) => m.value && m.href) as {
    Icon: typeof Mail;
    label: string;
    value: string;
    href: string;
  }[];

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
    const body = encodeURIComponent(
      `${parsed.data.message}\n\n— ${parsed.data.name} (${parsed.data.email})`,
    );
    window.location.href = `mailto:${p.email}?subject=${subject}&body=${body}`;
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
          {/* Contact links — equal height cards */}
          <Reveal className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:grid-rows-1 lg:grid-cols-1 lg:grid-rows-3">
            {contactMethods.map(({ Icon, label, value, href }, idx) => (
              <Reveal key={label} delay={idx * 0.1} className="h-full">
                <Magnet strength={0.2} className="block w-full">
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex h-full min-h-[92px] items-center gap-5 rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur transition-all duration-300 hover:border-primary/40 hover:bg-card/80 hover:shadow-[0_0_32px_-8px_var(--primary)]"
                  >
                    <span className="grid size-14 shrink-0 place-items-center rounded-2xl border border-primary/20 bg-primary/10 transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/20 group-hover:shadow-[0_0_20px_-4px_var(--primary)]">
                      <Icon className="size-6 text-primary" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-semibold text-foreground">{label}</p>
                      <p className="mt-1 truncate text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                        {value}
                      </p>
                    </div>
                    <ArrowUpRight className="size-5 shrink-0 text-muted-foreground/50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                  </a>
                </Magnet>
              </Reveal>
            ))}
          </Reveal>

          {/* Contact form */}
          <Reveal delay={0.15} className="h-full">
            <SpotlightCard className="h-full rounded-3xl p-7 glass">
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
                <Magnet strength={0.3}>
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
                </Magnet>
              </form>
            </SpotlightCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
