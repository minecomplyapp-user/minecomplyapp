import { apiPost } from "./api";
import { supabase } from "./supabase";
import Constants from "expo-constants";
import * as FileSystem from "expo-file-system/legacy";

export type SignedUploadUrlResponse = {
  url: string;
  path: string;
  token?: string;
};

export async function createSignedUploadUrl(
  filename: string,
  options?: { upsert?: boolean }
): Promise<SignedUploadUrlResponse> {
  return apiPost<SignedUploadUrlResponse>("/storage/upload-url", {
    filename,
    ...(options?.upsert !== undefined ? { upsert: options.upsert } : {}),
  });
}

export async function createSignedDownloadUrl(
  path: string,
  expiresIn?: number
): Promise<{ url: string }> {
  return apiPost<{ url: string }>("/storage/download-url", {
    path,
    ...(expiresIn !== undefined ? { expiresIn } : {}),
  });
}

/**
 * Get public URL for a file in Supabase Storage
 * This is faster and doesn't require backend call
 */
export function getPublicUrl(path: string): string {
  const { data } = supabase.storage
    .from("minecomplyapp-bucket")
    .getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Helper function to ensure session is valid before uploads
 */
async function ensureValidSession(): Promise<void> {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData?.session) {
      console.warn("⚠️ No active session, attempting to refresh...");
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError || !refreshData?.session) {
        console.error("❌ Failed to refresh session:", refreshError);
        throw new Error("Your session has expired. Please log out and log back in.");
      }
      console.log("✅ Session refreshed successfully");
    } else {
      // Check if token is about to expire (within 5 minutes)
      const expiresAt = sessionData.session.expires_at;
      if (expiresAt) {
        const expiresIn = expiresAt - Math.floor(Date.now() / 1000);
        if (expiresIn < 300) { // Less than 5 minutes
          console.log("🔄 Token expiring soon, refreshing session...");
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            console.warn("⚠️ Failed to refresh session, continuing with current token:", refreshError);
          } else {
            console.log("✅ Session refreshed proactively");
          }
        }
      }
    }
  } catch (sessionCheckError: any) {
    console.warn("⚠️ Session check failed, continuing with upload:", sessionCheckError);
    // Continue with upload even if session check fails
  }
}

/**
 * Helper function to handle upload with automatic retry on token expiration
 */
async function handleUploadWithRetry(
  path: string,
  arrayBuffer: ArrayBuffer,
  contentType: string,
  upsert: boolean
): Promise<{ path: string; id?: string; fullPath?: string }> {
  const { data, error } = await supabase.storage
    .from("minecomplyapp-bucket")
    .upload(path, arrayBuffer, {
      contentType,
      cacheControl: "3600",
      upsert,
    });

  if (error) {
    // Check if it's a token expiration error (we'll retry, so log as warning)
    const isTokenError = 
      error.message?.includes("exp") ||
      error.message?.includes("timestamp") ||
      error.message?.includes("JWT") ||
      error.message?.includes("signature verification");
    
    if (isTokenError) {
      console.warn("⚠️ Upload failed due to token expiration, will retry:", {
        message: error.message,
        statusCode: (error as any).statusCode,
      });
      console.log("🔄 Token expiration detected, attempting to refresh and retry...");
      try {
        // Refresh the session
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error("❌ Failed to refresh session:", refreshError);
          throw new Error("Your session has expired. Please log out and log back in.");
        }
        
        if (!refreshData?.session) {
          console.error("❌ No session returned after refresh");
          throw new Error("Session refresh failed. Please log out and log back in.");
        }
        
        console.log("✅ Session refreshed successfully");
        
        // Verify the new session is valid by getting it again
        const { data: verifyData, error: verifyError } = await supabase.auth.getSession();
        if (verifyError || !verifyData?.session) {
          console.error("❌ Failed to verify refreshed session:", verifyError);
          throw new Error("Session verification failed. Please try again.");
        }
        
        console.log("✅ Session verified, retrying upload...");
        console.log("📋 New session expires at:", verifyData.session.expires_at);
        
        // Small delay to ensure client picks up the new token
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Retry upload once after refresh
        console.log("🔄 Attempting retry upload...");
        const { data: retryData, error: retryError } = await supabase.storage
          .from("minecomplyapp-bucket")
          .upload(path, arrayBuffer, {
            contentType,
            cacheControl: "3600",
            upsert,
          });
        
        if (retryError) {
          console.error("❌ Retry upload failed:", {
            message: retryError.message,
            statusCode: (retryError as any).statusCode,
            error: retryError,
          });
          
          // If retry still fails with token error, the session might be completely invalid
          if (
            retryError.message?.includes("exp") ||
            retryError.message?.includes("timestamp") ||
            retryError.message?.includes("JWT") ||
            retryError.message?.includes("signature verification")
          ) {
            // Try one more time with a fresh session check
            console.log("🔄 Retry still failed with token error, checking session again...");
            const { data: finalSessionCheck } = await supabase.auth.getSession();
            if (finalSessionCheck?.session) {
              console.log("📋 Final session check - expires at:", finalSessionCheck.session.expires_at);
              // Wait a bit more and try one final time
              await new Promise(resolve => setTimeout(resolve, 300));
              const { data: finalRetryData, error: finalRetryError } = await supabase.storage
                .from("minecomplyapp-bucket")
                .upload(path, arrayBuffer, {
                  contentType,
                  cacheControl: "3600",
                  upsert,
                });
              
              if (finalRetryError) {
                console.error("❌ Final retry also failed:", finalRetryError.message);
                throw new Error("Your session has expired. Please log out and log back in to continue.");
              }
              
              console.log("✅ Upload succeeded on final retry!");
              return finalRetryData;
            }
            
            throw new Error("Your session has expired. Please log out and log back in to continue.");
          }
          
          throw new Error("File upload failed after refreshing session. Please try again.");
        }
        
        console.log("✅ Upload succeeded after retry!");
        return retryData;
      } catch (retryError: any) {
        console.error("❌ Retry after refresh failed:", retryError);
        // Re-throw with the original error message if it's a user-friendly message
        if (retryError.message && retryError.message.includes("session") || retryError.message.includes("log")) {
          throw retryError;
        }
        throw new Error("File upload failed after refreshing session. Please try again.");
      }
    } else {
      // Non-token errors are logged as errors since we won't retry
      console.error("❌ Supabase upload failed:", {
        message: error.message,
        statusCode: (error as any).statusCode,
        error: error,
      });
      throw error;
    }
  }

  return data;
}

export type UploadFromUriParams = {
  uri: string;
  fileName: string;
  contentType?: string;
  upsert?: boolean;
  folder?: string; // optional folder path inside bucket (e.g. 'epep/upload')
};

export async function uploadFileFromUri({
  uri,
  fileName,
  contentType,
  upsert,
  folder,
}: UploadFromUriParams): Promise<{ path: string }> {
  console.log("📤 Starting uploadFileFromUri (Supabase SDK direct upload)...");
  console.log("📝 Parameters:", {
    fileName,
    contentType,
    upsert,
    uriLength: uri.length,
  });

  // Generate unique path with UUID prefix
  const uniqueId =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const prefix = folder ? folder.replace(/^\/+|\/+$/g, '') : 'uploads';
  const path = `${prefix}/${uniqueId}-${fileName}`;

  console.log("📂 Upload path:", path);

  // Read file as base64 (React Native requires this for Supabase upload)
  console.log("� Reading file from URI...");
  let arrayBuffer: ArrayBuffer;

  try {
    // Try to read as base64 first
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log("✅ File read as base64, length:", base64.length);

    // Convert base64 to ArrayBuffer for Supabase upload
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    arrayBuffer = bytes.buffer;
  } catch (readError: any) {
    console.error("❌ Failed to read file:", readError);
    throw new Error("Failed to read file. Please try selecting the file again.");
  }

  // Ensure session is valid before uploading
  await ensureValidSession();

  // Upload using Supabase SDK directly (no signed URL needed)
  console.log("🚀 Uploading to Supabase Storage via SDK...");
  const data = await handleUploadWithRetry(
    path,
    arrayBuffer,
    contentType ?? "application/octet-stream",
    upsert ?? false
  );

  console.log("✅ Upload succeeded!", {
    path: data.path,
    id: data.id,
    fullPath: data.fullPath,
  });
  console.log("✅ File should now be visible at path:", data.path);

  return { path: data.path };
}

/**
 * Upload a signature image to the signatures/ folder
 * Returns both path and public URL
 */
export async function uploadSignature(uri: string): Promise<{ path: string; url: string }> {
  console.log("📤 Starting uploadSignature (Supabase SDK direct upload)...");
  console.log("📝 URI length:", uri.length);

  // Generate unique path with UUID prefix
  const timestamp = Date.now();
  const uniqueId =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const path = `signatures/${uniqueId}-signature-${timestamp}.png`;

  console.log("📂 Upload path:", path);

  // Read file as base64 (React Native requires this for Supabase upload)
  console.log("� Reading file from URI...");
  let arrayBuffer: ArrayBuffer;

  try {
    // Try to read as base64 first
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log("✅ File read as base64, length:", base64.length);

    // Convert base64 to ArrayBuffer for Supabase upload
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    arrayBuffer = bytes.buffer;
  } catch (readError: any) {
    console.error("❌ Failed to read signature:", readError);
    throw new Error("Failed to read signature. Please try again.");
  }

  // Ensure session is valid before uploading
  await ensureValidSession();

  // Upload using Supabase SDK directly (no signed URL needed)
  console.log("🚀 Uploading to Supabase Storage via SDK...");
  const data = await handleUploadWithRetry(
    path,
    arrayBuffer,
    "image/png",
    false
  );

  console.log("✅ Upload succeeded!", {
    path: data.path,
    id: data.id,
    fullPath: data.fullPath,
  });
  console.log("✅ File should now be visible at path:", data.path);

  // Get public URL directly from Supabase client (no backend call needed)
  const publicUrl = getPublicUrl(data.path);
  console.log("✅ Public URL generated:", publicUrl);

  return { path: data.path, url: publicUrl };
}

/**
 * Upload an attachment image to the uploads/ folder
 */
export async function uploadAttachment(
  uri: string,
  fileName?: string,
  folder?: string
): Promise<{ path: string }> {
  console.log("📤 Starting uploadAttachment (Supabase SDK direct upload)...");
  console.log("📝 URI length:", uri.length);

  // Generate unique path with UUID prefix
  const timestamp = Date.now();
  const defaultFileName = `attachment-${timestamp}.jpg`;
  const finalFileName = fileName || defaultFileName;
  const uniqueId =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const prefix = folder ? folder.replace(/^\/+|\/+$/g, '') : 'uploads';
  const path = `${prefix}/${uniqueId}-${finalFileName}`;

  console.log("📂 Upload path:", path);

  // Read file as base64 (React Native requires this for Supabase upload)
  console.log("📖 Reading file from URI...");
  let arrayBuffer: ArrayBuffer;

  try {
    // Try to read as base64 first
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log("✅ File read as base64, length:", base64.length);

    // Convert base64 to ArrayBuffer for Supabase upload
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    arrayBuffer = bytes.buffer;
  } catch (readError: any) {
    console.error("❌ Failed to read attachment:", readError);
    throw new Error("Failed to read attachment. Please try selecting the file again.");
  }

  // Ensure session is valid before uploading
  await ensureValidSession();

  // Upload using Supabase SDK directly (no signed URL needed)
  console.log("🚀 Uploading to Supabase Storage via SDK...");
  const data = await handleUploadWithRetry(
    path,
    arrayBuffer,
    "image/jpeg",
    false
  );

  console.log("✅ Upload succeeded!", {
    path: data.path,
    id: data.id,
    fullPath: data.fullPath,
  });
  console.log("✅ File should now be visible at path:", data.path);

  return { path: data.path };
}

/**
 * Upload a QR code image to the qr-codes/ folder
 */
export async function uploadQRCode(
  uri: string,
  fileName?: string,
  upsert: boolean = true
): Promise<{ path: string }> {
  console.log("📤 Starting uploadQRCode (Supabase SDK direct upload)...");

  const timestamp = Date.now();
  const defaultFileName = fileName || `qr-${timestamp}.jpg`;
  const uniqueId =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const path = `qr-codes/${uniqueId}-${defaultFileName}`;

  console.log("📂 Upload path:", path);

  // Read file as base64 (React Native requires this for Supabase upload)
  console.log("📖 Reading file from URI...");
  let arrayBuffer: ArrayBuffer;

  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log("✅ File read as base64, length:", base64.length);

    // Convert base64 to ArrayBuffer for Supabase upload
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    arrayBuffer = bytes.buffer;
  } catch (readError: any) {
    console.error("❌ Failed to read QR file:", readError);
    throw new Error("Failed to read QR file. Please try again.");
  }

  // Ensure session is valid before uploading
  await ensureValidSession();

  // Upload using Supabase SDK directly
  console.log("🚀 Uploading QR to Supabase Storage via SDK...");
  const data = await handleUploadWithRetry(
    path,
    arrayBuffer,
    "image/jpeg",
    upsert
  );

  console.log("✅ QR upload succeeded!", {
    path: data.path,
  });

  return { path: data.path };
}

const sanitizeFileName = (name: string): string => {
  if (!name) {
    return "file";
  }
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
};

const guessExtension = (mimeType?: string): string => {
  if (!mimeType) {
    return "jpg";
  }
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/heic": "heic",
    "image/heif": "heif",
    "image/gif": "gif",
  };
  return map[mimeType.toLowerCase()] || mimeType.split("/").pop() || "jpg";
};

const ensureExtension = (name: string, fallbackExt: string): string => {
  if (!name) {
    return `file.${fallbackExt}`;
  }
  const sanitized = sanitizeFileName(name);
  if (/\.[a-zA-Z0-9]+$/.test(sanitized)) {
    return sanitized;
  }
  return `${sanitized}.${fallbackExt}`;
};

type UploadProjectLocationImageParams = {
  uri: string;
  fileName?: string;
  mimeType?: string;
  upsert?: boolean;
};

/**
 * Upload a project location image to the location/ folder
 */
export async function uploadProjectLocationImage({
  uri,
  fileName,
  mimeType,
  upsert,
}: UploadProjectLocationImageParams): Promise<{ path: string }> {
  console.log("📤 Starting uploadProjectLocationImage...");
  if (!uri) {
    throw new Error("Invalid image. Please select an image and try again.");
  }

  const timestamp = Date.now();
  const fallbackExt = guessExtension(mimeType);
  const derivedName = fileName
    ? ensureExtension(fileName, fallbackExt)
    : `project-location-${timestamp}.${fallbackExt}`;
  const finalFileName = sanitizeFileName(derivedName);
  const uniqueId =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const path = `location/${uniqueId}-${finalFileName}`;

  console.log("📂 Upload path:", path);

  let arrayBuffer: ArrayBuffer;
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log("✅ File read as base64, length:", base64.length);
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    arrayBuffer = bytes.buffer;
  } catch (readError: any) {
    console.error("❌ Failed to read project location image:", readError);
    throw new Error("Failed to read image. Please try selecting the image again.");
  }

  const contentType = mimeType ?? "image/jpeg";

  // Ensure session is valid before uploading
  await ensureValidSession();

  console.log("🚀 Uploading project location image to Supabase Storage...");
  const data = await handleUploadWithRetry(
    path,
    arrayBuffer,
    contentType,
    upsert ?? false
  );

  console.log("✅ Project location image upload succeeded!", {
    path: data.path,
    id: data.id,
    fullPath: data.fullPath,
  });

  return { path: data.path };
}

type UploadNoiseQualityFileParams = {
  uri: string;
  fileName?: string;
  mimeType?: string;
  upsert?: boolean;
};

/**
 * Upload a noise quality monitoring file to the noise-quality/ folder
 */
export async function uploadNoiseQualityFile({
  uri,
  fileName,
  mimeType,
  upsert,
}: UploadNoiseQualityFileParams): Promise<{ path: string }> {
  console.log("📤 Starting uploadNoiseQualityFile...");
  if (!uri) {
    throw new Error("Invalid file. Please select a file and try again.");
  }

  const timestamp = Date.now();
  const fallbackExt = guessExtension(mimeType);
  const derivedName = fileName
    ? ensureExtension(fileName, fallbackExt)
    : `noise-quality-${timestamp}.${fallbackExt}`;
  const finalFileName = sanitizeFileName(derivedName);
  const uniqueId =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const path = `noise-quality/${uniqueId}-${finalFileName}`;

  console.log("📂 Upload path:", path);

  let arrayBuffer: ArrayBuffer;
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log("✅ File read as base64, length:", base64.length);
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    arrayBuffer = bytes.buffer;
  } catch (readError: any) {
    console.error("❌ Failed to read noise quality file:", readError);
    throw new Error("Failed to read file. Please try selecting the file again.");
  }

  const contentType = mimeType ?? "application/octet-stream";

  // Ensure session is valid before uploading
  await ensureValidSession();

  console.log("🚀 Uploading noise quality file to Supabase Storage...");
  const data = await handleUploadWithRetry(
    path,
    arrayBuffer,
    contentType,
    upsert ?? false
  );

  console.log("✅ Noise quality file upload succeeded!", {
    path: data.path,
    id: data.id,
    fullPath: data.fullPath,
  });

  return { path: data.path };
}

/**
 * Delete a file from Supabase storage
 */
export async function deleteFileFromStorage(
  path: string
): Promise<{ success: boolean }> {
  console.log("🗑️ Deleting file from storage:", path);

  if (!path) {
    console.warn("⚠️ No path provided, skipping deletion");
    return { success: false };
  }

  const { data, error } = await supabase.storage
    .from("minecomplyapp-bucket")
    .remove([path]);

  if (error) {
    console.error("❌ Failed to delete file:", {
      path,
      message: error.message,
      error,
    });
    // Don't throw - we want deletion to be non-blocking
    return { success: false };
  }

  console.log("✅ File deleted successfully:", path);
  return { success: true };
}

/**
 * Delete multiple files from Supabase storage
 */
export async function deleteFilesFromStorage(
  paths: string[]
): Promise<{ success: boolean; deletedCount: number }> {
  console.log("🗑️ Deleting multiple files from storage:", paths);

  if (!paths || paths.length === 0) {
    console.warn("⚠️ No paths provided, skipping deletion");
    return { success: true, deletedCount: 0 };
  }

  const validPaths = paths.filter((p) => p && p.trim());
  if (validPaths.length === 0) {
    console.warn("⚠️ No valid paths provided, skipping deletion");
    return { success: true, deletedCount: 0 };
  }

  const { data, error } = await supabase.storage
    .from("minecomplyapp-bucket")
    .remove(validPaths);

  if (error) {
    console.error("❌ Failed to delete files:", {
      paths: validPaths,
      message: error.message,
      error,
    });
    // Don't throw - we want deletion to be non-blocking
    return { success: false, deletedCount: 0 };
  }

  console.log("✅ Files deleted successfully:", {
    count: data.length,
    paths: validPaths,
  });
  return { success: true, deletedCount: data.length };
}
