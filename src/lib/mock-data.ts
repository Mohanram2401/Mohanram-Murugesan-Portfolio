import type { Certification, Education, Experience, Project, Skill } from "./types";

export const mockProjects: Project[] = [
  {
    id: "m-1",
    title: "SentinelOps — SOC Automation Platform",
    description:
      "Alert triage automation that enriches SIEM detections with threat intel and auto-closes false positives.",
    longDescription:
      "SentinelOps ingests Splunk and Elastic detections through a normalization layer, enriches each alert with VirusTotal, MISP and internal asset context, then scores it with a rules + ML hybrid. Analysts get a single queue with one-click containment actions, and 60% of noise closes itself.",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    tags: ["Security", "AI", "Node"],
    tech: ["Python", "Elastic", "FastAPI", "React", "Docker"],
    demoUrl: "https://example.com",
    githubUrl: "https://github.com/Mohanram2401",
    featured: true,
    order: 1,
  },
  {
    id: "m-2",
    title: "ThreatGraph — Attack Path Visualizer",
    description:
      "Interactive graph that maps identity and network relationships to surface lateral movement paths.",
    longDescription:
      "ThreatGraph pulls Active Directory, cloud IAM and firewall data into a graph database, then renders exploitable attack paths with blast-radius scoring so teams can prioritise the ten fixes that actually matter.",
    image:
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1200&q=80",
    tags: ["React", "Security"],
    tech: ["React", "TypeScript", "Neo4j", "D3.js"],
    demoUrl: "https://example.com",
    githubUrl: "https://github.com/Mohanram2401",
    featured: true,
    order: 2,
  },
  {
    id: "m-3",
    title: "PhishLens — Email Threat Analyzer",
    description:
      "LLM-assisted phishing triage that scores headers, URLs and attachments in seconds.",
    longDescription:
      "Users forward suspicious mail to a dedicated inbox; PhishLens detonates attachments in a sandbox, expands shortened URLs, checks SPF/DKIM/DMARC alignment and returns a verdict with a plain-English explanation.",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    tags: ["AI", "Node", "Firebase"],
    tech: ["Node.js", "Firebase", "OpenAI", "Tailwind"],
    demoUrl: "https://example.com",
    githubUrl: "https://github.com/Mohanram2401",
    order: 3,
  },
  {
    id: "m-4",
    title: "VulnForge — VAPT Reporting Suite",
    description:
      "Pentest workflow tool: findings library, CVSS scoring, and one-click client-ready reports.",
    longDescription:
      "VulnForge replaces the spreadsheet-and-Word workflow with a reusable finding library, evidence attachments, automatic CVSS 3.1 calculation and branded PDF export generated straight from the engagement data.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    tags: ["React", "Node", "Security"],
    tech: ["React", "Express", "PostgreSQL", "Puppeteer"],
    githubUrl: "https://github.com/Mohanram2401",
    order: 4,
  },
  {
    id: "m-5",
    title: "CloudGuard — Posture Scanner",
    description: "Continuous CSPM checks for AWS and Azure mapped to CIS benchmarks.",
    longDescription:
      "CloudGuard runs scheduled read-only scans against cloud accounts, maps misconfigurations to CIS and ISO 27001 controls, and pushes drift alerts into Slack with remediation snippets.",
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
    tags: ["Cloud", "Security", "Node"],
    tech: ["Go", "AWS", "Terraform", "React"],
    demoUrl: "https://example.com",
    order: 5,
  },
  {
    id: "m-6",
    title: "LogPipe — Detection-as-Code Framework",
    description: "Git-based Sigma rule pipeline with CI validation and automated SIEM deployment.",
    longDescription:
      "Detection engineers write Sigma rules in Git; LogPipe lints them, runs them against replayed telemetry to measure false-positive rate, and promotes passing rules into Splunk and Sentinel automatically.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    tags: ["Security", "Tools"],
    tech: ["Python", "Sigma", "GitHub Actions", "Splunk"],
    githubUrl: "https://github.com/Mohanram2401",
    order: 6,
  },
];

export const mockSkills: Skill[] = [
  { id: "s-1", name: "React", category: "Frontend", level: 88, order: 1 },
  { id: "s-2", name: "TypeScript", category: "Frontend", level: 85, order: 2 },
  { id: "s-3", name: "Tailwind CSS", category: "Frontend", level: 90, order: 3 },
  { id: "s-4", name: "Next.js", category: "Frontend", level: 76, order: 4 },
  { id: "s-5", name: "Node.js", category: "Backend", level: 84, order: 5 },
  { id: "s-6", name: "Python", category: "Backend", level: 92, order: 6 },
  { id: "s-7", name: "FastAPI", category: "Backend", level: 78, order: 7 },
  { id: "s-8", name: "Go", category: "Backend", level: 66, order: 8 },
  { id: "s-9", name: "PostgreSQL", category: "Database", level: 82, order: 9 },
  { id: "s-10", name: "Firestore", category: "Database", level: 80, order: 10 },
  { id: "s-11", name: "Elasticsearch", category: "Database", level: 87, order: 11 },
  { id: "s-12", name: "Redis", category: "Database", level: 70, order: 12 },
  { id: "s-13", name: "Splunk / SPL", category: "Security", level: 94, order: 13 },
  { id: "s-14", name: "Microsoft Sentinel", category: "Security", level: 86, order: 14 },
  { id: "s-15", name: "Burp Suite", category: "Security", level: 90, order: 15 },
  { id: "s-16", name: "Metasploit / Nmap", category: "Security", level: 88, order: 16 },
  { id: "s-17", name: "Docker", category: "Tools", level: 85, order: 17 },
  { id: "s-18", name: "Git & CI/CD", category: "Tools", level: 88, order: 18 },
  { id: "s-19", name: "Terraform", category: "Tools", level: 72, order: 19 },
  { id: "s-20", name: "Wireshark", category: "Tools", level: 89, order: 20 },
];

export const mockExperience: Experience[] = [
  {
    id: "e-1",
    role: "Cybersecurity Engineer",
    company: "NorthGate Security Labs",
    location: "Bengaluru, India",
    startDate: "2024",
    endDate: "Present",
    bullets: [
      "Own detection engineering across Splunk and Sentinel, shipping 180+ tuned rules mapped to MITRE ATT&CK.",
      "Cut mean time to triage by 47% by automating enrichment and containment playbooks.",
      "Lead purple-team exercises with the offensive team to validate coverage gaps quarterly.",
    ],
    order: 1,
  },
  {
    id: "e-2",
    role: "SOC Analyst — Tier 2",
    company: "Vertex Managed Services",
    location: "Chennai, India",
    startDate: "2022",
    endDate: "2024",
    bullets: [
      "Handled escalated incidents for 30+ enterprise clients across finance and healthcare.",
      "Built the on-call runbook library now used as the team's onboarding standard.",
      "Introduced weekly threat-hunting sprints that uncovered three long-dwelling intrusions.",
    ],
    order: 2,
  },
  {
    id: "e-3",
    role: "Security Analyst (VAPT)",
    company: "Cipherline Consulting",
    location: "Remote",
    startDate: "2021",
    endDate: "2022",
    bullets: [
      "Delivered 40+ web, API and network penetration tests with executive and technical reporting.",
      "Automated recurring recon with custom tooling, halving assessment setup time.",
    ],
    order: 3,
  },
];

export const mockEducation: Education[] = [
  {
    id: "ed-1",
    degree: "B.E. Computer Science and Engineering",
    institution: "Anna University",
    startDate: "2017",
    endDate: "2021",
    details: "Specialised in network security and distributed systems. Led the campus CTF team.",
    order: 1,
  },
  {
    id: "ed-2",
    degree: "Advanced Diploma — Offensive Security",
    institution: "Independent / Self-directed",
    startDate: "2021",
    endDate: "2022",
    details: "Hands-on labs across Active Directory attacks, web exploitation and malware analysis.",
    order: 2,
  },
];

export const mockCertifications: Certification[] = [
  {
    id: "c-1",
    name: "CompTIA Security+",
    issuer: "CompTIA",
    issuedDate: "2022-06",
    credentialUrl: "https://www.comptia.org",
    order: 1,
  },
  {
    id: "c-2",
    name: "Certified Ethical Hacker (CEH)",
    issuer: "EC-Council",
    issuedDate: "2023-02",
    credentialUrl: "https://www.eccouncil.org",
    order: 2,
  },
  {
    id: "c-3",
    name: "Splunk Core Certified Power User",
    issuer: "Splunk",
    issuedDate: "2023-09",
    credentialUrl: "https://www.splunk.com",
    order: 3,
  },
  {
    id: "c-4",
    name: "Microsoft SC-200: Security Operations Analyst",
    issuer: "Microsoft",
    issuedDate: "2024-04",
    credentialUrl: "https://learn.microsoft.com",
    order: 4,
  },
  {
    id: "c-5",
    name: "eJPT — Junior Penetration Tester",
    issuer: "INE Security",
    issuedDate: "2022-11",
    credentialUrl: "https://security.ine.com",
    order: 5,
  },
];

export const mockData = {
  projects: mockProjects,
  skills: mockSkills,
  experience: mockExperience,
  education: mockEducation,
  certifications: mockCertifications,
};