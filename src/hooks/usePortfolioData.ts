import { useQuery } from "@tanstack/react-query";

import { fetchSection } from "@/lib/content-service";
import type { Section, SectionTypeMap } from "@/lib/types";

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