import { apiGet, apiPatch, apiPost, getApiBaseUrl, getJwt } from "./api";
// Use legacy API to keep downloadAsync until we migrate to the new File/Directory API
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
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
 * Download and (optionally) share the generated DOCX for a CMVR report by ID.
 * Uses GET /api/cmvr/:id/docx and saves to the device Documents directory.
 * Returns the local file URI.
 */
export async function generateCMVRDocx(
  id: string,
  fileName = "CMVR_Report"
): Promise<string> {
  const baseUrl = getApiBaseUrl();
  const token = await getJwt();
  const safeName = `${fileName.replace(/[^a-zA-Z0-9-_\.]/g, "_")}.docx`;
  const downloadDir =
    (FileSystem as any).documentDirectory ||
    (FileSystem as any).cacheDirectory ||
    "";
  const targetPath = `${downloadDir}${safeName}`;

  try {
    const result = await FileSystem.downloadAsync(
      `${baseUrl}/api/cmvr/${id}/docx`,
      targetPath,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Try to trigger native share sheet if available
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(result.uri, {
        dialogTitle: `Share ${safeName}`,
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
    }

    return result.uri;
  } catch (error) {
    console.error("Error generating CMVR DOCX:", error);
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
