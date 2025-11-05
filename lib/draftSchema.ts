/**
 * Centralized Draft Schema
 *
 * This file defines all the keys used for saving and loading CMVR draft data
 * to prevent key drift and ensure consistency across all screens.
 *
 * Usage:
 * - Import DRAFT_KEYS in screens that save/load drafts
 * - Use DRAFT_KEYS.xxx instead of hardcoded strings
 * - TypeScript will catch typos and ensure consistency
 */

export const DRAFT_KEYS = {
  // Page 1 - General Info & Permits
  generalInfo: "generalInfo",
  eccInfo: "eccInfo",
  eccAdditionalForms: "eccAdditionalForms",
  isagInfo: "isagInfo",
  isagAdditionalForms: "isagAdditionalForms",
  epepInfo: "epepInfo",
  epepAdditionalForms: "epepAdditionalForms",
  rcfInfo: "rcfInfo",
  rcfAdditionalForms: "rcfAdditionalForms",
  mtfInfo: "mtfInfo",
  mtfAdditionalForms: "mtfAdditionalForms",
  fmrdfInfo: "fmrdfInfo",
  fmrdfAdditionalForms: "fmrdfAdditionalForms",
  mmtInfo: "mmtInfo",
  fileName: "fileName",

  // Page 2 - Executive Summary & Process Documentation
  executiveSummaryOfCompliance: "executiveSummaryOfCompliance",
  processDocumentationOfActivitiesUndertaken:
    "processDocumentationOfActivitiesUndertaken",
  eccMmtAdditional: "eccMmtAdditional",
  epepMmtAdditional: "epepMmtAdditional",
  ocularMmtAdditional: "ocularMmtAdditional",

  // Compliance Monitoring (Page 3)
  complianceToProjectLocationAndCoverageLimits:
    "complianceToProjectLocationAndCoverageLimits",

  // EIA Compliance (Page 4)
  complianceToImpactManagementCommitments:
    "complianceToImpactManagementCommitments",

  // Environmental Compliance (Page 5)
  airQualityImpactAssessment: "airQualityImpactAssessment",

  // Water Quality (Page 6)
  waterQualityImpactAssessment: "waterQualityImpactAssessment",

  // Noise Quality (Page 7)
  noiseQualityImpactAssessment: "noiseQualityImpactAssessment",

  // Waste Management (Page 8)
  complianceWithGoodPracticeInSolidAndHazardousWasteManagement:
    "complianceWithGoodPracticeInSolidAndHazardousWasteManagement",

  // Chemical Safety (Page 9)
  complianceWithGoodPracticeInChemicalSafetyManagement:
    "complianceWithGoodPracticeInChemicalSafetyManagement",
  complaintsVerificationAndManagement: "complaintsVerificationAndManagement",

  // Recommendations (Page 10)
  recommendationsData: "recommendationsData",

  // Attendance (Page 11)
  attendanceData: "attendanceData",

  // Metadata
  savedAt: "savedAt",
  createdAt: "createdAt",
} as const;

/**
 * Type for all valid draft keys
 */
export type DraftKey = (typeof DRAFT_KEYS)[keyof typeof DRAFT_KEYS];

/**
 * Interface for the complete CMVR draft structure
 * This ensures type safety when saving/loading drafts
 */
export interface CMVRDraftData {
  // Page 1
  generalInfo?: any;
  eccInfo?: any;
  eccAdditionalForms?: any;
  isagInfo?: any;
  isagAdditionalForms?: any;
  epepInfo?: any;
  epepAdditionalForms?: any;
  rcfInfo?: any;
  rcfAdditionalForms?: any;
  mtfInfo?: any;
  mtfAdditionalForms?: any;
  fmrdfInfo?: any;
  fmrdfAdditionalForms?: any;
  mmtInfo?: any;
  fileName?: string;

  // Page 2
  executiveSummaryOfCompliance?: any;
  processDocumentationOfActivitiesUndertaken?: any;
  eccMmtAdditional?: string[];
  epepMmtAdditional?: string[];
  ocularMmtAdditional?: string[];

  // Page 3+
  complianceToProjectLocationAndCoverageLimits?: any;
  complianceToImpactManagementCommitments?: any;
  airQualityImpactAssessment?: any;
  waterQualityImpactAssessment?: any;
  noiseQualityImpactAssessment?: any;
  complianceWithGoodPracticeInSolidAndHazardousWasteManagement?: any;
  complianceWithGoodPracticeInChemicalSafetyManagement?: any;
  complaintsVerificationAndManagement?: any;
  recommendationsData?: any;
  attendanceData?: any;

  // Metadata
  savedAt?: string;
  createdAt?: string;
}

/**
 * Helper to validate draft data structure
 */
export const isDraftValid = (data: any): data is CMVRDraftData => {
  return (
    data &&
    typeof data === "object" &&
    (data.fileName || data.generalInfo || data.savedAt)
  );
};
