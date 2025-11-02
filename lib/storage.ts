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

export type UploadFromUriParams = {
  uri: string;
  fileName: string;
  contentType?: string;
  upsert?: boolean;
};

export async function uploadFileFromUri({
  uri,
  fileName,
  contentType,
  upsert,
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
  const path = `uploads/${uniqueId}-${fileName}`;

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
    throw new Error(`Failed to read file: ${readError.message}`);
  }

  // Upload using Supabase SDK directly (no signed URL needed)
  console.log("🚀 Uploading to Supabase Storage via SDK...");
  const { data, error } = await supabase.storage
    .from("minecomplyapp-bucket")
    .upload(path, arrayBuffer, {
      contentType: contentType ?? "application/octet-stream",
      cacheControl: "3600",
      upsert: upsert ?? false,
    });

  if (error) {
    console.error("❌ Supabase upload failed:", {
      message: error.message,
      statusCode: (error as any).statusCode,
      error: error,
    });
    throw new Error(`Upload failed: ${error.message}`);
  }

  console.log("✅ Upload succeeded!", {
    path: data.path,
    id: data.id,
    fullPath: data.fullPath,
  });
  console.log("✅ File should now be visible at path:", data.path);

  return { path: data.path };
}
