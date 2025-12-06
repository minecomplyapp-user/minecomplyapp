import AsyncStorage from '@react-native-async-storage/async-storage';

const ECC_DRAFT_KEY = '@ecc_draft_array';
import { create } from 'zustand'; // You may need to install this package: npm install zustand

export const useEccDraftStore = create((set) => ({
  
  saveDraft: async (draft) => {
    try {
      const now = Date.now();
      
      // ✅ FIX: Deep clone draft to avoid reference issues
      const clonedDraft = JSON.parse(JSON.stringify(draft));
      
      const draftWithId = {
        ...clonedDraft,
        id: "ECC-" + now.toString(), // unique ID
        filename: clonedDraft.filename || clonedDraft.fileName || 'Untitled Draft',
        saveAt: clonedDraft.saveAt || new Date(now).toISOString(),
        date: new Date(clonedDraft.saveAt || now).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };

      // ✅ FIX: Validate critical data before saving
      console.log("=== ECC Draft Save Debug ===");
      console.log("Permit holders count:", (clonedDraft.permit_holders || []).length);
      console.log("General info present:", !!clonedDraft.generalInfo);
      console.log("MMT info present:", !!clonedDraft.mmtInfo);
      
      if (clonedDraft.permit_holders && clonedDraft.permit_holders.length > 0) {
        clonedDraft.permit_holders.forEach((holder, idx) => {
          console.log(`  Holder ${idx}: ${holder.name} (${(holder.monitoringState?.formatted?.conditions || []).length} conditions)`);
        });
      }
      console.log("================");

      const existing = await AsyncStorage.getItem(ECC_DRAFT_KEY);
      const drafts = existing ? JSON.parse(existing) : [];

      drafts.push(draftWithId);
      await AsyncStorage.setItem(ECC_DRAFT_KEY, JSON.stringify(drafts));

      console.log("✅ ECC draft saved successfully");
      return { success: true, draft: draftWithId };
    } catch (e) {
      console.error('❌ saveDraft error:', e);
      return { success: false, error: e.message };
    }
  },
clearDrafts: async () => { // ✅ FULL WIPE
    try {
      await AsyncStorage.removeItem(ECC_DRAFT_KEY);
      return { success: true };
    } catch (e) {
      console.log("clearDrafts error:", e);
      return { success: false };
    }
  },
  updateDraft: async (id, updatedDraft) => {
    try {
      const existing = await AsyncStorage.getItem(ECC_DRAFT_KEY);
      if (!existing) return { success: false, error: 'No drafts stored' };

      let drafts = JSON.parse(existing);
      const index = drafts.findIndex(d => d.id === id);
      if (index === -1) return { success: false, error: 'Draft not found' };

      // 1. Get the existing draft object
      const existingDraft = drafts[index]; 

      // ✅ FIX: Deep clone updatedDraft to avoid reference issues
      const clonedUpdate = JSON.parse(JSON.stringify(updatedDraft));

      // 2. Create the new merged draft
      //    This preserves existingDraft properties 
      //    and overwrites them with properties from updatedDraft (if any).
      //    The 'id' property is preserved/explicitly set last.
      const now = Date.now();
      const mergedDraft = {
        ...existingDraft,
        ...clonedUpdate,
        id: existingDraft.id, // Ensure the original ID is used
        saveAt: new Date(now).toISOString(),
        filename: clonedUpdate.filename || clonedUpdate.fileName || existingDraft.filename || existingDraft.fileName || 'Untitled Draft',
        date: new Date(now).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      };

      // ✅ FIX: Validate updated data
      console.log("=== ECC Draft Update Debug ===");
      console.log(`Updating draft ${id}`);
      console.log("Permit holders count:", (mergedDraft.permit_holders || []).length);
      console.log("================");

      // 3. Put the merged draft back into the array
      drafts[index] = mergedDraft;

      await AsyncStorage.setItem(ECC_DRAFT_KEY, JSON.stringify(drafts));
      console.log(`✅ Draft ${id} updated and merged successfully`);

      return { success: true };
    } catch (e) {
      console.error("❌ updateDraft error:", e);
      return { success: false, error: e.message };
    }
},

  deleteDraft: async (id) => {
    try {
      const existing = await AsyncStorage.getItem(ECC_DRAFT_KEY);
      if (!existing) return { success: false, error: 'No drafts stored' };

      let drafts = JSON.parse(existing).filter(d => d.id !== id);
      await AsyncStorage.setItem(ECC_DRAFT_KEY, JSON.stringify(drafts));

      return { success: true };
    } catch (e) {
      console.log("deleteDraft error:", e);
      return { success: false, error: e.message };
    }
  },
  

  getDraftList: async () => {
      try {
          const existing = await AsyncStorage.getItem(ECC_DRAFT_KEY);
          
          if (!existing) {
              return [];
          }

          const drafts = JSON.parse(existing);
          // console.log("DATE SAVED : ",drafts.date)
          // 🟢 MAPPING: Iterate over the full drafts and extract only the necessary metadata
      const metadataList = drafts.map(draft => ({
        id: draft.id,
        fileName: draft.filename || draft.fileName || 'Untitled Draft', // Use a fallback if fileName is missing
        date: draft.date, // formatted date
        saveAt: draft.saveAt || new Date().toISOString(),
      }));

          return metadataList;
      } catch (e) {
          console.log("getDraftList error:", e);
          return [];
      }
  },

  loadDraftById: async (id) => {
    try {
      const existing = await AsyncStorage.getItem(ECC_DRAFT_KEY);
      if (!existing) {
        console.warn("No drafts found in storage");
        return null;
      }

      const drafts = JSON.parse(existing);
      const draft = drafts.find(d => d.id === id);
      if (!draft) {
        console.warn(`Draft ${id} not found`);
        return null;
      }

      console.log("=== ECC Draft Load Debug ===");
      console.log(`Loading draft ${id}`);
      console.log("Filename:", draft.filename);
      
      // ✅ FIX: Return the complete draft data without losing information
      const permitHolders = draft?.permit_holders || [];
      console.log("Permit holders found:", permitHolders.length);
      
      // ✅ FIX: Preserve all original data, only format what's needed for UI
      const result = {
        draftId: id,
        filename: draft.filename || draft.fileName || 'Untitled',
        generalInfo: draft.generalInfo || {},
        mmtInfo: draft.mmtInfo || {},
        permit_holders: permitHolders,
        recommendations: draft.recommendations || draft.topass?.recommendations || [],
        // ✅ FIX: Preserve any additional data that might have been saved
        topass: draft.topass,
      };
      
      // Log each permit holder for debugging
      if (permitHolders.length > 0) {
        permitHolders.forEach((holder, idx) => {
          const condCount = holder.monitoringState?.formatted?.conditions?.length || 0;
          console.log(`  Holder ${idx}: ${holder.name} - ${condCount} conditions`);
        });
      } else {
        console.warn("⚠️  No permit holders found in draft!");
      }
      
      console.log("✅ Draft loaded successfully");
      console.log("================");

      return result;

    } catch (e) {
      console.error("❌ loadDraftById error:", e);
      return null;
    }
  }

}));
