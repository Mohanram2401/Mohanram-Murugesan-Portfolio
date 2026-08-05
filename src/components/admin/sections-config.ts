import type { FieldDef } from "./EntityForm";
import type { Section } from "@/lib/types";

export interface SectionConfig {
  key: Section;
  label: string;
  titleKey: string;
  subtitleKey: string;
  fields: FieldDef[];
}

export const sectionConfigs: SectionConfig[] = [
  {
    key: "projects",
    label: "Projects",
    titleKey: "title",
    subtitleKey: "description",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "description", label: "Short description", type: "textarea", required: true },
      { key: "longDescription", label: "Case study", type: "textarea" },
      {
        key: "image",
        label: "Thumbnail URL",
        type: "url",
        placeholder: "https://…",
        help: "Paste any image URL — it renders on the project card.",
      },
      { key: "tags", label: "Filter tags", type: "list", placeholder: "React, AI, Security…" },
      { key: "tech", label: "Tech badges", type: "list", placeholder: "TypeScript, Docker…" },
      { key: "demoUrl", label: "Live demo URL", type: "url" },
      { key: "githubUrl", label: "GitHub URL", type: "url" },
      { key: "featured", label: "Featured", type: "checkbox" },
      { key: "order", label: "Sort order", type: "number" },
    ],
  },
  {
    key: "skills",
    label: "Skills",
    titleKey: "name",
    subtitleKey: "category",
    fields: [
      { key: "name", label: "Skill", type: "text", required: true },
      {
        key: "category",
        label: "Category",
        type: "text",
        required: true,
        help: "Frontend, Backend, Database, Security or Tools",
      },
      { key: "level", label: "Proficiency (0-100)", type: "number", required: true },
      { key: "order", label: "Sort order", type: "number" },
    ],
  },
  {
    key: "experience",
    label: "Experience",
    titleKey: "role",
    subtitleKey: "company",
    fields: [
      { key: "role", label: "Role", type: "text", required: true },
      { key: "company", label: "Company", type: "text", required: true },
      { key: "location", label: "Location", type: "text" },
      { key: "startDate", label: "Start", type: "text", required: true, placeholder: "2024" },
      { key: "endDate", label: "End", type: "text", placeholder: "Present" },
      { key: "logo", label: "Company logo URL", type: "url" },
      { key: "bullets", label: "Highlights", type: "list", placeholder: "Add a highlight" },
      { key: "order", label: "Sort order", type: "number" },
    ],
  },
  {
    key: "education",
    label: "Education",
    titleKey: "degree",
    subtitleKey: "institution",
    fields: [
      { key: "degree", label: "Degree", type: "text", required: true },
      { key: "institution", label: "Institution", type: "text", required: true },
      { key: "startDate", label: "Start", type: "text", required: true },
      { key: "endDate", label: "End", type: "text" },
      { key: "logo", label: "Logo URL", type: "url" },
      { key: "details", label: "Details", type: "textarea" },
      { key: "order", label: "Sort order", type: "number" },
    ],
  },
  {
    key: "certifications",
    label: "Certifications",
    titleKey: "name",
    subtitleKey: "issuer",
    fields: [
      { key: "name", label: "Certification", type: "text", required: true },
      { key: "issuer", label: "Issuer", type: "text", required: true },
      {
        key: "issuedDate",
        label: "Issued date",
        type: "text",
        required: true,
        placeholder: "2025",
      },
      { key: "credentialUrl", label: "Credential URL", type: "url" },
      { key: "badge", label: "Badge URL", type: "url" },
      { key: "order", label: "Sort order", type: "number" },
    ],
  },
];
