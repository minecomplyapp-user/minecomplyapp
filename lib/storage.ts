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

/**
 * Upload a signature image to the signatures/ folder
 */
export async function uploadSignature(uri: string): Promise<{ path: string }> {
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
    throw new Error(`Failed to read signature: ${readError.message}`);
  }

  // Upload using Supabase SDK directly (no signed URL needed)
  console.log("🚀 Uploading to Supabase Storage via SDK...");
  const { data, error } = await supabase.storage
    .from("minecomplyapp-bucket")
    .upload(path, arrayBuffer, {
      contentType: "image/png",
      cacheControl: "3600",
      upsert: false,
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

/**
 * Upload an attachment image to the uploads/ folder
 */
export async function uploadAttachment(
  uri: string,
  fileName?: string
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
  const path = `uploads/${uniqueId}-${finalFileName}`;

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
    throw new Error(`Failed to read attachment: ${readError.message}`);
  }

  // Upload using Supabase SDK directly (no signed URL needed)
  console.log("🚀 Uploading to Supabase Storage via SDK...");
  const { data, error } = await supabase.storage
    .from("minecomplyapp-bucket")
    .upload(path, arrayBuffer, {
      contentType: "image/jpeg",
      cacheControl: "3600",
      upsert: false,
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
    throw new Error(`Failed to read QR file: ${readError.message}`);
  }

  // Upload using Supabase SDK directly
  console.log("🚀 Uploading QR to Supabase Storage via SDK...");
  const { data, error } = await supabase.storage
    .from("minecomplyapp-bucket")
    .upload(path, arrayBuffer, {
      contentType: "image/jpeg",
      cacheControl: "3600",
      upsert: upsert,
    });

  if (error) {
    console.error("❌ Supabase upload failed:", {
      message: error.message,
      statusCode: (error as any).statusCode,
      error: error,
    });
    throw new Error(`Upload failed: ${error.message}`);
  }

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
    throw new Error("Invalid image URI");
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
    throw new Error(`Failed to read image: ${readError.message}`);
  }

  const contentType = mimeType ?? "image/jpeg";

  console.log("🚀 Uploading project location image to Supabase Storage...");
  const { data, error } = await supabase.storage
    .from("minecomplyapp-bucket")
    .upload(path, arrayBuffer, {
      contentType,
      cacheControl: "3600",
      upsert: upsert ?? false,
    });

  if (error) {
    console.error("❌ Supabase upload failed:", {
      message: error.message,
      statusCode: (error as any).statusCode,
      error,
    });
    throw new Error(`Upload failed: ${error.message}`);
  }

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
    throw new Error("Invalid file URI");
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
    throw new Error(`Failed to read file: ${readError.message}`);
  }

  const contentType = mimeType ?? "application/octet-stream";

  console.log("🚀 Uploading noise quality file to Supabase Storage...");
  const { data, error } = await supabase.storage
    .from("minecomplyapp-bucket")
    .upload(path, arrayBuffer, {
      contentType,
      cacheControl: "3600",
      upsert: upsert ?? false,
    });

  if (error) {
    console.error("❌ Supabase upload failed:", {
      message: error.message,
      statusCode: (error as any).statusCode,
      error,
    });
    throw new Error(`Upload failed: ${error.message}`);
  }

  console.log("✅ Noise quality file upload succeeded!", {
    path: data.path,
    id: data.id,
    fullPath: data.fullPath,
  });

  return { path: data.path };
}
