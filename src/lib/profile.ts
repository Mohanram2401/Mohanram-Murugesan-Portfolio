import type { Settings } from "./types";

export const profile = {
  name: "Mohanram Murugesan",
  title: "Cybersecurity Engineer",
  // Paste a photo URL here or upload one in the admin panel (Profile & Hero).
  // A gradient monogram is shown as fallback while the image is missing or fails to load.
  avatar: "",
  roles: ["Cybersecurity Engineer", "SOC Analyst", "SIEM Engineer", "VAPT Specialist"],
  tagline:
    "I defend production systems end to end — hunting threats in SIEM telemetry, engineering detections, and breaking applications before attackers do.",
  location: "India",
  email: "mohanrammurugesan1@gmail.com",
  github: "https://github.com/Mohanram2401",
  linkedin: "https://www.linkedin.com/in/mohanram-murugesan/",
  resumeUrl: "#",
  about: [
    "I'm a cybersecurity engineer focused on security operations: building high-signal detections, tuning SIEM pipelines, and running end-to-end incident response for cloud and on-prem estates.",
    "On the offensive side I perform vulnerability assessments and penetration tests across web, API, and network surfaces — then translate findings into engineering fixes teams can actually ship.",
  ],
  stats: [
    { label: "Alerts triaged", value: "12k+" },
    { label: "Detections shipped", value: "180+" },
    { label: "Pentests delivered", value: "40+" },
    { label: "Years in security", value: "4+" },
  ],
};

/**
 * Default site settings used when no Firestore `settings/profile` document
 * exists (or Firebase is unreachable). Everything is editable in the admin
 * panel and every content section starts visible.
 */
export const defaultSettings: Settings = {
  ...profile,
  showStats: true,
  showResume: true,
  visibleSections: {
    about: true,
    skills: true,
    experience: true,
    education: true,
    projects: true,
    certifications: true,
    contact: true,
  },
};
