import AsyncStorage from '@react-native-async-storage/async-storage';

const ECC_DRAFT_KEY = '@ecc_draft_array';
import { create } from 'zustand'; // You may need to install this package: npm install zustand

export const useEccDraftStore = create((set) => ({
  
  saveDraft: async (draft) => {
    try {
      const draftWithId = {
        ...draft,
      id: "ECC-"+Date.now().toString().toString, // unique ID
      saveAt: Date.now()
  
   
   
    
      };

      console.log("asdasd",draft)

      const existing = await AsyncStorage.getItem(ECC_DRAFT_KEY);
      const drafts = existing ? JSON.parse(existing) : [];

      drafts.push(draftWithId);
      await AsyncStorage.setItem(ECC_DRAFT_KEY, JSON.stringify(drafts));

      return { success: true, draft: draftWithId };
    } catch (e) {
      console.log('saveDraft error:', e);
      return { success: false };
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
      if (!existing) return;

      let drafts = JSON.parse(existing);
      const index = drafts.findIndex(d => d.id === id);
      if (index === -1) return;

      drafts[index] = { id, ...updatedDraft };
      await AsyncStorage.setItem(ECC_DRAFT_KEY, JSON.stringify(drafts));

      return { success: true };
    } catch (e) {
      console.log("updateDraft error:", e);
    }
  },

  deleteDraft: async (id) => {
    try {
      const existing = await AsyncStorage.getItem(ECC_DRAFT_KEY);
      if (!existing) return;

      let drafts = JSON.parse(existing).filter(d => d.id !== id);
      await AsyncStorage.setItem(ECC_DRAFT_KEY, JSON.stringify(drafts));

      return { success: true };
    } catch (e) {
      console.log("deleteDraft error:", e);
    }
  },
  

  getDraftList: async () => {
      try {
          const existing = await AsyncStorage.getItem(ECC_DRAFT_KEY);
          
          if (!existing) {
              return [];
          }

          const drafts = JSON.parse(existing);
          
          // 🟢 MAPPING: Iterate over the full drafts and extract only the necessary metadata
          const metadataList = drafts.map(draft => ({
              id: draft.id,
              fileName: draft.filename || 'Untitled Draft', // Use a fallback if fileName is missing
              savedAt: draft.savedAt, // This is your 'updated' or 'saved' timestamp
            
            
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
      if (!existing) return null;

      const drafts = JSON.parse(existing);
      const draft = drafts.find(d => d.id === id);
      if (!draft) return null;

      // ✅ Extract and format permit_holder_with_conditions
      const permitHolders = draft?.permit_holders || [];
      console.log("permit holder",permitHolders)
      const formatted = permitHolders.map((holder) => {
        const conditions = holder.monitoringState?.formatted?.conditions ?? [];

        const monitoringState = conditions.map((cond) => ({
          id: String(cond.condition_number),
          title: cond.condition,
          descriptions: {
            complied: cond.remark_list?.[0] ?? '',
            partial: cond.remark_list?.[1] ?? '',
            not: cond.remark_list?.[2] ?? '',
          },
          isDefault: true,
          nested_to: cond.nested_to ? String(cond.nested_to) : null,
        }));

        return {
          id: holder.id,
          name: holder.name,
          type: holder.type,
          monitoringState,
        };
      });

      return { 
        filename: draft.filename,
        generalInfo:draft.generalInfo,
        permit_holders: draft.permit_holders,
        ...formatted
       };

    } catch (e) {
      console.log("loadDraftById error:", e);
      return { success: false };
    }
  }

}));
