import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck, Check, Loader2 } from "lucide-react";

interface BootStep {
  label: string;
  status: "pending" | "loading" | "success";
}

export function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState<BootStep[]>([
    { label: "INITIALIZING PORTAL PROTOCOLS", status: "pending" },
    { label: "ESTABLISHING DATABASE HANDSHAKE", status: "pending" },
    { label: "DECRYPTING PORTFOLIO DATA TELEMETRY", status: "pending" },
    { label: "VERIFYING SIEM DETECTION PIPELINES", status: "pending" },
    { label: "STAGING GEOMETRIC GRAPHICS SYSTEM", status: "pending" },
    { label: "AUTHORIZING VISITOR CONNECTION", status: "pending" },
  ]);

  useEffect(() => {
    // Incremental progress counter over ~4.5 seconds
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const diff = Math.floor(Math.random() * 3) + 2; // Increments by 2-4%
        return Math.min(prev + diff, 100);
      });
    }, 110);

    return () => clearInterval(progressInterval);
  }, []);

  // Update step statuses as progress increases
  useEffect(() => {
    setSteps((prevSteps) => {
      return prevSteps.map((step, index) => {
        const triggerPercent = (index + 1) * 15; // evenly spaced triggers
        
        let newStatus: BootStep["status"] = "pending";
        if (progress >= 100) {
          newStatus = "success";
        } else if (progress >= triggerPercent) {
          newStatus = "success";
        } else if (progress >= triggerPercent - 15) {
          newStatus = "loading";
        }
        
        return { ...step, status: newStatus };
      });
    });
  }, [progress]);

  useEffect(() => {
    if (progress === 100) {
      const exitTimer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem("portal-preloader-shown", "true");
      }, 800);
      return () => clearTimeout(exitTimer);
    }
  }, [progress]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.08,
            filter: "blur(8px)",
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#05070a] font-mono text-[12px] text-cyan-400"
        >
          {/* CRT scanline background overlay */}
          <div className="pointer-events-none absolute inset-0 bg-terminal-crt opacity-[0.06]" />

          <div className="w-full max-w-md px-6">
            {/* Center Shield Icon with pulsing glow */}
            <div className="mb-8 flex justify-center">
              <motion.div 
                animate={progress === 100 ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <span className="absolute inset-0 animate-ping rounded-2xl bg-cyan-500/20 opacity-30" />
                <div className="flex size-20 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.3)]">
                  <ShieldCheck className="size-10" />
                </div>
              </motion.div>
            </div>

            {/* Boot Logs */}
            <div className="mb-8 rounded-2xl border border-cyan-500/15 bg-black/50 p-5 leading-relaxed text-cyan-400/80 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] backdrop-blur">
              <div className="mb-3 text-[10px] text-cyan-500/60 uppercase tracking-widest font-bold">System Boot Sequence</div>
              <div className="space-y-2">
                {steps.map((step, i) => (
                  <div key={i} className="flex items-center justify-between gap-3">
                    <span className={step.status === "success" ? "text-cyan-300" : step.status === "loading" ? "text-cyan-400 animate-pulse" : "text-neutral-600"}>
                      &gt; {step.label}
                    </span>
                    <span className="shrink-0 font-bold">
                      {step.status === "success" ? (
                        <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px]">
                          <Check className="size-3" strokeWidth={3} /> OK
                        </span>
                      ) : step.status === "loading" ? (
                        <span className="flex items-center gap-1 text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded text-[10px]">
                          <Loader2 className="size-3 animate-spin" /> LOAD
                        </span>
                      ) : (
                        <span className="text-neutral-700 bg-neutral-900 px-1.5 py-0.5 rounded text-[10px]">
                          WAIT
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Percentage & Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between font-bold text-cyan-300">
                <span className="tracking-wider uppercase text-[10px] text-cyan-500/60">Decryption progress</span>
                <span className="text-sm font-bold tabular-nums">{progress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-950 ring-1 ring-cyan-500/20">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 via-primary to-purple-500"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
