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
  Dimensions,
  Image,
  TextInput,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { uploadFileFromUri, deleteFilesFromStorage } from "../../lib/storage";

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
import type {
  ExecutiveSummary,
  ProcessDocumentation,
} from "./types/CMVRPage2Screen.types";
import type {
  FormData,
  OtherComponent,
} from "./types/ComplianceMonitoringScreen.types";
import type {
  YesNoNull as EiaYesNoNull,
  OperationSection,
  MitigatingMeasure,
} from "./types/EIAComplianceScreen.types";
import type {
  ComplianceData as AirComplianceData,
  ParameterData as AirParameterData,
} from "./types/EnvironmentalComplianceScreen.types";
import type {
  WaterQualityData,
  Parameter as WaterParameter,
  PortData as WaterPortData,
} from "./types/WaterQualityScreen.types";
import type {
  NoiseParameter,
  QuarterData,
} from "./types/NoiseQualityScreen.types";
import type {
  WasteEntry,
  PlantPortSectionData,
  QuarrySectionData,
  PlantSectionData,
  PortSectionData,
} from "./types/WasteManagementScreen.types";
import type {
  ChemicalSafetyData,
  Complaint,
  YesNoNull as ChemicalYesNoNull,
  ChemicalCategory,
} from "./types/ChemicalSafetyScreen.types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const isTablet = SCREEN_WIDTH >= 768;
const isSmallPhone = SCREEN_WIDTH < 375;

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
  cmvrReportId?: string;
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
  executiveSummaryOfCompliance?: any;
  processDocumentationOfActivitiesUndertaken?: any;
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
  executiveSummaryOfCompliance?: any;
  processDocumentationOfActivitiesUndertaken?: any;
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

const parseCoordinateFields = (raw?: string) => {
  if (!raw) {
    return { gpsX: "", gpsY: "" };
  }
  const xMatch = raw.match(/X\s*:\s*([^,]+)/i);
  const yMatch = raw.match(/Y\s*:\s*([^,]+)/i);
  return {
    gpsX: xMatch ? xMatch[1].trim() : "",
    gpsY: yMatch ? yMatch[1].trim() : "",
  };
};

const parseLocationComponents = (raw?: string) => {
  const parts = (raw || "")
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
  if (parts.length === 0) {
    return {
      location: "",
      municipality: "",
      province: "",
      region: "",
    };
  }
  if (parts.length >= 4) {
    return {
      location: parts.slice(0, parts.length - 3).join(", ") || parts[0],
      municipality: parts[parts.length - 3] || "",
      province: parts[parts.length - 2] || "",
      region: parts[parts.length - 1] || "",
    };
  }
  if (parts.length === 3) {
    return {
      location: parts[0] || "",
      municipality: parts[0] || "",
      province: parts[1] || "",
      region: parts[2] || "",
    };
  }
  if (parts.length === 2) {
    return {
      location: parts[0] || "",
      municipality: parts[0] || "",
      province: parts[1] || "",
      region: "",
    };
  }
  return {
    location: parts[0] || "",
    municipality: "",
    province: "",
    region: "",
  };
};

const mapEccEntriesToForm = (entries?: any[]) => {
  if (!Array.isArray(entries) || entries.length === 0) {
    return {
      primary: { ...defaultEccInfo, isNA: true },
      additional: [] as ECCAdditionalForm[],
    };
  }
  const [first, ...rest] = entries;
  const convert = (item: any): ECCAdditionalForm => ({
    permitHolder: sanitizeString(item?.permitHolderName),
    eccNumber: sanitizeString(item?.eccNumber),
    dateOfIssuance: sanitizeString(item?.dateOfIssuance),
  });
  return {
    primary: {
      ...defaultEccInfo,
      isNA: false,
      permitHolder: sanitizeString(first?.permitHolderName),
      eccNumber: sanitizeString(first?.eccNumber),
      dateOfIssuance: sanitizeString(first?.dateOfIssuance),
    },
    additional: rest.map(convert),
  };
};

const mapIsagEntriesToForm = (entries?: any[], projectName?: string) => {
  if (!Array.isArray(entries) || entries.length === 0) {
    return {
      primary: { ...defaultIsagInfo, isNA: true },
      additional: [] as ISAGAdditionalForm[],
    };
  }
  const [first, ...rest] = entries;
  const convert = (item: any): ISAGAdditionalForm => ({
    permitHolder: sanitizeString(item?.permitHolderName),
    isagNumber: sanitizeString(item?.isagPermitNumber),
    dateOfIssuance: sanitizeString(item?.dateOfIssuance),
  });
  return {
    primary: {
      ...defaultIsagInfo,
      isNA: false,
      permitHolder: sanitizeString(first?.permitHolderName),
      isagNumber: sanitizeString(first?.isagPermitNumber),
      dateOfIssuance: sanitizeString(first?.dateOfIssuance),
      currentName: sanitizeString(projectName),
    },
    additional: rest.map(convert),
  };
};

const mapEpepEntriesToForm = (entries?: any[]) => {
  if (!Array.isArray(entries) || entries.length === 0) {
    return {
      primary: { ...defaultEpepInfo, isNA: true },
      additional: [] as EpepAdditionalForm[],
    };
  }
  const [first, ...rest] = entries;
  const convert = (item: any): EpepAdditionalForm => ({
    permitHolder: sanitizeString(item?.permitHolderName),
    epepNumber: sanitizeString(item?.epepNumber),
    dateOfApproval: sanitizeString(item?.dateOfApproval),
  });
  return {
    primary: {
      ...defaultEpepInfo,
      isNA: false,
      permitHolder: sanitizeString(first?.permitHolderName),
      epepNumber: sanitizeString(first?.epepNumber),
      dateOfApproval: sanitizeString(first?.dateOfApproval),
    },
    additional: rest.map(convert),
  };
};

const mapFundEntriesToForm = (entries?: any[]) => {
  if (!Array.isArray(entries) || entries.length === 0) {
    return {
      primary: { ...defaultFundInfo, isNA: true },
      additional: [] as FundAdditionalForm[],
    };
  }
  const [first, ...rest] = entries;
  const convert = (item: any): FundAdditionalForm => ({
    permitHolder: sanitizeString(item?.permitHolderName),
    savingsAccount: sanitizeString(item?.savingsAccountNumber),
    amountDeposited: sanitizeString(item?.amountDeposited),
    dateUpdated: sanitizeString(item?.dateUpdated),
  });
  return {
    primary: {
      ...defaultFundInfo,
      isNA: false,
      permitHolder: sanitizeString(first?.permitHolderName),
      savingsAccount: sanitizeString(first?.savingsAccountNumber),
      amountDeposited: sanitizeString(first?.amountDeposited),
      dateUpdated: sanitizeString(first?.dateUpdated),
    },
    additional: rest.map(convert),
  };
};

const buildLocationString = (info: GeneralInfo) =>
  [info.location, info.municipality, info.province, info.region]
    .map(sanitizeString)
    .filter((part) => part.length > 0)
    .join(", ");

const buildCoordinatesString = (info: ISAGInfo) => {
  const x = sanitizeString(info.gpsX);
  const y = sanitizeString(info.gpsY);
  if (!x && !y) return "";
  if (x && y) return `X: ${x}, Y: ${y}`;
  if (x) return `X: ${x}`;
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
  assign("executiveSummaryOfCompliance");
  assign("processDocumentationOfActivitiesUndertaken");
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
  if (quarter) {
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
  Object.keys(currentRecommendations).forEach((key) => {
    const section = currentRecommendations[key];
    if (section && !section.isNA && section.items && section.items.length > 0) {
      transformed[key] = section.items;
    }
  });
  const hasData = Object.keys(transformed).some(
    (key) => key !== "quarter" && key !== "year"
  );
  return hasData ? transformed : undefined;
};

const transformExecutiveSummaryForPayload = (raw: any) => {
  if (!raw) return undefined;
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

const parseFirstNumber = (val?: string): number => {
  if (!val) return 0;
  const m = String(val).match(/-?\d*\.?\d+/);
  return m ? parseFloat(m[0]) : 0;
};

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

  // Preserve uploaded images metadata
  const uploadedImages =
    raw && typeof raw.uploadedImages === "object"
      ? Object.entries(raw.uploadedImages as Record<string, unknown>).reduce(
          (acc: Record<string, string>, [key, value]) => {
            const cleanKey = String(key).trim();
            if (!cleanKey || typeof value !== "string") return acc;
            const cleanValue = value.trim();
            if (cleanValue) {
              acc[cleanKey] = cleanValue;
            }
            return acc;
          },
          {}
        )
      : {};

  return {
    parameters,
    otherComponents,
    uploadedImages: Object.keys(uploadedImages).length
      ? uploadedImages
      : undefined,
  };
};

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

const hasAirParameterValues = (param: AirParameterData) => {
  const fields: Array<keyof AirParameterData> = [
    "parameter",
    "currentSMR",
    "previousSMR",
    "currentMMT",
    "previousMMT",
    "thirdPartyTesting",
    "eqplRedFlag",
    "action",
    "limitPM25",
    "remarks",
  ];
  return fields.some((key) =>
    sanitizeString((param as Record<string, string | undefined>)[key]).trim()
  );
};

const transformAirQualityForPayload = (raw: any) => {
  if (!raw) return undefined;

  // NEW STRUCTURE: Check if we have location-based data (quarryData, plantData, etc.)
  const hasNewStructure =
    raw.quarryData || raw.plantData || raw.portData || raw.quarryPlantData;

  if (hasNewStructure) {
    // Transform new location-based structure
    const result: any = {};

    const transformLocationData = (locationData: any) => {
      if (!locationData) return null;

      const mergeRemarks = (param: any) => {
        const remarks = sanitizeString(param?.remarks);
        const thirdParty = sanitizeString(param?.thirdPartyTesting);
        if (!thirdParty) {
          return remarks;
        }
        const thirdPartyNote = `Third Party Testing: ${thirdParty}`;
        return remarks ? `${remarks} | ${thirdPartyNote}` : thirdPartyNote;
      };

      // Helper to map a single parameter
      const mapParameter = (param: any) => ({
        name: sanitizeString(param?.parameter),
        results: {
          inSMR: {
            current: sanitizeString(param?.currentSMR),
            previous: sanitizeString(param?.previousSMR),
          },
          mmtConfirmatorySampling: {
            current: sanitizeString(param?.currentMMT),
            previous: sanitizeString(param?.previousMMT),
          },
        },
        eqpl: {
          redFlag: sanitizeString(param?.eqplRedFlag),
          action: sanitizeString(param?.action),
          limit: sanitizeString(param?.limitPM25),
        },
        remarks: mergeRemarks(param),
      });

      // Build main parameter
      const mainParameter = {
        parameter: sanitizeString(locationData?.parameter),
        currentSMR: sanitizeString(locationData?.currentSMR),
        previousSMR: sanitizeString(locationData?.previousSMR),
        currentMMT: sanitizeString(locationData?.currentMMT),
        previousMMT: sanitizeString(locationData?.previousMMT),
        thirdPartyTesting: sanitizeString(locationData?.thirdPartyTesting),
        eqplRedFlag: sanitizeString(locationData?.eqplRedFlag),
        action: sanitizeString(locationData?.action),
        limitPM25: sanitizeString(locationData?.limitPM25),
        remarks: sanitizeString(locationData?.remarks),
      };

      // Gather all parameters (main + additional)
      const allParameters = [];
      if (mainParameter.parameter) {
        allParameters.push(mapParameter(mainParameter));
      }
      if (Array.isArray(locationData.parameters)) {
        locationData.parameters.forEach((param: any) => {
          if (param.parameter) {
            allParameters.push(mapParameter(param));
          }
        });
      }

      return {
        locationDescription: sanitizeString(locationData.locationInput),
        parameters: allParameters,
        samplingDate: sanitizeString(locationData?.dateTime),
        weatherAndWind: sanitizeString(locationData?.weatherWind),
        explanationForConfirmatorySampling: sanitizeString(
          locationData?.explanation
        ),
        overallAssessment: sanitizeString(locationData?.overallCompliance),
      };
    };

    // Transform each location
    if (raw.quarryData) {
      const transformed = transformLocationData(raw.quarryData);
      if (transformed) result.quarry = transformed;
    }
    if (raw.plantData) {
      const transformed = transformLocationData(raw.plantData);
      if (transformed) result.plant = transformed;
    }
    if (raw.portData) {
      const transformed = transformLocationData(raw.portData);
      if (transformed) result.port = transformed;
    }
    if (raw.quarryPlantData) {
      const transformed = transformLocationData(raw.quarryPlantData);
      if (transformed) result.quarryAndPlant = transformed;
    }

    return Object.keys(result).length > 0 ? result : undefined;
  }

  // LEGACY STRUCTURE: Old format with data object - NO LONGER SUPPORTED
  // Return undefined to prevent invalid data structure from being sent
  console.warn(
    "Legacy air quality format detected but not supported. Please use location-based structure (quarryData, plantData, portData)."
  );
  return undefined;
};

const transformWaterQualityForPayload = (raw: any) => {
  if (!raw) return undefined;

  const hasLocationStructure =
    raw.quarryData ||
    raw.plantData ||
    raw.quarryPlantData ||
    (Array.isArray(raw.ports) && raw.ports.some((port: any) => port));

  if (hasLocationStructure) {
    const orFallback = (value: any, fallback: any) => {
      if (value === undefined || value === null || value === "") {
        return fallback;
      }
      return value;
    };

    const mapLocationParam = (param: any, fallback: any) => {
      const resolvedParameter = sanitizeString(
        orFallback(param?.parameter, fallback?.parameter)
      );
      if (!resolvedParameter.trim()) {
        return null;
      }
      const resolvedResultType = sanitizeString(
        orFallback(param?.resultType, fallback?.resultType)
      );
      const currentTss = sanitizeString(
        orFallback(param?.tssCurrent, fallback?.tssCurrent)
      );
      const previousTss = sanitizeString(
        orFallback(param?.tssPrevious, fallback?.tssPrevious)
      );
      return {
        name: resolvedParameter,
        result: {
          internalMonitoring: {
            month: resolvedResultType,
            readings: [
              {
                label: resolvedParameter,
                current_mgL: parseFirstNumber(currentTss),
                previous_mgL: parseFirstNumber(previousTss),
              },
            ],
          },
          mmtConfirmatorySampling: {
            current: sanitizeString(
              orFallback(param?.mmtCurrent, fallback?.mmtCurrent)
            ),
            previous: sanitizeString(
              orFallback(param?.mmtPrevious, fallback?.mmtPrevious)
            ),
          },
        },
        denrStandard: {
          redFlag: sanitizeString(
            orFallback(param?.eqplRedFlag, fallback?.eqplRedFlag)
          ),
          action: sanitizeString(orFallback(param?.action, fallback?.action)),
          limit_mgL: parseFirstNumber(
            sanitizeString(orFallback(param?.limit, fallback?.limit))
          ),
        },
        remark: sanitizeString(orFallback(param?.remarks, fallback?.remarks)),
      };
    };

    const mapLocationData = (locationData: any) => {
      if (!locationData || typeof locationData !== "object") {
        return null;
      }
      const mainParam = mapLocationParam(locationData, locationData);
      const extraParams = Array.isArray(locationData.parameters)
        ? locationData.parameters
            .map((param: any) => mapLocationParam(param, locationData))
            .filter((param): param is NonNullable<typeof param> => !!param)
        : [];
      const parameters = [...(mainParam ? [mainParam] : []), ...extraParams];
      if (!parameters.length) {
        return null;
      }
      return {
        locationDescription: sanitizeString(locationData.locationInput),
        parameters,
        samplingDate: sanitizeString(locationData.dateTime),
        weatherAndWind: sanitizeString(locationData.weatherWind),
        explanationForConfirmatorySampling: sanitizeString(
          locationData.isExplanationNA ? "N/A" : locationData.explanation
        ),
        overallAssessment: sanitizeString(locationData.overallCompliance),
      };
    };

    const mapPortData = (portData: any) => {
      if (!portData || typeof portData !== "object") {
        return null;
      }
      const mainParam = mapLocationParam(portData, portData);
      const extraParams = Array.isArray(portData.additionalParameters)
        ? portData.additionalParameters
            .map((param: any) => mapLocationParam(param, portData))
            .filter((param): param is NonNullable<typeof param> => !!param)
        : [];
      const parameters = [...(mainParam ? [mainParam] : []), ...extraParams];
      if (!parameters.length) {
        return null;
      }
      return {
        locationDescription: sanitizeString(
          portData.portName ?? portData.locationInput
        ),
        parameters,
        samplingDate: sanitizeString(portData.dateTime),
        weatherAndWind: sanitizeString(portData.weatherWind),
        explanationForConfirmatorySampling: sanitizeString(
          portData.isExplanationNA ? "N/A" : portData.explanation
        ),
        overallAssessment: sanitizeString(
          portData.overallCompliance ?? raw?.data?.overallCompliance
        ),
      };
    };

    const result: any = {};
    if (raw.quarryData) {
      const quarry = mapLocationData(raw.quarryData);
      if (quarry) {
        result.quarry = quarry;
      }
    }
    if (raw.plantData) {
      const plant = mapLocationData(raw.plantData);
      if (plant) {
        result.plant = plant;
      }
    }
    if (raw.quarryPlantData) {
      const quarryPlant = mapLocationData(raw.quarryPlantData);
      if (quarryPlant) {
        result.quarryAndPlant = quarryPlant;
      }
    }
    if (Array.isArray(raw.ports) && raw.ports.length) {
      raw.ports.forEach((portData: any) => {
        const port = mapPortData(portData);
        if (port) {
          result.port = port;
        }
      });
    }

    return Object.keys(result).length > 0 ? result : undefined;
  }

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

  const result: any = {};

  if (sel.quarry && d?.quarryInput) {
    const mainParam = makeParam(d);
    const extraParams = params.map(makeParam);
    result.quarry = {
      locationDescription: String(d?.quarryInput ?? ""),
      parameters: [mainParam, ...extraParams].filter((p) => p.name),
      samplingDate: String(d?.dateTime ?? ""),
      weatherAndWind: String(d?.weatherWind ?? ""),
      explanationForConfirmatorySampling: String(d?.explanation ?? ""),
      overallAssessment: String(d?.overallCompliance ?? ""),
    };
  }

  if (sel.plant && d?.plantInput) {
    const mainParam = makeParam(d);
    const extraParams = params.map(makeParam);
    result.plant = {
      locationDescription: String(d?.plantInput ?? ""),
      parameters: [mainParam, ...extraParams].filter((p) => p.name),
      samplingDate: String(d?.dateTime ?? ""),
      weatherAndWind: String(d?.weatherWind ?? ""),
      explanationForConfirmatorySampling: String(d?.explanation ?? ""),
      overallAssessment: String(d?.overallCompliance ?? ""),
    };
  }

  if (sel.quarryPlant && d?.quarryPlantInput) {
    const mainParam = makeParam(d);
    const extraParams = params.map(makeParam);
    result.quarryAndPlant = {
      locationDescription: String(d?.quarryPlantInput ?? ""),
      parameters: [mainParam, ...extraParams].filter((p) => p.name),
      samplingDate: String(d?.dateTime ?? ""),
      weatherAndWind: String(d?.weatherWind ?? ""),
      explanationForConfirmatorySampling: String(d?.explanation ?? ""),
      overallAssessment: String(d?.overallCompliance ?? ""),
    };
  }

  if (ports?.length) {
    ports.forEach((port: any) => {
      const portMainParam = makeParam(port);
      const portExtraParams = Array.isArray(port.additionalParameters)
        ? port.additionalParameters.map(makeParam)
        : [];

      result.port = {
        locationDescription: String(
          port?.portName ?? port?.locationInput ?? d?.port ?? ""
        ),
        parameters: [portMainParam, ...portExtraParams].filter((p) => p.name),
        samplingDate: String(port?.dateTime ?? d?.dateTime ?? ""),
        weatherAndWind: String(port?.weatherWind ?? d?.weatherWind ?? ""),
        explanationForConfirmatorySampling: String(
          port?.explanation ?? d?.explanation ?? ""
        ),
        overallAssessment: String(
          port?.overallCompliance ?? d?.overallCompliance ?? ""
        ),
      };
    });
  }

  return Object.keys(result).length > 0 ? result : undefined;
};

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

  // Preserve uploaded files metadata
  const uploadedFiles = (
    Array.isArray(raw?.uploadedFiles) ? raw.uploadedFiles : []
  )
    .map((file: any) => {
      const storagePath =
        typeof file?.storagePath === "string"
          ? file.storagePath.trim()
          : undefined;
      const uri = typeof file?.uri === "string" ? file.uri.trim() : undefined;
      if (!storagePath && !uri) return null;

      const name =
        typeof file?.name === "string" && file.name.trim()
          ? file.name.trim()
          : storagePath?.split("/").pop();

      const size =
        typeof file?.size === "number"
          ? file.size
          : Number.isFinite(Number(file?.size))
            ? Number(file.size)
            : undefined;

      const mimeType =
        typeof file?.mimeType === "string" && file.mimeType.trim()
          ? file.mimeType.trim()
          : undefined;

      return { uri, name, size, mimeType, storagePath };
    })
    .filter(Boolean);

  return {
    parameters: parameters.length ? parameters : undefined,
    samplingDate: String(raw?.dateTime ?? ""),
    weatherAndWind: String(raw?.weatherWind ?? ""),
    explanationForConfirmatorySampling: String(raw?.explanation ?? ""),
    overallAssessment: Object.keys(overallAssessment).length
      ? overallAssessment
      : undefined,
    uploadedFiles: uploadedFiles.length ? uploadedFiles : undefined,
  };
};

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

const transformChemicalSafetyForPayload = (raw: any) => {
  if (!raw) return undefined;
  const cs = raw.chemicalSafety || {};
  const yn = (v: any) => String(v).toUpperCase() === "YES";
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

const transformComplaintsForPayload = (raw: any) => {
  if (!Array.isArray(raw)) return undefined;
  const cleaned = raw
    .filter((c) => !c?.isNA)
    .map((c) => ({
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

const createHydrationId = (() => {
  let counter = 0;
  return (prefix: string, index?: number) => {
    counter += 1;
    const randomPart = Math.random().toString(36).slice(2, 8);
    if (typeof index === "number") {
      return `${prefix}-${index}-${counter}-${randomPart}`;
    }
    return `${prefix}-${counter}-${randomPart}`;
  };
})();

const normalizeLabelKey = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

const COMPLIANCE_FORM_FIELD_DEFS = [
  { key: "projectLocation", label: "Project Location" },
  { key: "projectArea", label: "Project Area (ha)" },
  { key: "capitalCost", label: "Capital Cost (Php)" },
  { key: "typeOfMinerals", label: "Type of Minerals" },
  { key: "miningMethod", label: "Mining Method" },
  { key: "production", label: "Production" },
  { key: "mineLife", label: "Mine Life" },
  { key: "mineralReserves", label: "Mineral Reserves/ Resources" },
  { key: "accessTransportation", label: "Access/ Transportation" },
  { key: "powerSupply", label: "Power Supply", subFields: ["Plant", "Port"] },
  {
    key: "miningEquipment",
    label: "Mining Equipment",
    subFields: ["Quarry/Plant", "Port"],
  },
  {
    key: "workForce",
    label: "Work Force",
    subFields: ["Employees"],
  },
  {
    key: "developmentSchedule",
    label: "Development/ Utilization Schedule",
  },
] as const;

const buildDefaultComplianceFormData = (): FormData => {
  const base: Partial<FormData> = {};
  COMPLIANCE_FORM_FIELD_DEFS.forEach((def) => {
    (base as Record<string, any>)[def.key] = {
      label: def.label,
      specification: "",
      remarks: "",
      withinSpecs: null,
      ...(def.subFields
        ? {
            subFields: def.subFields.map((label) => ({
              label: `${label}:`,
              specification: "",
            })),
          }
        : {}),
    };
  });
  return base as FormData;
};

const isExecutiveSummaryFrontEndShape = (raw: any): raw is ExecutiveSummary => {
  return (
    raw &&
    typeof raw === "object" &&
    raw.epepCompliance &&
    typeof raw.epepCompliance === "object" &&
    Object.prototype.hasOwnProperty.call(raw, "sdmpCompliance")
  );
};

const normalizeExecutiveSummaryFromApi = (
  raw: any
): ExecutiveSummary | undefined => {
  if (!raw || typeof raw !== "object") {
    return undefined;
  }
  if (isExecutiveSummaryFrontEndShape(raw)) {
    return raw;
  }
  const epep = raw.complianceWithEpepCommitments || raw.epepCompliance || {};
  const sdmp = raw.complianceWithSdmpCommitments || raw.sdmp || {};
  const complaints = raw.complaintsManagement || {};
  const accountability = raw.accountability || {};
  const others = raw.others || {};
  const sdmpCompliance = sdmp.complied
    ? "complied"
    : sdmp.notComplied
      ? "not-complied"
      : "";
  const accountabilityStatus = accountability.complied
    ? "complied"
    : accountability.notComplied
      ? "not-complied"
      : "";
  return {
    epepCompliance: {
      safety: !!epep.safety,
      social: !!epep.social,
      rehabilitation: !!epep.rehabilitation,
    },
    epepRemarks: sanitizeString(epep.remarks),
    sdmpCompliance,
    sdmpRemarks: sanitizeString(sdmp.remarks),
    complaintsManagement: {
      naForAll: !!complaints.naForAll,
      complaintReceiving: !!(
        complaints.complaintReceiving ?? complaints.complaintReceivingSetup
      ),
      caseInvestigation: !!complaints.caseInvestigation,
      implementationControl: !!(
        complaints.implementationControl ?? complaints.implementationOfControl
      ),
      communicationComplainant: !!(
        complaints.communicationComplainant ??
        complaints.communicationWithComplainantOrPublic
      ),
      complaintDocumentation: !!complaints.complaintDocumentation,
    },
    complaintsRemarks: sanitizeString(complaints.remarks),
    accountability: accountabilityStatus,
    accountabilityRemarks: sanitizeString(accountability.remarks),
    othersSpecify: sanitizeString(others.specify),
    othersNA: !!(others.na ?? others.isNA),
  };
};

type ProcessDocSnapshot = ProcessDocumentation & {
  eccMmtAdditional: string[];
  epepMmtAdditional: string[];
  ocularMmtAdditional: string[];
};

const isProcessDocFrontEndShape = (raw: any): raw is ProcessDocSnapshot => {
  return (
    raw &&
    typeof raw === "object" &&
    Object.prototype.hasOwnProperty.call(raw, "eccMmtMembers") &&
    (Array.isArray(raw.eccMmtAdditional) || raw.eccMmtAdditional === undefined)
  );
};

const normalizeProcessDocumentationFromApi = (
  raw: any
): ProcessDocSnapshot | undefined => {
  if (!raw || typeof raw !== "object") {
    return undefined;
  }
  if (isProcessDocFrontEndShape(raw)) {
    return {
      ...raw,
      eccMmtAdditional: raw.eccMmtAdditional ?? [],
      epepMmtAdditional: raw.epepMmtAdditional ?? [],
      ocularMmtAdditional: raw.ocularMmtAdditional ?? [],
    };
  }
  const activities = raw.activities || {};
  const parseMembers = (value: any): string[] =>
    Array.isArray(value)
      ? value.map((entry) => sanitizeString(entry)).filter(Boolean)
      : [];
  const splitMembers = (value: any) => {
    const list = parseMembers(value);
    const [primary, ...additional] = list;
    return {
      primary: primary ?? "",
      additional,
    };
  };
  const eccMembers = splitMembers(
    activities.complianceWithEccConditionsCommitments?.mmtMembersInvolved
  );
  const epepMembers = splitMembers(
    activities.complianceWithEpepAepepConditions?.mmtMembersInvolved
  );
  const ocularMembers = splitMembers(
    activities.siteOcularValidation?.mmtMembersInvolved
  );
  const sampling = activities.siteValidationConfirmatorySampling || {};
  const siteValidationApplicable = sampling.applicable
    ? "applicable"
    : sampling.none
      ? "none"
      : "";
  const samplingMembers = parseMembers(sampling.mmtMembersInvolved).join(", ");
  return {
    dateConducted: sanitizeString(raw.dateConducted),
    sameDateForAll: !!(raw.sameDateForAll ?? raw.sameDateForAllActivities),
    eccMmtMembers: eccMembers.primary,
    eccMmtAdditional: eccMembers.additional,
    epepMmtMembers: epepMembers.primary,
    epepMmtAdditional: epepMembers.additional,
    ocularMmtMembers: ocularMembers.primary,
    ocularMmtAdditional: ocularMembers.additional,
    ocularNA: !!raw.ocularNA,
    methodologyRemarks: sanitizeString(
      raw.mergedMethodologyOrOtherRemarks ?? raw.methodologyRemarks
    ),
    siteValidationApplicable,
    samplingDateConducted: sanitizeString(sampling.dateConducted),
    samplingMmtMembers: samplingMembers,
    samplingMethodologyRemarks: sanitizeString(sampling.remarks),
  };
};

const normalizeProjectLocationFromApi = (
  raw: any
):
  | {
      formData: FormData;
      otherComponents: OtherComponent[];
      uploadedImages: Record<string, string>;
    }
  | undefined => {
  if (!raw || typeof raw !== "object") {
    return undefined;
  }
  if (raw.formData) {
    return {
      formData: raw.formData,
      otherComponents: Array.isArray(raw.otherComponents)
        ? raw.otherComponents
        : [],
      uploadedImages: raw.uploadedImages ?? {},
    };
  }
  const formData = buildDefaultComplianceFormData();
  const parameters = Array.isArray(raw.parameters) ? raw.parameters : [];
  parameters.forEach((param: any) => {
    const nameKey = normalizeLabelKey(
      sanitizeString(param?.name ?? param?.label ?? "")
    );
    const definition = COMPLIANCE_FORM_FIELD_DEFS.find(
      (def) => normalizeLabelKey(def.label) === nameKey
    );
    if (!definition) {
      return;
    }
    const field = (formData as Record<string, any>)[definition.key];
    if (!field) {
      return;
    }
    const specificationSource = param?.specification;
    if (specificationSource && typeof specificationSource === "object") {
      field.specification = sanitizeString(
        specificationSource.main ??
          specificationSource.Main ??
          specificationSource.default ??
          specificationSource.specification
      );
      if (definition.subFields && field.subFields) {
        field.subFields = field.subFields.map((subField: any) => {
          const key = subField.label.replace(/:$/, "");
          const match =
            specificationSource[key] ??
            specificationSource[key.toLowerCase()] ??
            specificationSource[key.replace(/[^a-z0-9]/gi, "")];
          return {
            ...subField,
            specification: sanitizeString(match),
          };
        });
      }
    } else if (specificationSource != null) {
      field.specification = sanitizeString(specificationSource);
    }
    field.remarks = sanitizeString(param?.remarks);
    field.withinSpecs =
      typeof param?.withinSpecs === "boolean" ? param.withinSpecs : null;
  });
  const otherComponents = Array.isArray(raw.otherComponents)
    ? raw.otherComponents.map((item: any, index: number) => ({
        specification: sanitizeString(
          item?.specification ?? item?.name ?? `Other Component ${index + 1}`
        ),
        remarks: sanitizeString(item?.remarks),
        withinSpecs:
          typeof item?.withinSpecs === "boolean" ? item.withinSpecs : null,
      }))
    : [];
  return {
    formData,
    otherComponents,
    uploadedImages: raw.uploadedImages ?? {},
  };
};

const toEiaYesNo = (value: any): EiaYesNoNull => {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "yes" || normalized === "complied") {
      return "yes";
    }
    if (normalized === "no" || normalized === "not complied") {
      return "no";
    }
  }
  if (value === true) {
    return "yes";
  }
  if (value === false) {
    return "no";
  }
  return null;
};

const createEmptyMitigatingMeasure = (
  prefix: string,
  index: number
): MitigatingMeasure => ({
  id: createHydrationId(prefix, index),
  planned: "",
  actualObservation: "",
  isEffective: null,
  recommendations: "",
});

const mapCommitments = (
  section: any,
  prefix: string,
  fallbackTitle: string
): OperationSection => {
  const title = sanitizeString(section?.areaName) || fallbackTitle;
  const commitments = Array.isArray(section?.commitments)
    ? section.commitments
    : [];
  const measures =
    commitments.length > 0
      ? commitments.map((item: any, index: number) => ({
          id: item?.id || createHydrationId(`${prefix}-measure`, index),
          planned: sanitizeString(item?.plannedMeasure),
          actualObservation: sanitizeString(item?.actualObservation),
          isEffective: toEiaYesNo(item?.isEffective),
          recommendations: sanitizeString(item?.recommendations),
        }))
      : [createEmptyMitigatingMeasure(`${prefix}-measure`, 0)];
  return {
    title,
    isNA: commitments.length === 0,
    measures,
  };
};

const normalizeImpactCommitmentsFromApi = (
  raw: any
):
  | {
      preConstruction: EiaYesNoNull;
      construction: EiaYesNoNull;
      quarryOperation: OperationSection;
      plantOperation: OperationSection;
      portOperation: OperationSection;
      overallCompliance: string;
    }
  | undefined => {
  if (!raw || typeof raw !== "object") {
    return undefined;
  }
  if (
    Object.prototype.hasOwnProperty.call(raw, "quarryOperation") &&
    Object.prototype.hasOwnProperty.call(raw, "preConstruction")
  ) {
    return raw;
  }
  const constructionInfo = Array.isArray(raw.constructionInfo)
    ? raw.constructionInfo
    : [];
  const preConstructionInfo = constructionInfo.find((section: any) =>
    String(section?.areaName || "")
      .toLowerCase()
      .includes("pre")
  );
  const constructionInfoEntry = constructionInfo.find((section: any) =>
    String(section?.areaName || "")
      .toLowerCase()
      .includes("construction")
  );
  const preConstructionCommitment = preConstructionInfo?.commitments?.[0];
  const constructionCommitment = constructionInfoEntry?.commitments?.[0];
  const implementationSections = Array.isArray(
    raw.implementationOfEnvironmentalImpactControlStrategies
  )
    ? raw.implementationOfEnvironmentalImpactControlStrategies
    : [];
  const [quarrySectionRaw, plantSectionRaw, portSectionRaw] =
    implementationSections;
  const quarryOperation = mapCommitments(
    quarrySectionRaw,
    "quarry",
    "Quarry Operation"
  );
  const plantOperation = mapCommitments(
    plantSectionRaw,
    "plant",
    "Plant Operation"
  );
  const portOperation = mapCommitments(
    portSectionRaw,
    "port",
    "Port Operation"
  );
  return {
    preConstruction: toEiaYesNo(preConstructionCommitment?.isEffective),
    construction: toEiaYesNo(constructionCommitment?.isEffective),
    quarryOperation,
    plantOperation,
    portOperation,
    overallCompliance: sanitizeString(raw.overallComplianceAssessment),
  };
};

const createEmptyAirParameter = (
  prefix: string,
  index: number
): AirParameterData => ({
  id: createHydrationId(prefix, index),
  parameter: "",
  currentSMR: "",
  previousSMR: "",
  currentMMT: "",
  previousMMT: "",
  thirdPartyTesting: "",
  eqplRedFlag: "",
  action: "",
  limitPM25: "",
  remarks: "",
});

const createEmptyAirComplianceData = (): AirComplianceData => ({
  eccConditions: "",
  quarry: "",
  plant: "",
  port: "",
  quarryPlant: "",
  parameter: "",
  currentSMR: "",
  previousSMR: "",
  currentMMT: "",
  previousMMT: "",
  thirdPartyTesting: "",
  eqplRedFlag: "",
  action: "",
  limitPM25: "",
  remarks: "",
  parameters: [],
  dateTime: "",
  weatherWind: "",
  explanation: "",
  overallCompliance: "",
});

const normalizeFileLikeFromApi = (file: any) => {
  if (!file) {
    return null;
  }
  if (typeof file === "string") {
    const name = file.split("/").pop() || file;
    return { name, uri: file };
  }
  if (typeof file === "object") {
    const cloned: any = { ...file };
    if (!cloned.name && typeof cloned.uri === "string") {
      cloned.name = cloned.uri.split("/").pop() || "document";
    }
    return cloned;
  }
  return null;
};

const mapAirParameterFromApi = (
  source: any,
  prefix: string,
  index: number
): AirParameterData => {
  const entry = createEmptyAirParameter(prefix, index);
  entry.id = source?.id ?? entry.id;
  entry.parameter = sanitizeString(source?.name ?? source?.parameter);
  entry.currentSMR = sanitizeString(
    source?.results?.inSMR?.current ?? source?.currentSMR
  );
  entry.previousSMR = sanitizeString(
    source?.results?.inSMR?.previous ?? source?.previousSMR
  );
  entry.currentMMT = sanitizeString(
    source?.results?.mmtConfirmatorySampling?.current ?? source?.currentMMT
  );
  entry.previousMMT = sanitizeString(
    source?.results?.mmtConfirmatorySampling?.previous ?? source?.previousMMT
  );
  entry.thirdPartyTesting = sanitizeString(
    source?.results?.thirdPartyTesting ??
      source?.thirdPartyTesting ??
      source?.thirdParty
  );
  entry.eqplRedFlag = sanitizeString(
    source?.eqpl?.redFlag ?? source?.eqplRedFlag
  );
  entry.action = sanitizeString(source?.eqpl?.action ?? source?.action);
  const limitSource =
    source?.eqpl?.limit ??
    source?.eqpl?.limit_mgL ??
    source?.eqplLimit ??
    source?.limitPM25 ??
    source?.limit;
  entry.limitPM25 = sanitizeString(
    typeof limitSource === "number" ? limitSource.toString() : limitSource
  );
  entry.remarks = sanitizeString(source?.remarks);
  return entry;
};

const normalizeAirQualityFromApi = (
  raw: any
):
  | {
      selectedLocations: {
        quarry: boolean;
        plant: boolean;
        port: boolean;
        quarryPlant: boolean;
      };
      data: AirComplianceData;
      uploadedEccFile?: any;
      uploadedImage?: string | null;
    }
  | undefined => {
  if (!raw || typeof raw !== "object") {
    return undefined;
  }
  if (raw.data && typeof raw.data === "object") {
    const normalizedParams = Array.isArray(raw.data.parameters)
      ? raw.data.parameters.map((param: any, index: number) => {
          const mapped = mapAirParameterFromApi(param, "air-extra", index);
          mapped.id = param?.id ?? mapped.id;
          return mapped;
        })
      : [];
    const normalizedData: AirComplianceData = {
      ...createEmptyAirComplianceData(),
      ...raw.data,
      parameters: normalizedParams,
    };
    if (!normalizedData.eccConditions) {
      const inferredName = normalizeFileLikeFromApi(raw.uploadedEccFile)?.name;
      normalizedData.eccConditions = inferredName ? inferredName : "";
    }
    const derivedSelected = {
      quarry: !!sanitizeString(normalizedData.quarry),
      plant: !!sanitizeString(normalizedData.plant),
      port: !!sanitizeString(normalizedData.port),
      quarryPlant: !!sanitizeString(normalizedData.quarryPlant),
    };
    const explicitSelected =
      raw.selectedLocations && typeof raw.selectedLocations === "object"
        ? {
            quarry: !!raw.selectedLocations.quarry,
            plant: !!raw.selectedLocations.plant,
            port: !!raw.selectedLocations.port,
            quarryPlant: !!raw.selectedLocations.quarryPlant,
          }
        : derivedSelected;
    return {
      selectedLocations: explicitSelected,
      data: normalizedData,
      uploadedEccFile: normalizeFileLikeFromApi(raw.uploadedEccFile),
      uploadedImage:
        typeof raw.uploadedImage === "string"
          ? raw.uploadedImage
          : (raw.uploadedImage?.uri ?? null),
    };
  }
  const data = createEmptyAirComplianceData();
  const parameters = Array.isArray(raw.parameters) ? raw.parameters : [];
  if (parameters.length > 0) {
    const mappedMain = mapAirParameterFromApi(parameters[0], "air-main", 0);
    data.parameter = mappedMain.parameter;
    data.currentSMR = mappedMain.currentSMR;
    data.previousSMR = mappedMain.previousSMR;
    data.currentMMT = mappedMain.currentMMT;
    data.previousMMT = mappedMain.previousMMT;
    data.thirdPartyTesting = mappedMain.thirdPartyTesting;
    data.eqplRedFlag = mappedMain.eqplRedFlag;
    data.action = mappedMain.action;
    data.limitPM25 = mappedMain.limitPM25;
    data.remarks = mappedMain.remarks;
  }
  data.parameters = parameters.slice(1).map((param: any, index: number) => {
    const converted = mapAirParameterFromApi(param, "air-extra", index);
    return converted;
  });
  data.quarry = sanitizeString(raw.quarry);
  data.plant = sanitizeString(raw.plant);
  data.port = sanitizeString(raw.port);
  data.quarryPlant = sanitizeString(raw.quarryPlant);
  data.dateTime = sanitizeString(raw.samplingDate);
  data.weatherWind = sanitizeString(raw.weatherAndWind);
  data.explanation = sanitizeString(raw.explanationForConfirmatorySampling);
  data.overallCompliance = sanitizeString(raw.overallAssessment);
  if (!data.eccConditions) {
    const eccSource =
      raw.eccConditions ??
      raw.eccCondition ??
      raw.eccConditionsDocument ??
      normalizeFileLikeFromApi(raw.uploadedEccFile)?.name;
    data.eccConditions = sanitizeString(eccSource);
  }
  return {
    selectedLocations: {
      quarry: !!sanitizeString(raw.quarry),
      plant: !!sanitizeString(raw.plant),
      port: !!sanitizeString(raw.port),
      quarryPlant: !!sanitizeString(raw.quarryPlant),
    },
    data,
    uploadedEccFile: normalizeFileLikeFromApi(raw.uploadedEccFile),
    uploadedImage:
      typeof raw.uploadedImage === "string"
        ? raw.uploadedImage
        : (raw.uploadedImage?.uri ?? null),
  };
};

const createEmptyWaterParameter = (
  prefix: string,
  index: number
): WaterParameter => ({
  id: createHydrationId(prefix, index),
  parameter: "",
  resultType: "Month",
  tssCurrent: "",
  tssPrevious: "",
  eqplRedFlag: "",
  action: "",
  limit: "",
  remarks: "",
  mmtCurrent: "",
  mmtPrevious: "",
  isMMTNA: false,
});

const createEmptyWaterQualityData = (): WaterQualityData => ({
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
});

const convertWaterBackendParam = (
  param: any,
  prefix: string,
  index: number
): WaterParameter => {
  const base = createEmptyWaterParameter(prefix, index);
  base.parameter = sanitizeString(param?.name);
  const month = sanitizeString(param?.result?.internalMonitoring?.month ?? "");
  if (month) {
    base.resultType = month;
  }
  const readings =
    param?.result?.internalMonitoring?.readings &&
    Array.isArray(param.result.internalMonitoring.readings)
      ? param.result.internalMonitoring.readings[0]
      : undefined;
  if (readings) {
    base.tssCurrent =
      readings.current_mgL != null ? String(readings.current_mgL) : "";
    base.tssPrevious =
      readings.previous_mgL != null ? String(readings.previous_mgL) : "";
  }
  base.mmtCurrent = sanitizeString(
    param?.result?.mmtConfirmatorySampling?.current
  );
  base.mmtPrevious = sanitizeString(
    param?.result?.mmtConfirmatorySampling?.previous
  );
  base.eqplRedFlag = sanitizeString(param?.denrStandard?.redFlag);
  base.action = sanitizeString(param?.denrStandard?.action);
  base.limit =
    param?.denrStandard?.limit_mgL != null
      ? String(param.denrStandard.limit_mgL)
      : "";
  base.remarks = sanitizeString(param?.remark);
  return base;
};

const normalizeWaterQualityFromApi = (
  raw: any
):
  | {
      selectedLocations: {
        quarry: boolean;
        plant: boolean;
        quarryPlant: boolean;
      };
      data: WaterQualityData;
      parameters: WaterParameter[];
      ports: WaterPortData[];
    }
  | undefined => {
  if (!raw || typeof raw !== "object") {
    return undefined;
  }

  // If already normalized, return as-is
  if (raw.data && raw.parameters && raw.ports) {
    return raw;
  }

  const data = createEmptyWaterQualityData();
  const extras: WaterParameter[] = [];
  const ports: WaterPortData[] = [];

  // Determine which locations are selected based on new structure
  const selectedLocations = {
    quarry: !!raw.quarry,
    plant: !!raw.plant,
    quarryPlant: !!raw.quarryAndPlant,
  };

  // Helper function to extract parameters from a location object
  const extractLocationData = (location: any) => {
    if (!location || typeof location !== "object") return null;

    const parameters = Array.isArray(location.parameters)
      ? location.parameters
      : [];
    const mappedParams = parameters.map((param: any, index: number) =>
      convertWaterBackendParam(param, "water-location", index)
    );

    return {
      parameters: mappedParams,
      samplingDate: sanitizeString(location.samplingDate),
      weatherAndWind: sanitizeString(location.weatherAndWind),
      explanationForConfirmatorySampling: sanitizeString(
        location.explanationForConfirmatorySampling
      ),
      overallAssessment: sanitizeString(location.overallAssessment),
    };
  };

  // Try to load from quarry first, then plant, then quarryAndPlant
  let primaryLocation = null;
  if (raw.quarry) {
    primaryLocation = extractLocationData(raw.quarry);
    data.quarryInput = "Quarry data present";
  } else if (raw.plant) {
    primaryLocation = extractLocationData(raw.plant);
    data.plantInput = "Plant data present";
  } else if (raw.quarryAndPlant) {
    primaryLocation = extractLocationData(raw.quarryAndPlant);
    data.quarryPlantInput = "Quarry and Plant data present";
  }

  // Populate main data from primary location
  if (primaryLocation) {
    const params = primaryLocation.parameters;
    if (params.length > 0) {
      const main = params[0];
      data.parameter = main.parameter;
      data.resultType = main.resultType;
      data.tssCurrent = main.tssCurrent;
      data.tssPrevious = main.tssPrevious;
      data.mmtCurrent = main.mmtCurrent ?? "";
      data.mmtPrevious = main.mmtPrevious ?? "";
      data.eqplRedFlag = main.eqplRedFlag;
      data.action = main.action;
      data.limit = main.limit;
      data.remarks = main.remarks;

      // Add additional parameters
      params.slice(1).forEach((param: any) => {
        extras.push(param);
      });
    }

    data.dateTime = primaryLocation.samplingDate;
    data.weatherWind = primaryLocation.weatherAndWind;
    data.explanation = primaryLocation.explanationForConfirmatorySampling;
    data.overallCompliance = primaryLocation.overallAssessment;
  }

  // Handle port data
  if (raw.port) {
    const portData = extractLocationData(raw.port);
    if (portData) {
      const portParams = portData.parameters;
      if (portParams.length > 0) {
        const [mainPortParam, ...additionalPortParams] = portParams;
        ports.push({
          id: createHydrationId("port", 0),
          portName: "Port",
          parameter: mainPortParam.parameter,
          resultType: mainPortParam.resultType,
          tssCurrent: mainPortParam.tssCurrent,
          tssPrevious: mainPortParam.tssPrevious,
          mmtCurrent: mainPortParam.mmtCurrent ?? "",
          mmtPrevious: mainPortParam.mmtPrevious ?? "",
          isMMTNA: false,
          eqplRedFlag: mainPortParam.eqplRedFlag,
          action: mainPortParam.action,
          limit: mainPortParam.limit,
          remarks: mainPortParam.remarks,
          dateTime: portData.samplingDate,
          weatherWind: portData.weatherAndWind,
          explanation: portData.explanationForConfirmatorySampling,
          isExplanationNA: !portData.explanationForConfirmatorySampling,
          additionalParameters: additionalPortParams,
        });
      }
    }
  }

  return {
    selectedLocations,
    data,
    parameters: extras,
    ports,
  };
};

const normalizeNoiseQualityFromApi = (raw: any) => {
  if (!raw || typeof raw !== "object") {
    return undefined;
  }
  if (
    Array.isArray(raw.parameters) &&
    raw.parameters.every((param: any) => param?.id)
  ) {
    return raw;
  }
  const parametersSource = Array.isArray(raw.parameters) ? raw.parameters : [];
  const parameters: NoiseParameter[] =
    parametersSource.length > 0
      ? parametersSource.map((param: any, index: number) => ({
          id: param?.id || createHydrationId("noise-param", index),
          parameter: sanitizeString(param?.name ?? param?.parameter),
          isParameterNA: !!param?.isParameterNA,
          currentInSMR: sanitizeString(
            param?.results?.inSMR?.current ?? param?.currentInSMR
          ),
          previousInSMR: sanitizeString(
            param?.results?.inSMR?.previous ?? param?.previousInSMR
          ),
          mmtCurrent: sanitizeString(
            param?.results?.mmtConfirmatorySampling?.current ??
              param?.mmtCurrent
          ),
          mmtPrevious: sanitizeString(
            param?.results?.mmtConfirmatorySampling?.previous ??
              param?.mmtPrevious
          ),
          redFlag: sanitizeString(param?.eqpl?.redFlag ?? param?.redFlag),
          isRedFlagChecked: !!(param?.eqpl?.redFlag ?? param?.isRedFlagChecked),
          action: sanitizeString(param?.eqpl?.action ?? param?.action),
          isActionChecked: !!(param?.eqpl?.action ?? param?.isActionChecked),
          limit: sanitizeString(param?.eqpl?.denrStandard ?? param?.limit),
          isLimitChecked: !!(
            param?.eqpl?.denrStandard ?? param?.isLimitChecked
          ),
        }))
      : [
          {
            id: createHydrationId("noise-param", 0),
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
          },
        ];
  const overall = raw.overallAssessment || {};
  const quarters: QuarterData = {
    first: sanitizeString(overall.firstQuarter?.assessment),
    isFirstChecked: !!overall.firstQuarter?.assessment,
    second: sanitizeString(overall.secondQuarter?.assessment),
    isSecondChecked: !!overall.secondQuarter?.assessment,
    third: sanitizeString(overall.thirdQuarter?.assessment),
    isThirdChecked: !!overall.thirdQuarter?.assessment,
    fourth: sanitizeString(overall.fourthQuarter?.assessment),
    isFourthChecked: !!overall.fourthQuarter?.assessment,
  };
  return {
    hasInternalNoise: !!raw.hasInternalNoise,
    uploadedFiles: Array.isArray(raw.uploadedFiles) ? raw.uploadedFiles : [],
    parameters,
    remarks: sanitizeString(raw.remarks),
    dateTime: sanitizeString(raw.samplingDate ?? raw.dateTime),
    weatherWind: sanitizeString(raw.weatherAndWind),
    explanation: sanitizeString(raw.explanationForConfirmatorySampling),
    explanationNA: !!raw.explanationNA,
    quarters,
  };
};

const createEmptyWasteSection = (prefix: string): PlantPortSectionData => ({
  typeOfWaste: "",
  eccEpepCommitments: [
    {
      id: createHydrationId(`${prefix}-waste`, 0),
      handling: "",
      storage: "",
      disposal: "",
    },
  ],
  isAdequate: null,
  previousRecord: "",
  currentQuarterWaste: "",
});

const normalizeWasteManagementFromApi = (
  raw: any
):
  | {
      selectedQuarter: string;
      quarryData: QuarrySectionData;
      quarryPlantData: PlantPortSectionData;
      plantSimpleData: PlantSectionData;
      plantData: PlantPortSectionData;
      portData: PortSectionData;
      portPlantData: PlantPortSectionData;
    }
  | undefined => {
  if (!raw || typeof raw !== "object") {
    return undefined;
  }
  if (
    raw.quarryData ||
    raw.quarryPlantData ||
    raw.plantData ||
    raw.portPlantData
  ) {
    return {
      selectedQuarter: raw.selectedQuarter ?? "Q2",
      quarryData: raw.quarryData ?? {
        noSignificantImpact: false,
        generateTable: false,
        N_A: false,
      },
      quarryPlantData: raw.quarryPlantData ?? createEmptyWasteSection("quarry"),
      plantSimpleData: raw.plantSimpleData ?? {
        noSignificantImpact: false,
        generateTable: false,
        N_A: false,
      },
      plantData: raw.plantData ?? createEmptyWasteSection("plant"),
      portData: raw.portData ?? {
        noSignificantImpact: false,
        generateTable: false,
        N_A: false,
      },
      portPlantData: raw.portPlantData ?? createEmptyWasteSection("port"),
    };
  }
  const result = {
    selectedQuarter: raw.selectedQuarter ?? "Q2",
    quarryData: {
      noSignificantImpact: false,
      generateTable: false,
      N_A: false,
    },
    quarryPlantData: createEmptyWasteSection("quarry"),
    plantSimpleData: {
      noSignificantImpact: false,
      generateTable: false,
      N_A: false,
    },
    plantData: createEmptyWasteSection("plant"),
    portData: { noSignificantImpact: false, generateTable: false, N_A: false },
    portPlantData: createEmptyWasteSection("port"),
  };
  const assignFlags = (
    source: any,
    target: {
      noSignificantImpact: boolean;
      generateTable: boolean;
      N_A: boolean;
    },
    key: "quarryPlantData" | "plantData" | "portPlantData"
  ) => {
    if (!source) {
      return;
    }
    if (Array.isArray(source)) {
      target.noSignificantImpact = false;
      target.N_A = false;
      target.generateTable = true;
      const sectionTarget = (result as Record<string, PlantPortSectionData>)[
        key
      ];
      if (!sectionTarget) {
        return;
      }
      if (!source.length) {
        return;
      }
      const formatted = source.map((entry: any, index: number) => ({
        id: createHydrationId(`${key}-entry`, index),
        handling: sanitizeString(
          entry?.eccEpepCommitments?.handling ?? entry?.handling
        ),
        storage: sanitizeString(
          entry?.eccEpepCommitments?.storage ?? entry?.storage
        ),
        disposal: sanitizeString(
          entry?.eccEpepCommitments?.disposal == null
            ? ""
            : entry.eccEpepCommitments.disposal
              ? "Yes"
              : "No"
        ),
      }));
      sectionTarget.typeOfWaste = sanitizeString(
        source[0]?.typeOfWaste ?? sectionTarget.typeOfWaste
      );
      const adequate = source[0]?.adequate;
      sectionTarget.isAdequate = adequate?.y
        ? "YES"
        : adequate?.n
          ? "NO"
          : sectionTarget.isAdequate;
      sectionTarget.previousRecord = sanitizeString(
        source[0]?.previousRecord ?? sectionTarget.previousRecord
      );
      sectionTarget.currentQuarterWaste = sanitizeString(
        source[0]?.q2_2025_Generated_HW ??
          source[0]?.currentQuarterWaste ??
          sectionTarget.currentQuarterWaste
      );
      sectionTarget.eccEpepCommitments = formatted;
    } else if (typeof source === "string") {
      const normalized = source.toLowerCase();
      if (normalized.includes("n/a") || normalized === "na") {
        target.N_A = true;
        target.noSignificantImpact = false;
        target.generateTable = false;
      } else if (normalized.includes("no significant")) {
        target.noSignificantImpact = true;
        target.N_A = false;
        target.generateTable = false;
      }
    }
  };
  assignFlags(raw.quarry, result.quarryData, "quarryPlantData");
  assignFlags(raw.plant, result.plantSimpleData, "plantData");
  assignFlags(raw.port, result.portData, "portPlantData");
  return result;
};

const toChemicalYesNo = (value: any): ChemicalYesNoNull => {
  if (typeof value === "string") {
    const normalized = value.trim().toUpperCase();
    if (normalized === "YES" || normalized === "Y" || normalized === "TRUE") {
      return "YES";
    }
    if (normalized === "NO" || normalized === "N" || normalized === "FALSE") {
      return "NO";
    }
  }
  if (value === true) {
    return "YES";
  }
  if (value === false) {
    return "NO";
  }
  return null;
};

const normalizeChemicalSafetyFromApi = (
  raw: any
):
  | {
      chemicalSafety: ChemicalSafetyData;
      healthSafetyChecked: boolean;
      socialDevChecked: boolean;
    }
  | undefined => {
  if (!raw || typeof raw !== "object") {
    return undefined;
  }
  if (raw.chemicalSafety) {
    return {
      chemicalSafety: {
        ...raw.chemicalSafety,
      },
      healthSafetyChecked: !!raw.healthSafetyChecked,
      socialDevChecked: !!raw.socialDevChecked,
    };
  }
  const chemicalSafetySource = raw || {};
  const chemicalSafety: ChemicalSafetyData = {
    isNA: !!chemicalSafetySource.isNA,
    riskManagement: toChemicalYesNo(chemicalSafetySource.riskManagement),
    training: toChemicalYesNo(chemicalSafetySource.training),
    handling: toChemicalYesNo(chemicalSafetySource.handling),
    emergencyPreparedness: toChemicalYesNo(
      chemicalSafetySource.emergencyPreparedness
    ),
    remarks: sanitizeString(chemicalSafetySource.remarks),
    chemicalCategory: (sanitizeString(chemicalSafetySource.chemicalCategory) ||
      null) as ChemicalCategory,
    othersSpecify: sanitizeString(chemicalSafetySource.othersSpecify),
  };
  return {
    chemicalSafety,
    healthSafetyChecked: !!raw.healthSafetyChecked,
    socialDevChecked: !!raw.socialDevChecked,
  };
};

const normalizeComplaintsListFromApi = (raw: any): Complaint[] | undefined => {
  if (!Array.isArray(raw)) {
    return undefined;
  }
  return raw.map((item: any, index: number) => ({
    id: item?.id || createHydrationId("complaint", index),
    isNA: !!item?.isNA,
    dateFiled: sanitizeString(item?.dateFiled),
    filedLocation: (item?.filedLocation as Complaint["filedLocation"]) || null,
    othersSpecify: sanitizeString(item?.othersSpecify),
    nature: sanitizeString(item?.nature),
    resolutions: sanitizeString(item?.resolutions),
  }));
};

const normalizeComplianceMonitoringReportFromApi = (
  raw: any
): Partial<DraftSnapshot> => {
  if (!raw || typeof raw !== "object") {
    return {};
  }
  const result: Partial<DraftSnapshot> = {};
  if (raw.complianceToProjectLocationAndCoverageLimits?.formData) {
    result.complianceToProjectLocationAndCoverageLimits =
      raw.complianceToProjectLocationAndCoverageLimits;
  } else {
    const plcl = normalizeProjectLocationFromApi(
      raw.complianceToProjectLocationAndCoverageLimits
    );
    if (plcl) {
      result.complianceToProjectLocationAndCoverageLimits = plcl;
    }
  }
  if (raw.complianceToImpactManagementCommitments?.quarryOperation) {
    result.complianceToImpactManagementCommitments =
      raw.complianceToImpactManagementCommitments;
  } else {
    const impact = normalizeImpactCommitmentsFromApi(
      raw.complianceToImpactManagementCommitments
    );
    if (impact) {
      result.complianceToImpactManagementCommitments = impact;
    }
  }
  const air = normalizeAirQualityFromApi(raw.airQualityImpactAssessment);
  if (air) {
    result.airQualityImpactAssessment = air;
  }
  const water = normalizeWaterQualityFromApi(raw.waterQualityImpactAssessment);
  if (water) {
    result.waterQualityImpactAssessment = water;
  }
  const noise = normalizeNoiseQualityFromApi(raw.noiseQualityImpactAssessment);
  if (noise) {
    result.noiseQualityImpactAssessment = noise;
  }
  const waste = normalizeWasteManagementFromApi(
    raw.complianceWithGoodPracticeInSolidAndHazardousWasteManagement
  );
  if (waste) {
    result.complianceWithGoodPracticeInSolidAndHazardousWasteManagement = waste;
  }
  const chemical = normalizeChemicalSafetyFromApi(
    raw.complianceWithGoodPracticeInChemicalSafetyManagement
  );
  if (chemical) {
    result.complianceWithGoodPracticeInChemicalSafetyManagement = chemical;
  }
  const complaints = normalizeComplaintsListFromApi(
    raw.complaintsVerificationAndManagement
  );
  if (complaints) {
    result.complaintsVerificationAndManagement = complaints;
  }
  if (raw.recommendationFromPrevQuarter) {
    result.recommendationFromPrevQuarter = raw.recommendationFromPrevQuarter;
  }
  if (raw.recommendationForNextQuarter) {
    result.recommendationForNextQuarter = raw.recommendationForNextQuarter;
  }
  if (raw.recommendationsData) {
    result.recommendationsData = raw.recommendationsData;
  }
  return result;
};

const buildCreateCMVRPayload = (
  snapshot: DraftSnapshot,
  options: {
    recommendationsData?: RecommendationsData;
    attendanceId?: string;
  } = {},
  userId?: string
): CreateCMVRDto => {
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
  const complianceMonitoringReport: any = {};
  let hasComplianceData = false;
  let hasPLCL = false;
  let hasImpact = false;
  let hasAir = false;
  let hasWater = false;

  if (norm.complianceToProjectLocationAndCoverageLimits) {
    const transformedPLCL = transformProjectLocationCoverageForPayload(
      norm.complianceToProjectLocationAndCoverageLimits
    );

    // Backfill uploadedImages if transformer didn't capture them
    if (
      transformedPLCL &&
      !transformedPLCL.uploadedImages &&
      norm.complianceToProjectLocationAndCoverageLimits.uploadedImages
    ) {
      transformedPLCL.uploadedImages = Object.fromEntries(
        Object.entries(
          norm.complianceToProjectLocationAndCoverageLimits
            .uploadedImages as Record<string, string | undefined>
        )
          .map(([k, v]) => [k.trim(), (v ?? "").trim()])
          .filter(([, v]) => v)
      );
    }

    complianceMonitoringReport.complianceToProjectLocationAndCoverageLimits =
      transformedPLCL;
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
    const transformedNoise = transformNoiseQualityForPayload(
      norm.noiseQualityImpactAssessment
    );

    // Backfill uploadedFiles if transformer didn't capture them
    if (
      transformedNoise &&
      (!transformedNoise.uploadedFiles ||
        transformedNoise.uploadedFiles.length === 0) &&
      Array.isArray(norm.noiseQualityImpactAssessment.uploadedFiles)
    ) {
      transformedNoise.uploadedFiles =
        norm.noiseQualityImpactAssessment.uploadedFiles
          .map((file: any) => {
            const storagePath =
              typeof file?.storagePath === "string"
                ? file.storagePath.trim()
                : undefined;
            const uri =
              typeof file?.uri === "string" ? file.uri.trim() : undefined;
            if (!storagePath && !uri) return null;

            const name =
              typeof file?.name === "string" && file.name.trim()
                ? file.name.trim()
                : storagePath?.split("/").pop();

            const size =
              typeof file?.size === "number"
                ? file.size
                : Number.isFinite(Number(file?.size))
                  ? Number(file.size)
                  : undefined;

            const mimeType =
              typeof file?.mimeType === "string" && file.mimeType.trim()
                ? file.mimeType.trim()
                : undefined;

            return { uri, name, size, mimeType, storagePath };
          })
          .filter(Boolean);
    }

    complianceMonitoringReport.noiseQualityImpactAssessment = transformedNoise;
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
  // Relax gating: allow payload to include complianceMonitoringReport with any populated section
  if (hasComplianceData) {
    payload.complianceMonitoringReport = complianceMonitoringReport;
  }
  if (options.attendanceId) {
    payload.attendanceId = options.attendanceId;
  }

  // Add ECC Conditions attachment if uploaded
  if (norm.airQualityImpactAssessment?.uploadedEccFile) {
    const eccFile = norm.airQualityImpactAssessment.uploadedEccFile;
    payload.eccConditionsAttachment = {
      fileName: eccFile.name || "ECC Conditions Document",
      fileUrl: eccFile.publicUrl || eccFile.uri || null,
      mimeType: eccFile.mimeType || null,
      storagePath: eccFile.storagePath || null,
    };
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
    selectedAttendanceId: routeSelectedAttendanceId,
    selectedAttendanceTitle: routeSelectedAttendanceTitle,
    documentation: routeDocumentation,
    attachments: routeAttachments,
    newlyUploadedPaths: routeNewlyUploadedPaths,
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
  const [isDownloading, setIsDownloading] = useState(false);
  const selectedFormat: "docx" = "docx";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [attachments, setAttachments] = useState<
    { uri: string; path?: string; uploading?: boolean; caption?: string }[]
  >([]);
  const [newlyUploadedPaths, setNewlyUploadedPaths] = useState<string[]>([]);

  // Handle incoming attachments from CMVRAttachmentsScreen
  useEffect(() => {
    if (routeAttachments && Array.isArray(routeAttachments)) {
      console.log("Loading attachments from route:", routeAttachments);
      const formattedAttachments = routeAttachments.map((att: any) => ({
        uri: att.path || "",
        path: att.path || "",
        caption: att.caption || "",
        uploading: false,
      }));
      setAttachments(formattedAttachments);
    }
    if (routeNewlyUploadedPaths && Array.isArray(routeNewlyUploadedPaths)) {
      setNewlyUploadedPaths(routeNewlyUploadedPaths);
    }
  }, [routeAttachments, routeNewlyUploadedPaths]);

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
      let routeUpdate = routeDraftUpdate;
      if (routeReportId && Object.keys(routeDraftUpdate).length === 0) {
        try {
          console.log("Fetching CMVR report from API:", routeReportId);
          const { getCMVRReportById } = await import("../../lib/cmvr");
          const reportData = await getCMVRReportById(routeReportId);
          if (reportData && isActive) {
            const sourceGeneralInfo =
              reportData.generalInfo &&
              typeof reportData.generalInfo === "object"
                ? (reportData.generalInfo as Record<string, unknown>)
                : undefined;
            const locationSource =
              typeof reportData.location === "string"
                ? reportData.location
                : (reportData.location?.barangay as string) || "";
            const locationFields = parseLocationComponents(
              (sourceGeneralInfo?.location as string) || locationSource
            );
            const { primary: eccPrimary, additional: eccAdditional } =
              mapEccEntriesToForm(reportData.ecc);
            const { primary: isagPrimaryBase, additional: isagAdditional } =
              mapIsagEntriesToForm(
                reportData.isagMpp,
                reportData.projectCurrentName || reportData.projectNameInEcc
              );
            const { primary: epepPrimary, additional: epepAdditional } =
              mapEpepEntriesToForm(reportData.epep);
            const { primary: rcfPrimary, additional: rcfAdditional } =
              mapFundEntriesToForm(reportData.rehabilitationCashFund);
            const { primary: mtfPrimary, additional: mtfAdditional } =
              mapFundEntriesToForm(reportData.monitoringTrustFundUnified);
            const { primary: fmrdfPrimary, additional: fmrdfAdditional } =
              mapFundEntriesToForm(
                reportData.finalMineRehabilitationAndDecommissioningFund
              );
            const coords = parseCoordinateFields(
              sanitizeString(reportData.projectGeographicalCoordinates)
            );
            const proponentInfoSource = reportData.proponent || {};
            const mmtSource = reportData.mmt || {};
            const isagPrimary: ISAGInfo = {
              ...isagPrimaryBase,
              isNA: isagPrimaryBase.isNA,
              currentName:
                sanitizeString(reportData.projectCurrentName) ||
                isagPrimaryBase.currentName,
              nameInECC:
                sanitizeString(reportData.projectNameInEcc) ||
                isagPrimaryBase.nameInECC,
              projectStatus: sanitizeString(reportData.projectStatus),
              gpsX: coords.gpsX,
              gpsY: coords.gpsY,
              proponentName: sanitizeString(
                proponentInfoSource.contactPersonAndPosition
              ),
              proponentContact: sanitizeString(
                proponentInfoSource.contactPersonAndPosition
              ),
              proponentAddress: sanitizeString(
                proponentInfoSource.mailingAddress
              ),
              proponentPhone: sanitizeString(proponentInfoSource.telephoneFax),
              proponentEmail: sanitizeString(proponentInfoSource.emailAddress),
            };
            const computedLocation = sourceGeneralInfo
              ? {
                  region: String(sourceGeneralInfo.region ?? ""),
                  province: String(sourceGeneralInfo.province ?? ""),
                  municipality: String(sourceGeneralInfo.municipality ?? ""),
                  barangay: String(sourceGeneralInfo.location ?? ""),
                }
              : undefined;
            const location = computedLocation
              ? computedLocation
              : typeof reportData.location === "string"
                ? {
                    region: "",
                    province: "",
                    municipality: "",
                    barangay: reportData.location,
                  }
                : reportData.location || {};
            routeUpdate = {
              generalInfo: {
                companyName:
                  (sourceGeneralInfo?.companyName as string) ||
                  reportData.companyName ||
                  "",
                projectName:
                  (sourceGeneralInfo?.projectName as string) ||
                  reportData.projectCurrentName ||
                  reportData.projectNameInEcc ||
                  "",
                quarter:
                  (sourceGeneralInfo?.quarter as string) ||
                  reportData.quarter ||
                  "",
                year:
                  (sourceGeneralInfo?.year as string) ||
                  reportData.year?.toString() ||
                  "",
                dateOfCompliance:
                  (sourceGeneralInfo?.dateOfCompliance as string) ||
                  reportData.dateOfComplianceMonitoringAndValidation ||
                  "",
                monitoringPeriod:
                  (sourceGeneralInfo?.monitoringPeriod as string) ||
                  reportData.monitoringPeriodCovered ||
                  "",
                dateOfCMRSubmission:
                  (sourceGeneralInfo?.dateOfCMRSubmission as string) ||
                  reportData.dateOfCmrSubmission ||
                  "",
                region:
                  (sourceGeneralInfo?.region as string) ||
                  locationFields.region ||
                  (location.region as string) ||
                  "",
                province:
                  (sourceGeneralInfo?.province as string) ||
                  locationFields.province ||
                  (location.province as string) ||
                  "",
                municipality:
                  (sourceGeneralInfo?.municipality as string) ||
                  locationFields.municipality ||
                  (location.municipality as string) ||
                  "",
                location:
                  locationFields.location ||
                  (sourceGeneralInfo?.location as string) ||
                  (location.barangay as string) ||
                  "",
              },
              eccInfo: eccPrimary,
              eccAdditionalForms: eccAdditional,
              isagInfo: isagPrimary,
              isagAdditionalForms: isagAdditional,
              epepInfo: epepPrimary,
              epepAdditionalForms: epepAdditional,
              rcfInfo: rcfPrimary,
              rcfAdditionalForms: rcfAdditional,
              mtfInfo: mtfPrimary,
              mtfAdditionalForms: mtfAdditional,
              fmrdfInfo: fmrdfPrimary,
              fmrdfAdditionalForms: fmrdfAdditional,
              mmtInfo: {
                ...defaultMmtInfo,
                isNA: false,
                contactPerson: sanitizeString(
                  mmtSource.contactPersonAndPosition
                ),
                mailingAddress: sanitizeString(mmtSource.mailingAddress),
                phoneNumber: sanitizeString(mmtSource.telephoneFax),
                emailAddress: sanitizeString(mmtSource.emailAddress),
              },
            };

            const normalizedExecutiveSummary = normalizeExecutiveSummaryFromApi(
              reportData.executiveSummaryOfCompliance ??
                reportData.cmvrData?.executiveSummaryOfCompliance
            );
            if (normalizedExecutiveSummary) {
              routeUpdate.executiveSummaryOfCompliance =
                normalizedExecutiveSummary;
            }

            const normalizedProcessDoc = normalizeProcessDocumentationFromApi(
              reportData.processDocumentationOfActivitiesUndertaken ??
                reportData.cmvrData?.processDocumentationOfActivitiesUndertaken
            );
            if (normalizedProcessDoc) {
              routeUpdate.processDocumentationOfActivitiesUndertaken =
                normalizedProcessDoc;
            }

            const normalizedComplianceSections =
              normalizeComplianceMonitoringReportFromApi(
                reportData.complianceMonitoringReport
              );
            if (normalizedComplianceSections) {
              Object.assign(routeUpdate, normalizedComplianceSections);
            }

            // Load attachments if they exist
            if (
              reportData.attachments &&
              Array.isArray(reportData.attachments)
            ) {
              console.log(
                "Loading existing attachments:",
                reportData.attachments
              );
              const loadedAttachments = reportData.attachments.map(
                (att: any) => ({
                  uri: att.path || "", // Use path as uri for display purposes
                  path: att.path || "",
                  caption: att.caption || "",
                  uploading: false,
                })
              );
              setAttachments(loadedAttachments);
              console.log("Attachments loaded into state:", loadedAttachments);
            }

            console.log("Successfully loaded report data from API");
          }
        } catch (error) {
          console.error("Error fetching CMVR report:", error);
        }
      }
      const stored = await loadStoredDraft();
      const merged = mergeDraftData(stored, routeUpdate, resolvedFileName);
      if (!isActive) {
        return;
      }
      setDraftSnapshot(merged);
      await persistSnapshot(merged);
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
  }, [
    loadStoredDraft,
    routeDraftUpdate,
    resolvedFileName,
    persistSnapshot,
    routeReportId,
  ]);

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
        await saveDraftToLocal();
      }
    } catch (e) {
      console.warn("Failed to save draft on exit:", e);
    } finally {
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

              // Collect all uploaded file paths from draftSnapshot
              const filesToDelete: string[] = [];

              // Extract location images from complianceToProjectLocationAndCoverageLimits
              if (
                draftSnapshot?.complianceToProjectLocationAndCoverageLimits
                  ?.uploadedImages
              ) {
                const uploadedImages =
                  draftSnapshot.complianceToProjectLocationAndCoverageLimits
                    .uploadedImages;
                Object.values(uploadedImages).forEach((imagePath: any) => {
                  if (typeof imagePath === "string" && imagePath.trim()) {
                    // Extract storage path from URL or use directly if it's already a path
                    const path = imagePath.includes("location/")
                      ? imagePath.split("location/")[1]?.split("?")[0]
                      : imagePath;
                    if (path && !path.startsWith("http")) {
                      filesToDelete.push(`location/${path}`);
                    } else if (path && path.includes("location/")) {
                      const extractedPath =
                        path.match(/location\/([^?]+)/)?.[0];
                      if (extractedPath) filesToDelete.push(extractedPath);
                    }
                  }
                });
              }

              // Extract noise quality files from noiseQualityImpactAssessment
              if (draftSnapshot?.noiseQualityImpactAssessment?.uploadedFiles) {
                const uploadedFiles =
                  draftSnapshot.noiseQualityImpactAssessment.uploadedFiles;
                if (Array.isArray(uploadedFiles)) {
                  uploadedFiles.forEach((file: any) => {
                    const storagePath = file?.storagePath || file?.path;
                    if (
                      storagePath &&
                      typeof storagePath === "string" &&
                      storagePath.trim()
                    ) {
                      // Clean up the path
                      const cleanPath = storagePath.includes("noise-quality/")
                        ? storagePath.split("noise-quality/")[1]?.split("?")[0]
                        : storagePath;
                      if (cleanPath && !cleanPath.startsWith("http")) {
                        filesToDelete.push(`noise-quality/${cleanPath}`);
                      } else if (
                        cleanPath &&
                        cleanPath.includes("noise-quality/")
                      ) {
                        const extractedPath = cleanPath.match(
                          /noise-quality\/([^?]+)/
                        )?.[0];
                        if (extractedPath) filesToDelete.push(extractedPath);
                      }
                    }
                  });
                }
              }

              console.log("🗑️ Files to delete with CMVR:", filesToDelete);

              // Delete files from storage (non-blocking)
              if (filesToDelete.length > 0) {
                deleteFilesFromStorage(filesToDelete).catch((err) => {
                  console.error("⚠️ Failed to delete some files:", err);
                  // Don't block the CMVR deletion if file deletion fails
                });
              }

              // Delete the CMVR report from database
              await deleteCMVRReport(submittedReportId);
              setHasSubmitted(false);
              setSubmittedReportId(null);
              Alert.alert(
                "Deleted",
                "The CMVR report and associated files were deleted."
              );
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
        {
          recommendationsData: snapshotForSubmission.recommendationsData,
          attendanceId: routeSelectedAttendanceId,
        },
        user?.id
      );

      // Add attachments to payload
      console.log("=== DEBUG UPDATE: Attachments state ===", attachments);
      if (attachments.length > 0) {
        const formattedAttachments = attachments
          .filter((a) => !!a.path)
          .map((a) => ({ path: a.path!, caption: a.caption || undefined }));
        console.log(
          "=== DEBUG UPDATE: Formatted attachments ===",
          formattedAttachments
        );
        payload.attachments = formattedAttachments;
      }

      console.log(
        "=== DEBUG UPDATE: Payload attachments ===",
        payload.attachments
      );

      const fileNameForUpdate =
        sanitizeString(snapshotForSubmission.fileName) ||
        sanitizeString(snapshotForSubmission.generalInfo?.projectName) ||
        "CMVR_Report";
      await updateCMVRReport(submittedReportId, payload, fileNameForUpdate);
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
        {
          recommendationsData: snapshotForSubmission.recommendationsData,
          attendanceId: routeSelectedAttendanceId,
        },
        user?.id
      );

      // Add attachments to payload
      console.log("=== DEBUG: Attachments state ===", attachments);
      if (attachments.length > 0) {
        const formattedAttachments = attachments
          .filter((a) => !!a.path)
          .map((a) => ({ path: a.path!, caption: a.caption || undefined }));
        console.log(
          "=== DEBUG: Formatted attachments ===",
          formattedAttachments
        );
        payload.attachments = formattedAttachments;
      }

      console.log("=== DEBUG: Payload attachments ===", payload.attachments);
      console.log("=== DEBUG: Payload being sent ===");
      console.log(JSON.stringify(payload, null, 2));
      const fileNameForSubmission =
        sanitizeString(snapshotForSubmission.fileName) ||
        sanitizeString(snapshotForSubmission.generalInfo?.projectName) ||
        "CMVR_Report";
      const created = await createCMVRReport(payload, fileNameForSubmission);
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
  const executiveSummary =
    draftSnapshot?.executiveSummaryOfCompliance ??
    routeExecutiveSummaryOfCompliance;
  const processDocumentation =
    draftSnapshot?.processDocumentationOfActivitiesUndertaken ??
    routeProcessDocumentationOfActivitiesUndertaken;
  const complianceProjectLocation =
    draftSnapshot?.complianceToProjectLocationAndCoverageLimits ??
    routeComplianceToProjectLocationAndCoverageLimits;
  const complianceImpactCommitments =
    draftSnapshot?.complianceToImpactManagementCommitments ??
    routeComplianceToImpactManagementCommitments;
  const airQualityAssessment =
    draftSnapshot?.airQualityImpactAssessment ??
    routeAirQualityImpactAssessment;
  const waterQualityAssessment =
    draftSnapshot?.waterQualityImpactAssessment ??
    routeWaterQualityImpactAssessment;
  const noiseQualityAssessment =
    draftSnapshot?.noiseQualityImpactAssessment ??
    routeNoiseQualityImpactAssessment;
  const wasteManagementData =
    draftSnapshot?.complianceWithGoodPracticeInSolidAndHazardousWasteManagement ??
    routeComplianceWithGoodPracticeInSolidAndHazardousWasteManagement;
  const chemicalSafetyData =
    draftSnapshot?.complianceWithGoodPracticeInChemicalSafetyManagement ??
    routeComplianceWithGoodPracticeInChemicalSafetyManagement;
  const complaintsData =
    draftSnapshot?.complaintsVerificationAndManagement ??
    routeComplaintsVerificationAndManagement;
  const recommendationsData =
    draftSnapshot?.recommendationsData ?? routeRecommendationsData;
  const recommendationPrev =
    draftSnapshot?.recommendationFromPrevQuarter ??
    routeRecommendationFromPrevQuarter;
  const recommendationNext =
    draftSnapshot?.recommendationForNextQuarter ??
    routeRecommendationForNextQuarter;
  const attendanceUrl = draftSnapshot?.attendanceUrl ?? routeAttendanceUrl;
  const documentation = draftSnapshot?.documentation ?? routeDocumentation;

  const baseNavParams = {
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
  };

  const draftPayload = {
    ...(draftSnapshot ?? {}),
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
    executiveSummaryOfCompliance: executiveSummary,
    processDocumentationOfActivitiesUndertaken: processDocumentation,
    complianceToProjectLocationAndCoverageLimits: complianceProjectLocation,
    complianceToImpactManagementCommitments: complianceImpactCommitments,
    airQualityImpactAssessment: airQualityAssessment,
    waterQualityImpactAssessment: waterQualityAssessment,
    noiseQualityImpactAssessment: noiseQualityAssessment,
    complianceWithGoodPracticeInSolidAndHazardousWasteManagement:
      wasteManagementData,
    complianceWithGoodPracticeInChemicalSafetyManagement: chemicalSafetyData,
    complaintsVerificationAndManagement: complaintsData,
    recommendationsData,
    recommendationFromPrevQuarter: recommendationPrev,
    recommendationForNextQuarter: recommendationNext,
    attendanceUrl,
    documentation,
  } as DraftSnapshot;

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
      await generateCMVRDocx(submittedReportId, fileName);
      Alert.alert(
        "Download Started",
        "Your browser will open to download the DOCX file.",
        [{ text: "OK" }]
      );
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

  const handleDownload = async () => {
    if (!documentGenerated) {
      Alert.alert(
        "Generate Required",
        "Please generate the document before attempting to download it.",
        [{ text: "OK" }]
      );
      return;
    }
    if (!submittedReportId) {
      Alert.alert(
        "Missing Report",
        "The report identifier is not available. Please resubmit and try again.",
        [{ text: "OK" }]
      );
      return;
    }
    setIsDownloading(true);
    try {
      await generateCMVRDocx(submittedReportId, fileName);
      Alert.alert(
        "Download Started",
        "Your browser will open to download the file.",
        [{ text: "OK" }]
      );
    } catch (err: any) {
      console.error("Download DOCX failed:", err);
      Alert.alert(
        "Download Failed",
        err?.message || "Unable to download the document. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const getDisplayValue = (
    value: string | undefined | null,
    fallback = "Not provided"
  ) => {
    return value && value.trim() !== "" ? value : fallback;
  };

  const navigateToGeneralInfo = () => {
    navigation.navigate("CMVRReport", {
      ...baseNavParams,
      draftData: draftPayload,
      recommendationsData,
      recommendationFromPrevQuarter: recommendationPrev,
      recommendationForNextQuarter: recommendationNext,
    } as any);
  };

  const navigateToPage2 = () => {
    navigation.navigate("CMVRPage2", {
      ...baseNavParams,
      executiveSummaryOfCompliance: executiveSummary,
      processDocumentationOfActivitiesUndertaken: processDocumentation,
      complianceToProjectLocationAndCoverageLimits: complianceProjectLocation,
      complianceToImpactManagementCommitments: complianceImpactCommitments,
      airQualityImpactAssessment: airQualityAssessment,
      draftData: draftPayload,
    } as any);
  };

  const navigateToWaterQuality = () => {
    navigation.navigate("WaterQuality", {
      ...baseNavParams,
      waterQualityImpactAssessment: waterQualityAssessment,
      airQualityImpactAssessment: airQualityAssessment,
      draftData: draftPayload,
    } as any);
  };

  const navigateToNoiseQuality = () => {
    navigation.navigate("NoiseQuality", {
      ...baseNavParams,
      waterQualityImpactAssessment: waterQualityAssessment,
      noiseQualityImpactAssessment: noiseQualityAssessment,
      draftData: draftPayload,
    } as any);
  };

  const navigateToWasteManagement = () => {
    navigation.navigate("WasteManagement", {
      ...baseNavParams,
      complianceWithGoodPracticeInSolidAndHazardousWasteManagement:
        wasteManagementData,
      draftData: draftPayload,
    } as any);
  };

  const navigateToChemicalSafety = () => {
    navigation.navigate("ChemicalSafety", {
      ...baseNavParams,
      complianceWithGoodPracticeInChemicalSafetyManagement: chemicalSafetyData,
      complaintsVerificationAndManagement: complaintsData,
      recommendationsData,
      draftData: draftPayload,
    } as any);
  };

  const navigateToAttendanceSelection = () => {
    navigation.navigate("AttendanceList", {
      fromRecommendations: true,
      ...baseNavParams,
      executiveSummaryOfCompliance: executiveSummary,
      processDocumentationOfActivitiesUndertaken: processDocumentation,
      complianceToProjectLocationAndCoverageLimits: complianceProjectLocation,
      complianceToImpactManagementCommitments: complianceImpactCommitments,
      airQualityImpactAssessment: airQualityAssessment,
      waterQualityImpactAssessment: waterQualityAssessment,
      noiseQualityImpactAssessment: noiseQualityAssessment,
      complianceWithGoodPracticeInSolidAndHazardousWasteManagement:
        wasteManagementData,
      complianceWithGoodPracticeInChemicalSafetyManagement: chemicalSafetyData,
      complaintsVerificationAndManagement: complaintsData,
      recommendationsData,
      recommendationFromPrevQuarter: recommendationPrev,
      recommendationForNextQuarter: recommendationNext,
      attendanceUrl,
      documentation,
    } as any);
  };

  // --- Attachments Handlers ---
  const processPickedAsset = async (asset: ImagePicker.ImagePickerAsset) => {
    const newItem = { uri: asset.uri, uploading: true, caption: "" } as {
      uri: string;
      path?: string;
      uploading?: boolean;
      caption?: string;
    };
    setAttachments((prev) => [...prev, newItem]);
    try {
      const nameFromPicker = (
        asset.fileName ??
        asset.uri.split("/").pop() ??
        "image.jpg"
      ).replace(/\?.*$/, "");
      const ext = nameFromPicker.includes(".")
        ? nameFromPicker.split(".").pop()
        : "jpg";
      const baseName = fileName
        ? fileName.trim().replace(/[^a-zA-Z0-9._-]/g, "_")
        : "cmvr";
      const finalName = `${baseName}_${Date.now()}.${ext}`;
      const contentType = asset.mimeType ?? "image/jpeg";
      const { path } = await uploadFileFromUri({
        uri: asset.uri,
        fileName: finalName,
        contentType,
        upsert: false,
      });
      console.log("=== DEBUG: File uploaded ===", {
        path,
        uri: asset.uri,
        finalName,
      });
      setNewlyUploadedPaths((prev) => [...prev, path]);
      setAttachments((prev) =>
        prev.map((a) =>
          a.uri === newItem.uri ? { ...a, path, uploading: false } : a
        )
      );
      console.log("=== DEBUG: Updated attachments state ===", attachments);
    } catch (e: any) {
      setAttachments((prev) => prev.filter((a) => a.uri !== newItem.uri));
      Alert.alert(
        "Upload failed",
        e?.message || "Could not upload the image. Please try again."
      );
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "We need access to your media library to attach images."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });
    if (result.canceled || !result.assets?.length) return;
    const asset = result.assets[0];
    await processPickedAsset(asset);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Camera permission is needed to take a photo."
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });
    if (result.canceled || !result.assets?.length) return;
    const asset = result.assets[0];
    await processPickedAsset(asset);
  };

  const removeAttachment = (uri: string) => {
    setAttachments((prev) => prev.filter((a) => a.uri !== uri));
  };

  const updateAttachmentCaption = (uri: string, caption: string) => {
    setAttachments((prev) =>
      prev.map((a) => (a.uri === uri ? { ...a, caption } : a))
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 0, backgroundColor: "white" }}>
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
      </SafeAreaView>
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
          <SummaryItem
            icon="🧾"
            title="Executive Summary"
            value={executiveSummary ? "Available" : "Not provided"}
            onPress={navigateToPage2}
          />
          <SummaryItem
            icon="🗂️"
            title="Process Documentation"
            value={
              processDocumentation?.dateConducted
                ? getDisplayValue(processDocumentation.dateConducted)
                : "Not provided"
            }
            onPress={navigateToPage2}
          />
          <SummaryItem
            icon="💧"
            title="Water Quality Assessment"
            value={waterQualityAssessment ? "Available" : "Not provided"}
            onPress={navigateToWaterQuality}
          />
          <SummaryItem
            icon="🔊"
            title="Noise Quality Assessment"
            value={noiseQualityAssessment ? "Available" : "Not provided"}
            onPress={navigateToNoiseQuality}
          />
          <SummaryItem
            icon="♻️"
            title="Waste Management"
            value={wasteManagementData ? "Available" : "Not provided"}
            onPress={navigateToWasteManagement}
          />
          <SummaryItem
            icon="🧪"
            title="Chemical Safety & Complaints"
            value={
              chemicalSafetyData || complaintsData
                ? "Available"
                : "Not provided"
            }
            onPress={navigateToChemicalSafety}
          />
          <SummaryItem
            icon="📋"
            title="Attendance Record"
            value={
              routeSelectedAttendanceTitle
                ? routeSelectedAttendanceTitle
                : "Not selected"
            }
            onPress={navigateToAttendanceSelection}
          />
          <SummaryItem
            icon="📎"
            title="Attachments"
            value={
              attachments.length > 0
                ? `${attachments.length} file${attachments.length > 1 ? "s" : ""}`
                : "No attachments"
            }
            onPress={() =>
              navigation.navigate(
                "CMVRAttachments" as never,
                {
                  ...baseNavParams,
                  existingAttachments: attachments,
                  fileName,
                } as never
              )
            }
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
                      <Text style={styles.submitButtonText}>Submitting...</Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="cloud-upload" size={20} color="white" />
                      <Text style={styles.submitButtonText}>
                        Submit to Database
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              )}

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
                    <Ionicons name="document-text" size={20} color="white" />
                    <Text style={styles.generateButtonText}>
                      Generate Docx
                      {!hasSubmitted ? " (Submit Required)" : ""}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {hasSubmitted && submittedReportId && (
                <>
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
                        <Ionicons name="refresh" size={20} color="white" />
                        <Text style={styles.updateButtonText}>Update</Text>
                      </>
                    )}
                  </TouchableOpacity>

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
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </>
              )}

              {!hasSubmitted && (
                <View style={styles.infoBannerContainer}>
                  <Ionicons
                    name="information-circle"
                    size={18}
                    color="#1E40AF"
                  />
                  <Text style={styles.infoBannerText}>
                    Submit your report to the database first to enable document
                    generation.
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
                style={[
                  styles.downloadButton,
                  isDownloading && styles.buttonDisabled,
                ]}
                onPress={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <ActivityIndicator size="small" color="white" />
                    <Text style={styles.downloadButtonText}>Preparing...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="download" size={20} color="white" />
                    <Text style={styles.downloadButtonText}>Download</Text>
                  </>
                )}
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
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: isTablet ? 32 : 20,
    paddingTop: Platform.OS === "ios" ? 40 : 20, // Reduced paddingTop for both platforms
    paddingBottom: isTablet ? 24 : 20,
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
    padding: isTablet ? 12 : 8,
    marginRight: isTablet ? 20 : 16,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
  },
  exitText: {
    color: "#1E40AF",
    fontSize: isTablet ? 18 : 16,
    fontWeight: "700",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: isTablet ? 28 : isSmallPhone ? 20 : 22,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: isTablet ? 16 : 14,
    color: "#64748B",
    marginTop: 4,
    lineHeight: isTablet ? 24 : 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: isTablet ? 32 : 20,
    paddingBottom: isTablet ? 60 : 40,
    maxWidth: isTablet ? 1024 : undefined,
    alignSelf: isTablet ? "center" : undefined,
    width: isTablet ? "100%" : undefined,
  },
  previewCard: {
    backgroundColor: "white",
    borderRadius: isTablet ? 24 : 20,
    shadowColor: "#02217C",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    marginBottom: isTablet ? 32 : 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeader: {
    backgroundColor: "#02217C",
    padding: isTablet ? 32 : 24,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: isTablet ? 80 : 64,
    height: isTablet ? 80 : 64,
    borderRadius: isTablet ? 20 : 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: isTablet ? 24 : 16,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: isTablet ? 24 : isSmallPhone ? 18 : 20,
    fontWeight: "700",
    color: "white",
    marginBottom: isTablet ? 8 : 6,
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: isTablet ? 16 : 14,
    color: "rgba(255, 255, 255, 0.95)",
    lineHeight: isTablet ? 24 : 20,
  },
  formatSection: {
    padding: isTablet ? 32 : 24,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  sectionLabel: {
    fontSize: isTablet ? 18 : 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: isTablet ? 20 : 16,
    letterSpacing: -0.2,
  },
  formatButtons: {
    gap: isTablet ? 20 : 16,
    flexDirection: isTablet ? "row" : "column",
  },
  formatButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: isTablet ? 24 : 20,
    borderRadius: isTablet ? 20 : 16,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    backgroundColor: "white",
    flex: isTablet ? 1 : undefined,
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
    width: isTablet ? 56 : 48,
    height: isTablet ? 56 : 48,
    borderRadius: isTablet ? 14 : 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: isTablet ? 20 : 16,
  },
  formatTextContainer: {
    flex: 1,
  },
  formatTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  formatDescription: {
    fontSize: isTablet ? 16 : 14,
    color: "#64748B",
    lineHeight: isTablet ? 24 : 20,
  },
  summarySection: {
    padding: isTablet ? 32 : 24,
    backgroundColor: "white",
    borderRadius: isTablet ? 24 : 20,
    marginBottom: isTablet ? 32 : 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  summaryTitle: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: isTablet ? 24 : 20,
    letterSpacing: -0.3,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F8FAFC",
    borderRadius: isTablet ? 16 : 14,
    padding: isTablet ? 20 : 16,
    marginBottom: isTablet ? 16 : 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  summaryIcon: {
    fontSize: isTablet ? 36 : 28,
    marginRight: isTablet ? 20 : 16,
    marginTop: 2,
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryItemTitle: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: "700",
    color: "#475569",
    marginBottom: isTablet ? 6 : 4,
    letterSpacing: -0.1,
  },
  summaryItemValue: {
    fontSize: isTablet ? 17 : 15,
    color: "#0F172A",
    lineHeight: isTablet ? 26 : 22,
  },
  summaryAdditional: {
    fontSize: isTablet ? 14 : 12,
    color: "#02217C",
    marginTop: isTablet ? 8 : 6,
    fontWeight: "600",
  },
  generatedSection: {
    padding: isTablet ? 32 : 24,
    backgroundColor: "white",
    borderRadius: isTablet ? 24 : 20,
    marginBottom: isTablet ? 32 : 24,
  },
  generatedCard: {
    backgroundColor: "#F0FDF4",
    borderRadius: isTablet ? 24 : 20,
    padding: isTablet ? 36 : 28,
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#86EFAC",
  },
  generatedIconContainer: {
    marginBottom: isTablet ? 20 : 16,
  },
  generatedTitle: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: isTablet ? 8 : 6,
    letterSpacing: -0.3,
  },
  generatedSubtitle: {
    fontSize: isTablet ? 17 : 15,
    color: "#059669",
    marginBottom: 4,
    fontWeight: "600",
  },
  generatedDate: {
    fontSize: isTablet ? 15 : 13,
    color: "#64748B",
    marginTop: 4,
  },
  actionSection: {
    marginBottom: isTablet ? 32 : 20,
    paddingHorizontal: 4,
  },
  generateButton: {
    backgroundColor: "#1E40AF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: isTablet ? 22 : 18,
    borderRadius: isTablet ? 20 : 16,
    gap: isTablet ? 16 : 12,
    shadowColor: "#1E40AF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
    marginTop: isTablet ? 32 : 24,
  },
  submitButton: {
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: isTablet ? 22 : 18,
    borderRadius: isTablet ? 20 : 16,
    gap: isTablet ? 16 : 12,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  submitButtonText: {
    color: "white",
    fontSize: isTablet ? 19 : 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  updateButton: {
    backgroundColor: "#0EA5E9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: isTablet ? 22 : 18,
    borderRadius: isTablet ? 20 : 16,
    gap: isTablet ? 16 : 12,
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
    marginTop: isTablet ? 8 : 6,
  },
  updateButtonText: {
    color: "white",
    fontSize: isTablet ? 19 : 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  deleteButton: {
    backgroundColor: "#DC2626",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: isTablet ? 22 : 18,
    borderRadius: isTablet ? 20 : 16,
    gap: isTablet ? 16 : 12,
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
    marginTop: isTablet ? 8 : 6,
  },
  deleteButtonText: {
    color: "white",
    fontSize: isTablet ? 19 : 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  draftButton: {
    backgroundColor: "#F59E0B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: isTablet ? 22 : 18,
    borderRadius: isTablet ? 20 : 16,
    gap: isTablet ? 16 : 12,
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
    marginTop: isTablet ? 16 : 14,
  },
  draftButtonText: {
    color: "white",
    fontSize: isTablet ? 19 : 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  errorContainer: {
    marginTop: isTablet ? 20 : 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    padding: isTablet ? 20 : 16,
    borderRadius: isTablet ? 16 : 14,
    gap: isTablet ? 16 : 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorText: {
    flex: 1,
    fontSize: isTablet ? 16 : 14,
    color: "#DC2626",
    lineHeight: isTablet ? 24 : 20,
    fontWeight: "500",
  },
  infoBannerContainer: {
    marginTop: isTablet ? 16 : 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DBEAFE",
    padding: isTablet ? 16 : 12,
    borderRadius: isTablet ? 14 : 12,
    gap: isTablet ? 12 : 8,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  infoBannerText: {
    flex: 1,
    fontSize: isTablet ? 15 : 13,
    color: "#1E3A8A",
    lineHeight: isTablet ? 22 : 18,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  generateButtonText: {
    color: "white",
    fontSize: isTablet ? 19 : 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  actionButtons: {
    flexDirection: "row",
    gap: isTablet ? 16 : 12,
  },
  previewButton: {
    flex: 1,
    backgroundColor: "#475569",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: isTablet ? 20 : 16,
    borderRadius: isTablet ? 16 : 12,
    gap: isTablet ? 12 : 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  previewButtonText: {
    color: "white",
    fontSize: isTablet ? 18 : 16,
    fontWeight: "700",
  },
  downloadButton: {
    flex: 1,
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: isTablet ? 20 : 16,
    borderRadius: isTablet ? 16 : 12,
    gap: isTablet ? 12 : 8,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  downloadButtonText: {
    color: "white",
    fontSize: isTablet ? 19 : 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  infoNote: {
    backgroundColor: "#EFF6FF",
    borderRadius: isTablet ? 20 : 16,
    padding: isTablet ? 24 : 20,
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
    marginLeft: isTablet ? 16 : 14,
  },
  infoTitle: {
    fontSize: isTablet ? 17 : 15,
    fontWeight: "700",
    color: "#1E40AF",
    marginBottom: isTablet ? 8 : 6,
    letterSpacing: -0.1,
  },
  infoDescription: {
    fontSize: isTablet ? 16 : 14,
    color: "#1E40AF",
    lineHeight: isTablet ? 24 : 21,
  },
  draftNote: {
    backgroundColor: "#FEF3C7",
    borderRadius: isTablet ? 20 : 16,
    padding: isTablet ? 24 : 20,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#FCD34D",
    marginTop: isTablet ? 20 : 16,
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
    fontSize: isTablet ? 17 : 15,
    fontWeight: "700",
    color: "#D97706",
    marginBottom: isTablet ? 8 : 6,
    letterSpacing: -0.1,
  },
  draftNoteDescription: {
    fontSize: isTablet ? 16 : 14,
    color: "#D97706",
    lineHeight: isTablet ? 24 : 21,
  },
  card: {
    backgroundColor: "white",
    borderRadius: isTablet ? 20 : 16,
    padding: isTablet ? 24 : 20,
    marginBottom: isTablet ? 20 : 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sectionTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: isTablet ? 8 : 6,
  },
  sectionDescription: {
    fontSize: isTablet ? 15 : 14,
    color: "#64748B",
    lineHeight: isTablet ? 22 : 20,
  },
});

export default CMVRDocumentExportScreen;
