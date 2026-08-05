import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const R = 190;
const CSS_SIZE = R * 2 + 80;
const HALF = CSS_SIZE / 2;

/* ── Your actual skill stack ───────────────────────────────────── */
const tools = [
  {
    id: "splunk",
    label: "Splunk",
    cat: "SIEM",
    lat: 22,
    lon: 15,
    icon: "https://cdn.simpleicons.org/splunk/05C3DD",
  },
  {
    id: "sentinel",
    label: "Sentinel",
    cat: "SIEM",
    lat: 38,
    lon: 55,
    letter: "S",
    color: "#0078D4",
  },
  {
    id: "burp",
    label: "Burp Suite",
    cat: "OffSec",
    lat: -20,
    lon: 85,
    letter: "B",
    color: "#FF6633",
  },
  {
    id: "metasploit",
    label: "Metasploit",
    cat: "OffSec",
    lat: -42,
    lon: 115,
    letter: "M",
    color: "#E83E28",
  },
  {
    id: "nmap",
    label: "Nmap",
    cat: "OffSec",
    lat: 5,
    lon: 145,
    letter: "N",
    color: "#4FC3F7",
  },
  {
    id: "wireshark",
    label: "Wireshark",
    cat: "Network",
    lat: 52,
    lon: 175,
    icon: "https://cdn.simpleicons.org/wireshark/1679A7",
  },
  {
    id: "react",
    label: "React",
    cat: "Frontend",
    lat: 55,
    lon: 295,
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    id: "ts",
    label: "TypeScript",
    cat: "Frontend",
    lat: 30,
    lon: 320,
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  {
    id: "nextjs",
    label: "Next.js",
    cat: "Frontend",
    lat: -15,
    lon: 340,
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  },
  {
    id: "python",
    label: "Python",
    cat: "Backend",
    lat: -38,
    lon: 260,
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    id: "node",
    label: "Node.js",
    cat: "Backend",
    lat: 15,
    lon: 235,
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  {
    id: "go",
    label: "Go",
    cat: "Backend",
    lat: 48,
    lon: 210,
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
  },
  {
    id: "elastic",
    label: "Elastic",
    cat: "Data",
    lat: -48,
    lon: 195,
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elasticsearch/elasticsearch-original.svg",
  },
  {
    id: "redis",
    label: "Redis",
    cat: "Data",
    lat: 10,
    lon: 270,
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
  },
  {
    id: "postgres",
    label: "PostgreSQL",
    cat: "Data",
    lat: -30,
    lon: 300,
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  },
  {
    id: "docker",
    label: "Docker",
    cat: "DevOps",
    lat: 45,
    lon: 140,
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  },
  {
    id: "k8s",
    label: "K8s",
    cat: "DevOps",
    lat: 28,
    lon: 165,
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-original.svg",
  },
  {
    id: "git",
    label: "Git",
    cat: "DevOps",
    lat: -55,
    lon: 30,
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },
  {
    id: "terraform",
    label: "Terraform",
    cat: "DevOps",
    lat: 25,
    lon: 100,
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg",
  },
  {
    id: "grafana",
    label: "Grafana",
    cat: "Monitor",
    lat: -10,
    lon: 250,
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg",
  },
  {
    id: "aws",
    label: "AWS",
    cat: "Cloud",
    lat: -45,
    lon: 60,
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg",
  },
];

const connections: [string, string][] = [
  ["splunk", "elastic"],
  ["splunk", "sentinel"],
  ["python", "splunk"],
  ["python", "elastic"],
  ["python", "docker"],
  ["docker", "terraform"],
  ["docker", "k8s"],
  ["docker", "node"],
  ["react", "ts"],
  ["react", "nextjs"],
  ["ts", "nextjs"],
  ["ts", "node"],
  ["git", "docker"],
  ["git", "terraform"],
  ["nmap", "wireshark"],
  ["nmap", "metasploit"],
  ["burp", "metasploit"],
  ["grafana", "elastic"],
  ["grafana", "redis"],
  ["aws", "terraform"],
  ["aws", "docker"],
  ["go", "docker"],
  ["redis", "node"],
  ["postgres", "node"],
];

const catColors: Record<string, string> = {
  SIEM: "#05C3DD",
  OffSec: "#E83E28",
  Network: "#1679A7",
  Frontend: "#61DAFB",
  Backend: "#83CD29",
  Data: "#E34F26",
  DevOps: "#0DB7ED",
  Monitor: "#F46800",
  Cloud: "#FF9900",
};

/* ── Simplified continent outlines [lat, lon][] ────────────────── */
const continents: [number, number][][] = [
  /* Africa */ [
    [37, -10],
    [37, 30],
    [30, 33],
    [22, 37],
    [12, 44],
    [5, 50],
    [-2, 48],
    [-10, 40],
    [-26, 33],
    [-34, 26],
    [-35, 18],
    [-28, 15],
    [-17, 12],
    [-5, 10],
    [5, 0],
    [5, -8],
    [15, -17],
    [26, -14],
    [33, -8],
  ],
  /* Europe */ [
    [36, -10],
    [43, 0],
    [48, -5],
    [51, 2],
    [56, 10],
    [63, 12],
    [70, 25],
    [71, 28],
    [70, 40],
    [55, 22],
    [48, 15],
    [44, 12],
    [40, 25],
    [36, 22],
  ],
  /* Asia */ [
    [42, 25],
    [55, 40],
    [65, 60],
    [70, 70],
    [72, 80],
    [70, 110],
    [60, 130],
    [50, 140],
    [35, 130],
    [22, 114],
    [1, 104],
    [8, 98],
    [22, 72],
    [24, 68],
    [30, 48],
    [36, 36],
  ],
  /* N. America */ [
    [60, -170],
    [72, -130],
    [70, -100],
    [65, -80],
    [50, -55],
    [43, -70],
    [30, -82],
    [25, -80],
    [15, -88],
    [8, -78],
    [18, -96],
    [25, -110],
    [35, -120],
    [48, -125],
    [58, -138],
  ],
  /* S. America */ [
    [12, -72],
    [7, -55],
    [2, -50],
    [-8, -35],
    [-18, -40],
    [-28, -48],
    [-38, -58],
    [-48, -66],
    [-56, -68],
    [-54, -64],
    [-42, -73],
    [-28, -70],
    [-18, -70],
    [-5, -80],
    [5, -77],
  ],
  /* Australia */ [
    [-12, 130],
    [-18, 122],
    [-28, 114],
    [-35, 118],
    [-38, 142],
    [-35, 151],
    [-28, 154],
    [-20, 149],
    [-13, 143],
    [-12, 136],
  ],
];

/* ── Projection ────────────────────────────────────────────────── */
function project(lat: number, lon: number, rot: number) {
  const rL = (lat * Math.PI) / 180;
  const rN = ((lon + rot) * Math.PI) / 180;
  return { x: Math.cos(rL) * Math.sin(rN), y: -Math.sin(rL), z: Math.cos(rL) * Math.cos(rN) };
}

function cx(x: number) {
  return HALF + x * R;
}
function cy(y: number) {
  return HALF + y * R;
}

/* ── Canvas draw ───────────────────────────────────────────────── */
function draw(ctx: CanvasRenderingContext2D, angle: number) {
  const w = CSS_SIZE;
  ctx.clearRect(0, 0, w, w);

  /* Background radial glow */
  const bgG = ctx.createRadialGradient(HALF, HALF, R * 0.2, HALF, HALF, R * 1.8);
  bgG.addColorStop(0, "rgba(5,195,221,0.12)");
  bgG.addColorStop(0.5, "rgba(60,20,120,0.06)");
  bgG.addColorStop(1, "transparent");
  ctx.fillStyle = bgG;
  ctx.fillRect(0, 0, w, w);

  /* Sphere body — glass */
  const sG = ctx.createRadialGradient(HALF - R * 0.22, HALF - R * 0.22, R * 0.08, HALF, HALF, R);
  sG.addColorStop(0, "rgba(20,60,110,0.55)");
  sG.addColorStop(0.45, "rgba(10,35,70,0.45)");
  sG.addColorStop(0.85, "rgba(5,18,40,0.6)");
  sG.addColorStop(1, "rgba(2,8,20,0.75)");
  ctx.beginPath();
  ctx.arc(HALF, HALF, R, 0, Math.PI * 2);
  ctx.fillStyle = sG;
  ctx.fill();

  /* Continent fills */
  for (const poly of continents) {
    const pts = poly.map(([lat, lon]) => project(lat, lon, angle));
    const avgZ = pts.reduce((s, p) => s + p.z, 0) / pts.length;
    if (avgZ < -0.15) continue;
    const a = 0.08 + ((avgZ + 0.15) / 1.15) * 0.14;
    ctx.beginPath();
    pts.forEach((p, i) => (i === 0 ? ctx.moveTo(cx(p.x), cy(p.y)) : ctx.lineTo(cx(p.x), cy(p.y))));
    ctx.closePath();
    ctx.fillStyle = `rgba(40,120,100,${a})`;
    ctx.fill();
    ctx.strokeStyle = `rgba(80,200,160,${a * 0.8})`;
    ctx.lineWidth = 0.6;
    ctx.stroke();
  }

  /* Dense wireframe — back (very dim) */
  ctx.lineWidth = 0.4;
  for (let i = 0; i < 24; i++) {
    const phi = i * 15;
    const eff = (((phi + angle) % 360) + 360) % 360;
    if (Math.cos((eff * Math.PI) / 180) > 0) continue;
    ctx.strokeStyle = "rgba(80,200,255,0.05)";
    ctx.beginPath();
    for (let lat = -90; lat <= 90; lat += 4) {
      const p = project(lat, phi, angle);
      if (lat === -90) ctx.moveTo(cx(p.x), cy(p.y));
      else ctx.lineTo(cx(p.x), cy(p.y));
    }
    ctx.stroke();
  }

  /* Dense wireframe — front (bright) */
  for (let i = 0; i < 24; i++) {
    const phi = i * 15;
    const eff = (((phi + angle) % 360) + 360) % 360;
    const cos = Math.cos((eff * Math.PI) / 180);
    if (cos <= 0) continue;
    ctx.strokeStyle = `rgba(100,210,255,${0.08 + cos * 0.22})`;
    ctx.lineWidth = i % 6 === 0 ? 0.8 : 0.4;
    ctx.beginPath();
    for (let lat = -90; lat <= 90; lat += 4) {
      const p = project(lat, phi, angle);
      if (lat === -90) ctx.moveTo(cx(p.x), cy(p.y));
      else ctx.lineTo(cx(p.x), cy(p.y));
    }
    ctx.stroke();
  }

  /* Latitude arcs — front */
  ctx.lineWidth = 0.4;
  for (let lat = -80; lat <= 80; lat += 10) {
    const pts: { x: number; y: number; z: number }[] = [];
    for (let e = -90; e <= 90; e += 4) {
      pts.push(project(lat, e - angle, angle));
    }
    const isEquator = Math.abs(lat) < 2;
    ctx.strokeStyle = isEquator ? "rgba(139,92,246,0.4)" : "rgba(100,210,255,0.14)";
    ctx.lineWidth = isEquator ? 1.2 : 0.4;
    ctx.beginPath();
    pts.forEach((p, i) => (i === 0 ? ctx.moveTo(cx(p.x), cy(p.y)) : ctx.lineTo(cx(p.x), cy(p.y))));
    ctx.stroke();
  }

  /* Intersection nodes (hundreds) */
  for (let i = 0; i < 24; i++) {
    const phi = i * 15;
    for (let j = -8; j <= 8; j++) {
      const lat = j * 10;
      const p = project(lat, phi, angle);
      if (p.z < 0.05) continue;
      const br = p.z;
      const sz = 0.6 + br * 1;
      ctx.beginPath();
      ctx.arc(cx(p.x), cy(p.y), sz, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(150,220,255,${br * 0.5})`;
      ctx.fill();
    }
  }

  /* Connection lines */
  for (const [fromId, toId] of connections) {
    const from = tools.find((t) => t.id === fromId);
    const to = tools.find((t) => t.id === toId);
    if (!from || !to) continue;
    const pf = project(from.lat, from.lon, angle);
    const pt = project(to.lat, to.lon, angle);
    const mz = (pf.z + pt.z) / 2;
    if (mz < -0.2) continue;
    const a = 0.06 + Math.max(0, mz) * 0.18;
    ctx.strokeStyle = `rgba(5,195,221,${a})`;
    ctx.lineWidth = 0.6;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx(pf.x), cy(pf.y));
    ctx.lineTo(cx(pt.x), cy(pt.y));
    ctx.stroke();
    ctx.setLineDash([]);
  }

  /* Rim glow */
  ctx.beginPath();
  ctx.arc(HALF, HALF, R, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(5,195,221,0.35)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(HALF, HALF, R + 1, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(5,195,221,0.1)";
  ctx.lineWidth = 4;
  ctx.stroke();

  /* Orbital rings & glowing particles */
  const orbitalAngle = angle * 0.4;
  for (const [tiltX, tiltY, radiusMul] of [
    [50, 20, 1.35],
    [-30, -10, 1.25],
    [10, 60, 1.18],
  ] as const) {
    const radT = (tiltX * Math.PI) / 180;
    const radY = ((tiltY + orbitalAngle) * Math.PI) / 180;
    ctx.strokeStyle = "rgba(139,92,246,0.15)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    for (let deg = 0; deg <= 360; deg += 3) {
      const rDeg = (deg * Math.PI) / 180;
      const x = Math.cos(rDeg) * R * radiusMul;
      const y = Math.sin(rDeg) * R * radiusMul * Math.cos(radT);
      const z = Math.sin(rDeg) * R * radiusMul * Math.sin(radT);
      const cosY = Math.cos(radY);
      const sinY = Math.sin(radY);
      const nx = x * cosY + z * sinY;
      const nz = -x * sinY + z * cosY;
      const px = HALF + nx;
      const py = HALF + y;
      if (nz < -R * 0.3) continue;
      if (deg === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Orbiting packet particle dot
    const dotDeg = (angle * 1.5) % 360;
    const rDot = (dotDeg * Math.PI) / 180;
    const dx = Math.cos(rDot) * R * radiusMul;
    const dy = Math.sin(rDot) * R * radiusMul * Math.cos(radT);
    const dz = Math.sin(rDot) * R * radiusMul * Math.sin(radT);
    const cosY = Math.cos(radY);
    const sinY = Math.sin(radY);
    const dnx = dx * cosY + dz * sinY;
    const dnz = -dx * sinY + dz * cosY;
    
    if (dnz > -R * 0.2) {
      const dpx = HALF + dnx;
      const dpy = HALF + dy;
      const pulseSize = 3 + Math.sin(angle * 0.08) * 1.5;
      
      const glow = ctx.createRadialGradient(dpx, dpy, 0, dpx, dpy, pulseSize * 3);
      glow.addColorStop(0, "rgba(5, 195, 221, 1)");
      glow.addColorStop(0.3, "rgba(139, 92, 246, 0.6)");
      glow.addColorStop(1, "transparent");
      
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(dpx, dpy, pulseSize * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Core dot
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(dpx, dpy, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* Specular highlight */
  const specG = ctx.createRadialGradient(
    HALF - R * 0.3,
    HALF - R * 0.3,
    0,
    HALF - R * 0.3,
    HALF - R * 0.3,
    R * 0.55,
  );
  specG.addColorStop(0, "rgba(255,255,255,0.2)");
  specG.addColorStop(1, "transparent");
  ctx.fillStyle = specG;
  ctx.beginPath();
  ctx.arc(HALF, HALF, R, 0, Math.PI * 2);
  ctx.fill();

  /* Floating particles */
  for (let i = 0; i < 40; i++) {
    const seed = i * 137.508;
    const px = (Math.sin(seed) * 0.5 + 0.5) * CSS_SIZE;
    const py = (Math.cos(seed * 0.7) * 0.5 + 0.5) * CSS_SIZE;
    const dist = Math.hypot(px - HALF, py - HALF);
    if (dist < R + 10) continue;
    if (dist > R + 120) continue;
    const flicker = 0.15 + Math.sin(angle * 0.05 + seed) * 0.12;
    ctx.beginPath();
    ctx.arc(px, py, 0.8, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(100,200,255,${flicker})`;
    ctx.fill();
  }
}

/* ── Component ─────────────────────────────────────────────────── */
interface GlobeModalProps {
  open: boolean;
  onClose: () => void;
}

export function GlobeModal({ open, onClose }: GlobeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const angleRef = useRef(0);
  const pausedRef = useRef(false);
  const iconContainerRef = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selected) setSelected(null);
        else onClose();
      }
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, selected]);

  /* Main animation loop — pure canvas, no React re-renders */
  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = CSS_SIZE * dpr;
    canvas.height = CSS_SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let raf: number;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!pausedRef.current) {
        angleRef.current = (angleRef.current + dt * 14) % 360;
      }
      draw(ctx, angleRef.current);
      updateIconDOM(iconContainerRef.current, angleRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open]);

  const onGlobeEnter = useCallback(() => {
    pausedRef.current = true;
  }, []);
  const onGlobeLeave = useCallback(() => {
    pausedRef.current = false;
  }, []);

  const selectedTool = selected ? tools.find((t) => t.id === selected) : null;
  const relatedIds = selected
    ? connections
        .filter(([a, b]) => a === selected || b === selected)
        .map(([a, b]) => (a === selected ? b : a))
    : [];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-background/92 backdrop-blur-2xl"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.15, opacity: 0, y: 60 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.15, opacity: 0, y: 60 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-[205]"
            onMouseEnter={onGlobeEnter}
            onMouseLeave={onGlobeLeave}
          >
            <div className="relative" style={{ width: CSS_SIZE, height: CSS_SIZE }}>
              <canvas ref={canvasRef} style={{ width: CSS_SIZE, height: CSS_SIZE }} />
              {/* Icon overlay */}
              <div
                ref={iconContainerRef}
                className="absolute inset-0"
                style={{ pointerEvents: "none" }}
              >
                {tools.map((t) => (
                  <div
                    key={t.id}
                    data-tool-id={t.id}
                    className="absolute"
                    style={{ width: 40, height: 40, pointerEvents: "auto", opacity: 0 }}
                    onClick={() => setSelected(selected === t.id ? null : t.id)}
                  >
                    <div className="group/icon relative grid size-full place-items-center cursor-pointer">
                      <div
                        className="absolute inset-0 rounded-xl bg-background/90 shadow-lg shadow-black/30 backdrop-blur-sm transition-all duration-200"
                        style={{ border: `1px solid ${catColors[t.cat] ?? "#05C3DD"}40` }}
                      />
                      {t.icon ? (
                        <img
                          src={t.icon}
                          alt={t.label}
                          className="relative z-10 size-6 rounded-md object-contain p-0.5"
                          loading="lazy"
                        />
                      ) : (
                        <span
                          className="relative z-10 flex size-6 items-center justify-center rounded-md text-[11px] font-bold"
                          style={{ color: t.color, background: `${t.color}18` }}
                        >
                          {t.letter}
                        </span>
                      )}
                      <span className="pointer-events-none absolute -bottom-8 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1 font-mono text-[10px] font-medium text-background opacity-0 shadow-xl transition-opacity duration-200 group-hover/icon:opacity-100">
                        {t.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {selectedTool && (
              <motion.div
                key={selectedTool.id}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                transition={{ duration: 0.3 }}
                className="relative z-[205] mt-6 flex items-center gap-4 rounded-2xl border border-border/50 bg-card/60 px-6 py-4 backdrop-blur"
              >
                <div
                  className="grid size-10 shrink-0 place-items-center rounded-xl"
                  style={{
                    background: `${catColors[selectedTool.cat]}15`,
                    border: `1px solid ${catColors[selectedTool.cat]}40`,
                  }}
                >
                  <span
                    className="text-xs font-bold"
                    style={{ color: catColors[selectedTool.cat] }}
                  >
                    {selectedTool.cat.slice(0, 3)}
                  </span>
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-foreground">
                    {selectedTool.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    <span
                      className="mr-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        background: `${catColors[selectedTool.cat]}18`,
                        color: catColors[selectedTool.cat],
                      }}
                    >
                      {selectedTool.cat}
                    </span>
                    {relatedIds.length > 0 && (
                      <span className="text-muted-foreground/60">
                        connects to{" "}
                        {relatedIds
                          .map((id) => tools.find((t) => t.id === id)?.label)
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="ml-2 grid size-7 shrink-0 place-items-center rounded-lg text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!selectedTool && (
            <motion.div
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              transition={{ delay: 0.7, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-[205] mt-10 text-center"
            >
              <h3 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Skills & Arsenal
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Click any node to explore — hover the globe to pause — press <kbd className="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-[10px] text-foreground ring-1 ring-border">ESC</kbd> to exit.
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Update icon DOM positions (runs at 60fps, no React render) ── */
function updateIconDOM(container: HTMLDivElement | null, angle: number) {
  if (!container) return;
  const children = container.children;
  for (let i = 0; i < tools.length; i++) {
    const el = children[i] as HTMLElement | undefined;
    const t = tools[i];
    if (!el || !t) continue;
    const p = project(t.lat, t.lon, angle);
    const d01 = (p.z + 1) / 2;
    const scale = 0.45 + d01 * 0.55;
    const opacity = p.z > -0.25 ? 0.1 + d01 * 0.9 : 0;
    const sz = 40;
    el.style.left = `${HALF + p.x * R - sz / 2}px`;
    el.style.top = `${HALF + p.y * R - sz / 2}px`;
    el.style.transform = `scale(${scale})`;
    el.style.opacity = String(opacity);
    el.style.zIndex = String(Math.round(p.z * 100 + 100));
    el.style.pointerEvents = p.z < -0.15 ? "none" : "auto";
  }
}
