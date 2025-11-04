import { create } from 'zustand';
import BASE_URL from './api'; 

export const useCmvrStore = create((set) => ({
    // ... (initial state)
    reports: [], 
    isLoading: false,
    selectedReport: null,

    generateGeneralInfoPdf: async () => { 
        set({ isLoading: true });
        
        try {
            const endpoint = `${BASE_URL}/cmvr/preview/general-info-docx`; 

            const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reportData),
            });

            if (!response.ok) throw new Error('Failed to generate document');

            // Convert the response to blob-like data
            const arrayBuffer = await response.arrayBuffer();
            const buffer = new Uint8Array(arrayBuffer);

            // Create a file path
            const fileUri = `${FileSystem.documentDirectory}cmvr-general-info-${reportData.id}.docx`;

            // Write file to local storage
            await FileSystem.writeAsStringAsync(
            fileUri,
            Buffer.from(buffer).toString('base64'),
            { encoding: FileSystem.EncodingType.Base64 }
            );

            // Open or share the file
            if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
            } else {
            alert('Sharing is not available on this device');
            }
            return { success: true, report: newReport }; 
            
        } catch (error) {
            set({ isLoading: false });
            console.error("Error creating ECC Report:", error.message);
            return { success: false, error: error.message };
        }
    }
}));