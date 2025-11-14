import AsyncStorage from "@react-native-async-storage/async-storage";

const DRAFT_PREFIX = "cmvr_draft_";
const DRAFT_INDEX_KEY = "cmvr_draft_index";

export interface DraftMetadata {
  key: string;
  fileName: string;
  projectName?: string;
  lastSaved: string;
  createdAt: string;
}

/**
 * Get all CMVR draft keys from AsyncStorage
 */
export const getAllDraftKeys = async (): Promise<string[]> => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    return allKeys.filter((key) => key.startsWith(DRAFT_PREFIX));
  } catch (error) {
    console.error("Error getting draft keys:", error);
    return [];
  }
};

/**
 * Get metadata for all drafts
 */
export const getAllDraftMetadata = async (): Promise<DraftMetadata[]> => {
  try {
    const draftKeys = await getAllDraftKeys();
    const metadata: DraftMetadata[] = [];

    for (const key of draftKeys) {
      try {
        const draftStr = await AsyncStorage.getItem(key);
        if (draftStr) {
          const draft = JSON.parse(draftStr);
          metadata.push({
            key,
            fileName: draft.fileName || "Untitled Draft",
            projectName:
              draft.generalInfo?.projectNameCurrent ||
              draft.generalInfo?.projectName ||
              draft.generalInfo?.companyName ||
              "Untitled Project",
            lastSaved:
              draft.savedAt || draft.createdAt || new Date().toISOString(),
            createdAt:
              draft.createdAt || draft.savedAt || new Date().toISOString(),
          });
        }
      } catch (err) {
        console.log(`Error parsing draft ${key}:`, err);
      }
    }

    // Sort by last saved, newest first
    return metadata.sort(
      (a, b) =>
        new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime()
    );
  } catch (error) {
    console.error("Error getting draft metadata:", error);
    return [];
  }
};

/**
 * Get a specific draft by key
 */
export const getDraft = async (key: string): Promise<any | null> => {
  try {
    const draftStr = await AsyncStorage.getItem(key);
    return draftStr ? JSON.parse(draftStr) : null;
  } catch (error) {
    console.error(`Error getting draft ${key}:`, error);
    return null;
  }
};

/**
 * Save a draft to AsyncStorage
 */
export const saveDraft = async (
  fileName: string,
  data: any
): Promise<boolean> => {
  try {
    const key = `${DRAFT_PREFIX}${fileName || "temp"}`;
    const draftData = {
      ...data,
      fileName,
      savedAt: new Date().toISOString(),
      createdAt: data.createdAt || new Date().toISOString(),
    };

    await AsyncStorage.setItem(key, JSON.stringify(draftData));
    console.log("Draft saved:", key);
    return true;
  } catch (error) {
    console.error("Error saving draft:", error);
    return false;
  }
};

/**
 * Delete a draft by key
 */
export const deleteDraft = async (key: string): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(key);
    console.log("Draft deleted:", key);
    return true;
  } catch (error) {
    console.error(`Error deleting draft ${key}:`, error);
    return false;
  }
};

/**
 * Clear all drafts (use with caution)
 */
export const clearAllDrafts = async (): Promise<boolean> => {
  try {
    const draftKeys = await getAllDraftKeys();
    await AsyncStorage.multiRemove(draftKeys);
    console.log(`Cleared ${draftKeys.length} drafts`);
    return true;
  } catch (error) {
    console.error("Error clearing drafts:", error);
    return false;
  }
};
