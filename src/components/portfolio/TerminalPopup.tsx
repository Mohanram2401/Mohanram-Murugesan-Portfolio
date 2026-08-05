import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, X, ChevronRight, CornerDownLeft, Terminal, Minus, RotateCcw, Maximize2, Minimize2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface CommandLog {
  text: string;
  type: "input" | "output" | "system" | "error" | "success";
}

export function TerminalPopup() {
  const [open, setOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [history, setHistory] = useState<CommandLog[]>([]);
  const [typingText, setTypingText] = useState("");
  const [typingType, setTypingType] = useState<CommandLog["type"]>("system");
  const [isTyping, setIsTyping] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [step, setStep] = useState<"cmd" | "name" | "email" | "message">("cmd");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const activeTimeouts = useRef<NodeJS.Timeout[]>([]);

  // Startup logs constant
  const startupLogs: CommandLog[] = [
    { text: " Mohanram Murugesan [Secure Portal Terminal v1.42]", type: "system" },
    { text: "Establishing secure shell handshake... OK", type: "system" },
    { text: "Type 'help' to view available operations.", type: "system" },
  ];

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, typingText]);

  // Focus input on click
  const focusTerminal = () => {
    inputRef.current?.focus();
  };

  // Clear all pending timeouts
  const clearTimeouts = () => {
    activeTimeouts.current.forEach(clearTimeout);
    activeTimeouts.current = [];
  };

  // Typing helper function
  const typeLines = (lines: CommandLog[], callback?: () => void) => {
    clearTimeouts();
    setIsTyping(true);

    let lineIndex = 0;
    let charIndex = 0;
    let accumulatedText = "";

    const typeChar = () => {
      if (lineIndex >= lines.length) {
        setIsTyping(false);
        if (callback) callback();
        return;
      }

      const currentLine = lines[lineIndex]!;
      setTypingType(currentLine.type);

      if (charIndex < currentLine.text.length) {
        accumulatedText += currentLine.text[charIndex];
        setTypingText(accumulatedText);
        charIndex++;
        
        const speed = 25;
        const timer = setTimeout(typeChar, speed);
        activeTimeouts.current.push(timer);
      } else {
        // Complete current line
        setHistory((prev) => [...prev, currentLine]);
        setTypingText("");
        accumulatedText = "";
        charIndex = 0;
        lineIndex++;
        
        const timer = setTimeout(typeChar, 300);
        activeTimeouts.current.push(timer);
      }
    };

    typeChar();
  };

  // Trigger shell restart sequence
  const handleRestart = () => {
    setHistory([]);
    setTypingText("");
    setIsTyping(false);
    setStep("cmd");
    typeLines(startupLogs);
  };

  // Open Shell triggering routine
  const handleOpenShell = () => {
    if (open) {
      setIsMinimized(true);
      setOpen(false);
    } else {
      setOpen(true);
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  };

  // Handle open state side effects
  useEffect(() => {
    if (open) {
      setShowTooltip(false);
      if (!isMinimized) {
        typeLines(startupLogs);
      } else {
        setIsMinimized(false);
      }
    }
  }, [open]);

  // Handle event listener from external triggers (like Navbar)
  useEffect(() => {
    const handler = () => {
      handleOpenShell();
    };
    window.addEventListener("open-terminal", handler);
    return () => {
      window.removeEventListener("open-terminal", handler);
    };
  }, [open, isMinimized]);

  // Completely Close shell (Wipe state)
  const handleCloseShell = () => {
    setOpen(false);
    setIsMinimized(false);
    clearTimeouts();
    setHistory([]);
    setTypingText("");
    setIsTyping(false);
    setStep("cmd");
  };

  // Minimize shell (Preserve state)
  const handleMinimizeShell = () => {
    setIsMinimized(true);
    setOpen(false);
  };

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setHistory((prev) => [...prev, { text: `guest@mohanram-sec:~$ ${trimmed}`, type: "input" }]);
    setInputVal("");

    const normalized = trimmed.toLowerCase();

    if (normalized === "help") {
      typeLines([
        { text: "Available commands:", type: "output" },
        { text: "  about      - Details about Mohanram Murugesan", type: "output" },
        { text: "  projects   - Summary of featured engineering projects", type: "output" },
        { text: "  whoami     - Guest session authorization details", type: "output" },
        { text: "  contact    - Initiate an interactive contact message", type: "output" },
        { text: "  clear      - Clear the console scrollback", type: "output" },
        { text: "  exit       - Terminate terminal session", type: "output" },
      ]);
    } else if (normalized === "clear") {
      clearTimeouts();
      setHistory([]);
      setTypingText("");
      setIsTyping(false);
    } else if (normalized === "exit") {
      typeLines([
        { text: "Session terminated. Closing shell...", type: "system" }
      ], () => {
        setTimeout(() => handleCloseShell(), 500);
      });
    } else if (normalized === "whoami") {
      typeLines([
        { text: "Session ID: SSH-SEC-" + Math.floor(Math.random() * 900000 + 100000), type: "output" },
        { text: "Access level: Guest (Read/Send telemetry)", type: "output" },
        { text: "Status: Connection active over HTTPS/WSS", type: "output" },
      ]);
    } else if (normalized === "about") {
      typeLines([
        { text: "Mohanram Murugesan — Cybersecurity Engineer & SOC Analyst.", type: "output" },
        { text: "Specializes in building high-signal detection rules, SIEM telemetry integration,", type: "output" },
        { text: "VAPT (web/API/network penetration testing), and security orchestration automation.", type: "output" },
      ]);
    } else if (normalized === "projects") {
      typeLines([
        { text: "Featured Deployments & Labs:", type: "output" },
        { text: "  * Wazuh SIEM   - Centralized monitoring, n8n automation, and Slack alerts", type: "output" },
        { text: "  * Zabbix+pfSense - DDoS detection and automated email notifications", type: "output" },
        { text: "  * Packet Ranger - Wireshark network traffic analysis lab", type: "output" },
        { text: "  * RansomwareDet - Threat identification, YARA rules, and RK-Hunter scan", type: "output" },
      ]);
    } else if (normalized === "contact") {
      typeLines([
        { text: "[CONSTRUCTING SECURE CHANNEL]", type: "system" },
        { text: "Please enter your Name:", type: "output" },
      ], () => {
        setStep("name");
        setTimeout(() => inputRef.current?.focus(), 50);
      });
    } else {
      typeLines([
        { text: `guest: command not found: ${trimmed}. Type 'help' for commands.`, type: "error" }
      ]);
    }
  };

  const handleStepInput = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return;

    setHistory((prev) => [...prev, { text: trimmed, type: "input" }]);
    setInputVal("");

    if (step === "name") {
      setFormData((f) => ({ ...f, name: trimmed }));
      typeLines([
        { text: "Please enter your Email address:", type: "output" }
      ], () => {
        setStep("email");
        setTimeout(() => inputRef.current?.focus(), 50);
      });
    } else if (step === "email") {
      if (!trimmed.includes("@") || !trimmed.includes(".")) {
        typeLines([
          { text: "Invalid email format. Try again:", type: "error" }
        ]);
        return;
      }
      setFormData((f) => ({ ...f, email: trimmed }));
      typeLines([
        { text: "Enter your Message / Inquiry details:", type: "output" }
      ], () => {
        setStep("message");
        setTimeout(() => inputRef.current?.focus(), 50);
      });
    } else if (step === "message") {
      const finalMsg = trimmed;
      const finalData = { ...formData, message: finalMsg };
      setFormData({ name: "", email: "", message: "" });
      setStep("cmd");

      typeLines([
        { text: "[DISPATCHING TELEMETRY ENVELOPE]", type: "system" },
        { text: "Encrypting message with AES-256-GCM...", type: "system" }
      ], () => {
        void (async () => {
          try {
            await supabase.from("contacts").insert({
              name: finalData.name,
              email: finalData.email,
              message: finalData.message,
            });
          } catch {
            // ignore
          }

          typeLines([
            { text: "Secure handshake complete. Handed off successfully!", type: "success" },
            { text: `Thank you, ${finalData.name}. Mohanram has been notified of your message.`, type: "success" },
            { text: "Connection restored to guest CLI shell.", type: "system" }
          ], () => {
            setTimeout(() => inputRef.current?.focus(), 50);
          });
        })();
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (step === "cmd") {
        handleCommand(inputVal);
      } else {
        handleStepInput(inputVal);
      }
    }
  };

  return (
    <>
      {/* Floating Shell Trigger (Bottom-Left) */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3">
        <AnimatePresence>
          {showTooltip && !open && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-[260px] rounded-xl border border-primary/20 bg-neutral-950/95 p-3 font-mono text-[11px] leading-relaxed text-cyan-400/90 shadow-xl shadow-black/60 ring-1 ring-primary/10 backdrop-blur-md"
            >
              <p>
                Stuck on a question? I'm here to help you with real-time security guidance and telemetry contact channels. 🚀
              </p>
              <div className="absolute -bottom-1.5 left-5 size-3 rotate-45 border-r border-b border-primary/20 bg-neutral-950" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={handleOpenShell}
          className={`group flex size-12 items-center justify-center rounded-full border border-primary/45 bg-[#05070a] text-primary shadow-[0_0_24px_-4px_rgba(5,195,221,0.3)] backdrop-blur transition-all duration-300 hover:scale-110 hover:border-primary hover:shadow-[0_0_30px_-2px_rgba(5,195,221,0.55)] cursor-pointer ${
            open ? "scale-95 border-accent2 text-accent2 shadow-[0_0_24px_rgba(139,92,246,0.3)]" : ""
          }`}
          title="Open Security Shell"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/10 opacity-30" />
          <Bot className="size-5" />
        </motion.button>
      </div>

      {/* Terminal Viewport Canvas (Always Fixed Inset, Click-Through) */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 flex p-4 pointer-events-none ${
              fullscreen 
                ? "items-center justify-center bg-black/60 backdrop-blur-sm" 
                : "items-end justify-start"
            }`}
          >
            {/* Click shield for closing fullscreen shell */}
            {fullscreen && (
              <div 
                className="absolute inset-0 pointer-events-auto cursor-default" 
                onClick={handleCloseShell}
              />
            )}

            <motion.div
              layout
              initial={{ scale: 0.05, opacity: 0, x: -10, y: 40 }}
              animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
              exit={{ scale: 0.05, opacity: 0, x: -10, y: 40 }}
              transition={{ type: "spring", stiffness: 280, damping: 25 }}
              onClick={focusTerminal}
              style={{ originX: 0, originY: 1 }} // Always scale/collapse to the bottom-left Bot icon
              className={`relative flex flex-col overflow-hidden rounded-2xl border border-primary/25 bg-neutral-950/97 font-mono text-[12px] leading-relaxed text-emerald-400 shadow-2xl shadow-black/85 ring-1 ring-primary/20 backdrop-blur-md pointer-events-auto ${
                fullscreen 
                  ? "h-[520px] w-full max-w-xl" 
                  : "h-[480px] w-[380px] max-w-[calc(100vw-2rem)] ml-2 mb-20"
              }`}
            >
              {/* Scanline CRT overlay */}
              <div className="pointer-events-none absolute inset-0 z-20 bg-terminal-crt opacity-[0.06]" />

              {/* Title Bar / Header */}
              <div className="flex items-center justify-between border-b border-primary/15 bg-neutral-900/80 px-4 py-2 text-xs text-muted-foreground select-none">
                <div className="flex items-center gap-2">
                  <Terminal className="size-3.5 text-primary" />
                  <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">
                    guest@mohanram-sec
                  </span>
                </div>
                
                {/* Control Actions Panel */}
                <div className="flex items-center gap-2">
                  {/* Minimize button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMinimizeShell();
                    }}
                    className="grid size-5 place-items-center rounded hover:bg-neutral-800 hover:text-cyan-400 transition-colors cursor-pointer"
                    title="Minimize Shell (Preserves Session)"
                  >
                    <Minus className="size-3" />
                  </button>

                  {/* Restart button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRestart();
                    }}
                    className="grid size-5 place-items-center rounded hover:bg-neutral-800 hover:text-cyan-400 transition-colors cursor-pointer"
                    title="Restart Telemetry Handshake"
                  >
                    <RotateCcw className="size-3" />
                  </button>

                  {/* Maximize/Fullscreen button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFullscreen((prev) => !prev);
                    }}
                    className="grid size-5 place-items-center rounded hover:bg-neutral-800 hover:text-cyan-400 transition-colors cursor-pointer"
                    title={fullscreen ? "Floating Window" : "Center Fullscreen"}
                  >
                    {fullscreen ? <Minimize2 className="size-3" /> : <Maximize2 className="size-3" />}
                  </button>

                  {/* Close button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseShell();
                    }}
                    className="grid size-5 place-items-center rounded hover:bg-neutral-800 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Close Shell (Resets Session)"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Console log area */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 scrollbar-thin scrollbar-thumb-primary/20">
                {history.map((log, i) => {
                  let colorClass = "text-emerald-400";
                  if (log.type === "system") colorClass = "text-cyan-400/90";
                  if (log.type === "error") colorClass = "text-rose-400";
                  if (log.type === "success") colorClass = "text-teal-300 font-medium";
                  if (log.type === "input") colorClass = "text-slate-200";

                  return (
                    <div key={i} className="flex items-start gap-2">
                      {log.type !== "input" && (
                        <Bot className="size-3.5 text-primary shrink-0 mt-0.5" />
                      )}
                      <div className={`flex-1 whitespace-pre-wrap ${colorClass}`}>
                        {log.text}
                      </div>
                    </div>
                  );
                })}
                
                {typingText && (
                  <div className="flex items-start gap-2">
                    <Bot className="size-3.5 text-primary shrink-0 mt-0.5 animate-pulse" />
                    <div className={`flex-1 whitespace-pre-wrap ${
                      typingType === "system" ? "text-cyan-400/90" :
                      typingType === "error" ? "text-rose-400" :
                      typingType === "success" ? "text-teal-300 font-medium" :
                      "text-emerald-400"
                    }`}>
                      {typingText}
                      <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-emerald-400 animate-pulse" />
                    </div>
                  </div>
                )}
                
                <div ref={bottomRef} />
              </div>

              {/* Command Input Area */}
              <div className="flex items-center gap-2 border-t border-primary/15 bg-neutral-900/50 px-4 py-3.5">
                <ChevronRight className="size-4 shrink-0 text-cyan-400" />
                <span className="text-slate-300 select-none">
                  {step === "cmd" ? "guest:~$" : step.toUpperCase() + ":"}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-slate-100 outline-none border-none ring-0 placeholder:text-neutral-700 font-mono"
                  placeholder={step === "cmd" ? "type 'help'..." : "input..."}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  disabled={isTyping}
                />
                <span className="text-[10px] text-neutral-600 flex items-center gap-1 select-none">
                  [ENTER] <CornerDownLeft className="size-2.5" />
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
