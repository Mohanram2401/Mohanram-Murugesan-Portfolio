export type Section = "projects" | "skills" | "experience" | "education" | "certifications";

/** A single hero stat card, e.g. { label: "Alerts triaged", value: "12k+" }. */
export interface Stat {
  label: string;
  value: string;
}

/** Page-level sections that can be hidden from the portfolio (plus content sections). */
export type VisibleSectionKey = Section | "about" | "contact";

/** Toggles that decide which sections render on the portfolio and in the nav. */
export type VisibleSections = Record<VisibleSectionKey, boolean>;

/**
 * Profile + hero + visibility configuration. The portfolio reads this via
 * `fetchSettings` (static content in `src/lib/profile.ts`).
 */
export type Settings = {
  name: string;
  title: string;
  avatar: string;
  roles: string[];
  tagline: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
  /** When true the "View Resume" button in the hero links to the active resume. */
  showResume: boolean;
  about: string[];
  stats: Stat[];
  /** Whether the hero stats row (alerts triaged / detections shipped / …) is shown. */
  showStats: boolean;
  visibleSections: VisibleSections;
};

/**
 * A resume stored in the `resumes` Firestore collection.
 * Files live in Cloudinary (free tier) under the `resumes` folder.
 */
export interface Resume {
  id: string;
  /** Display name, e.g. "Security Engineer Resume". */
  name: string;
  /** Cloudinary secure URL for the uploaded file. */
  fileUrl: string;
  /** Original file name stored for reference. */
  fileName: string;
  /** MIME type, e.g. "application/pdf". */
  fileType: string;
  /** Whether this resume is currently active (shown to visitors). */
  active: boolean;
  /** Sort order. */
  order?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image?: string;
  tags: string[];
  tech: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  order?: number;
}

export interface Skill {
  id: string;
  name: string;
  category: "Frontend" | "Backend" | "Database" | "Tools" | "Security";
  level: number;
  order?: number;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  logo?: string;
  bullets: string[];
  order?: number;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate?: string;
  logo?: string;
  details?: string;
  order?: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issuedDate: string;
  credentialUrl?: string;
  badge?: string;
  order?: number;
}

export interface SectionTypeMap {
  projects: Project;
  skills: Skill;
  experience: Experience;
  education: Education;
  certifications: Certification;
}
