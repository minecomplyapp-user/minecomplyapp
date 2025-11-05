export interface RecommendationItem {
  recommendation: string;
  commitment: string;
  status?: string;
}

export interface SectionData {
  isNA?: boolean;
  items: RecommendationItem[];
}

export type SectionKey =
  | "complianceToECC"
  | "impactManagement"
  | "waterQuality"
  | "noiseQuality"
  | "wasteManagement"
  | "chemicalSafety";

export interface RecommendationsPayload {
  currentRecommendations: Record<SectionKey, SectionData>;
  previousRecommendations: Record<SectionKey, SectionData>;
  prevQuarter: string;
  prevYear: string;
}
