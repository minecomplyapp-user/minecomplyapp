import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../contexts/AuthContext";
import { useFileName } from "../../contexts/FileNameContext";
import {
  createCMVRReport,
  generateCMVRDocx,
  deleteCMVRReport,
  updateCMVRReport,
} from "../../lib/cmvr";
import type {
  GeneralInfo,
  ECCInfo,
  ECCAdditionalForm,
  ISAGInfo,
  ISAGAdditionalForm,
  EPEPInfo,
  RCFInfo,
  MMTInfo,
  CreateCMVRDto,
} from "./types/CMVRReportScreen.types";

type RecommendationItemShape = {
  recommendation?: string;
  commitment?: string;
  status?: string;
};

type RecommendationSectionShape = {
  isNA?: boolean;
  items?: RecommendationItemShape[];
};

type RecommendationsData = {
  currentRecommendations?: Record<string, RecommendationSectionShape>;
  previousRecommendations?: Record<string, RecommendationSectionShape>;
  prevQuarter?: string;
  prevYear?: string;
};

type EpepAdditionalForm = Omit<EPEPInfo, "isNA">;
type FundAdditionalForm = Omit<RCFInfo, "isNA">;

type CMVRDocumentExportParams = {
  cmvrReportId?: string; // if provided, enables Generate/Delete immediately
  generalInfo?: GeneralInfo;
  eccInfo?: ECCInfo;
  eccAdditionalForms?: ECCAdditionalForm[];
  isagInfo?: ISAGInfo;
  isagAdditionalForms?: ISAGAdditionalForm[];
  epepInfo?: EPEPInfo;
  epepAdditionalForms?: EpepAdditionalForm[];
  rcfInfo?: RCFInfo;
  rcfAdditionalForms?: FundAdditionalForm[];
  mtfInfo?: RCFInfo;
  mtfAdditionalForms?: FundAdditionalForm[];
  fmrdfInfo?: RCFInfo;
  fmrdfAdditionalForms?: FundAdditionalForm[];
  mmtInfo?: MMTInfo;
  fileName?: string;
  recommendationsData?: RecommendationsData;
  selectedAttendanceId?: string;
  selectedAttendanceTitle?: string;
  // Page 2 data (Executive Summary & Process Documentation)
  executiveSummaryOfCompliance?: any;
  processDocumentationOfActivitiesUndertaken?: any;
  // Compliance Monitoring Report sections
  complianceToProjectLocationAndCoverageLimits?: any;
  complianceToImpactManagementCommitments?: any;
  airQualityImpactAssessment?: any;
  waterQualityImpactAssessment?: any;
  noiseQualityImpactAssessment?: any;
  complianceWithGoodPracticeInSolidAndHazardousWasteManagement?: any;
  complianceWithGoodPracticeInChemicalSafetyManagement?: any;
  complaintsVerificationAndManagement?: any;
  recommendationFromPrevQuarter?: any;
  recommendationForNextQuarter?: any;
  attendanceUrl?: string;
  documentation?: any;
};

type RootStackParamList = {
  CMVRDocumentExport: CMVRDocumentExportParams;
};

type DraftSnapshot = {
  generalInfo: GeneralInfo;
  eccInfo: ECCInfo;
  eccAdditionalForms: ECCAdditionalForm[];
  isagInfo: ISAGInfo;
  isagAdditionalForms: ISAGAdditionalForm[];
  epepInfo: EPEPInfo;
  epepAdditionalForms: EpepAdditionalForm[];
  rcfInfo: RCFInfo;
  rcfAdditionalForms: FundAdditionalForm[];
  mtfInfo: RCFInfo;
  mtfAdditionalForms: FundAdditionalForm[];
  fmrdfInfo: RCFInfo;
  fmrdfAdditionalForms: FundAdditionalForm[];
  mmtInfo: MMTInfo;
  fileName: string;
  savedAt?: string;
  recommendationsData?: RecommendationsData;
  // Page 2 data (Executive Summary & Process Documentation)
  executiveSummaryOfCompliance?: any;
  processDocumentationOfActivitiesUndertaken?: any;
  // Compliance Monitoring Report sections
  complianceToProjectLocationAndCoverageLimits?: any;
  complianceToImpactManagementCommitments?: any;
  airQualityImpactAssessment?: any;
  waterQualityImpactAssessment?: any;
  noiseQualityImpactAssessment?: any;
  complianceWithGoodPracticeInSolidAndHazardousWasteManagement?: any;
  complianceWithGoodPracticeInChemicalSafetyManagement?: any;
  complaintsVerificationAndManagement?: any;
  recommendationFromPrevQuarter?: any;
  recommendationForNextQuarter?: any;
  attendanceUrl?: string;
  documentation?: any;
};

const defaultGeneralInfo: GeneralInfo = {
  companyName: "",
  projectName: "",
  location: "",
  region: "",
  province: "",
  municipality: "",
  quarter: "",
  year: "",
  dateOfCompliance: "",
  monitoringPeriod: "",
  dateOfCMRSubmission: "",
};

const defaultEccInfo: ECCInfo = {
  isNA: false,
  permitHolder: "",
  eccNumber: "",
  dateOfIssuance: "",
};

const defaultIsagInfo: ISAGInfo = {
  isNA: false,
  permitHolder: "",
  isagNumber: "",
  dateOfIssuance: "",
  currentName: "",
  nameInECC: "",
  projectStatus: "",
  gpsX: "",
  gpsY: "",
  proponentName: "",
  proponentContact: "",
  proponentAddress: "",
  proponentPhone: "",
  proponentEmail: "",
};

const defaultEpepInfo: EPEPInfo = {
  isNA: false,
  permitHolder: "",
  epepNumber: "",
  dateOfApproval: "",
};

const defaultFundInfo: RCFInfo = {
  isNA: false,
  permitHolder: "",
  savingsAccount: "",
  amountDeposited: "",
  dateUpdated: "",
};

const defaultMmtInfo: MMTInfo = {
  isNA: false,
  contactPerson: "",
  mailingAddress: "",
  phoneNumber: "",
  emailAddress: "",
};

const sanitizeString = (value?: string | null) => (value ?? "").toString();

const buildLocationString = (info: GeneralInfo) =>
  [info.location, info.municipality, info.province, info.region]
    .map(sanitizeString)
    .filter((part) => part.length > 0)
    .join(", ");

const buildCoordinatesString = (info: ISAGInfo) => {
  const x = sanitizeString(info.gpsX);
  const y = sanitizeString(info.gpsY);
  if (!x && !y) {
    return "";
  }
  if (x && y) {
    return `X: ${x}, Y: ${y}`;
  }
  if (x) {
    return `X: ${x}`;
  }
  return `Y: ${y}`;
};

const buildEccEntries = (info: ECCInfo, additional: ECCAdditionalForm[]) => {
  const entries: Array<{
    permitHolderName: string;
    eccNumber: string;
    dateOfIssuance: string;
  }> = [];

  if (!info.isNA) {
    const hasMainData = [info.permitHolder, info.eccNumber, info.dateOfIssuance]
      .map(sanitizeString)
      .some((value) => value.length > 0);

    if (hasMainData) {
      entries.push({
        permitHolderName: sanitizeString(info.permitHolder),
        eccNumber: sanitizeString(info.eccNumber),
        dateOfIssuance: sanitizeString(info.dateOfIssuance),
      });
    }
  }

  additional.forEach((form) => {
    entries.push({
      permitHolderName: sanitizeString(form.permitHolder),
      eccNumber: sanitizeString(form.eccNumber),
      dateOfIssuance: sanitizeString(form.dateOfIssuance),
    });
  });

  return entries;
};

const buildIsagEntries = (info: ISAGInfo, additional: ISAGAdditionalForm[]) => {
  const entries: Array<{
    permitHolderName: string;
    isagPermitNumber: string;
    dateOfIssuance: string;
  }> = [];

  if (!info.isNA) {
    const hasMainData = [
      info.permitHolder,
      info.isagNumber,
      info.dateOfIssuance,
    ]
      .map(sanitizeString)
      .some((value) => value.length > 0);

    if (hasMainData) {
      entries.push({
        permitHolderName: sanitizeString(info.permitHolder),
        isagPermitNumber: sanitizeString(info.isagNumber),
        dateOfIssuance: sanitizeString(info.dateOfIssuance),
      });
    }
  }

  additional.forEach((form) => {
    entries.push({
      permitHolderName: sanitizeString(form.permitHolder),
      isagPermitNumber: sanitizeString(form.isagNumber),
      dateOfIssuance: sanitizeString(form.dateOfIssuance),
    });
  });

  return entries;
};

const buildEpepEntries = (info: EPEPInfo, additional: EpepAdditionalForm[]) => {
  const entries: Array<{
    permitHolderName: string;
    epepNumber: string;
    dateOfApproval: string;
  }> = [];

  if (!info.isNA) {
    const hasMainData = [
      info.permitHolder,
      info.epepNumber,
      info.dateOfApproval,
    ]
      .map(sanitizeString)
      .some((value) => value.length > 0);

    if (hasMainData) {
      entries.push({
        permitHolderName: sanitizeString(info.permitHolder),
        epepNumber: sanitizeString(info.epepNumber),
        dateOfApproval: sanitizeString(info.dateOfApproval),
      });
    }
  }

  additional.forEach((form) => {
    entries.push({
      permitHolderName: sanitizeString(form.permitHolder),
      epepNumber: sanitizeString(form.epepNumber),
      dateOfApproval: sanitizeString(form.dateOfApproval),
    });
  });

  return entries;
};

const buildFundEntries = (info: RCFInfo, additional: FundAdditionalForm[]) => {
  const entries: Array<{
    permitHolderName: string;
    savingsAccountNumber: string;
    amountDeposited: string;
    dateUpdated: string;
  }> = [];

  if (!info.isNA) {
    const hasMainData = [
      info.permitHolder,
      info.savingsAccount,
      info.amountDeposited,
      info.dateUpdated,
    ]
      .map(sanitizeString)
      .some((value) => value.length > 0);

    if (hasMainData) {
      entries.push({
        permitHolderName: sanitizeString(info.permitHolder),
        savingsAccountNumber: sanitizeString(info.savingsAccount),
        amountDeposited: sanitizeString(info.amountDeposited),
        dateUpdated: sanitizeString(info.dateUpdated),
      });
    }
  }

  additional.forEach((form) => {
    entries.push({
      permitHolderName: sanitizeString(form.permitHolder),
      savingsAccountNumber: sanitizeString(form.savingsAccount),
      amountDeposited: sanitizeString(form.amountDeposited),
      dateUpdated: sanitizeString(form.dateUpdated),
    });
  });

  return entries;
};

const mergeDraftData = (
  existing: DraftSnapshot | null,
  updates: Partial<DraftSnapshot>,
  fileName: string
): DraftSnapshot => {
  const base: DraftSnapshot = existing
    ? { ...existing }
    : {
        generalInfo: defaultGeneralInfo,
        eccInfo: defaultEccInfo,
        eccAdditionalForms: [],
        isagInfo: defaultIsagInfo,
        isagAdditionalForms: [],
        epepInfo: defaultEpepInfo,
        epepAdditionalForms: [],
        rcfInfo: defaultFundInfo,
        rcfAdditionalForms: [],
        mtfInfo: defaultFundInfo,
        mtfAdditionalForms: [],
        fmrdfInfo: defaultFundInfo,
        fmrdfAdditionalForms: [],
        mmtInfo: defaultMmtInfo,
        fileName,
        savedAt: new Date().toISOString(),
      };

  const assign = <K extends keyof DraftSnapshot>(key: K) => {
    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      const value = updates[key];
      if (value !== undefined) {
        base[key] = value as DraftSnapshot[K];
      }
    }
  };

  assign("generalInfo");
  assign("eccInfo");
  assign("eccAdditionalForms");
  assign("isagInfo");
  assign("isagAdditionalForms");
  assign("epepInfo");
  assign("epepAdditionalForms");
  assign("rcfInfo");
  assign("rcfAdditionalForms");
  assign("mtfInfo");
  assign("mtfAdditionalForms");
  assign("fmrdfInfo");
  assign("fmrdfAdditionalForms");
  assign("mmtInfo");
  assign("recommendationsData");

  // Include Page 2 data (Executive Summary & Process Documentation)
  assign("executiveSummaryOfCompliance");
  assign("processDocumentationOfActivitiesUndertaken");

  // Include Compliance Monitoring Report sections
  assign("complianceToProjectLocationAndCoverageLimits");
  assign("complianceToImpactManagementCommitments");
  assign("airQualityImpactAssessment");
  assign("waterQualityImpactAssessment");
  assign("noiseQualityImpactAssessment");
  assign("complianceWithGoodPracticeInSolidAndHazardousWasteManagement");
  assign("complianceWithGoodPracticeInChemicalSafetyManagement");
  assign("complaintsVerificationAndManagement");
  assign("recommendationFromPrevQuarter");
  assign("recommendationForNextQuarter");
  assign("attendanceUrl");
  assign("documentation");

  base.fileName = fileName;
  base.savedAt = new Date().toISOString();

  return base;
};

const toNumberOrYear = (value?: string) => {
  const parsed = value ? parseInt(value, 10) : NaN;
  return Number.isFinite(parsed) ? parsed : new Date().getFullYear();
};

const transformRecommendationsForPayload = (
  currentRecommendations?: Record<string, RecommendationSectionShape>,
  quarter?: string,
  year?: string
) => {
  if (!currentRecommendations) return undefined;

  const transformed: any = {};

  // Add quarter and year at the top level
  if (quarter) {
    // Convert quarter string (e.g., "1st", "2nd", "3rd", "4th") to number
    const quarterMatch = quarter.match(/(\d+)/);
    if (quarterMatch) {
      transformed.quarter = parseInt(quarterMatch[1], 10);
    }
  }

  if (year) {
    const yearNum = parseInt(year, 10);
    if (!isNaN(yearNum)) {
      transformed.year = yearNum;
    }
  }

  // Transform each section (plant, quarry, port) from {isNA, items} to just items array
  Object.keys(currentRecommendations).forEach((key) => {
    const section = currentRecommendations[key];
    if (section && !section.isNA && section.items && section.items.length > 0) {
      transformed[key] = section.items;
    }
  });

  // Only return the object if it has at least one section with data (besides quarter/year)
  const hasData = Object.keys(transformed).some(
    (key) => key !== "quarter" && key !== "year"
  );
  return hasData ? transformed : undefined;
};

// Map Page 2: Executive Summary to backend DTO shape
const transformExecutiveSummaryForPayload = (raw: any) => {
  if (!raw) return undefined;

  // sdmp string to booleans
  const sdmp = (raw.sdmpCompliance || "").toString().trim().toLowerCase();
  const sdmpComplied =
    sdmp === "complied" ||
    sdmp === "yes" ||
    sdmp === "y" ||
    raw.sdmpCompliance === true;
  const sdmpNotComplied =
    sdmp === "not complied" || sdmp === "no" || sdmp === "n";

  const accountability = (raw.accountability || "")
    .toString()
    .trim()
    .toLowerCase();
  const accComplied =
    accountability === "complied" ||
    accountability === "yes" ||
    raw.accountability === true;
  const accNotComplied =
    accountability === "not complied" || accountability === "no";

  const cm = raw.complaintsManagement || {};

  return {
    complianceWithEpepCommitments: {
      safety: !!raw?.epepCompliance?.safety,
      social: !!raw?.epepCompliance?.social,
      rehabilitation: !!raw?.epepCompliance?.rehabilitation,
      remarks: raw?.epepRemarks ?? "",
    },
    complianceWithSdmpCommitments: {
      complied: !!sdmpComplied,
      notComplied: !!sdmpNotComplied,
      remarks: raw?.sdmpRemarks ?? "",
    },
    complaintsManagement: {
      naForAll: !!cm?.naForAll,
      complaintReceivingSetup: !!cm?.complaintReceiving,
      caseInvestigation: !!cm?.caseInvestigation,
      implementationOfControl: !!cm?.implementationControl,
      communicationWithComplainantOrPublic: !!cm?.communicationComplainant,
      complaintDocumentation: !!cm?.complaintDocumentation,
      remarks: raw?.complaintsRemarks ?? "",
    },
    accountability: {
      complied: !!accComplied,
      notComplied: !!accNotComplied,
      remarks: raw?.accountabilityRemarks ?? "",
    },
    others: {
      specify: raw?.othersSpecify ?? "",
      na: !!raw?.othersNA,
    },
  };
};

// Map Page 2: Process Documentation to backend DTO shape
const transformProcessDocumentationForPayload = (raw: any) => {
  if (!raw) return undefined;

  const parseMembers = (text?: string, extras?: string[]) => {
    const base = (text || "")
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const extra = (extras || []).map((s) => (s || "").trim()).filter(Boolean);
    return [...base, ...extra];
  };

  const sva = (raw.siteValidationApplicable || "")
    .toString()
    .trim()
    .toLowerCase();
  const applicable =
    sva === "yes" || sva === "y" || raw.siteValidationApplicable === true;
  const none =
    sva === "no" || sva === "none" || raw.siteValidationApplicable === false;

  return {
    dateConducted: raw?.dateConducted ?? "",
    mergedMethodologyOrOtherRemarks: raw?.methodologyRemarks ?? "",
    sameDateForAllActivities: !!raw?.sameDateForAll,
    activities: {
      complianceWithEccConditionsCommitments: {
        mmtMembersInvolved: parseMembers(
          raw?.eccMmtMembers,
          raw?.eccMmtAdditional
        ),
      },
      complianceWithEpepAepepConditions: {
        mmtMembersInvolved: parseMembers(
          raw?.epepMmtMembers,
          raw?.epepMmtAdditional
        ),
      },
      siteOcularValidation: {
        mmtMembersInvolved: parseMembers(
          raw?.ocularMmtMembers,
          raw?.ocularMmtAdditional
        ),
      },
      siteValidationConfirmatorySampling: {
        mmtMembersInvolved: parseMembers(raw?.samplingMmtMembers),
        dateConducted: raw?.samplingDateConducted ?? "",
        applicable,
        none,
        remarks: raw?.samplingMethodologyRemarks ?? "",
      },
    },
  };
};

// Helper to coerce strings like "50 mg/L" or "6.0 - 9.0" to a number (first number found)
const parseFirstNumber = (val?: string): number => {
  if (!val) return 0;
  const m = String(val).match(/-?\d*\.?\d+/);
  return m ? parseFloat(m[0]) : 0;
};

// CMR 1: Compliance to Project Location and Coverage Limits
const transformProjectLocationCoverageForPayload = (raw: any) => {
  if (!raw) return undefined;
  const formData = raw.formData || {};
  const other = raw.otherComponents || [];

  const parameters = Object.values(formData).map((f: any) => {
    const specObj: any = {};
    if (f?.specification) specObj.main = String(f.specification);
    if (Array.isArray(f?.subFields)) {
      f.subFields.forEach((sf: any) => {
        if (sf?.label)
          specObj[sf.label.replace(/:$/, "")] = sf?.specification ?? "";
      });
    }
    return {
      name: String(f?.label ?? ""),
      specification: specObj,
      remarks: String(f?.remarks ?? ""),
      withinSpecs: Boolean(f?.withinSpecs),
    };
  });

  const otherComponents = other.map((item: any, idx: number) => ({
    name: String(
      item?.name ?? item?.specification ?? `Other Component ${idx + 1}`
    ),
    specification: String(item?.specification ?? ""),
    remarks: String(item?.remarks ?? ""),
    withinSpecs: Boolean(item?.withinSpecs),
  }));

  return { parameters, otherComponents };
};

// CMR 2: Compliance to Impact Management Commitments in EIA & EPEP
const transformImpactCommitmentsForPayload = (raw: any) => {
  if (!raw) return undefined;
  const toBool = (v: any) =>
    String(v).toLowerCase() === "yes"
      ? true
      : String(v).toLowerCase() === "no"
        ? false
        : !!v;
  const mapMeasures = (section: any) => {
    const measures = Array.isArray(section?.measures) ? section.measures : [];
    return {
      areaName: String(section?.title ?? ""),
      commitments: measures.map((m: any) => ({
        plannedMeasure: String(m?.planned ?? ""),
        actualObservation: String(m?.actualObservation ?? ""),
        isEffective: toBool(m?.isEffective),
        recommendations: String(m?.recommendations ?? ""),
      })),
    };
  };

  const constructionInfo = [
    {
      areaName: "Pre-Construction",
      commitments: [
        {
          plannedMeasure: "Pre-construction compliance",
          actualObservation: String(raw?.preConstruction ?? ""),
          isEffective: toBool(raw?.preConstruction),
          recommendations: "",
        },
      ],
    },
    {
      areaName: "Construction",
      commitments: [
        {
          plannedMeasure: "Construction compliance",
          actualObservation: String(raw?.construction ?? ""),
          isEffective: toBool(raw?.construction),
          recommendations: "",
        },
      ],
    },
  ];

  const implementationOfEnvironmentalImpactControlStrategies = [
    mapMeasures(raw?.quarryOperation),
    mapMeasures(raw?.plantOperation),
    mapMeasures(raw?.portOperation),
  ];

  return {
    constructionInfo,
    implementationOfEnvironmentalImpactControlStrategies,
    overallComplianceAssessment: String(raw?.overallCompliance ?? ""),
  };
};

// CMR 3: Air Quality Impact Assessment
const transformAirQualityForPayload = (raw: any) => {
  if (!raw) return undefined;
  const sel = raw.selectedLocations || {};
  const d = raw.data || {};
  const combineParams = () => {
    // To satisfy backend validation (which currently forbids non-decorated fields),
    // only send allowed keys: name and remarks.
    const main = [
      {
        name: String(d?.parameter ?? ""),
        remarks: String(d?.remarks ?? ""),
      },
    ];
    const extras = Array.isArray(d?.parameters)
      ? d.parameters.map((p: any) => ({
          name: String(p?.parameter ?? ""),
          remarks: String(p?.remarks ?? ""),
        }))
      : [];
    return [...main, ...extras].filter((x) => x.name);
  };

  return {
    quarry: sel.quarry ? String(d?.quarry ?? "") : String(d?.quarry ?? ""),
    quarryPlant: sel.quarryPlant ? String(d?.quarryPlant ?? "") : undefined,
    plant: sel.plant ? String(d?.plant ?? "") : String(d?.plant ?? ""),
    port: sel.port ? String(d?.port ?? "") : String(d?.port ?? ""),
    parameters: combineParams(),
    samplingDate: String(d?.dateTime ?? ""),
    weatherAndWind: String(d?.weatherWind ?? ""),
    explanationForConfirmatorySampling: String(d?.explanation ?? ""),
    overallAssessment: String(d?.overallCompliance ?? ""),
  };
};

// CMR 4: Water Quality Impact Assessment
const transformWaterQualityForPayload = (raw: any) => {
  if (!raw) return undefined;
  const sel = raw.selectedLocations || {};
  const d = raw.data || {};
  const params = Array.isArray(raw.parameters) ? raw.parameters : [];
  const ports = Array.isArray(raw.ports) ? raw.ports : [];

  const makeParam = (p: any) => ({
    name: String(p?.parameter ?? ""),
    result: {
      internalMonitoring: {
        month: String(p?.resultType ?? d?.resultType ?? ""),
        readings: [
          {
            label: String(p?.parameter ?? "Reading"),
            current_mgL: parseFirstNumber(p?.tssCurrent ?? d?.tssCurrent),
            previous_mgL: parseFirstNumber(p?.tssPrevious ?? d?.tssPrevious),
          },
        ],
      },
      mmtConfirmatorySampling: {
        current: String(p?.mmtCurrent ?? d?.mmtCurrent ?? ""),
        previous: String(p?.mmtPrevious ?? d?.mmtPrevious ?? ""),
      },
    },
    denrStandard: {
      redFlag: String(p?.eqplRedFlag ?? d?.eqplRedFlag ?? ""),
      action: String(p?.action ?? d?.action ?? ""),
      limit_mgL: parseFirstNumber(p?.limit ?? d?.limit),
    },
    remark: String(p?.remarks ?? d?.remarks ?? ""),
  });

  const mainParam = makeParam(d);
  const extraParams = params.map(makeParam);

  // Ports (map to parametersTable2)
  const portParams: any[] = [];
  ports.forEach((port: any) => {
    const base = makeParam(port);
    base.name = `${port?.portName || "Port"} - ${base.name}`.trim();
    portParams.push(base);
    if (Array.isArray(port.additionalParameters)) {
      port.additionalParameters.forEach((pp: any) => {
        const p2 = makeParam(pp);
        p2.name = `${port?.portName || "Port"} - ${p2.name}`.trim();
        portParams.push(p2);
      });
    }
  });

  return {
    quarry: sel.quarry
      ? String(d?.quarryInput ?? "")
      : String(d?.quarryInput ?? ""),
    quarryPlant: sel.quarryPlant
      ? String(d?.quarryPlantInput ?? "")
      : undefined,
    plant: sel.plant
      ? String(d?.plantInput ?? "")
      : String(d?.plantInput ?? ""),
    port: ports?.length ? String(ports[0]?.portName ?? "") : undefined,
    parameters: [mainParam, ...extraParams].filter((p) => p.name),
    parametersTable2: portParams.length ? portParams : undefined,
    samplingDate: String(d?.dateTime ?? ""),
    weatherAndWind: String(d?.weatherWind ?? ""),
    explanationForConfirmatorySampling: String(d?.explanation ?? ""),
    overallAssessment: String(d?.overallCompliance ?? ""),
  };
};

// CMR 5: Noise Quality Impact Assessment
const transformNoiseQualityForPayload = (raw: any) => {
  if (!raw) return undefined;
  const list = Array.isArray(raw.parameters) ? raw.parameters : [];
  const parameters = list.map((p: any) => ({
    name: String(p?.parameter ?? ""),
    results: {
      inSMR: {
        current: String(p?.currentInSMR ?? ""),
        previous: String(p?.previousInSMR ?? ""),
      },
      mmtConfirmatorySampling: {
        current: String(p?.mmtCurrent ?? ""),
        previous: String(p?.mmtPrevious ?? ""),
      },
    },
    eqpl: {
      redFlag: String(p?.redFlag ?? ""),
      action: String(p?.action ?? ""),
      denrStandard: String(p?.limit ?? ""),
    },
  }));

  const toQuarter = (label: string, content: string) =>
    content
      ? {
          year: undefined,
          assessment: String(content),
        }
      : undefined;

  const overallAssessment: any = {};
  if (raw?.quarters?.first)
    overallAssessment.firstQuarter = toQuarter("1st", raw.quarters.first);
  if (raw?.quarters?.second)
    overallAssessment.secondQuarter = toQuarter("2nd", raw.quarters.second);
  if (raw?.quarters?.third)
    overallAssessment.thirdQuarter = toQuarter("3rd", raw.quarters.third);
  if (raw?.quarters?.fourth)
    overallAssessment.fourthQuarter = toQuarter("4th", raw.quarters.fourth);

  return {
    parameters: parameters.length ? parameters : undefined,
    samplingDate: String(raw?.dateTime ?? ""),
    weatherAndWind: String(raw?.weatherWind ?? ""),
    explanationForConfirmatorySampling: String(raw?.explanation ?? ""),
    overallAssessment: Object.keys(overallAssessment).length
      ? overallAssessment
      : undefined,
  };
};

// CMR 6: Waste Management
const transformWasteManagementForPayload = (raw: any) => {
  if (!raw) return undefined;

  const mapPlantPortSection = (sec: any): any[] => {
    if (!sec) return [];
    const items = Array.isArray(sec?.eccEpepCommitments)
      ? sec.eccEpepCommitments
      : [];
    return items.map((it: any) => ({
      typeOfWaste: String(sec?.typeOfWaste ?? ""),
      eccEpepCommitments: {
        handling: String(it?.handling ?? ""),
        storage: String(it?.storage ?? ""),
        disposal: Boolean(it?.disposal),
      },
      adequate: {
        y: String(sec?.isAdequate ?? "").toUpperCase() === "YES",
        n: String(sec?.isAdequate ?? "").toUpperCase() === "NO",
      },
      previousRecord: sec?.previousRecord ?? "",
      q2_2025_Generated_HW: sec?.currentQuarterWaste ?? "",
      total: undefined,
    }));
  };

  const quarry = raw?.quarryData?.N_A
    ? "N/A"
    : raw?.quarryData?.noSignificantImpact && !raw?.quarryData?.generateTable
      ? "No significant impact"
      : mapPlantPortSection(raw?.quarryPlantData);

  const plant = raw?.plantSimpleData?.N_A
    ? "N/A"
    : raw?.plantSimpleData?.noSignificantImpact &&
        !raw?.plantSimpleData?.generateTable
      ? "No significant impact"
      : mapPlantPortSection(raw?.plantData);

  const port = raw?.portData?.N_A
    ? "N/A"
    : raw?.portData?.noSignificantImpact && !raw?.portData?.generateTable
      ? "No significant impact"
      : mapPlantPortSection(raw?.portPlantData);

  return { quarry, plant, port };
};

// CMR 7: Chemical Safety Management
const transformChemicalSafetyForPayload = (raw: any) => {
  if (!raw) return undefined;
  const cs = raw.chemicalSafety || {};
  const yn = (v: any) => String(v).toUpperCase() === "YES";

  // Backend expects an object with a `chemicalSafety` nested object plus
  // boolean flags for healthSafetyChecked and socialDevChecked
  return {
    chemicalSafety: {
      isNA: cs.isNA ?? undefined,
      riskManagement:
        cs.riskManagement != null
          ? (yn(cs.riskManagement) as boolean)
          : undefined,
      training: cs.training != null ? (yn(cs.training) as boolean) : undefined,
      handling: cs.handling != null ? (yn(cs.handling) as boolean) : undefined,
      emergencyPreparedness:
        cs.emergencyPreparedness != null
          ? (yn(cs.emergencyPreparedness) as boolean)
          : undefined,
      remarks: cs.remarks ?? undefined,
      chemicalCategory: cs.chemicalCategory ?? undefined,
      othersSpecify: cs.othersSpecify ?? undefined,
    },
    healthSafetyChecked: !!raw.healthSafetyChecked,
    socialDevChecked: !!raw.socialDevChecked,
  };
};

// CMR 8: Complaints Verification and Management
const transformComplaintsForPayload = (raw: any) => {
  if (!Array.isArray(raw)) return undefined;
  const cleaned = raw
    .filter((c) => !c?.isNA)
    .map((c) => ({
      // Backend expects these exact property names
      dateFiled: String(c?.dateFiled ?? ""),
      filedLocation: String(c?.filedLocation ?? ""),
      othersSpecify:
        c?.filedLocation === "Others"
          ? String(c?.othersSpecify ?? "")
          : undefined,
      nature: String(c?.nature ?? ""),
      resolutions: String(c?.resolutions ?? ""),
      id: c?.id ?? undefined,
      isNA: c?.isNA ?? undefined,
    }));
  return cleaned.length ? cleaned : undefined;
};

const buildCreateCMVRPayload = (
  snapshot: DraftSnapshot,
  options: { recommendationsData?: RecommendationsData } = {},
  userId?: string
): CreateCMVRDto => {
  // Normalize snapshot to accept either:
  //  - top-level section fields (complianceToProjectLocationAndCoverageLimits, airQualityImpactAssessment, etc.)
  //  - or a nested `complianceMonitoringReport` object containing those sections
  const norm: DraftSnapshot = snapshot.complianceMonitoringReport
    ? ({
        ...snapshot,
        ...(snapshot.complianceMonitoringReport as any),
      } as DraftSnapshot)
    : snapshot;

  const generalInfo = norm.generalInfo ?? defaultGeneralInfo;
  const eccEntries = buildEccEntries(
    norm.eccInfo ?? defaultEccInfo,
    norm.eccAdditionalForms ?? []
  );
  const isagEntries = buildIsagEntries(
    norm.isagInfo ?? defaultIsagInfo,
    norm.isagAdditionalForms ?? []
  );
  const epepEntries = buildEpepEntries(
    norm.epepInfo ?? defaultEpepInfo,
    norm.epepAdditionalForms ?? []
  );
  const rcfEntries = buildFundEntries(
    norm.rcfInfo ?? defaultFundInfo,
    norm.rcfAdditionalForms ?? []
  );
  const mtfEntries = buildFundEntries(
    norm.mtfInfo ?? defaultFundInfo,
    norm.mtfAdditionalForms ?? []
  );
  const fmrdfEntries = buildFundEntries(
    norm.fmrdfInfo ?? defaultFundInfo,
    norm.fmrdfAdditionalForms ?? []
  );

  const proponentInfo = norm.isagInfo ?? defaultIsagInfo;
  const mmtInfo = norm.mmtInfo ?? defaultMmtInfo;

  const payload: CreateCMVRDto = {
    companyName: sanitizeString(generalInfo.companyName) || "Untitled Company",
    location: buildLocationString(generalInfo),
    quarter: sanitizeString(generalInfo.quarter) || "1st",
    year: toNumberOrYear(generalInfo.year),
    dateOfComplianceMonitoringAndValidation: sanitizeString(
      generalInfo.dateOfCompliance
    ),
    monitoringPeriodCovered: sanitizeString(generalInfo.monitoringPeriod),
    dateOfCmrSubmission: sanitizeString(generalInfo.dateOfCMRSubmission),
    ecc: eccEntries,
    isagMpp: isagEntries,
    projectCurrentName:
      sanitizeString(proponentInfo.currentName) ||
      sanitizeString(generalInfo.projectName),
    projectNameInEcc:
      sanitizeString(proponentInfo.nameInECC) ||
      sanitizeString(generalInfo.projectName),
    projectStatus: sanitizeString(proponentInfo.projectStatus),
    projectGeographicalCoordinates: buildCoordinatesString(proponentInfo),
    proponent: {
      contactPersonAndPosition:
        sanitizeString(proponentInfo.proponentContact) ||
        sanitizeString(proponentInfo.proponentName),
      mailingAddress: sanitizeString(proponentInfo.proponentAddress),
      telephoneFax: sanitizeString(proponentInfo.proponentPhone),
      emailAddress: sanitizeString(proponentInfo.proponentEmail),
    },
    mmt: {
      contactPersonAndPosition: sanitizeString(mmtInfo.contactPerson),
      mailingAddress: sanitizeString(mmtInfo.mailingAddress),
      telephoneFax: sanitizeString(mmtInfo.phoneNumber),
      emailAddress: sanitizeString(mmtInfo.emailAddress),
    },
    epepFmrdpStatus: (norm.epepInfo?.isNA ?? false) ? "N/A" : "Approved",
    epep: epepEntries,
    rehabilitationCashFund: rcfEntries,
    monitoringTrustFundUnified: mtfEntries,
    finalMineRehabilitationAndDecommissioningFund: fmrdfEntries,
  };

  if (userId) {
    payload.createdById = userId;
  }

  // Add Page 2 data (Executive Summary & Process Documentation)
  if (norm.executiveSummaryOfCompliance) {
    payload.executiveSummaryOfCompliance = transformExecutiveSummaryForPayload(
      norm.executiveSummaryOfCompliance
    );
  }

  if (norm.processDocumentationOfActivitiesUndertaken) {
    payload.processDocumentationOfActivitiesUndertaken =
      transformProcessDocumentationForPayload(
        norm.processDocumentationOfActivitiesUndertaken
      );
  }

  // Build Compliance Monitoring Report from all the collected sections
  const complianceMonitoringReport: any = {};
  let hasComplianceData = false;

  // Track presence of required sections for ComplianceMonitoringReportDto
  let hasPLCL = false;
  let hasImpact = false;
  let hasAir = false;
  let hasWater = false;

  if (norm.complianceToProjectLocationAndCoverageLimits) {
    complianceMonitoringReport.complianceToProjectLocationAndCoverageLimits =
      transformProjectLocationCoverageForPayload(
        norm.complianceToProjectLocationAndCoverageLimits
      );
    hasComplianceData = true;
    hasPLCL = true;
  }

  if (norm.complianceToImpactManagementCommitments) {
    complianceMonitoringReport.complianceToImpactManagementCommitments =
      transformImpactCommitmentsForPayload(
        norm.complianceToImpactManagementCommitments
      );
    hasComplianceData = true;
    hasImpact = true;
  }

  if (norm.airQualityImpactAssessment) {
    complianceMonitoringReport.airQualityImpactAssessment =
      transformAirQualityForPayload(norm.airQualityImpactAssessment);
    hasComplianceData = true;
    hasAir = true;
  }

  if (norm.waterQualityImpactAssessment) {
    complianceMonitoringReport.waterQualityImpactAssessment =
      transformWaterQualityForPayload(norm.waterQualityImpactAssessment);
    hasComplianceData = true;
    hasWater = true;
  }

  if (norm.noiseQualityImpactAssessment) {
    complianceMonitoringReport.noiseQualityImpactAssessment =
      transformNoiseQualityForPayload(norm.noiseQualityImpactAssessment);
    hasComplianceData = true;
  }

  if (norm.complianceWithGoodPracticeInSolidAndHazardousWasteManagement) {
    complianceMonitoringReport.complianceWithGoodPracticeInSolidAndHazardousWasteManagement =
      transformWasteManagementForPayload(
        norm.complianceWithGoodPracticeInSolidAndHazardousWasteManagement
      );
    hasComplianceData = true;
  }

  if (norm.complianceWithGoodPracticeInChemicalSafetyManagement) {
    complianceMonitoringReport.complianceWithGoodPracticeInChemicalSafetyManagement =
      transformChemicalSafetyForPayload(
        norm.complianceWithGoodPracticeInChemicalSafetyManagement
      );
    hasComplianceData = true;
  }

  if (norm.complaintsVerificationAndManagement) {
    complianceMonitoringReport.complaintsVerificationAndManagement =
      transformComplaintsForPayload(norm.complaintsVerificationAndManagement);
    hasComplianceData = true;
  }

  if (
    norm.recommendationFromPrevQuarter ||
    options.recommendationsData?.previousRecommendations
  ) {
    const transformedPrevRecommendations = transformRecommendationsForPayload(
      options.recommendationsData?.previousRecommendations,
      options.recommendationsData?.prevQuarter,
      options.recommendationsData?.prevYear
    );
    complianceMonitoringReport.recommendationFromPrevQuarter =
      norm.recommendationFromPrevQuarter || transformedPrevRecommendations;
    hasComplianceData = true;
  }

  if (
    norm.recommendationForNextQuarter ||
    options.recommendationsData?.currentRecommendations
  ) {
    const transformedRecommendations = transformRecommendationsForPayload(
      options.recommendationsData?.currentRecommendations,
      generalInfo.quarter,
      generalInfo.year
    );
    complianceMonitoringReport.recommendationForNextQuarter =
      norm.recommendationForNextQuarter || transformedRecommendations;
    hasComplianceData = true;
  }

  // Only add complianceMonitoringReport if ALL required sections are present
  if (hasComplianceData && hasPLCL && hasImpact && hasAir && hasWater) {
    payload.complianceMonitoringReport = complianceMonitoringReport;
  }

  return payload;
};

type CMVRDocumentExportScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CMVRDocumentExport"
>;

type CMVRDocumentExportScreenRouteProp = RouteProp<
  RootStackParamList,
  "CMVRDocumentExport"
>;

const CMVRDocumentExportScreen = () => {
  const navigation = useNavigation<CMVRDocumentExportScreenNavigationProp>();
  const route = useRoute<CMVRDocumentExportScreenRouteProp>();
  const { user } = useAuth();
  const { fileName: contextFileName } = useFileName();

  const routeParams = route.params ?? {};
  const {
    cmvrReportId: routeReportId,
    generalInfo: routeGeneralInfo,
    eccInfo: routeEccInfo,
    eccAdditionalForms: routeEccAdditionalForms,
    isagInfo: routeIsagInfo,
    isagAdditionalForms: routeIsagAdditionalForms,
    epepInfo: routeEpepInfo,
    epepAdditionalForms: routeEpepAdditionalForms,
    rcfInfo: routeRcfInfo,
    rcfAdditionalForms: routeRcfAdditionalForms,
    mtfInfo: routeMtfInfo,
    mtfAdditionalForms: routeMtfAdditionalForms,
    fmrdfInfo: routeFmrdfInfo,
    fmrdfAdditionalForms: routeFmrdfAdditionalForms,
    mmtInfo: routeMmtInfo,
    recommendationsData: routeRecommendationsData,
    fileName: routeFileName,
    // Page 2+ data
    executiveSummaryOfCompliance: routeExecutiveSummaryOfCompliance,
    processDocumentationOfActivitiesUndertaken:
      routeProcessDocumentationOfActivitiesUndertaken,
    complianceToProjectLocationAndCoverageLimits:
      routeComplianceToProjectLocationAndCoverageLimits,
    complianceToImpactManagementCommitments:
      routeComplianceToImpactManagementCommitments,
    airQualityImpactAssessment: routeAirQualityImpactAssessment,
    waterQualityImpactAssessment: routeWaterQualityImpactAssessment,
    noiseQualityImpactAssessment: routeNoiseQualityImpactAssessment,
    complianceWithGoodPracticeInSolidAndHazardousWasteManagement:
      routeComplianceWithGoodPracticeInSolidAndHazardousWasteManagement,
    complianceWithGoodPracticeInChemicalSafetyManagement:
      routeComplianceWithGoodPracticeInChemicalSafetyManagement,
    complaintsVerificationAndManagement:
      routeComplaintsVerificationAndManagement,
    recommendationFromPrevQuarter: routeRecommendationFromPrevQuarter,
    recommendationForNextQuarter: routeRecommendationForNextQuarter,
    attendanceUrl: routeAttendanceUrl,
    documentation: routeDocumentation,
  } = routeParams;

  const resolvedFileName = useMemo(
    () => routeFileName?.trim() || contextFileName?.trim() || "CMVR_Report",
    [routeFileName, contextFileName]
  );

  const DRAFT_KEY = useMemo(
    () => `cmvr_draft_${resolvedFileName || "temp"}`,
    [resolvedFileName]
  );

  const [draftSnapshot, setDraftSnapshot] = useState<DraftSnapshot | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [documentGenerated, setDocumentGenerated] = useState(false);
  // Only DOCX supported for generation
  const selectedFormat: "docx" = "docx";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  // Track successful submission so we can enable generation only after DB submit
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadStoredDraft =
    useCallback(async (): Promise<DraftSnapshot | null> => {
      try {
        const raw = await AsyncStorage.getItem(DRAFT_KEY);
        if (!raw) {
          return null;
        }
        return JSON.parse(raw) as DraftSnapshot;
      } catch (error) {
        console.error("Failed to load CMVR draft:", error);
        return null;
      }
    }, [DRAFT_KEY]);

  const persistSnapshot = useCallback(
    async (snapshot: DraftSnapshot) => {
      await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(snapshot));
      console.log("Draft saved locally:", DRAFT_KEY);
    },
    [DRAFT_KEY]
  );

  const routeDraftUpdate = useMemo<Partial<DraftSnapshot>>(() => {
    const update: Partial<DraftSnapshot> = {};
    if (routeGeneralInfo) update.generalInfo = routeGeneralInfo;
    if (routeEccInfo) update.eccInfo = routeEccInfo;
    if (routeEccAdditionalForms !== undefined)
      update.eccAdditionalForms = routeEccAdditionalForms;
    if (routeIsagInfo) update.isagInfo = routeIsagInfo;
    if (routeIsagAdditionalForms !== undefined)
      update.isagAdditionalForms = routeIsagAdditionalForms;
    if (routeEpepInfo) update.epepInfo = routeEpepInfo;
    if (routeEpepAdditionalForms !== undefined)
      update.epepAdditionalForms = routeEpepAdditionalForms;
    if (routeRcfInfo) update.rcfInfo = routeRcfInfo;
    if (routeRcfAdditionalForms !== undefined)
      update.rcfAdditionalForms = routeRcfAdditionalForms;
    if (routeMtfInfo) update.mtfInfo = routeMtfInfo;
    if (routeMtfAdditionalForms !== undefined)
      update.mtfAdditionalForms = routeMtfAdditionalForms;
    if (routeFmrdfInfo) update.fmrdfInfo = routeFmrdfInfo;
    if (routeFmrdfAdditionalForms !== undefined)
      update.fmrdfAdditionalForms = routeFmrdfAdditionalForms;
    if (routeMmtInfo) update.mmtInfo = routeMmtInfo;
    if (routeRecommendationsData !== undefined)
      update.recommendationsData = routeRecommendationsData;

    // Page 2+ data
    if (routeExecutiveSummaryOfCompliance !== undefined)
      update.executiveSummaryOfCompliance = routeExecutiveSummaryOfCompliance;
    if (routeProcessDocumentationOfActivitiesUndertaken !== undefined)
      update.processDocumentationOfActivitiesUndertaken =
        routeProcessDocumentationOfActivitiesUndertaken;
    if (routeComplianceToProjectLocationAndCoverageLimits !== undefined)
      update.complianceToProjectLocationAndCoverageLimits =
        routeComplianceToProjectLocationAndCoverageLimits;
    if (routeComplianceToImpactManagementCommitments !== undefined)
      update.complianceToImpactManagementCommitments =
        routeComplianceToImpactManagementCommitments;
    if (routeAirQualityImpactAssessment !== undefined)
      update.airQualityImpactAssessment = routeAirQualityImpactAssessment;
    if (routeWaterQualityImpactAssessment !== undefined)
      update.waterQualityImpactAssessment = routeWaterQualityImpactAssessment;
    if (routeNoiseQualityImpactAssessment !== undefined)
      update.noiseQualityImpactAssessment = routeNoiseQualityImpactAssessment;
    if (
      routeComplianceWithGoodPracticeInSolidAndHazardousWasteManagement !==
      undefined
    )
      update.complianceWithGoodPracticeInSolidAndHazardousWasteManagement =
        routeComplianceWithGoodPracticeInSolidAndHazardousWasteManagement;
    if (routeComplianceWithGoodPracticeInChemicalSafetyManagement !== undefined)
      update.complianceWithGoodPracticeInChemicalSafetyManagement =
        routeComplianceWithGoodPracticeInChemicalSafetyManagement;
    if (routeComplaintsVerificationAndManagement !== undefined)
      update.complaintsVerificationAndManagement =
        routeComplaintsVerificationAndManagement;
    if (routeRecommendationFromPrevQuarter !== undefined)
      update.recommendationFromPrevQuarter = routeRecommendationFromPrevQuarter;
    if (routeRecommendationForNextQuarter !== undefined)
      update.recommendationForNextQuarter = routeRecommendationForNextQuarter;
    if (routeAttendanceUrl !== undefined)
      update.attendanceUrl = routeAttendanceUrl;
    if (routeDocumentation !== undefined)
      update.documentation = routeDocumentation;

    return update;
  }, [
    routeGeneralInfo,
    routeEccInfo,
    routeEccAdditionalForms,
    routeIsagInfo,
    routeIsagAdditionalForms,
    routeEpepInfo,
    routeEpepAdditionalForms,
    routeRcfInfo,
    routeRcfAdditionalForms,
    routeMtfInfo,
    routeMtfAdditionalForms,
    routeFmrdfInfo,
    routeFmrdfAdditionalForms,
    routeMmtInfo,
    routeRecommendationsData,
    routeExecutiveSummaryOfCompliance,
    routeProcessDocumentationOfActivitiesUndertaken,
    routeComplianceToProjectLocationAndCoverageLimits,
    routeComplianceToImpactManagementCommitments,
    routeAirQualityImpactAssessment,
    routeWaterQualityImpactAssessment,
    routeNoiseQualityImpactAssessment,
    routeComplianceWithGoodPracticeInSolidAndHazardousWasteManagement,
    routeComplianceWithGoodPracticeInChemicalSafetyManagement,
    routeComplaintsVerificationAndManagement,
    routeRecommendationFromPrevQuarter,
    routeRecommendationForNextQuarter,
    routeAttendanceUrl,
    routeDocumentation,
  ]);

  useEffect(() => {
    let isActive = true;

    const hydrateDraft = async () => {
      const stored = await loadStoredDraft();
      const merged = mergeDraftData(stored, routeDraftUpdate, resolvedFileName);
      if (!isActive) {
        return;
      }
      setDraftSnapshot(merged);
      await persistSnapshot(merged);

      // If navigation provided a report id, mark as submitted
      if (routeReportId && isActive) {
        setSubmittedReportId(routeReportId);
        setHasSubmitted(true);
      }
    };

    hydrateDraft().catch((error) => {
      console.error("Failed to prepare CMVR draft snapshot:", error);
    });

    return () => {
      isActive = false;
    };
  }, [loadStoredDraft, routeDraftUpdate, resolvedFileName, persistSnapshot]);

  const saveDraftToLocal = useCallback(async (): Promise<DraftSnapshot> => {
    if (!draftSnapshot) {
      throw new Error("No CMVR data available to save.");
    }

    const snapshotToPersist: DraftSnapshot = {
      ...draftSnapshot,
      fileName: resolvedFileName,
      savedAt: new Date().toISOString(),
    };

    setDraftSnapshot(snapshotToPersist);
    await persistSnapshot(snapshotToPersist);
    return snapshotToPersist;
  }, [draftSnapshot, persistSnapshot, resolvedFileName]);
  const handleExit = async () => {
    try {
      if (!hasSubmitted) {
        // Save current snapshot silently as draft before exiting
        await saveDraftToLocal();
      }
    } catch (e) {
      console.warn("Failed to save draft on exit:", e);
    } finally {
      // Always navigate back to Dashboard as requested
      navigation.navigate("Dashboard" as never);
    }
  };

  const handleDeleteFromSupabase = async () => {
    if (!submittedReportId) return;
    Alert.alert(
      "Delete Report",
      "Are you sure you want to delete this CMVR report from the database? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deleteCMVRReport(submittedReportId);
              setHasSubmitted(false);
              setSubmittedReportId(null);
              Alert.alert("Deleted", "The CMVR report was deleted.");
            } catch (e: any) {
              console.error("Delete CMVR report failed:", e);
              Alert.alert(
                "Delete Failed",
                e?.message || "Unable to delete the report."
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleSubmitUpdate = async () => {
    if (!submittedReportId) return;
    if (!draftSnapshot) {
      Alert.alert("Nothing to update", "No report data to submit.");
      return;
    }
    try {
      setIsUpdating(true);
      const snapshotForSubmission = mergeDraftData(
        draftSnapshot,
        routeDraftUpdate,
        resolvedFileName
      );
      const payload = buildCreateCMVRPayload(
        snapshotForSubmission,
        { recommendationsData: snapshotForSubmission.recommendationsData },
        user?.id
      );

      // Extract fileName separately (not in payload)
      const fileNameForUpdate =
        sanitizeString(snapshotForSubmission.fileName) ||
        sanitizeString(snapshotForSubmission.generalInfo?.projectName) ||
        "CMVR_Report";

      await updateCMVRReport(submittedReportId, payload, fileNameForUpdate);

      // Delete the draft from AsyncStorage after successful update
      await AsyncStorage.removeItem(DRAFT_KEY);

      Alert.alert("Updated", "Your CMVR report has been updated.");
    } catch (e: any) {
      console.error("Update CMVR report failed:", e);
      Alert.alert("Update Failed", e?.message || "Could not update report.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!draftSnapshot) {
      Alert.alert(
        "Preparing Draft",
        "Please wait while we load your CMVR report data.",
        [{ text: "OK" }]
      );
      return;
    }

    setIsSavingDraft(true);
    try {
      await saveDraftToLocal();
      Alert.alert(
        "Draft Saved",
        "Your CMVR report has been saved as a draft locally.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error saving CMVR draft:", error);
      Alert.alert("Save Failed", "Failed to save draft. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleSubmitToSupabase = async () => {
    if (!draftSnapshot) {
      Alert.alert(
        "Preparing Data",
        "Please wait while we prepare your CMVR report data.",
        [{ text: "OK" }]
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const snapshotForSubmission = mergeDraftData(
        draftSnapshot,
        routeDraftUpdate,
        resolvedFileName
      );

      setDraftSnapshot(snapshotForSubmission);

      console.log("=== DEBUG: Snapshot for submission ===");
      console.log(
        "Has executiveSummaryOfCompliance:",
        !!snapshotForSubmission.executiveSummaryOfCompliance
      );
      console.log(
        "Has processDocumentationOfActivitiesUndertaken:",
        !!snapshotForSubmission.processDocumentationOfActivitiesUndertaken
      );
      console.log(
        "Has waterQualityImpactAssessment:",
        !!snapshotForSubmission.waterQualityImpactAssessment
      );
      console.log(
        "Has airQualityImpactAssessment:",
        !!snapshotForSubmission.airQualityImpactAssessment
      );
      console.log(
        "Has noiseQualityImpactAssessment:",
        !!snapshotForSubmission.noiseQualityImpactAssessment
      );
      console.log("Full snapshot keys:", Object.keys(snapshotForSubmission));

      const payload = buildCreateCMVRPayload(
        snapshotForSubmission,
        { recommendationsData: snapshotForSubmission.recommendationsData },
        user?.id
      );

      console.log("=== DEBUG: Payload being sent ===");
      console.log(JSON.stringify(payload, null, 2));

      // Extract fileName separately (not in payload)
      const fileNameForSubmission =
        sanitizeString(snapshotForSubmission.fileName) ||
        sanitizeString(snapshotForSubmission.generalInfo?.projectName) ||
        "CMVR_Report";

      const created = await createCMVRReport(payload, fileNameForSubmission);
      // Try to capture the created report id if returned by API
      const newId = created?.id || created?.data?.id || null;
      setSubmittedReportId(newId);
      setHasSubmitted(true);

      await AsyncStorage.removeItem(DRAFT_KEY);

      Alert.alert(
        "Submitted",
        "Your CMVR report has been saved to the database. You can now generate a document.",
        [{ text: "OK" }]
      );
    } catch (error: any) {
      console.error("Error submitting CMVR report:", error);
      const errorMessage =
        error?.message || "Failed to submit CMVR report. Please try again.";
      setSubmitError(errorMessage);

      Alert.alert("Submission Failed", errorMessage, [{ text: "OK" }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fileName = resolvedFileName;
  const generalInfo =
    draftSnapshot?.generalInfo ?? routeGeneralInfo ?? defaultGeneralInfo;
  const eccInfo = draftSnapshot?.eccInfo ?? routeEccInfo ?? defaultEccInfo;
  const eccAdditionalForms =
    draftSnapshot?.eccAdditionalForms ??
    routeEccAdditionalForms ??
    ([] as ECCAdditionalForm[]);
  const isagInfo = draftSnapshot?.isagInfo ?? routeIsagInfo ?? defaultIsagInfo;
  const isagAdditionalForms =
    draftSnapshot?.isagAdditionalForms ??
    routeIsagAdditionalForms ??
    ([] as ISAGAdditionalForm[]);
  const epepInfo = draftSnapshot?.epepInfo ?? routeEpepInfo ?? defaultEpepInfo;
  const epepAdditionalForms =
    draftSnapshot?.epepAdditionalForms ??
    routeEpepAdditionalForms ??
    ([] as EpepAdditionalForm[]);
  const rcfInfo = draftSnapshot?.rcfInfo ?? routeRcfInfo ?? defaultFundInfo;
  const rcfAdditionalForms =
    draftSnapshot?.rcfAdditionalForms ??
    routeRcfAdditionalForms ??
    ([] as FundAdditionalForm[]);
  const mtfInfo = draftSnapshot?.mtfInfo ?? routeMtfInfo ?? defaultFundInfo;
  const mtfAdditionalForms =
    draftSnapshot?.mtfAdditionalForms ??
    routeMtfAdditionalForms ??
    ([] as FundAdditionalForm[]);
  const fmrdfInfo =
    draftSnapshot?.fmrdfInfo ?? routeFmrdfInfo ?? defaultFundInfo;
  const fmrdfAdditionalForms =
    draftSnapshot?.fmrdfAdditionalForms ??
    routeFmrdfAdditionalForms ??
    ([] as FundAdditionalForm[]);
  const mmtInfo = draftSnapshot?.mmtInfo ?? routeMmtInfo ?? defaultMmtInfo;

  const handleGenerateDocument = async () => {
    if (!hasSubmitted || !submittedReportId) {
      Alert.alert(
        "Submit Required",
        "Please submit your report to the database first.",
        [{ text: "OK" }]
      );
      return;
    }
    setIsGenerating(true);
    try {
      const uri = await generateCMVRDocx(submittedReportId, fileName);
      console.log("DOCX saved to:", uri);
      setDocumentGenerated(true);
    } catch (err: any) {
      console.error("Generate DOCX failed:", err);
      Alert.alert(
        "Generation Failed",
        err?.message || "Unable to generate document. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = () => {
    console.log("Opening DOCX preview...");
  };

  const handleDownload = () => {
    console.log("Downloading DOCX file...");
  };

  const getDisplayValue = (
    value: string | undefined | null,
    fallback = "Not provided"
  ) => {
    return value && value.trim() !== "" ? value : fallback;
  };

  // Navigation handlers for summary cards
  const navigateToGeneralInfo = () => {
    navigation.navigate("CMVRReport", {
      fileName,
      generalInfo,
      eccInfo,
      eccAdditionalForms,
      isagInfo,
      isagAdditionalForms,
      epepInfo,
      epepAdditionalForms,
      rcfInfo,
      rcfAdditionalForms,
      mtfInfo,
      mtfAdditionalForms,
      fmrdfInfo,
      fmrdfAdditionalForms,
      mmtInfo,
      draftData: draftSnapshot,
    } as any);
  };

  const navigateToPage2 = () => {
    navigation.navigate("CMVRPage2", {
      fileName,
      generalInfo,
      eccInfo,
      eccAdditionalForms,
      isagInfo,
      isagAdditionalForms,
      epepInfo,
      epepAdditionalForms,
      rcfInfo,
      rcfAdditionalForms,
      mtfInfo,
      mtfAdditionalForms,
      fmrdfInfo,
      fmrdfAdditionalForms,
      mmtInfo,
      draftData: draftSnapshot,
    } as any);
  };

  const navigateToWaterQuality = () => {
    navigation.navigate("WaterQuality", {
      fileName,
      generalInfo,
      eccInfo,
      eccAdditionalForms,
      isagInfo,
      isagAdditionalForms,
      epepInfo,
      epepAdditionalForms,
      rcfInfo,
      rcfAdditionalForms,
      mtfInfo,
      mtfAdditionalForms,
      fmrdfInfo,
      fmrdfAdditionalForms,
      mmtInfo,
      draftData: draftSnapshot,
    } as any);
  };

  const navigateToNoiseQuality = () => {
    navigation.navigate("NoiseQuality", {
      fileName,
      generalInfo,
      eccInfo,
      eccAdditionalForms,
      isagInfo,
      isagAdditionalForms,
      epepInfo,
      epepAdditionalForms,
      rcfInfo,
      rcfAdditionalForms,
      mtfInfo,
      mtfAdditionalForms,
      fmrdfInfo,
      fmrdfAdditionalForms,
      mmtInfo,
      draftData: draftSnapshot,
    } as any);
  };

  const navigateToWasteManagement = () => {
    navigation.navigate("WasteManagement", {
      fileName,
      generalInfo,
      eccInfo,
      eccAdditionalForms,
      isagInfo,
      isagAdditionalForms,
      epepInfo,
      epepAdditionalForms,
      rcfInfo,
      rcfAdditionalForms,
      mtfInfo,
      mtfAdditionalForms,
      fmrdfInfo,
      fmrdfAdditionalForms,
      mmtInfo,
      draftData: draftSnapshot,
    } as any);
  };

  const navigateToChemicalSafety = () => {
    navigation.navigate("ChemicalSafety", {
      fileName,
      generalInfo,
      eccInfo,
      eccAdditionalForms,
      isagInfo,
      isagAdditionalForms,
      epepInfo,
      epepAdditionalForms,
      rcfInfo,
      rcfAdditionalForms,
      mtfInfo,
      mtfAdditionalForms,
      fmrdfInfo,
      fmrdfAdditionalForms,
      mmtInfo,
      draftData: draftSnapshot,
    } as any);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>CMVR Report Export</Text>
          <Text style={styles.headerSubtitle}>
            Generate and download your report
          </Text>
        </View>
        <TouchableOpacity onPress={handleExit}>
          <Text style={styles.exitText}>Exit</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.previewCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="document-text" size={32} color="white" />
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {(fileName || "CMVR_Report") + ".docx"}
              </Text>
              <Text style={styles.cardSubtitle} numberOfLines={1}>
                {getDisplayValue(
                  isagInfo?.currentName || generalInfo?.projectName,
                  "Project"
                )}{" "}
                - Compliance Report
              </Text>
            </View>
          </View>
        </View>

        {/* Format selection removed; only DOCX is generated */}

        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Document Contents Summary</Text>

          <SummaryItem
            icon="📋"
            title="General Information"
            value={`${getDisplayValue(generalInfo?.companyName)} - ${getDisplayValue(isagInfo?.currentName || generalInfo?.projectName)}`}
            onPress={navigateToGeneralInfo}
          />

          <SummaryItem
            icon="🛡️"
            title="ECC Information"
            value={
              eccInfo.isNA
                ? "Not Applicable"
                : getDisplayValue(eccInfo.eccNumber)
            }
            additional={
              !eccInfo.isNA && eccAdditionalForms.length > 0
                ? `+${eccAdditionalForms.length} additional`
                : undefined
            }
            onPress={navigateToGeneralInfo}
          />

          <SummaryItem
            icon="📄"
            title="ISAG/MPP Information"
            value={
              isagInfo.isNA
                ? "Not Applicable"
                : getDisplayValue(isagInfo.isagNumber)
            }
            additional={
              !isagInfo.isNA && isagAdditionalForms.length > 0
                ? `+${isagAdditionalForms.length} additional`
                : undefined
            }
            onPress={navigateToGeneralInfo}
          />

          <SummaryItem
            icon="🌿"
            title="EPEP Information"
            value={
              epepInfo.isNA
                ? "Not Applicable"
                : getDisplayValue(epepInfo.epepNumber)
            }
            additional={
              !epepInfo.isNA && epepAdditionalForms.length > 0
                ? `+${epepAdditionalForms.length} additional`
                : undefined
            }
            onPress={navigateToGeneralInfo}
          />

          <SummaryItem
            icon="💰"
            title="RCF Status"
            value={
              rcfInfo.isNA
                ? "Not Applicable"
                : `₱${getDisplayValue(rcfInfo.amountDeposited, "0.00")}`
            }
            additional={
              !rcfInfo.isNA && rcfAdditionalForms.length > 0
                ? `+${rcfAdditionalForms.length} additional`
                : undefined
            }
            onPress={navigateToGeneralInfo}
          />

          <SummaryItem
            icon="🛡️"
            title="MTF Status"
            value={
              mtfInfo.isNA
                ? "Not Applicable"
                : `₱${getDisplayValue(mtfInfo.amountDeposited, "0.00")}`
            }
            additional={
              !mtfInfo.isNA && mtfAdditionalForms.length > 0
                ? `+${mtfAdditionalForms.length} additional`
                : undefined
            }
            onPress={navigateToGeneralInfo}
          />

          <SummaryItem
            icon="🌱"
            title="FMRDF Status"
            value={
              fmrdfInfo.isNA
                ? "Not Applicable"
                : `₱${getDisplayValue(fmrdfInfo.amountDeposited, "0.00")}`
            }
            additional={
              !fmrdfInfo.isNA && fmrdfAdditionalForms.length > 0
                ? `+${fmrdfAdditionalForms.length} additional`
                : undefined
            }
            onPress={navigateToGeneralInfo}
          />

          <SummaryItem
            icon="👥"
            title="Monitoring Team"
            value={
              mmtInfo.contactPerson
                ? getDisplayValue(mmtInfo.contactPerson)
                : "Not provided"
            }
            onPress={navigateToGeneralInfo}
          />
        </View>

        {documentGenerated && (
          <View style={styles.generatedSection}>
            <View style={styles.generatedCard}>
              <View style={styles.generatedIconContainer}>
                <Ionicons name="checkmark-circle" size={48} color="#10B981" />
              </View>
              <Text style={styles.generatedTitle} numberOfLines={1}>
                {(fileName || "CMVR_Report") + ".docx"}
              </Text>
              <Text style={styles.generatedSubtitle}>
                Document ready for download
              </Text>
              <Text style={styles.generatedDate}>
                Generated on {new Date().toLocaleDateString()}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.actionSection}>
          {!documentGenerated ? (
            <>
              <TouchableOpacity
                style={[
                  styles.generateButton,
                  (isGenerating || !hasSubmitted) && styles.buttonDisabled,
                ]}
                onPress={handleGenerateDocument}
                disabled={isGenerating || !hasSubmitted}
              >
                {isGenerating ? (
                  <>
                    <ActivityIndicator size="small" color="white" />
                    <Text style={styles.generateButtonText}>
                      Generating Document...
                    </Text>
                  </>
                ) : (
                  <>
                    {!hasSubmitted && (
                      <TouchableOpacity
                        style={[
                          styles.submitButton,
                          isSubmitting && styles.buttonDisabled,
                        ]}
                        onPress={handleSubmitToSupabase}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <ActivityIndicator size="small" color="white" />
                            <Text style={styles.submitButtonText}>
                              Submitting...
                            </Text>
                          </>
                        ) : (
                          <>
                            <Ionicons
                              name="cloud-upload"
                              size={20}
                              color="white"
                            />
                            <Text style={styles.submitButtonText}>
                              Submit to Database
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>
                    )}

                    <Ionicons name="document-text" size={20} color="white" />
                    <Text style={styles.generateButtonText}>
                      Generate Docx
                      {!hasSubmitted ? " (enable after submit)" : ""}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {hasSubmitted && submittedReportId ? (
                <TouchableOpacity
                  style={[
                    styles.updateButton,
                    isUpdating && styles.buttonDisabled,
                  ]}
                  onPress={handleSubmitUpdate}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <ActivityIndicator size="small" color="white" />
                      <Text style={styles.updateButtonText}>Updating...</Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="cloud-upload" size={20} color="white" />
                      <Text style={styles.updateButtonText}>Submit Update</Text>
                    </>
                  )}
                </TouchableOpacity>
              ) : null}

              {hasSubmitted && submittedReportId ? (
                <TouchableOpacity
                  style={[
                    styles.deleteButton,
                    isDeleting && styles.buttonDisabled,
                  ]}
                  onPress={handleDeleteFromSupabase}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <ActivityIndicator size="small" color="white" />
                      <Text style={styles.deleteButtonText}>Deleting...</Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="trash" size={20} color="white" />
                      <Text style={styles.deleteButtonText}>
                        Delete from Database
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              ) : null}

              {/* Removed Save Draft Locally button as requested */}

              {!hasSubmitted && (
                <View style={styles.infoBannerContainer}>
                  <Ionicons name="lock-closed" size={18} color="#1E40AF" />
                  <Text style={styles.infoBannerText}>
                    Document generation is enabled after the report is saved in
                    the database.
                  </Text>
                </View>
              )}

              {submitError && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={20} color="#DC2626" />
                  <Text style={styles.errorText}>{submitError}</Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.previewButton}
                onPress={handlePreview}
              >
                <Ionicons name="eye" size={20} color="white" />
                <Text style={styles.previewButtonText}>Preview</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={handleDownload}
              >
                <Ionicons name="download" size={20} color="white" />
                <Text style={styles.downloadButtonText}>Download</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.infoNote}>
          <Ionicons name="information-circle" size={20} color="#2563EB" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Document Information</Text>
            <Text style={styles.infoDescription}>
              Your CMVR report will include all sections with the information
              you've provided.{" "}
              {"DOCX format allows you to make further edits if needed."}
            </Text>
          </View>
        </View>

        <View style={styles.draftNote}>
          <Ionicons name="save-outline" size={20} color="#F59E0B" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.draftNoteTitle}>Draft Auto-Save</Text>
            <Text style={styles.draftNoteDescription}>
              Your report data is automatically saved locally when you open this
              screen. If you exit before submitting, we’ll save it to Drafts
              automatically.
            </Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

const SummaryItem = ({
  icon,
  title,
  value,
  additional,
  onPress,
}: {
  icon: string;
  title: string;
  value: string;
  additional?: string;
  onPress?: () => void;
}) => {
  const content = (
    <>
      <Text style={styles.summaryIcon}>{icon}</Text>
      <View style={styles.summaryTextContainer}>
        <Text style={styles.summaryItemTitle}>{title}</Text>
        <Text style={styles.summaryItemValue} numberOfLines={1}>
          {value}
        </Text>
        {additional && (
          <Text style={styles.summaryAdditional}>{additional}</Text>
        )}
      </View>
      {onPress && <Ionicons name="chevron-forward" size={20} color="#94A3B8" />}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={styles.summaryItem}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.summaryItem}>{content}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 24,
    paddingBottom: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  backButton: {
    padding: 8,
    marginRight: 16,
    borderRadius: 8,
  },
  exitText: {
    color: "#1E40AF",
    fontSize: 16,
    fontWeight: "700",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  previewCard: {
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#02217C",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    marginBottom: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeader: {
    backgroundColor: "#02217C",
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.95)",
    lineHeight: 20,
  },
  formatSection: {
    padding: 24,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  formatButtons: {
    gap: 16,
  },
  formatButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    backgroundColor: "white",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  formatButtonActive: {
    borderColor: "#02217C",
    backgroundColor: "#EFF6FF",
    ...Platform.select({
      ios: {
        shadowColor: "#02217C",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  formatIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  formatTextContainer: {
    flex: 1,
  },
  formatTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  formatDescription: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
  summarySection: {
    padding: 24,
    backgroundColor: "white",
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  summaryIcon: {
    fontSize: 28,
    marginRight: 16,
    marginTop: 2,
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryItemTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 4,
    letterSpacing: -0.1,
  },
  summaryItemValue: {
    fontSize: 15,
    color: "#0F172A",
    lineHeight: 22,
  },
  summaryAdditional: {
    fontSize: 12,
    color: "#02217C",
    marginTop: 6,
    fontWeight: "600",
  },
  generatedSection: {
    padding: 24,
    backgroundColor: "white",
  },
  generatedCard: {
    backgroundColor: "#F0FDF4",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#86EFAC",
  },
  generatedIconContainer: {
    marginBottom: 16,
  },
  generatedTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  generatedSubtitle: {
    fontSize: 15,
    color: "#059669",
    marginBottom: 4,
    fontWeight: "600",
  },
  generatedDate: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
  },
  actionSection: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  generateButton: {
    backgroundColor: "#1E40AF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#1E40AF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 14,
  },
  submitButton: {
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  submitButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  updateButton: {
    backgroundColor: "#0EA5E9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
    marginTop: 6,
  },
  updateButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  deleteButton: {
    backgroundColor: "#DC2626",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
    marginTop: 6,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  draftButton: {
    backgroundColor: "#F59E0B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
    marginTop: 14,
  },
  draftButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  errorContainer: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    padding: 16,
    borderRadius: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: "#DC2626",
    lineHeight: 20,
    fontWeight: "500",
  },
  infoBannerContainer: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DBEAFE",
    padding: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  infoBannerText: {
    flex: 1,
    fontSize: 13,
    color: "#1E3A8A",
    lineHeight: 18,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  generateButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  previewButton: {
    flex: 1,
    backgroundColor: "#475569",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  previewButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  downloadButton: {
    flex: 1,
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  downloadButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  infoNote: {
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    ...Platform.select({
      ios: {
        shadowColor: "#2563EB",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E40AF",
    marginBottom: 6,
    letterSpacing: -0.1,
  },
  infoDescription: {
    fontSize: 14,
    color: "#1E40AF",
    lineHeight: 21,
  },
  draftNote: {
    backgroundColor: "#FEF3C7",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#FCD34D",
    marginTop: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#F59E0B",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  draftNoteTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#D97706",
    marginBottom: 6,
    letterSpacing: -0.1,
  },
  draftNoteDescription: {
    fontSize: 14,
    color: "#D97706",
    lineHeight: 21,
  },
});

export default CMVRDocumentExportScreen;
