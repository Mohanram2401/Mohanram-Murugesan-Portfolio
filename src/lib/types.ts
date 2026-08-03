export type Section = "projects" | "skills" | "experience" | "education" | "certifications";

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