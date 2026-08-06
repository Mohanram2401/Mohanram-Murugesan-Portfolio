import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, ShieldCheck, X, Terminal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { useSettings } from "@/hooks/usePortfolioData";
import { useAdminAccess } from "@/hooks/useAdminAccess";

const DEFAULT_LINKS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "contact", label: "Contact" },
];

const linkVariants = {
  hidden: { opacity: 0, y: -14, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.3 + i * 0.06, type: "spring" as const, stiffness: 260, damping: 22 },
  }),
};

const mobileVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] as const, duration: 0.5 },
  }),
};

export function Navbar() {
  useAdminAccess();
  const { data: settings } = useSettings();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.2,
  });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("hero");

  const name = settings?.name?.trim() ? settings.name : "Mohanram";
  const title = settings?.title?.trim() ? settings.title : "Cybersecurity Engineer";

  /* Nav links follow the visibility settings — hidden sections drop off the nav. */
  const links = useMemo(() => {
    const visible = settings?.visibleSections;
    if (!visible) return DEFAULT_LINKS;
    const list: { id: string; label: string }[] = [];
    if (visible.about) list.push({ id: "about", label: "About" });
    if (visible.experience || visible.education)
      list.push({ id: "experience", label: "Experience" });
    if (visible.projects) list.push({ id: "projects", label: "Projects" });
    if (visible.certifications) list.push({ id: "certifications", label: "Certifications" });
    if (visible.contact) list.push({ id: "contact", label: "Contact" });
    return list;
  }, [settings]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Track the active section */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    links.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [links]);

  /* Lock body scroll while the mobile menu is open */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navigate = useNavigate();
  const [logoClicks, setLogoClicks] = useState<{ count: number; lastClick: number }>({ count: 0, lastClick: 0 });

  const onLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const now = Date.now();
    setLogoClicks((prev) => {
      const isQuick = now - prev.lastClick < 3000;
      const count = isQuick ? prev.count + 1 : 1;
      if (count >= 5) {
        void navigate({ to: "/admin" });
        return { count: 0, lastClick: 0 };
      }
      return { count, lastClick: now };
    });
  };

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-brand shadow-[0_0_12px_var(--primary)]"
      />

      {/* Navbar */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "py-2.5" : "py-4"
          }`}
      >
        <nav
          className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500 sm:px-5 ${scrolled
              ? "glass shadow-2xl shadow-black/40 ring-1 ring-border/40"
              : "border border-transparent"
            }`}
          style={{ width: "min(100% - 2rem, 72rem)" }}
        >
          {/* Logo */}
          <motion.button
            onClick={onLogoClick}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="group flex items-center gap-2.5"
            aria-label="Back to top"
          >
            <span className="relative grid size-9 place-items-center rounded-xl bg-gradient-brand shadow-[0_0_22px_-4px_var(--primary)] transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 group-hover:shadow-[0_0_30px_-2px_var(--primary)]">
              <span className="absolute inset-0 rounded-xl bg-primary/40 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
              <ShieldCheck className="relative size-5 text-background" />
            </span>
            <span className="font-display text-sm font-semibold tracking-tight text-foreground">
              {name}
              <span className="text-primary">.</span>
            </span>
          </motion.button>

          {/* Desktop links */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="hidden items-center gap-1 lg:flex"
          >
            {links.map((link, i) => {
              const isActive = active === link.id;
              return (
                <motion.button
                  key={link.id}
                  custom={i}
                  variants={linkVariants}
                  onClick={() => go(link.id)}
                  className={`group relative rounded-lg px-3.5 py-2 text-sm transition-colors ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-primary/12 ring-1 ring-primary/30"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}
                  <span className="relative flex items-center gap-1.5">
                    {link.label}
                    {/* underline grow on hover */}
                    <span
                      className={`absolute -bottom-1 left-0 h-px bg-gradient-to-r from-primary to-accent2 transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                    />
                  </span>
                </motion.button>
              );
            })}
            {/* Terminal Shell Button */}
            <motion.button
              custom={links.length}
              variants={linkVariants}
              onClick={() => window.dispatchEvent(new CustomEvent("open-terminal"))}
              className="ml-3 inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2 font-mono text-xs text-primary transition-all hover:bg-primary/20 hover:shadow-[0_0_15px_-4px_var(--primary)] cursor-pointer"
              title="Open Secure Shell"
            >
              <Terminal className="size-3.5" />
              <span>Shell</span>
            </motion.button>
          </motion.div>

          {/* Mobile Shell & Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-terminal"))}
              className="grid size-9 place-items-center rounded-lg border border-primary/25 bg-primary/10 text-primary transition-colors hover:bg-primary/20"
              title="Open Secure Shell"
            >
              <Terminal className="size-4" />
            </button>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55, type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className="grid size-9 place-items-center rounded-lg border border-border/70 text-foreground transition-colors hover:border-primary/50"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.25 }}
                >
                  {open ? <X className="size-4" /> : <Menu className="size-4" />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at calc(100% - 44px) 44px)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-background/95 px-8 backdrop-blur-2xl lg:hidden"
          >
            <motion.div
              className="pointer-events-none absolute right-0 bottom-0 size-[22rem] rounded-full bg-primary/10 blur-[120px]"
              aria-hidden
            />
            <nav className="relative flex flex-col gap-2" aria-label="Mobile navigation">
              {links.map((link, i) => (
                <motion.button
                  key={link.id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={mobileVariants}
                  onClick={() => go(link.id)}
                  className={`group flex items-center gap-4 rounded-2xl px-4 py-4 text-left text-2xl font-display font-semibold transition-colors ${active === link.id
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-card/60"
                    }`}
                >
                  <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                  {link.label}
                  <span
                    className={`ml-auto h-px flex-1 max-w-16 bg-gradient-to-r from-primary/50 to-transparent transition-all duration-500 ${active === link.id ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                      }`}
                  />
                </motion.button>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="relative mt-8 flex items-center gap-3 px-4"
            >
              <span className="grid size-8 place-items-center rounded-lg bg-gradient-brand">
                <ShieldCheck className="size-4 text-background" />
              </span>
              <span className="font-mono text-xs text-muted-foreground">{title}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
