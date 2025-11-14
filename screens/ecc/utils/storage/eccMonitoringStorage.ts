import AsyncStorage from "@react-native-async-storage/async-storage";
import { PermitHolder } from "../../types/eccMonitoring";

const STORAGE_KEY = "ECC_MONITORING_V3";

export const loadStored = async (): Promise<{ permitHolders?: PermitHolder[] } | null> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("loadECCMonitoring err", e);
    return null;
  }
};




export const saveStored = async (payload: { permitHolders?: PermitHolder[] }) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn("saveECCMonitoring err", e);
  }
};
