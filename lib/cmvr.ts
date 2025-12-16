import { apiGet, apiPatch, apiPost, getApiBaseUrl, getJwt } from "./api";
import { Linking } from "react-native";
import type { CreateCMVRDto } from "../screens/CMVRPAGE/types/CMVRReportScreen.types";

const COMPLIANCE_SECTION_KEYS = [
  "complianceToProjectLocationAndCoverageLimits",
  "complianceToImpactManagementCommitments",
  "airQualityImpactAssessment",
  "waterQualityImpactAssessment",
  "noiseQualityImpactAssessment",
  "complianceWithGoodPracticeInSolidAndHazardousWasteManagement",
  "complianceWithGoodPracticeInChemicalSafetyManagement",
  "complaintsVerificationAndManagement",
  "recommendationFromPrevQuarter",
  "recommendationForNextQuarter",
];

const normalizeComplianceSections = (source: any) => {
  if (!source || typeof source !== "object") {
    return {} as Record<string, unknown>;
  }
  const nested = source.complianceMonitoringReport;
  if (nested && typeof nested === "object") {
    return nested as Record<string, unknown>;
  }
  return COMPLIANCE_SECTION_KEYS.reduce<Record<string, unknown>>((acc, key) => {
    if (key in source) {
      acc[key] = (source as Record<string, unknown>)[key];
    }
    return acc;
  }, {});
};

const buildGeneralInfoSnapshot = (data: any) => {
  if (!data || typeof data !== "object") {
    return undefined;
  }
  const generalInfo =
    data.generalInfo && typeof data.generalInfo === "object"
      ? data.generalInfo
      : undefined;
  const base: any = generalInfo ? { ...generalInfo } : {};
  base.companyName = base.companyName ?? data.companyName ?? "";
  base.projectName =
    base.projectName ?? data.projectCurrentName ?? data.projectNameInEcc ?? "";
  base.location =
    base.location ?? (typeof data.location === "string" ? data.location : "");
  base.region = base.region ?? data.location?.region ?? "";
  base.province = base.province ?? data.location?.province ?? "";
  base.municipality = base.municipality ?? data.location?.municipality ?? "";
  base.quarter = base.quarter ?? data.quarter ?? "";
  base.year = base.year ?? (data.year ? String(data.year) : "");
  base.dateOfCompliance =
    base.dateOfCompliance ?? data.dateOfComplianceMonitoringAndValidation ?? "";
  base.monitoringPeriod =
    base.monitoringPeriod ?? data.monitoringPeriodCovered ?? "";
  base.dateOfCMRSubmission =
    base.dateOfCMRSubmission ?? data.dateOfCmrSubmission ?? "";
  return base;
};

/**
 * Create a new CMVR report
 * @param data - CMVR report data matching backend DTO structure (without fileName)
 * @param fileName - Optional file name sent as a separate query parameter
 * @returns Promise with created CMVR report
 */
export async function createCMVRReport(
  data: CreateCMVRDto,
  fileName?: string
): Promise<any> {
  try {
    const queryParam = fileName
      ? `?fileName=${encodeURIComponent(fileName)}`
      : "";
    const response = await apiPost(`/cmvr${queryParam}`, data);
    console.log("[CMVR] Report created successfully");
    return response;
  } catch (error: any) {
    console.error("[CMVR] Failed to create report:", error);
    // Enhance error message for user
    const userMessage = error.message || "Failed to create CMVR report. Please try again.";
    throw new Error(userMessage);
  }
}

/**
 * Get all CMVR reports
 * @returns Promise with array of CMVR reports
 */
export async function getAllCMVRReports(): Promise<any[]> {
  try {
    const response = await apiGet<any[]>("/cmvr");
    console.log(`[CMVR] Fetched ${response.length} reports`);
    return response as any[];
  } catch (error: any) {
    console.error("[CMVR] Failed to fetch reports:", error);
    const userMessage = error.message || "Failed to load CMVR reports. Please try again.";
    throw new Error(userMessage);
  }
}

/**
 * Get a specific CMVR report by ID
 * @param id - CMVR report ID
 * @returns Promise with CMVR report
 */
export async function getCMVRReportById(id: string): Promise<any> {
  try {
    const response = await apiGet<any>(`/cmvr/${id}`);
    if (!response) {
      console.warn(`[CMVR] Report ${id} returned empty response`);
      return response;
    }

    const cmvrData =
      response.cmvrData && typeof response.cmvrData === "object"
        ? response.cmvrData
        : {};
    const complianceSections = normalizeComplianceSections(cmvrData);
    const generalInfo = buildGeneralInfoSnapshot(cmvrData);

    const normalized = {
      ...cmvrData,
      ...response,
      complianceMonitoringReport:
        Object.keys(complianceSections).length > 0
          ? complianceSections
          : response.complianceMonitoringReport,
      generalInfo,
      // ✅ FIX: Ensure permitHolderList is included from response or cmvrData
      permitHolderList: Array.isArray(response.permitHolderList)
        ? response.permitHolderList
        : Array.isArray(cmvrData.permitHolderList)
          ? cmvrData.permitHolderList
          : [],
      // ✅ FIX: Ensure attendanceId is included from response or cmvrData
      attendanceId: response.attendanceId || cmvrData.attendanceId || null,
      attachments: Array.isArray(response.attachments)
        ? response.attachments
        : Array.isArray(cmvrData.attachments)
          ? cmvrData.attachments
          : [],
      cmvrData,
    };

    console.log(`[CMVR] Successfully loaded report ${id}`);
    console.log(`[CMVR] Permit Holder List count: ${normalized.permitHolderList.length}`);
    console.log(`[CMVR] Date of CMR Submission: ${normalized.generalInfo?.dateOfCMRSubmission || "NOT SET"}`);
    console.log(`[CMVR] Attendance ID: ${normalized.attendanceId || "NOT SET"}`);
    console.log(`[CMVR] Attachments count: ${normalized.attachments.length}`);
    return normalized;
  } catch (error: any) {
    console.error(`[CMVR] Failed to fetch report ${id}:`, error);
    const userMessage = error.message || "Failed to load CMVR report. Please try again.";
    throw new Error(userMessage);
  }
}

/** Get CMVR reports created by a specific user */
export async function getCMVRReportsByUser(userId: string): Promise<any[]> {
  try {
    const reports = await apiGet<any[]>(`/cmvr/user/${userId}`);
    console.log(`[CMVR] Fetched ${reports.length} reports for user ${userId}`);
    return reports;
  } catch (error: any) {
    console.error(`[CMVR] Failed to fetch reports for user ${userId}:`, error);
    const userMessage = error.message || "Failed to load your CMVR reports. Please try again.";
    throw new Error(userMessage);
  }
}

/**
 * Generate PDF for CMVR General Information section
 * @param id - CMVR report ID
 * @returns Promise with PDF blob/buffer
 */
export async function generateCMVRGeneralInfoPdf(id: string): Promise<Blob> {
  try {
    const baseUrl = getApiBaseUrl();
    const token = await getJwt();
    const response = await fetch(`${baseUrl}/cmvr/${id}/pdf/general-info`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/pdf",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to generate PDF");
    }
    return await response.blob();
  } catch (error) {
    console.error("Error generating CMVR PDF:", error);
    throw error;
  }
}

/**
 * Download the generated DOCX for a CMVR report by ID.
 * Opens the download URL in the device's browser so the file downloads to the Downloads folder.
 * @param id - CMVR report ID
 * @param fileName - Base file name (not used, included for API compatibility)
 */
export async function generateCMVRDocx(
  id: string,
  fileName = "CMVR_Report"
): Promise<string> {
  const baseUrl = getApiBaseUrl();

  // Construct the download URL - no authentication required for downloads
  // This allows the browser to download without token expiration issues
  const downloadUrl = `${baseUrl}/cmvr/${id}/docx`;

  try {
    const supported = await Linking.canOpenURL(downloadUrl);
    if (!supported) {
      throw new Error("Unable to open download URL in browser");
    }

    // This will open the device's browser and trigger the file download
    // The file will be saved to the browser's Downloads folder
    await Linking.openURL(downloadUrl);

    return downloadUrl;
  } catch (error) {
    console.error("Error opening download URL:", error);
    throw error;
  }
}

/**
 * Delete a CMVR report by ID
 */
export async function deleteCMVRReport(id: string): Promise<void> {
  const baseUrl = getApiBaseUrl();
  const token = await getJwt();
  const resp = await fetch(`${baseUrl}/cmvr/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  if (!resp.ok) {
    let msg = `Failed to delete CMVR report (${resp.status})`;
    try {
      const j = await resp.json();
      if (j?.message) msg = j.message;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }
}

/**
 * Update a CMVR report by ID (replace cmvrData)
 * @param id - CMVR report ID
 * @param data - CMVR report data (without fileName)
 * @param fileName - Optional file name sent as a separate query parameter
 */
export async function updateCMVRReport(
  id: string,
  data: CreateCMVRDto,
  fileName?: string
): Promise<any> {
  try {
    const queryParam = fileName
      ? `?fileName=${encodeURIComponent(fileName)}`
      : "";
    const result = await apiPatch<any>(`/cmvr/${id}${queryParam}`, data);
    console.log(`[CMVR] Successfully updated report ${id}`);
    return result;
  } catch (error: any) {
    console.error(`[CMVR] Failed to update report ${id}:`, error);
    const userMessage = error.message || "Failed to update CMVR report. Please try again.";
    throw new Error(userMessage);
  }
}
