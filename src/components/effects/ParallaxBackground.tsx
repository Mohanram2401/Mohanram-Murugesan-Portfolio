import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

export function ParallaxBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const springProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 15 });

  // Floating speeds
  const y1 = useTransform(springProgress, [0, 1], ["0%", "80%"]);
  const y2 = useTransform(springProgress, [0, 1], ["0%", "-40%"]);
  const y3 = useTransform(springProgress, [0, 1], ["0%", "120%"]);
  const y4 = useTransform(springProgress, [0, 1], ["0%", "-20%"]);
  const y5 = useTransform(springProgress, [0, 1], ["0%", "50%"]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 -z-30 overflow-hidden" aria-hidden>
      {/* Layer 1: Left floating tech grid/matrix (Large scroll) */}
      <motion.div
        style={{ y: y1 }}
        className="absolute left-[3%] top-[15vh] opacity-[0.04] text-primary"
      >
        <svg width="240" height="300" viewBox="0 0 240 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="2" fill="currentColor" />
          <circle cx="50" cy="10" r="2" fill="currentColor" />
          <circle cx="90" cy="10" r="2" fill="currentColor" />
          <circle cx="130" cy="10" r="2" fill="currentColor" />
          <circle cx="10" cy="50" r="2" fill="currentColor" />
          <line x1="10" y1="10" x2="130" y2="10" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="10" y1="10" x2="10" y2="150" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="170" cy="90" r="3" fill="currentColor" />
          <circle cx="210" cy="130" r="3" fill="currentColor" />
          <path d="M50,10 L170,90 L210,130" stroke="currentColor" strokeWidth="1" />
        </svg>
      </motion.div>

      {/* Layer 2: Right floating glowing cyber orb (Medium scroll negative direction) */}
      <motion.div
        style={{ y: y2 }}
        className="absolute right-[5%] top-[40vh] size-96 rounded-full bg-accent2/10 blur-[120px]"
      />

      {/* Layer 3: Left floating binary matrix or code bracket (Very fast scroll) */}
      <motion.div
        style={{ y: y3 }}
        className="absolute left-[2%] top-[65vh] font-mono text-[11px] leading-relaxed text-accent3/20 opacity-30 select-none"
      >
        <div>01000011 01011001</div>
        <div>01000010 01000101</div>
        <div>01010010 01010011</div>
        <div>01000101 01000011</div>
        <div className="text-primary/30 mt-3">&lt;det_rules /&gt;</div>
      </motion.div>

      {/* Layer 4: Right floating node topology (Slow scroll negative direction) */}
      <motion.div
        style={{ y: y4 }}
        className="absolute right-[3%] top-[80vh] opacity-[0.05] text-accent3"
      >
        <svg width="280" height="350" viewBox="0 0 280 350" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="80" cy="80" r="4" fill="currentColor" />
          <circle cx="180" cy="40" r="6" fill="currentColor" />
          <circle cx="240" cy="160" r="4" fill="currentColor" />
          <circle cx="100" cy="220" r="5" fill="currentColor" />
          <line x1="80" y1="80" x2="180" y2="40" stroke="currentColor" strokeWidth="1.5" />
          <line x1="180" y1="40" x2="240" y2="160" stroke="currentColor" strokeWidth="1.5" />
          <line x1="80" y1="80" x2="100" y2="220" stroke="currentColor" strokeWidth="1.5" />
          <line x1="100" y1="220" x2="240" y2="160" stroke="currentColor" strokeWidth="1.5" />
          <path d="M100,220 L50,300 M240,160 L200,320" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        </svg>
      </motion.div>

      {/* Layer 5: Center-Right floating background orb (Medium scroll) */}
      <motion.div
        style={{ y: y5 }}
        className="absolute right-[20%] top-[120vh] size-[500px] rounded-full bg-primary/8 blur-[160px]"
      />
    </div>
  );
}
