import { create } from 'zustand';
import BASE_URL from './api'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
const ECC_STORAGE_KEY = '@ecc_data_array';

import { useAuth } from "../contexts/AuthContext";

export const useEccStore = create((set) => ({
    // ... (initial state)
    
    reports: [], 
    isLoading: false,
    selectedReport: null,
    setSelectedReport: (report) => set({ selectedReport: report }),

    clearSelectedReport:async () => {
    // Assuming 'selectedReport' is a state field you want to clear
    set({ selectedReport: null }); 
},
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
updateEcc : async (id, updatedEccObject,token) => {
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

    addReport: async (reportData,token) => { 
       
        set({ isLoading: true });
        
        try {
            const endpoint = `${BASE_URL}/ecc/createEccReport`; 

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' ,
                            'Authorization': `Bearer ${token}`, // <— REQUIRED when DISABLE_AUTH=false

                },
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
getReportById: async (id,token) => {

  set({ isLoading: true, selectedReport: null });
  try {
    const endpoint = `${BASE_URL}/ecc/getEccReportById/${id}`;
    
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`, // <— REQUIRED when DISABLE_AUTH=false

      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const report = await response.json();
    set({ selectedReport: report, isLoading: false });

    console.log("the reportwrtsD",report)

    return { success: true, report };
  } catch (error) {
    set({ isLoading: false });
    console.error(`Error fetching report ${id}:`, error);
    return { success: false, error: error.message };
  }
},

  getAllReports: async (createdById,token) => {
    // 1. Start Loading
    set({ isLoading: true, error: null }); 
    try {
        // 2. Fetch Data from the API endpoint
        // You'll need to replace 'YOUR_API_BASE_URL' and use a fetch or axios call.
        const response = await fetch(`${BASE_URL}/ecc/getAllEccReports/${createdById}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
            });
        if (!response.ok) {
            throw new Error('Failed to fetch ECC reports.');
        }

        const data = await response.json();
            console.log("fetched ecc report",data)
        // 3. Update State with the fetched data
        set({
            reports: data, // Assuming the API returns an array of reports
            isLoading: false,
        });

    } catch (error) {
        // 4. Handle Errors
        console.error('Error fetching reports:', error);
        set({
            error: error.message || 'An unknown error occurred',
            isLoading: false,
        });
    }
},
  
   
  createAndDownloadReport: async (reportData, token) => {
    try {
        console.log("Starting report creation API call...");
        
        const response = await fetch(`${BASE_URL}/ecc/createEccAndGenerateDocs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(reportData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
        
        const { download_url } = await response.json();
        console.log("DOWNLOAD URL (relative from service):", download_url);
        
        const base=BASE_URL+'/'

 
        const fullDownloadUrl = new URL(download_url, base).href;
        console.log(BASE_URL)
        console.log("Full Download URL:", fullDownloadUrl);
        return { success: true, download_url: fullDownloadUrl };

    } catch (error) {
        console.error('Report generation failed:', error);
        return { success: false, error: (error).message };
    }
}

}));