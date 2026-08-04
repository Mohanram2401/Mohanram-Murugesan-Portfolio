import { useQuery } from "@tanstack/react-query";

import { fetchResumes, fetchSection, fetchSettings } from "@/lib/content-service";
import type { Resume, Section, SectionTypeMap, Settings } from "@/lib/types";

export function sectionQueryOptions<S extends Section>(section: S) {
  return {
    queryKey: ["content", section] as const,
    queryFn: () => fetchSection(section),
    staleTime: 60_000,
  };
}

export function useSection<S extends Section>(section: S) {
  return useQuery<SectionTypeMap[S][]>(sectionQueryOptions(section));
}

/**
 * Reads the site-wide settings (profile, hero content and section visibility).
 * Falls back to the static default settings when Firestore is unavailable.
 */
export function useSettings() {
  return useQuery<Settings>({
    queryKey: ["settings"] as const,
    queryFn: () => fetchSettings(),
    staleTime: 60_000,
  });
}

/**
 * Reads all resume entries from the `resumes` Firestore collection.
 * Returns an empty array when Firebase is not configured.
 */
export function useResumes() {
  return useQuery<Resume[]>({
    queryKey: ["resumes"] as const,
    queryFn: () => fetchResumes(),
    staleTime: 60_000,
  });
}
