import { create } from "zustand";
import BASE_URL from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { transformToBackendDTO } from "./cmvrTransformers";
import { buildCmvrTestData } from "./cmvrTestData";
import { getJwt } from "../lib/api";

// Storage key for CMVR drafts
const CMVR_DRAFT_STORAGE_KEY = "@cmvr_draft";

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
      error: null,
    }));
  },

  /**
   * Initialize a new report
   */
  initializeNewReport: (fileName = "Untitled") => {
    set({
      currentReport: {
        // Page 1: General Information & Permits
        generalInfo: {},
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

        // Page 2: Executive Summary & Process Documentation
        executiveSummaryOfCompliance: {},
        processDocumentationOfActivitiesUndertaken: {},

        // Page 3+: Environmental Assessments
        complianceToProjectLocationAndCoverageLimits: {},
        complianceToImpactManagementCommitments: {},
        airQualityImpactAssessment: {},
        waterQualityImpactAssessment: {},
        noiseQualityImpactAssessment: {},
        complianceWithGoodPracticeInSolidAndHazardousWasteManagement: {},
        complianceWithGoodPracticeInChemicalSafetyManagement: {},
        complaintsVerificationAndManagement: [],

        // Recommendations
        recommendationsData: {},

        // Attachments
        attendanceUrl: null,
      },
      fileName,
      submissionId: null,
      projectId: null,
      projectName: "",
      isDirty: false,
      error: null,
    });
  },

  /**
   * Update a specific section of the current report
   */
  updateSection: (sectionName, sectionData) => {
    set((state) => ({
      currentReport: {
        ...state.currentReport,
        [sectionName]: sectionData,
      },
      isDirty: true,
    }));
  },

  /**
   * Update multiple sections at once
   */
  updateMultipleSections: (sectionsData) => {
    set((state) => ({
      currentReport: {
        ...state.currentReport,
        ...sectionsData,
      },
      isDirty: true,
    }));
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
    set({
      currentReport: {
        generalInfo: reportData.generalInfo || {},
        eccInfo: reportData.eccInfo || {},
        eccAdditionalForms: reportData.eccAdditionalForms || [],
        isagInfo: reportData.isagInfo || {},
        isagAdditionalForms: reportData.isagAdditionalForms || [],
        epepInfo: reportData.epepInfo || {},
        epepAdditionalForms: reportData.epepAdditionalForms || [],
        rcfInfo: reportData.rcfInfo || {},
        rcfAdditionalForms: reportData.rcfAdditionalForms || [],
        mtfInfo: reportData.mtfInfo || {},
        mtfAdditionalForms: reportData.mtfAdditionalForms || [],
        fmrdfInfo: reportData.fmrdfInfo || {},
        fmrdfAdditionalForms: reportData.fmrdfAdditionalForms || [],
        mmtInfo: reportData.mmtInfo || {},
        executiveSummaryOfCompliance:
          reportData.executiveSummaryOfCompliance || {},
        processDocumentationOfActivitiesUndertaken:
          reportData.processDocumentationOfActivitiesUndertaken || {},
        complianceToProjectLocationAndCoverageLimits:
          reportData.complianceToProjectLocationAndCoverageLimits || {},
        complianceToImpactManagementCommitments:
          reportData.complianceToImpactManagementCommitments || {},
        airQualityImpactAssessment: reportData.airQualityImpactAssessment || {},
        waterQualityImpactAssessment:
          reportData.waterQualityImpactAssessment || {},
        noiseQualityImpactAssessment:
          reportData.noiseQualityImpactAssessment || {},
        complianceWithGoodPracticeInSolidAndHazardousWasteManagement:
          reportData.complianceWithGoodPracticeInSolidAndHazardousWasteManagement ||
          {},
        complianceWithGoodPracticeInChemicalSafetyManagement:
          reportData.complianceWithGoodPracticeInChemicalSafetyManagement || {},
        complaintsVerificationAndManagement:
          reportData.complaintsVerificationAndManagement || [],
        recommendationsData: reportData.recommendationsData || {},
        attendanceUrl: reportData.attendanceUrl || null,
      },
      fileName: reportData.fileName || "Untitled",
      submissionId: reportData.id || reportData.submissionId || null,
      projectId: reportData.projectId || null,
      projectName:
        reportData.projectName || reportData.generalInfo?.projectName || "",
      isDirty: false,
      error: null,
    });
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
      error: null,
    });
  },

  // ==================== DRAFT MANAGEMENT ====================

  /**
   * Save current report as draft to AsyncStorage
   */
  saveDraft: async () => {
    const state = get();

    if (!state.currentReport) {
      console.warn("No current report to save");
      return { success: false, error: "No report data" };
    }

    set({ isSaving: true });

    try {
      const draftData = {
        ...state.currentReport,
        fileName: state.fileName,
        projectName: state.projectName,
        savedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(
        CMVR_DRAFT_STORAGE_KEY,
        JSON.stringify(draftData)
      );

      set({ isSaving: false, isDirty: false });
      console.log("Draft saved successfully");

      return { success: true };
    } catch (error) {
      set({ isSaving: false, error: error.message });
      console.error("Error saving draft:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Load draft from AsyncStorage
   */
  loadDraft: async () => {
    set({ isLoading: true });

    try {
      const draftString = await AsyncStorage.getItem(CMVR_DRAFT_STORAGE_KEY);

      if (!draftString) {
        set({ isLoading: false });
        return { success: false, error: "No draft found" };
      }

      const draftData = JSON.parse(draftString);
      get().loadReport(draftData);

      set({ isLoading: false });
      console.log("Draft loaded successfully");

      return { success: true, data: draftData };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error("Error loading draft:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete draft from AsyncStorage
   */
  deleteDraft: async () => {
    try {
      await AsyncStorage.removeItem(CMVR_DRAFT_STORAGE_KEY);
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

  submitReport: async (token) => {
    const state = get();

    if (!state.currentReport) {
      return { success: false, error: "No report to submit" };
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
      const endpoint = `${BASE_URL}/cmvr?fileName=${encodeURIComponent(fileName)}`;

      console.log(
        "Submitting payload:",
        JSON.stringify(reportPayload, null, 2)
      );

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(reportPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit CMVR report");
      }

      const submittedReport = await response.json();

      set({
        submissionId: submittedReport.id,
        isLoading: false,
        isDirty: false,
      });

      // Delete draft after successful submission
      await get().deleteDraft();

      console.log("Report submitted successfully:", submittedReport.id);
      return { success: true, report: submittedReport };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error("Error submitting report:", error);
      return { success: false, error: error.message };
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
      const endpoint = `${BASE_URL}/cmvr?fileName=${encodeURIComponent(fileName)}`;

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
      });

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
