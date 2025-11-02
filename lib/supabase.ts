import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

// Get Supabase credentials from app config
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || "";
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase configuration. Please check your app.config.js"
  );
}

// Custom storage implementation for Expo with chunking to avoid 2KB limit on some platforms
const MAX_CHUNK = 1900; // leave headroom for metadata/overhead
// SecureStore keys must be alphanumeric plus '.', '-', '_'. Avoid ':' or other chars.
const CHUNK_INDEX_SUFFIX = "__chunks";

async function setChunkedItem(key: string, value: string) {
  // Remove existing chunks
  const existingIndex = await SecureStore.getItemAsync(
    key + CHUNK_INDEX_SUFFIX
  );
  if (existingIndex) {
    const count = parseInt(existingIndex, 10) || 0;
    await Promise.all(
      Array.from({ length: count }).map((_, i) =>
        SecureStore.deleteItemAsync(`${key}__${i}`)
      )
    );
    await SecureStore.deleteItemAsync(key + CHUNK_INDEX_SUFFIX);
  }

  if (value.length <= MAX_CHUNK) {
    await SecureStore.setItemAsync(key, value);
    return;
  }

  const chunks: string[] = [];
  for (let i = 0; i < value.length; i += MAX_CHUNK) {
    chunks.push(value.substring(i, i + MAX_CHUNK));
  }
  await Promise.all(
    chunks.map((chunk, idx) =>
      SecureStore.setItemAsync(`${key}__${idx}`, chunk)
    )
  );
  await SecureStore.setItemAsync(
    key + CHUNK_INDEX_SUFFIX,
    String(chunks.length)
  );
  // Store a small marker in the base key so getItem can quickly detect chunked value
  await SecureStore.setItemAsync(key, "__CHUNKED__");
}

async function getChunkedItem(key: string) {
  const base = await SecureStore.getItemAsync(key);
  if (base === "__CHUNKED__") {
    const countStr = await SecureStore.getItemAsync(key + CHUNK_INDEX_SUFFIX);
    const count = parseInt(countStr || "0", 10);
    if (!count) return null;
    const parts: (string | null)[] = await Promise.all(
      Array.from({ length: count }).map((_, i) =>
        SecureStore.getItemAsync(`${key}__${i}`)
      )
    );
    return parts.join("");
  }
  return base;
}

async function removeChunkedItem(key: string) {
  const countStr = await SecureStore.getItemAsync(key + CHUNK_INDEX_SUFFIX);
  const count = parseInt(countStr || "0", 10);
  if (count) {
    await Promise.all(
      Array.from({ length: count }).map((_, i) =>
        SecureStore.deleteItemAsync(`${key}__${i}`)
      )
    );
    await SecureStore.deleteItemAsync(key + CHUNK_INDEX_SUFFIX);
  }
  await SecureStore.deleteItemAsync(key);
}

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => getChunkedItem(key),
  setItem: (key: string, value: string) => setChunkedItem(key, value),
  removeItem: (key: string) => removeChunkedItem(key),
};

// Create Supabase client with proper configuration for React Native
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Important for React Native
  },
});
