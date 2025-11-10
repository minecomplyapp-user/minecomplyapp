import { create } from 'zustand';
import BASE_URL from './api'; 

export const useCmvrStore = create((set, get) => ({
    // Initial state
    reports: [], 
    isLoading: false,
    selectedReport: null,
    error: null,

    // Fetch all CMVR reports - GET /api/cmvr
    fetchReports: async () => {
        set({ isLoading: true, error: null });
        
        try {
            const endpoint = `${BASE_URL}/cmvr`;
            
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error('Failed to fetch CMVR reports');

            const data = await response.json();
            
            // Transform the data to match the expected format
            const formattedReports = data.map(report => ({
                id: report.id,
                title: report.projectName || report.title,
                date: report.createdAt || report.date,
                status: report.status || 'Draft',
                type: 'cmvr',
                ...report // Include all other fields
            }));

            set({ reports: formattedReports, isLoading: false });
            return { success: true, reports: formattedReports };
            
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error fetching CMVR reports:", error.message);
            return { success: false, error: error.message };
        }
    },

    // Get report by ID - GET /api/cmvr/{id}
    getReportById: async (reportId) => {
        set({ isLoading: true, error: null });
        
        try {
            const endpoint = `${BASE_URL}/cmvr/${reportId}`;
            
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error('Failed to fetch CMVR report');

            const report = await response.json();
            
            // Format the report data
            const formattedReport = {
                id: report.id,
                title: report.projectName || report.title,
                date: report.createdAt || report.date,
                status: report.status || 'Draft',
                type: 'cmvr',
                ...report
            };

            set({ selectedReport: formattedReport, isLoading: false });
            return { success: true, report: formattedReport };
            
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error fetching CMVR report by ID:", error.message);
            return { success: false, error: error.message };
        }
    },

    // Get reports by user ID - GET /api/cmvr/user/{userId}
    fetchReportsByUserId: async (userId) => {
        set({ isLoading: true, error: null });
        
        try {
            const endpoint = `${BASE_URL}/cmvr/user/${userId}`;
            
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error('Failed to fetch user CMVR reports');

            const data = await response.json();
            
            const formattedReports = data.map(report => ({
                id: report.id,
                title: report.projectName || report.title,
                date: report.createdAt || report.date,
                status: report.status || 'Draft',
                type: 'cmvr',
                ...report
            }));

            set({ reports: formattedReports, isLoading: false });
            return { success: true, reports: formattedReports };
            
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error fetching user CMVR reports:", error.message);
            return { success: false, error: error.message };
        }
    },

    // Create new CMVR report - POST /api/cmvr
    createReport: async (reportData) => {
        set({ isLoading: true, error: null });
        
        try {
            const endpoint = `${BASE_URL}/cmvr`;
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reportData),
            });

            if (!response.ok) throw new Error('Failed to create CMVR report');

            const newReport = await response.json();
            
            const formattedReport = {
                id: newReport.id,
                title: newReport.projectName || newReport.title,
                date: newReport.createdAt || new Date().toISOString(),
                status: newReport.status || 'Draft',
                type: 'cmvr',
                ...newReport
            };

            set(state => ({
                reports: [formattedReport, ...state.reports],
                selectedReport: formattedReport,
                isLoading: false
            }));

            return { success: true, report: formattedReport };
            
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error creating CMVR report:", error.message);
            return { success: false, error: error.message };
        }
    },

    // Update CMVR report - PATCH /api/cmvr/{id}
    updateReport: async (reportId, reportData) => {
        set({ isLoading: true, error: null });
        
        try {
            const endpoint = `${BASE_URL}/cmvr/${reportId}`;
            
            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reportData),
            });

            if (!response.ok) throw new Error('Failed to update CMVR report');

            const updatedReport = await response.json();
            
            const formattedReport = {
                id: updatedReport.id,
                title: updatedReport.projectName || updatedReport.title,
                date: updatedReport.createdAt || updatedReport.date,
                status: updatedReport.status || 'Draft',
                type: 'cmvr',
                ...updatedReport
            };

            set(state => ({
                reports: state.reports.map(r => r.id === reportId ? formattedReport : r),
                selectedReport: formattedReport,
                isLoading: false
            }));

            return { success: true, report: formattedReport };
            
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error updating CMVR report:", error.message);
            return { success: false, error: error.message };
        }
    },

    // Delete CMVR report - DELETE /api/cmvr/{id}
    deleteReport: async (reportId) => {
        set({ isLoading: true, error: null });
        
        try {
            const endpoint = `${BASE_URL}/cmvr/${reportId}`;
            
            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error('Failed to delete CMVR report');

            set(state => ({
                reports: state.reports.filter(r => r.id !== reportId),
                selectedReport: state.selectedReport?.id === reportId ? null : state.selectedReport,
                isLoading: false
            }));

            return { success: true };
            
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error deleting CMVR report:", error.message);
            return { success: false, error: error.message };
        }
    },

    // Generate DOCX for full report - GET /api/cmvr/{id}/docx
    generateReportDocx: async (reportId) => {
        set({ isLoading: true, error: null });
        
        try {
            const endpoint = `${BASE_URL}/cmvr/${reportId}/docx`;
            
            const response = await fetch(endpoint, {
                method: 'GET',
            });

            if (!response.ok) throw new Error('Failed to generate DOCX');

            const arrayBuffer = await response.arrayBuffer();
            const buffer = new Uint8Array(arrayBuffer);

            const fileUri = `${FileSystem.documentDirectory}cmvr-report-${reportId}.docx`;

            await FileSystem.writeAsStringAsync(
                fileUri,
                Buffer.from(buffer).toString('base64'),
                { encoding: FileSystem.EncodingType.Base64 }
            );

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            } else {
                alert('Sharing is not available on this device');
            }
            
            set({ isLoading: false });
            return { success: true, fileUri };
            
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error generating DOCX:", error.message);
            return { success: false, error: error.message };
        }
    },

    // Generate PDF for general info - GET /api/cmvr/{id}/pdf/general-info
    generateGeneralInfoPdf: async (reportId) => {
        set({ isLoading: true, error: null });
        
        try {
            const endpoint = `${BASE_URL}/cmvr/${reportId}/pdf/general-info`;
            
            const response = await fetch(endpoint, {
                method: 'GET',
            });

            if (!response.ok) throw new Error('Failed to generate PDF');

            const arrayBuffer = await response.arrayBuffer();
            const buffer = new Uint8Array(arrayBuffer);

            const fileUri = `${FileSystem.documentDirectory}cmvr-general-info-${reportId}.pdf`;

            await FileSystem.writeAsStringAsync(
                fileUri,
                Buffer.from(buffer).toString('base64'),
                { encoding: FileSystem.EncodingType.Base64 }
            );

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            } else {
                alert('Sharing is not available on this device');
            }
            
            set({ isLoading: false });
            return { success: true, fileUri };
            
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error generating PDF:", error.message);
            return { success: false, error: error.message };
        }
    },

    // Clear selected report
    clearSelectedReport: () => {
        set({ selectedReport: null });
    },

    // Clear error
    clearError: () => {
        set({ error: null });
    }
}));