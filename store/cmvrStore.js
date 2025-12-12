import { create } from "zustand";
import BASE_URL from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { transformToBackendDTO } from "./cmvrTransformers";
import { buildCmvrTestData } from "./cmvrTestData";
import { getJwt } from "../lib/api";
import { saveDraft as saveDraftToStorage } from "../lib/drafts";

// Storage key for CMVR drafts
const CMVR_DRAFT_STORAGE_KEY = "@cmvr_draft";

const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const ensureArray = (value, fallback = []) =>
  Array.isArray(value) ? value : fallback;

const createMeasureEntry = () => ({
  id: `measure-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  planned: "",
  actualObservation: "",
  isEffective: null,
  recommendations: "",
});

const createOperationSection = (title) => ({
  title,
  isNA: false,
  measures: [createMeasureEntry()],
});

const createAirQualityLocation = () => ({
  locationInput: "",
  samplingDate: "",
  weatherAndWind: "",
  explanationForConfirmatorySampling: "",
  overallAssessment: "",
  parameters: [],
  parameter: "", // ✅ NEW: Main parameter field
  unit: "", // ✅ NEW: Unit field
});

const createAirQualitySection = () => ({
  // Legacy structure (for old unified form)
  selectedLocations: {
    quarry: false,
    plant: false,
    quarryPlant: false,
    port: false,
  },
  quarryData: createAirQualityLocation(),
  plantData: createAirQualityLocation(),
  quarryPlantData: createAirQualityLocation(),
  portData: createAirQualityLocation(),
  // New structure (for Environmental Compliance screen)
  quarry: "",
  plant: "",
  port: "",
  quarryPlant: "",
  quarryEnabled: false,
  plantEnabled: false,
  portEnabled: false,
  quarryPlantEnabled: false,
  table: null,
  uploadedEccFile: null,
  uploadedImage: null,
});

const createWaterQualityLocation = () => ({
  locationInput: "",
  parameter: "",
  resultType: "Month",
  tssCurrent: "",
  tssPrevious: "",
  mmtCurrent: "",
  mmtPrevious: "",
  isMMTNA: false,
  eqplRedFlag: "",
  action: "",
  limit: "",
  remarks: "",
  dateTime: "",
  weatherWind: "",
  explanation: "",
  isExplanationNA: false,
  overallCompliance: "",
  parameters: [],
});

const createWaterQualityPort = () => ({
  id: "",
  portName: "",
  parameter: "",
  resultType: "Month",
  tssCurrent: "",
  tssPrevious: "",
  mmtCurrent: "",
  mmtPrevious: "",
  isMMTNA: false,
  eqplRedFlag: "",
  action: "",
  limit: "",
  remarks: "",
  dateTime: "",
  weatherWind: "",
  explanation: "",
  isExplanationNA: false,
  additionalParameters: [],
});

const createWaterQualitySection = () => ({
  quarry: "",
  plant: "",
  quarryPlant: "",
  quarryEnabled: false,
  plantEnabled: false,
  quarryPlantEnabled: false,
  waterQuality: createWaterQualityLocation(),
  port: createWaterQualityLocation(),
  data: {
    quarryInput: "",
    plantInput: "",
    quarryPlantInput: "",
    parameter: "",
    resultType: "Month",
    tssCurrent: "",
    tssPrevious: "",
    mmtCurrent: "",
    mmtPrevious: "",
    isMMTNA: false,
    eqplRedFlag: "",
    action: "",
    limit: "",
    remarks: "",
    dateTime: "",
    weatherWind: "",
    explanation: "",
    isExplanationNA: false,
    overallCompliance: "",
  },
  parameters: [],
  ports: [],
});

const createNoiseParameter = () => ({
  id: `param-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  parameter: "",
  isParameterNA: false,
  currentInSMR: "",
  previousInSMR: "",
  mmtCurrent: "",
  mmtPrevious: "",
  redFlag: "",
  isRedFlagChecked: false,
  action: "",
  isActionChecked: false,
  limit: "",
  isLimitChecked: false,
});

const createNoiseQualitySection = () => ({
  hasInternalNoise: false,
  uploadedFiles: [],
  parameters: [createNoiseParameter()],
  remarks: "",
  dateTime: "",
  weatherWind: "",
  explanation: "",
  explanationNA: false,
  quarters: {
    first: "",
    isFirstChecked: false,
    second: "",
    isSecondChecked: false,
    third: "",
    isThirdChecked: false,
    fourth: "",
    isFourthChecked: false,
  },
});

const createWasteToggleSection = () => ({
  noSignificantImpact: false,
  generateTable: false,
  N_A: false,
});

const createWasteCommitment = (suffix = "") => ({
  id: `waste-${Date.now()}-${suffix}`,
  typeOfWaste: "",
  handling: "",
  storage: "",
  disposal: "",
});

const createWastePlantSection = (suffix) => ({
  typeOfWaste: "",
  eccEpepCommitments: [createWasteCommitment(suffix)],
  isAdequate: null,
  previousRecord: "",
  currentQuarterWaste: "",
});

const createWasteManagementSection = () => ({
  quarryData: createWasteToggleSection(),
  plantSimpleData: createWasteToggleSection(),
  selectedQuarter: "Q2",
  quarryPlantData: createWastePlantSection("quarry"),
  plantData: createWastePlantSection("plant"),
  portData: createWasteToggleSection(),
  portPlantData: createWastePlantSection("port"),
});

const createChemicalSafetySection = () => ({
  chemicalSafety: {
    isNA: false,
    riskManagement: null,
    training: null,
    handling: null,
    emergencyPreparedness: null,
    remarks: "",
    chemicalCategory: null,
    othersSpecify: "",
  },
  healthSafetyChecked: false,
  socialDevChecked: false,
});

const createComplaintEntry = () => ({
  id: `complaint-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  isNA: false,
  dateFiled: "",
  filedLocation: null,
  othersSpecify: "",
  nature: "",
  resolutions: "",
});

const createRecommendationsSection = () => ({
  currentRecommendations: {
    plant: {
      isNA: false,
      items: [{ recommendation: "", commitment: "", status: "" }],
    },
    quarry: {
      isNA: false,
      items: [{ recommendation: "", commitment: "", status: "" }],
    },
    port: {
      isNA: false,
      items: [{ recommendation: "", commitment: "", status: "" }],
    },
  },
  previousRecommendations: {
    plant: {
      isNA: false,
      items: [{ recommendation: "", commitment: "", status: "" }],
    },
    quarry: {
      isNA: false,
      items: [{ recommendation: "", commitment: "", status: "" }],
    },
    port: {
      isNA: false,
      items: [{ recommendation: "", commitment: "", status: "" }],
    },
  },
  prevQuarter: "1st",
  prevYear: "",
});

const createLocationCoverageSection = () => ({
  formData: {
    projectLocation: {
      label: "Project Location",
      specification: "",
      remarks: "",
      withinSpecs: null,
    },
    projectArea: {
      label: "Project Area (ha)",
      specification: "",
      remarks: "",
      withinSpecs: null,
    },
    capitalCost: {
      label: "Capital Cost (Php)",
      specification: "",
      remarks: "",
      withinSpecs: null,
    },
    typeOfMinerals: {
      label: "Type of Minerals",
      specification: "",
      remarks: "",
      withinSpecs: null,
    },
    miningMethod: {
      label: "Mining Method",
      specification: "",
      remarks: "",
      withinSpecs: null,
    },
    production: {
      label: "Production",
      specification: "",
      remarks: "",
      withinSpecs: null,
    },
    mineLife: {
      label: "Mine Life",
      specification: "",
      remarks: "",
      withinSpecs: null,
    },
    mineralReserves: {
      label: "Mineral Reserves/ Resources",
      specification: "",
      remarks: "",
      withinSpecs: null,
    },
    accessTransportation: {
      label: "Access/ Transportation",
      specification: "",
      remarks: "",
      withinSpecs: null,
    },
    powerSupply: {
      label: "Power Supply",
      specification: "",
      remarks: "",
      withinSpecs: null,
      subFields: [
        { label: "Plant:", specification: "" },
        { label: "Port:", specification: "" },
      ],
    },
    miningEquipment: {
      label: "Mining Equipment",
      specification: "",
      remarks: "",
      withinSpecs: null,
      subFields: [
        { label: "Quarry/Plant:", specification: "" },
        { label: "Port:", specification: "" },
      ],
    },
    workForce: {
      label: "Work Force",
      specification: "",
      remarks: "",
      withinSpecs: null,
      subFields: [{ label: "Employees:", specification: "" }],
    },
    developmentSchedule: {
      label: "Development/ Utilization Schedule",
      specification: "",
      remarks: "",
      withinSpecs: null,
    },
  },
  otherComponents: [],
  uploadedImages: {},
  imagePreviews: {},
});

const createImpactCommitmentsSection = () => ({
  preConstruction: null,
  construction: null,
  quarryOperation: createOperationSection("Quarry Operation"),
  plantOperation: createOperationSection("Plant Operation"),
  portOperation: createOperationSection("Port Operation"),
  overallCompliance: "",
});

const createExecutiveSummarySection = () => ({
  epepCompliance: {
    safety: false,
    social: false,
    rehabilitation: false,
  },
  epepRemarks: "",
  sdmpCompliance: "",
  sdmpRemarks: "",
  complaintsManagement: {
    complaintReceiving: false,
    caseInvestigation: false,
    implementationControl: false,
    communicationComplainant: false,
    complaintDocumentation: false,
    naForAll: false,
  },
  complaintsRemarks: "",
  accountability: "",
  accountabilityRemarks: "",
  othersSpecify: "",
  othersNA: false,
});

const createProcessDocumentationSection = () => ({
  dateConducted: "",
  sameDateForAll: false,
  eccMmtMembers: "",
  epepMmtMembers: "",
  ocularMmtMembers: "",
  ocularNA: false,
  methodologyRemarks: "",
  siteValidationApplicable: "",
  samplingDateConducted: "",
  samplingMmtMembers: "",
  samplingMethodologyRemarks: "",
});

const createEmptyReportState = () => ({
  generalInfo: {},
  permitHolderList: [],
  // ✅ NEW: Permit holder type selection (single vs multiple)
  permitHolderType: "single", // "single" | "multiple"
  eccInfo: {},
  eccAdditionalForms: [],
  isagInfo: {},
  isagAdditionalForms: [],
  epepInfo: {},
  epepAdditionalForms: [],
  rcfInfo: {},
  rcfAdditionalForms: [],
  mtfInfo: {},
  mtfAdditionalForms: [],
  fmrdfInfo: {},
  fmrdfAdditionalForms: [],
  mmtInfo: {},
  executiveSummaryOfCompliance: createExecutiveSummarySection(),
  // ✅ NEW: Compliance Monitoring Report Discussion
  complianceMonitoringReportDiscussion: {
    summary: "",
    keyFindings: [""],
    recommendations: [""],
    nextSteps: "",
  },
  // ✅ NEW: Air Quality Assessment Detailed
  airQualityAssessmentDetailed: {
    overallStatus: "",
    trendAnalysis: "",
    comparisonToPrevious: "",
    exceedances: [""],
    mitigationMeasures: [""],
    futureProjections: "",
  },
  processDocumentationOfActivitiesUndertaken:
    createProcessDocumentationSection(),
  // ✅ FIX: Member arrays for Process Documentation section
  eccMmtAdditional: [],
  epepMmtAdditional: [],
  ocularMmtAdditional: [],
  complianceToProjectLocationAndCoverageLimits: createLocationCoverageSection(),
  complianceToImpactManagementCommitments: createImpactCommitmentsSection(),
  // ✅ FIX: Separate ECC Conditions from Air Quality
  eccConditionsAttachment: {
    uploadedEccFile: null,
    uploadedImage: null,
  },
  airQualityImpactAssessment: createAirQualitySection(),
  waterQualityImpactAssessment: createWaterQualitySection(),
  noiseQualityImpactAssessment: createNoiseQualitySection(),
  complianceWithGoodPracticeInSolidAndHazardousWasteManagement:
    createWasteManagementSection(),
  complianceWithGoodPracticeInChemicalSafetyManagement:
    createChemicalSafetySection(),
  complaintsVerificationAndManagement: [createComplaintEntry()],
  recommendationsData: createRecommendationsSection(),
  attendanceUrl: null,
  attendanceId: null,
  // ✅ FIX: Include attachments array in empty report state
  attachments: [],
});

const mergeObjects = (base, incoming) =>
  isObject(incoming) ? { ...base, ...incoming } : base;

const normalizeOperationSection = (incoming, title) => {
  const base = createOperationSection(title);
  if (!isObject(incoming)) return base;
  return {
    ...base,
    ...incoming,
    measures: ensureArray(incoming.measures, base.measures),
  };
};

const normalizeImpactCommitmentsSection = (incoming) => {
  const base = createImpactCommitmentsSection();
  if (!isObject(incoming)) return base;
  return {
    ...base,
    preConstruction: incoming.preConstruction ?? base.preConstruction,
    construction: incoming.construction ?? base.construction,
    quarryOperation: normalizeOperationSection(
      incoming.quarryOperation,
      "Quarry Operation"
    ),
    plantOperation: normalizeOperationSection(
      incoming.plantOperation,
      "Plant Operation"
    ),
    portOperation: normalizeOperationSection(
      incoming.portOperation,
      "Port Operation"
    ),
    overallCompliance: incoming.overallCompliance ?? base.overallCompliance,
  };
};

const normalizeAirQualitySection = (incoming) => {
  const base = createAirQualitySection();
  if (!isObject(incoming)) return base;
  const normalizeLocation = (location) => {
    const template = createAirQualityLocation();
    if (!isObject(location)) return template;
    return {
      ...template,
      ...location,
      parameters: ensureArray(location.parameters, template.parameters),
    };
  };

  const rawSelected = incoming.selectedLocations || {};

  return {
    selectedLocations: {
      ...base.selectedLocations,
      ...rawSelected,
      quarryPlant:
        typeof rawSelected.quarryPlant === "boolean"
          ? rawSelected.quarryPlant
          : (rawSelected.quarryAndPlant ?? base.selectedLocations.quarryPlant),
    },
    quarryData: normalizeLocation(incoming.quarryData),
    plantData: normalizeLocation(incoming.plantData),
    quarryPlantData: normalizeLocation(
      incoming.quarryPlantData || incoming.quarryAndPlantData
    ),
    portData: normalizeLocation(incoming.portData),
    // New structure fields (Environmental Compliance screen)
    quarry: incoming.quarry ?? base.quarry,
    plant: incoming.plant ?? base.plant,
    port: incoming.port ?? base.port,
    quarryPlant: incoming.quarryPlant ?? base.quarryPlant,
    quarryEnabled: incoming.quarryEnabled ?? base.quarryEnabled,
    plantEnabled: incoming.plantEnabled ?? base.plantEnabled,
    portEnabled: incoming.portEnabled ?? base.portEnabled,
    quarryPlantEnabled: incoming.quarryPlantEnabled ?? base.quarryPlantEnabled,
    table: incoming.table ?? base.table,
    uploadedEccFile: incoming.uploadedEccFile ?? base.uploadedEccFile,
    uploadedImage: incoming.uploadedImage ?? base.uploadedImage,
  };
};

const normalizeWaterQualitySection = (incoming) => {
  const base = createWaterQualitySection();
  if (!isObject(incoming)) return base;

  const normalizeLocation = (location) => {
    const template = createWaterQualityLocation();
    if (!isObject(location)) return template;
    return {
      ...template,
      ...location,
      parameters: ensureArray(location.parameters, template.parameters),
    };
  };

  const normalizePort = (port) => {
    const template = createWaterQualityPort();
    if (!isObject(port)) return template;
    return {
      ...template,
      ...port,
      additionalParameters: ensureArray(
        port.additionalParameters,
        template.additionalParameters
      ),
    };
  };

  return {
    ...base,
    ...incoming,
    waterQuality: normalizeLocation(incoming.waterQuality),
    port: normalizeLocation(incoming.port),
    data: mergeObjects(base.data, incoming.data),
    parameters: ensureArray(incoming.parameters, base.parameters),
    ports: ensureArray(incoming.ports, base.ports).map(normalizePort),
  };
};

const normalizeNoiseQualitySection = (incoming) => {
  const base = createNoiseQualitySection();
  if (!isObject(incoming)) return base;
  return {
    ...base,
    ...incoming,
    uploadedFiles: ensureArray(incoming.uploadedFiles, base.uploadedFiles),
    parameters: ensureArray(incoming.parameters, base.parameters).length
      ? ensureArray(incoming.parameters, base.parameters)
      : base.parameters,
    quarters: mergeObjects(base.quarters, incoming.quarters),
  };
};

const normalizeWastePlantSection = (incoming, suffix) => {
  const template = createWastePlantSection(suffix);
  if (!isObject(incoming)) return template;
  return {
    ...template,
    ...incoming,
    eccEpepCommitments: ensureArray(
      incoming.eccEpepCommitments,
      template.eccEpepCommitments
    ),
  };
};

const normalizeWasteManagementSection = (incoming) => {
  const base = createWasteManagementSection();
  if (!isObject(incoming)) return base;
  return {
    quarryData: mergeObjects(base.quarryData, incoming.quarryData),
    plantSimpleData: mergeObjects(
      base.plantSimpleData,
      incoming.plantSimpleData
    ),
    selectedQuarter: incoming.selectedQuarter || base.selectedQuarter,
    quarryPlantData: normalizeWastePlantSection(
      incoming.quarryPlantData,
      "quarry"
    ),
    plantData: normalizeWastePlantSection(incoming.plantData, "plant"),
    portData: mergeObjects(base.portData, incoming.portData),
    portPlantData: normalizeWastePlantSection(incoming.portPlantData, "port"),
  };
};

const normalizeChemicalSafetySection = (incoming) => {
  const base = createChemicalSafetySection();
  if (!isObject(incoming)) return base;
  return {
    chemicalSafety: mergeObjects(base.chemicalSafety, incoming.chemicalSafety),
    healthSafetyChecked:
      incoming.healthSafetyChecked ?? base.healthSafetyChecked,
    socialDevChecked: incoming.socialDevChecked ?? base.socialDevChecked,
  };
};

const normalizeComplaints = (incoming) => {
  const fallback = [createComplaintEntry()];
  const complaints = ensureArray(incoming, fallback);
  return complaints.length ? complaints : fallback;
};

const normalizeRecommendationSection = (incomingSections, defaultSections) => {
  if (!isObject(incomingSections)) return defaultSections;
  const result = { ...defaultSections };
  Object.keys(defaultSections).forEach((key) => {
    const section = incomingSections[key];
    result[key] = isObject(section)
      ? {
          ...defaultSections[key],
          ...section,
          items: ensureArray(section.items, defaultSections[key].items),
        }
      : defaultSections[key];
  });
  return result;
};

const normalizeRecommendationsSection = (incoming) => {
  const base = createRecommendationsSection();
  if (!isObject(incoming)) return base;
  return {
    currentRecommendations: normalizeRecommendationSection(
      incoming.currentRecommendations,
      base.currentRecommendations
    ),
    previousRecommendations: normalizeRecommendationSection(
      incoming.previousRecommendations,
      base.previousRecommendations
    ),
    prevQuarter: incoming.prevQuarter || base.prevQuarter,
    prevYear: incoming.prevYear || base.prevYear,
  };
};

const normalizeExecutiveSummary = (incoming) => {
  const base = createExecutiveSummarySection();
  if (!isObject(incoming)) return base;
  return {
    ...base,
    ...incoming,
    epepCompliance: mergeObjects(base.epepCompliance, incoming.epepCompliance),
    complaintsManagement: mergeObjects(
      base.complaintsManagement,
      incoming.complaintsManagement
    ),
  };
};

const normalizeProcessDocumentation = (incoming) => {
  const base = createProcessDocumentationSection();
  return mergeObjects(base, incoming);
};

const normalizeLocationCoverage = (incoming) => {
  const base = createLocationCoverageSection();
  if (!isObject(incoming)) return base;
  
  // ✅ FIX: Deep merge formData to ensure all 14 parameters are always present
  const mergedFormData = { ...base.formData };
  if (incoming.formData && isObject(incoming.formData)) {
    // Overlay stored values on top of default structure
    Object.keys(base.formData).forEach((key) => {
      if (incoming.formData[key]) {
        mergedFormData[key] = {
          ...base.formData[key],
          ...incoming.formData[key],
          // Preserve subFields structure if it exists in default
          subFields: incoming.formData[key].subFields || base.formData[key].subFields,
        };
      }
    });
  }
  
  return {
    formData: mergedFormData,
    otherComponents: ensureArray(
      incoming.otherComponents,
      base.otherComponents
    ),
    uploadedImages: mergeObjects(base.uploadedImages, incoming.uploadedImages),
    imagePreviews: mergeObjects(base.imagePreviews, incoming.imagePreviews),
  };
};

const normalizeReportData = (reportData = {}) => {
  // Unwrap cmvrData if present (from backend response)
  const sourceData = reportData.cmvrData || reportData;
  const base = createEmptyReportState();
  return {
    generalInfo: mergeObjects(base.generalInfo, sourceData.generalInfo),
    permitHolderList: ensureArray(
      sourceData.permitHolderList,
      base.permitHolderList
    ),
    eccInfo: mergeObjects(base.eccInfo, sourceData.eccInfo),
    eccAdditionalForms: ensureArray(
      sourceData.eccAdditionalForms,
      base.eccAdditionalForms
    ),
    isagInfo: mergeObjects(base.isagInfo, sourceData.isagInfo),
    isagAdditionalForms: ensureArray(
      sourceData.isagAdditionalForms,
      base.isagAdditionalForms
    ),
    epepInfo: mergeObjects(base.epepInfo, sourceData.epepInfo),
    epepAdditionalForms: ensureArray(
      sourceData.epepAdditionalForms,
      base.epepAdditionalForms
    ),
    rcfInfo: mergeObjects(base.rcfInfo, sourceData.rcfInfo),
    rcfAdditionalForms: ensureArray(
      sourceData.rcfAdditionalForms,
      base.rcfAdditionalForms
    ),
    mtfInfo: mergeObjects(base.mtfInfo, sourceData.mtfInfo),
    mtfAdditionalForms: ensureArray(
      sourceData.mtfAdditionalForms,
      base.mtfAdditionalForms
    ),
    fmrdfInfo: mergeObjects(base.fmrdfInfo, sourceData.fmrdfInfo),
    fmrdfAdditionalForms: ensureArray(
      sourceData.fmrdfAdditionalForms,
      base.fmrdfAdditionalForms
    ),
    mmtInfo: mergeObjects(base.mmtInfo, sourceData.mmtInfo),
    executiveSummaryOfCompliance: normalizeExecutiveSummary(
      sourceData.executiveSummaryOfCompliance
    ),
    // ✅ FIX: Normalize Compliance Monitoring Report Discussion
    complianceMonitoringReportDiscussion: mergeObjects(
      base.complianceMonitoringReportDiscussion,
      sourceData.complianceMonitoringReportDiscussion || {}
    ),
    processDocumentationOfActivitiesUndertaken: normalizeProcessDocumentation(
      sourceData.processDocumentationOfActivitiesUndertaken
    ),
    // ✅ FIX: Ensure member arrays are properly loaded from draft/API
    eccMmtAdditional: ensureArray(
      sourceData.eccMmtAdditional,
      base.eccMmtAdditional || []
    ),
    epepMmtAdditional: ensureArray(
      sourceData.epepMmtAdditional,
      base.epepMmtAdditional || []
    ),
    ocularMmtAdditional: ensureArray(
      sourceData.ocularMmtAdditional,
      base.ocularMmtAdditional || []
    ),
    complianceToProjectLocationAndCoverageLimits: normalizeLocationCoverage(
      sourceData.complianceToProjectLocationAndCoverageLimits
    ),
    complianceToImpactManagementCommitments: normalizeImpactCommitmentsSection(
      sourceData.complianceToImpactManagementCommitments
    ),
    // ✅ FIX: Normalize ECC Conditions separately from Air Quality
    eccConditionsAttachment: mergeObjects(
      base.eccConditionsAttachment,
      sourceData.eccConditionsAttachment || {}
    ),
    airQualityImpactAssessment: normalizeAirQualitySection(
      sourceData.airQualityImpactAssessment
    ),
    waterQualityImpactAssessment: normalizeWaterQualitySection(
      sourceData.waterQualityImpactAssessment
    ),
    noiseQualityImpactAssessment: normalizeNoiseQualitySection(
      sourceData.noiseQualityImpactAssessment
    ),
    complianceWithGoodPracticeInSolidAndHazardousWasteManagement:
      normalizeWasteManagementSection(
        sourceData.complianceWithGoodPracticeInSolidAndHazardousWasteManagement
      ),
    complianceWithGoodPracticeInChemicalSafetyManagement:
      normalizeChemicalSafetySection(
        sourceData.complianceWithGoodPracticeInChemicalSafetyManagement
      ),
    complaintsVerificationAndManagement: normalizeComplaints(
      sourceData.complaintsVerificationAndManagement
    ),
    recommendationsData: normalizeRecommendationsSection(
      sourceData.recommendationsData
    ),
    attendanceId:
      sourceData.attendanceId !== undefined
        ? sourceData.attendanceId
        : sourceData.attendanceUrl !== undefined
          ? sourceData.attendanceUrl
          : base.attendanceId,
    attendanceUrl:
      sourceData.attendanceUrl !== undefined
        ? sourceData.attendanceUrl
        : sourceData.attendanceId !== undefined
          ? sourceData.attendanceId
          : base.attendanceUrl,
    // ✅ FIX: Include attachments in normalized report data
    attachments: ensureArray(
      sourceData.attachments,
      base.attachments || []
    ),
  };
};

const resolveAuthToken = async (token) => {
  if (typeof token === "string" && token.trim().length > 0) {
    return token;
  }
  try {
    return await getJwt();
  } catch (error) {
    console.error("Failed to resolve auth token:", error);
    throw new Error(
      "Unable to fetch authentication token. Please sign in again."
    );
  }
};

/**
 * CMVR Store - Centralized state management for CMVR reports
 *
 * Responsibilities:
 * 1. Hold current report state in memory
 * 2. Save/load drafts from AsyncStorage
 * 3. Submit reports to backend API
 * 4. Fetch submitted reports from backend
 */
export const useCmvrStore = create((set, get) => ({
  // ==================== STATE ====================

  // Current report being edited (in-memory state)
  currentReport: null,

  // Metadata about the current report
  fileName: "Untitled",
  submissionId: null,
  projectId: null,
  projectName: "",
  createdById: null,

  // List of all submitted reports (fetched from backend)
  submittedReports: [],

  // Loading states
  isLoading: false,
  isSaving: false,

  // Error handling
  error: null,

  // Track if current report has unsaved changes
  isDirty: false,

  // Track which sections have been edited in the current session
  editedSections: [],

  // Draft tracking
  isDraftLoaded: false,
  lastSavedAt: null,

  // ==================== ACTIONS ====================

  /**
   * Quickly populate the store with rich sample data for testing/export previews
   */
  fillAllTestData: () => {
    const { metadata, report } = buildCmvrTestData();

    set((state) => ({
      ...state,
      currentReport: report,
      fileName: metadata.fileName || state.fileName || "CMVR Test Report",
      projectName: metadata.projectName || state.projectName || "",
      projectId: null,
      submissionId: null,
      isDirty: true,
      editedSections: Object.keys(report ?? {}),
      error: null,
    }));
  },

  /**
   * Initialize a new report
   */
  initializeNewReport: (fileName = "Untitled") => {
    try {
      const emptyReport = createEmptyReportState();
      console.log("[CMVR Store] Initializing new report:", fileName);
      set({
        currentReport: emptyReport,
        fileName,
        submissionId: null,
        projectId: null,
        projectName: "",
        isDirty: false,
        isDraftLoaded: false,
        lastSavedAt: null,
        error: null,
        editedSections: [],
      });
      console.log("[CMVR Store] New report initialized successfully");
    } catch (error) {
      console.error("[CMVR Store ERROR] Failed to initialize new report:", error);
      // Set minimal valid state to prevent crashes
      set({
        currentReport: {
          generalInfo: {},
          permitHolderList: [],
          executiveSummaryOfCompliance: {},
        },
        fileName: fileName || "Untitled",
        submissionId: null,
        projectId: null,
        projectName: "",
        isDirty: false,
        isDraftLoaded: false,
        lastSavedAt: null,
        error: error.message || "Failed to initialize report",
        editedSections: [],
      });
    }
  },

  /**
   * Update a specific section of the current report
   */
  updateSection: (sectionName, sectionData) => {
    set((state) => {
      const updatedSections = new Set(state.editedSections || []);
      if (sectionName) {
        updatedSections.add(sectionName);
      }
      return {
        currentReport: {
          ...state.currentReport,
          [sectionName]: sectionData,
        },
        isDirty: true,
        editedSections: Array.from(updatedSections),
      };
    });
  },

  /**
   * Update multiple sections at once
   */
  updateMultipleSections: (sectionsData) => {
    const normalizedSectionsData = { ...(sectionsData || {}) };
    if (
      Object.prototype.hasOwnProperty.call(
        normalizedSectionsData,
        "attendanceUrl"
      ) &&
      !Object.prototype.hasOwnProperty.call(
        normalizedSectionsData,
        "attendanceId"
      )
    ) {
      normalizedSectionsData.attendanceId =
        normalizedSectionsData.attendanceUrl;
    } else if (
      Object.prototype.hasOwnProperty.call(
        normalizedSectionsData,
        "attendanceId"
      ) &&
      !Object.prototype.hasOwnProperty.call(
        normalizedSectionsData,
        "attendanceUrl"
      )
    ) {
      normalizedSectionsData.attendanceUrl =
        normalizedSectionsData.attendanceId;
    }

    set((state) => {
      const updatedSections = new Set(state.editedSections || []);
      Object.keys(normalizedSectionsData || {}).forEach((sectionName) => {
        if (sectionName) {
          updatedSections.add(sectionName);
        }
      });
      return {
        currentReport: {
          ...state.currentReport,
          ...normalizedSectionsData,
        },
        isDirty: true,
        editedSections: Array.from(updatedSections),
      };
    });
  },

  /**
   * Update report metadata (fileName, projectName, etc.)
   */
  updateMetadata: (metadata) => {
    set((state) => ({
      ...state,
      ...metadata,
      isDirty: true,
    }));
  },

  /**
   * Set the user ID who created/owns this report
   */
  setCreatedById: (userId) => {
    set({ createdById: userId });
  },

  /**
   * Get the complete current report data
   */
  getCurrentReport: () => {
    const state = get();
    return {
      ...state.currentReport,
      fileName: state.fileName,
      savedAt: new Date().toISOString(),
    };
  },

  /**
   * Load report from data object (when opening a draft or submission)
   */
  loadReport: (reportData) => {
    try {
      console.log("[CMVR Store] Loading report data...");
      const normalized = normalizeReportData(reportData);
      set({
        currentReport: normalized,
        fileName: reportData.fileName || "Untitled",
        submissionId: reportData.id || reportData.submissionId || null,
        projectId: reportData.projectId || null,
        projectName:
          reportData.projectName || reportData.generalInfo?.projectName || "",
        isDirty: false,
        error: null,
        editedSections: [],
      });
      console.log("[CMVR Store] Report loaded successfully");
    } catch (error) {
      console.error("[CMVR Store ERROR] Failed to load report:", error);
      // Set error state but don't crash
      set({
        error: error.message || "Failed to load report data",
        currentReport: createEmptyReportState(),
        fileName: "Untitled",
        submissionId: null,
        projectId: null,
        projectName: "",
        isDirty: false,
        editedSections: [],
      });
    }
  },

  /**
   * Clear the current report (reset to initial state)
   */
  clearReport: () => {
    set({
      currentReport: null,
      fileName: "Untitled",
      submissionId: null,
      projectId: null,
      projectName: "",
      isDirty: false,
      isDraftLoaded: false,
      lastSavedAt: null,
      error: null,
      editedSections: [],
    });
  },

  // ==================== DRAFT MANAGEMENT ====================

  /**
   * Save current report as draft to AsyncStorage
   * FIXED: Enhanced to ensure all form data including nested arrays/objects persist correctly
   */
  saveDraft: async () => {
    const state = get();

    if (!state.currentReport) {
      console.warn("No current report to save");
      return { success: false, error: "No report data" };
    }

    set({ isSaving: true });

    try {
      const savedAt = new Date().toISOString();
      
      // ✅ FIX: Deep clone currentReport to avoid any reference issues
      const clonedReport = JSON.parse(JSON.stringify(state.currentReport));
      
      // ✅ FIX: Explicitly preserve critical nested data structures
      const draftData = {
        ...clonedReport,
        fileName: state.fileName,
        projectName: state.projectName,
        savedAt,
        // ✅ FIX: Ensure metadata is preserved
        submissionId: state.submissionId,
        projectId: state.projectId,
        createdById: state.createdById,
        // ✅ FIX: Preserve edit tracking
        editedSections: state.editedSections,
        // ✅ FIX: Explicitly ensure attachments and attendanceId are included
        attachments: clonedReport.attachments || state.currentReport?.attachments || [],
        attendanceId: clonedReport.attendanceId !== undefined 
          ? clonedReport.attendanceId 
          : (state.currentReport?.attendanceId !== undefined 
            ? state.currentReport.attendanceId 
            : null),
      };

      // ✅ FIX: Validate critical data before saving
      console.log("=== CMVR Draft Save Debug ===");
      console.log("Report sections count:", Object.keys(clonedReport).length);
      if (clonedReport.processDocumentationOfActivitiesUndertaken) {
        console.log("✓ Process documentation present");
      }
      if (clonedReport.executiveSummaryOfCompliance) {
        console.log("✓ Executive summary present");
      }
      // ✅ FIX: Verify member arrays are included
      console.log("ECC MMT Additional members:", clonedReport.eccMmtAdditional?.length || 0);
      console.log("EPEP MMT Additional members:", clonedReport.epepMmtAdditional?.length || 0);
      console.log("Ocular MMT Additional members:", clonedReport.ocularMmtAdditional?.length || 0);
      // ✅ FIX: Verify Date of CMR Submission and Permit Holder List
      console.log("Date of CMR Submission:", clonedReport.generalInfo?.dateOfCMRSubmission || "NOT SET");
      console.log("Permit Holder List count:", clonedReport.permitHolderList?.length || 0);
      if (clonedReport.permitHolderList && clonedReport.permitHolderList.length > 0) {
        console.log("Permit Holders:", clonedReport.permitHolderList);
      }
      // ✅ FIX: Verify attendanceId
      console.log("Attendance ID:", clonedReport.attendanceId || "NOT SET");
      // ✅ FIX: Verify attachments (if stored in report)
      console.log("Attachments count:", clonedReport.attachments?.length || 0);
      console.log("================");

      // Save to multi-file draft system (so it appears in the list)
      await saveDraftToStorage(state.fileName, draftData);

      // Also save to single slot for Dashboard "Resume" card
      await AsyncStorage.setItem(
        CMVR_DRAFT_STORAGE_KEY,
        JSON.stringify(draftData)
      );

      set({ isSaving: false, isDirty: false, lastSavedAt: savedAt });
      console.log("✅ Draft saved successfully with all sections");

      return { success: true, savedAt };
    } catch (error) {
      set({ isSaving: false, error: error.message });
      console.error("❌ Error saving draft:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Load draft from AsyncStorage
   * FIXED: Enhanced to properly restore all nested data structures
   */
  loadDraft: async () => {
    set({ isLoading: true });

    try {
      const draftString = await AsyncStorage.getItem(CMVR_DRAFT_STORAGE_KEY);

      if (!draftString) {
        set({ isLoading: false });
        return { success: false, error: "No draft found" };
      }

      let draftData;
      try {
        draftData = JSON.parse(draftString);
      } catch (parseError) {
        console.error("❌ Failed to parse draft JSON:", parseError);
        set({ isLoading: false, error: "Draft data is corrupted" });
        return { success: false, error: "Draft data is corrupted. Please create a new draft." };
      }
      
      // ✅ FIX: Validate draft data before loading
      console.log("=== CMVR Draft Load Debug ===");
      console.log("Draft sections count:", Object.keys(draftData).length);
      console.log("Draft saved at:", draftData.savedAt);
      // ✅ FIX: Verify Date of CMR Submission and Permit Holder List in draft
      console.log("Date of CMR Submission in draft:", draftData.generalInfo?.dateOfCMRSubmission || "NOT SET");
      console.log("Permit Holder List in draft:", draftData.permitHolderList?.length || 0, "items");
      if (draftData.permitHolderList && draftData.permitHolderList.length > 0) {
        console.log("Permit Holders:", draftData.permitHolderList);
      }
      // ✅ FIX: Verify attendanceId in draft
      console.log("Attendance ID in draft:", draftData.attendanceId || "NOT SET");
      // ✅ FIX: Verify attachments in draft
      console.log("Attachments in draft:", draftData.attachments?.length || 0, "items");
      
      // ✅ FIX: Use loadReport to properly restore all sections
      get().loadReport(draftData);

      // ✅ FIX: Restore metadata
      set({
        fileName: draftData.fileName || "Untitled",
        projectName: draftData.projectName || "",
        submissionId: draftData.submissionId || null,
        projectId: draftData.projectId || null,
        createdById: draftData.createdById || null,
        editedSections: draftData.editedSections || [],
        isLoading: false,
        isDraftLoaded: true,
        lastSavedAt: draftData.savedAt || null,
      });
      
      // ✅ FIX: Verify restoration after loadReport
      const restoredReport = get().currentReport;
      console.log("Date of CMR Submission after restore:", restoredReport?.generalInfo?.dateOfCMRSubmission || "NOT SET");
      console.log("Permit Holder List after restore:", restoredReport?.permitHolderList?.length || 0, "items");
      console.log("Attendance ID after restore:", restoredReport?.attendanceId || "NOT SET");
      console.log("✅ Draft loaded successfully with all metadata");
      console.log("================");

      return { success: true, data: draftData };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error("❌ Error loading draft:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete draft from AsyncStorage
   */
  deleteDraft: async () => {
    try {
      await AsyncStorage.removeItem(CMVR_DRAFT_STORAGE_KEY);
      set({ isDraftLoaded: false, lastSavedAt: null });
      console.log("Draft deleted successfully");
      return { success: true };
    } catch (error) {
      console.error("Error deleting draft:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Check if draft exists in AsyncStorage
   */
  hasDraft: async () => {
    try {
      const draftString = await AsyncStorage.getItem(CMVR_DRAFT_STORAGE_KEY);
      return draftString !== null;
    } catch (error) {
      console.error("Error checking for draft:", error);
      return false;
    }
  },

  // ==================== BACKEND API OPERATIONS ====================

  /**
   * Submit current report to backend API
   */
  /**
   * Transform store data to backend DTO format
   */
  transformToDTO: () => {
    const state = get();
    const generalInfo = state.currentReport?.generalInfo || {};
    return transformToBackendDTO(
      state.currentReport,
      generalInfo,
      state.createdById
    );
  },

  submitReport: async (token, attachments, fileNameOverride) => {
    const state = get();

    if (!state.currentReport) {
      const errorMsg = "No report to submit. Please create a report first.";
      console.warn("[CMVR Store] Submit failed: No current report");
      return { success: false, error: errorMsg };
    }

    set({ isLoading: true, error: null });

    try {
      const authToken = await resolveAuthToken(token);

      // Transform store data to backend DTO format
      const reportPayload = get().transformToDTO();

      if (!reportPayload) {
        throw new Error("Failed to prepare report data. Please check all required fields.");
      }

      // Add attachments to payload if provided
      if (attachments && Array.isArray(attachments) && attachments.length > 0) {
        const formattedAttachments = attachments
          .filter((a) => !!a.path)
          .map((a) => ({ path: a.path, caption: a.caption || undefined }));
        reportPayload.attachments = formattedAttachments;
        console.log("[CMVR Store] Added attachments to payload:", formattedAttachments);
        console.log("[CMVR Store] Attachment count:", formattedAttachments.length);
      } else {
        console.log("[CMVR Store] No attachments provided or attachments array is empty");
        console.log("[CMVR Store] Attachments value:", attachments);
      }
      
      console.log("[CMVR Store] Final payload attachments:", reportPayload.attachments);

      // Construct endpoint with fileName as query param
      // Use fileNameOverride if provided, otherwise use state.fileName, fallback to "Untitled"
      const fileName = fileNameOverride || state.fileName || "Untitled";
      // Update store's fileName if override was provided
      if (fileNameOverride && fileNameOverride !== state.fileName) {
        set({ fileName: fileNameOverride });
      }
      const endpoint = `${BASE_URL}/cmvr?fileName=${encodeURIComponent(fileName)}`;

      console.log("[CMVR Store] Submitting report:", fileName);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(reportPayload),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: `Server error (${response.status})` };
        }
        const userMessage = errorData.message || "Failed to submit CMVR report. Please try again.";
        throw new Error(userMessage);
      }

      const submittedReport = await response.json();

      set({
        submissionId: submittedReport.id,
        isLoading: false,
        isDirty: false,
        isDraftLoaded: false,
      });

      // Delete draft after successful submission
      try {
        await get().deleteDraft();
      } catch (draftError) {
        console.warn("[CMVR Store] Failed to delete draft after submission:", draftError);
        // Don't fail submission if draft deletion fails
      }

      console.log("[CMVR Store] Report submitted successfully:", submittedReport.id);
      return { success: true, report: submittedReport };
    } catch (error) {
      const userMessage = error.message || "An unexpected error occurred. Please try again.";
      set({ isLoading: false, error: userMessage });
      console.error("[CMVR Store] Error submitting report:", error);
      return { success: false, error: userMessage };
    }
  },

  /**
   * Update an existing submitted report
   */
  updateSubmittedReport: async (reportId, token) => {
    const state = get();

    if (!state.currentReport) {
      return { success: false, error: "No report to update" };
    }

    set({ isLoading: true, error: null });

    try {
      const authToken = await resolveAuthToken(token);

      // Transform store data to backend DTO format
      const reportPayload = get().transformToDTO();

      if (!reportPayload) {
        throw new Error("Failed to transform report data");
      }

      // Construct endpoint with fileName as query param
      const fileName = state.fileName || "Untitled";
      const endpoint = `${BASE_URL}/cmvr/${reportId}?fileName=${encodeURIComponent(fileName)}`;

      console.log(
        "Submitting payload:",
        JSON.stringify(reportPayload, null, 2)
      );

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(reportPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update CMVR report");
      }

      const updatedReport = await response.json();

      set({
        isLoading: false,
        isDirty: false,
        isDraftLoaded: false,
      });

      // Delete draft after successful update if this was loaded from draft
      if (state.isDraftLoaded) {
        await get().deleteDraft();
      }

      console.log("Report updated successfully:", updatedReport.id);
      return { success: true, report: updatedReport };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error("Error updating report:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Fetch all submitted reports for a user
   */
  fetchUserReports: async (userId, token) => {
    set({ isLoading: true, error: null });

    try {
      const endpoint = `${BASE_URL}/cmvr/user/${userId}`;
      const authToken = await resolveAuthToken(token);

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch CMVR reports");
      }

      const reports = await response.json();

      set({
        submittedReports: reports,
        isLoading: false,
      });

      console.log(`Fetched ${reports.length} CMVR reports`);
      return { success: true, reports };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error("Error fetching reports:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Fetch a specific report by ID
   */
  fetchReportById: async (reportId, token) => {
    set({ isLoading: true, error: null });

    try {
      const endpoint = `${BASE_URL}/cmvr/${reportId}`;
      const authToken = await resolveAuthToken(token);

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch report ${reportId}`);
      }

      const report = await response.json();

      // Load the fetched report into current state
      get().loadReport(report);

      set({ isLoading: false });

      console.log("Report fetched and loaded:", reportId);
      return { success: true, report };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error("Error fetching report:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete a submitted report
   */
  deleteSubmittedReport: async (reportId, token) => {
    set({ isLoading: true, error: null });

    try {
      const endpoint = `${BASE_URL}/cmvr/${reportId}`;
      const authToken = await resolveAuthToken(token);

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete report");
      }

      // Remove from local state
      set((state) => ({
        submittedReports: state.submittedReports.filter(
          (r) => r.id !== reportId
        ),
        isLoading: false,
      }));

      console.log("Report deleted:", reportId);
      return { success: true };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error("Error deleting report:", error);
      return { success: false, error: error.message };
    }
  },

  // ==================== UTILITY FUNCTIONS ====================

  /**
   * Mark report as clean (no unsaved changes)
   */
  markAsClean: () => {
    set({ isDirty: false });
  },

  /**
   * Mark report as dirty (has unsaved changes)
   */
  markAsDirty: () => {
    set({ isDirty: true });
  },

  /**
   * Set error message
   */
  setError: (errorMessage) => {
    set({ error: errorMessage });
  },

  /**
   * Clear error message
   */
  clearError: () => {
    set({ error: null });
  },
}));
