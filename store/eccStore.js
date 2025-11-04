import { create } from 'zustand';
import BASE_URL from './api'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
const ECC_STORAGE_KEY = '@ecc_data_array';
export const useEccStore = create((set) => ({
    // ... (initial state)
    
    reports: [], 
    isLoading: false,
    selectedReport: null,
  saveEcc :async (newEccObject) => {
    try {
        // 1. GENERATE THE ID AND ADD IT TO THE NEW OBJECT
        const eccWithId = { 
            id: Date.now(), // Unique ID based on current timestamp
            ...newEccObject 
        };

        // 2. Retrieve the existing array data
        const existingDataString = await AsyncStorage.getItem(ECC_STORAGE_KEY);
        
        let eccsArray = [];

        if (existingDataString !== null) {
            eccsArray = JSON.parse(existingDataString);
        }

        // 3. Add the new object WITH the ID to the array
        eccsArray.push(eccWithId); 

        // 4. Stringify and save the updated array
        const jsonValue = JSON.stringify(eccsArray);
        await AsyncStorage.setItem(ECC_STORAGE_KEY, jsonValue);
        
        console.log(`New ECC (ID: ${eccWithId.id}) successfully added and array saved!`);
    } catch (e) {
        console.error('Error saving or retrieving ECC data:', e);
    }
},
updateEcc : async (id, updatedEccObject) => {
    try {
        // 1. Retrieve the existing array data
        const existingDataString = await AsyncStorage.getItem(ECC_STORAGE_KEY);
        
        if (existingDataString === null) {
            console.warn('Cannot update: No existing ECC data found in storage.');
            return;
        }

        let eccsArray = JSON.parse(existingDataString);

        // Ensure the updated object includes the original ID
        const eccWithId = { 
            id: id, 
            ...updatedEccObject 
        };

        // 2. Find the index of the object to update
        const indexToUpdate = eccsArray.findIndex(ecc => ecc.id === id);

        if (indexToUpdate === -1) {
            console.warn(`Cannot update: ECC item with ID ${id} not found.`);
            return;
        }

        // 3. Replace the old object with the new, updated object
        eccsArray[indexToUpdate] = eccWithId;

        // 4. Stringify and save the updated array
        const jsonValue = JSON.stringify(eccsArray);
        await AsyncStorage.setItem(ECC_STORAGE_KEY, jsonValue);
        
        console.log(`ECC item with ID ${id} successfully updated and saved!`);
        
    } catch (e) {
        console.error('Error updating ECC data:', e);
    }
},
    getEccList: async()=>{
        
        try {
            const jsonValue = await AsyncStorage.getItem(ECC_STORAGE_KEY);
            
            // Check if value exists, then parse it.
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.error('Error reading data:', e);
        }
       
    },

    addReport: async (reportData) => { 
        set({ isLoading: true });
        
        try {
            const endpoint = `${BASE_URL}/ecc/createEccReport`; 

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reportData), 
            });

            // 1. Check response status and handle errors
            if (!response.ok) {
                // Always try to parse JSON for error messages
                const errorData = await response.json(); 
                throw new Error(errorData.message || 'Failed to create ECC Report!');
            }
            
            // 2. Handle successful response (Robust Parsing)
            let newReport = {};
            const contentType = response.headers.get("content-type");

            // Only attempt to parse JSON if the header indicates JSON content
            if (contentType && contentType.includes("application/json")) {
                newReport = await response.json();
            } else {
                // If the server returns 200/201 but with no body/text, 
                // we return a default object to prevent crashing.
                console.warn("API returned success without a JSON body.");
                newReport = { id: 'temp-id', ...reportData, success: true }; 
            }
            
            // 3. Success: Update the store's state
            set((state) => ({ 
                reports: [...state.reports, newReport], 
                isLoading: false 
            }));

            // Return the successfully created/parsed report
            return { success: true, report: newReport }; 
            
        } catch (error) {
            set({ isLoading: false });
            console.error("Error creating ECC Report:", error.message);
            return { success: false, error: error.message };
        }
    },
    getReportById: async (id) => {
        set({ isLoading: true, selectedReport: null });
        try {
            const endpoint = `${BASE_URL}/ecc/getEccReportById/${id}`; // e hardcode lang sa ang id ari kay wako sure if multiple project bani
            const report = await apiRequest(endpoint, 'GET'); 
            const selectedReport = report;
            return { success: true, report: report };

        } catch (error) {
            set({ isLoading: false });
            console.error(`Error fetching report ${id}:`, error.message);
            return { success: false, error: error.message };
        }
    },
    getAllReports: async () => {
        set({ isLoading: true });   
    },
    updateCondition: async (conditionId, data) => {
        set({ isLoading: true });
        try {
            const endpoint = `${BASE_URL}/ecc/condition/${conditionId}`;
            // The API response is likely the updated condition or the full report
            const updatedCondition = await apiRequest(endpoint, 'PATCH', updateData); 

            // Logic to update the condition in the local state (e.g., in selectedReport) goes here.
            // ...

            set({ isLoading: false });
            return { success: true, condition: updatedCondition };
        } catch (error) {
            set({ isLoading: false });
            console.error(`Error updating condition ${conditionId}:`, error.message);
            return { success: false, error: error.message };
        }
    },
    addCondition: async (reportId, data) => {
        set({ isLoading: true });
        try {
            const endpoint = `${BASE_URL}/ecc/addCondition/${reportId}`;
            const newCondition = await apiRequest(endpoint, 'POST', createDto); 

            // Logic to add the new condition to the local state (e.g., in selectedReport) goes here.
            // ...
            
            set({ isLoading: false });
            return { success: true, condition: newCondition };
        } catch (error) {
            set({ isLoading: false });
            console.error(`Error adding condition to report ${reportId}:`, error.message);
            return { success: false, error: error.message };
        }
    },
     createAndDownloadReport: async (reportData) => {
    try {
        console.log("here")
        const response = await fetch(`${BASE_URL}/ecc/createEccAndGenerateDocs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add Authorization if needed
            },
            body: JSON.stringify(reportData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error: ${response.status} - ${errorText}`);
        }

        // Get filename from the Content-Disposition header set by NestJS
        const contentDisposition = response.headers.get('content-disposition');
        let filename = 'report_' + Date.now() + '.docx'; // Fallback filename
        if (contentDisposition) {
            const matches = contentDisposition.match(/filename="?(.+)"?/);
            if (matches && matches[1]) {
                filename = matches[1];
            }
        }
        
        // Get the response body as a Blob
        const fileBlob = await response.blob();

        return { success: true, fileBlob, filename };

    } catch (error) {
        console.error('Report generation failed:', error);
        return { success: false, error: (error).message };
    }
},
}));