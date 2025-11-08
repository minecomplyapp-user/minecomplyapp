import { apiGet, apiPatch, apiPost, getApiBaseUrl, getJwt } from "./api";
import { Linking } from "react-native";
import type { CreateCMVRDto } from "../screens/CMVRPAGE/types/CMVRReportScreen.types";

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
    return response;
  } catch (error) {
    console.error("Error creating CMVR report:", error);
    throw error;
  }
}

/**
 * Get all CMVR reports
 * @returns Promise with array of CMVR reports
 */
export async function getAllCMVRReports(): Promise<any[]> {
  try {
    const response = await apiGet<any[]>("/cmvr");
    return response as any[];
  } catch (error) {
    console.error("Error fetching CMVR reports:", error);
    throw error;
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
    return response;
  } catch (error) {
    console.error("Error fetching CMVR report:", error);
    throw error;
  }
}

/** Get CMVR reports created by a specific user */
export async function getCMVRReportsByUser(userId: string): Promise<any[]> {
  try {
    return await apiGet<any[]>(`/cmvr/user/${userId}`);
  } catch (error) {
    console.error("Error fetching CMVR reports by user:", error);
    throw error;
  }
}

/**
 * Generate PDF for CMVR General Information section
 * @param id - CMVR report ID
 * @returns Promise with PDF blob/buffer
 */
export async function generateCMVRGeneralInfoPdf(id: string): Promise<Blob> {
  try {
    const response = await fetch(`/cmvr/${id}/pdf/general-info`);
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
  const downloadUrl = `${baseUrl}/api/cmvr/${id}/docx`;

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
  const resp = await fetch(`${baseUrl}/api/cmvr/${id}`, {
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
  const queryParam = fileName
    ? `?fileName=${encodeURIComponent(fileName)}`
    : "";
  return apiPatch<any>(`/cmvr/${id}${queryParam}`, data);
}
