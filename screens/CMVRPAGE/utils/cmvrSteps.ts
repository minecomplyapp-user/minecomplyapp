// cmvrSteps.ts
export type CMVRStep = {
  step: number;
  name: string;
  screenName: string;
  description: string;
};

export const CMVR_STEPS: CMVRStep[] = [
  {
    step: 1,
    name: "General Information",
    screenName: "CMVRReport",
    description: "Company and project details",
  },
  {
    step: 2,
    name: "Executive Summary",
    screenName: "CMVRPage2",
    description: "Summary and documentation",
  },
  {
    step: 3,
    name: "Compliance Monitoring",
    screenName: "ComplianceMonitoring",
    description: "Monitor compliance status",
  },
  {
    step: 4,
    name: "EIA Compliance",
    screenName: "EIACompliance",
    description: "Environmental impact assessment",
  },
  {
    step: 5,
    name: "Environmental Compliance",
    screenName: "EnvironmentalCompliance",
    description: "Environmental monitoring",
  },
  {
    step: 6,
    name: "Water Quality",
    screenName: "WaterQuality",
    description: "Water quality assessment",
  },
  {
    step: 7,
    name: "Noise Quality",
    screenName: "NoiseQuality",
    description: "Noise level monitoring",
  },
  {
    step: 8,
    name: "Waste Management",
    screenName: "WasteManagement",
    description: "Waste tracking and disposal",
  },
  {
    step: 9,
    name: "Chemical Safety",
    screenName: "ChemicalSafety",
    description: "Chemical handling and storage",
  },
  {
    step: 10,
    name: "Recommendations",
    screenName: "Recommendations",
    description: "Provide recommendations",
  },
  {
    step: 11,
    name: "Attendance Records",
    screenName: "AttendanceList",
    description: "Team attendance documentation",
  },
  {
    step: 12,
    name: "Attachments",
    screenName: "CMVRAttachments",
    description: "Add supporting documents",
  },
  {
    step: 13,
    name: "Export Report",
    screenName: "CMVRDocumentExport",
    description: "Generate final report",
  },
];

export const getTotalSteps = (): number => CMVR_STEPS.length;

export const getCurrentStepInfo = (
  screenName: string
): CMVRStep | undefined => {
  return CMVR_STEPS.find((step) => step.screenName === screenName);
};

export const getStepByNumber = (stepNumber: number): CMVRStep | undefined => {
  return CMVR_STEPS.find((step) => step.step === stepNumber);
};
