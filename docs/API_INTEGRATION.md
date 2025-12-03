# MineComply Mobile App - API Integration

> Last Updated: December 2025

## Table of Contents

- [API Client Architecture](#api-client-architecture)
- [Base API Client](#base-api-client)
- [Module-Specific APIs](#module-specific-apis)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [File Upload/Download](#file-uploaddownload)

---

## API Client Architecture

**Location**: `lib/`

**Structure:**
- `api.ts` - Base HTTP client
- `cmvr.ts` - CMVR operations
- `compliance.ts` - ECC operations
- `storage.ts` - File operations
- `profile.ts` - Profile operations
- `supabase.ts` - Supabase client

---

## Base API Client

**Location**: `lib/api.ts`

### API Base URL Resolution

**Priority:**
1. `EXPO_PUBLIC_API_BASE_URL` (deployed)
2. `API_BASE_URL` (local override)
3. Auto-detected dev server + `:3000`
4. Fallback: `http://localhost:3000`

### Methods

**`apiGet<T>(path, init?)`**
```typescript
const reports = await apiGet<Report[]>('/cmvr');
```

**`apiPost<T>(path, body, init?)`**
```typescript
const report = await apiPost('/cmvr', reportData);
```

**`apiPatch<T>(path, body, init?)`**
```typescript
const updated = await apiPatch(`/cmvr/${id}`, updateData);
```

**`apiDelete<T>(path, init?)`**
```typescript
await apiDelete(`/cmvr/${id}`);
```

---

## Module-Specific APIs

### CMVR API (`lib/cmvr.ts`)

**`createCMVRReport(data, fileName?)`**
```typescript
const report = await createCMVRReport(cmvrData, "Q3_2025");
```

**`getAllCMVRReports()`**
```typescript
const reports = await getAllCMVRReports();
```

**`getCMVRReportById(id)`**
```typescript
const report = await getCMVRReportById(reportId);
```

**`getCMVRReportsByUser(userId)`**
```typescript
const userReports = await getCMVRReportsByUser(userId);
```

**`updateCMVRReport(id, data, fileName?)`**
```typescript
const updated = await updateCMVRReport(id, newData, "Updated_Name");
```

**`deleteCMVRReport(id)`**
```typescript
await deleteCMVRReport(reportId);
```

**`generateCMVRDocx(id, fileName?)`**
```typescript
const downloadUrl = await generateCMVRDocx(reportId);
// Opens in browser for download
```

### Storage API (`lib/storage.ts`)

**`uploadFileFromUri({ uri, fileName })`**
```typescript
const result = await uploadFileFromUri({
  uri: 'file:///path/to/file.jpg',
  fileName: 'photo.jpg',
});
console.log('Uploaded to:', result.path);
```

**`getDownloadUrl(path)`**
```typescript
const url = await getDownloadUrl('uploads/file.jpg');
```

**`deleteFiles(paths)`**
```typescript
await deleteFiles(['uploads/file1.jpg', 'uploads/file2.jpg']);
```

---

## Authentication

All API requests include Supabase JWT:

```typescript
async function getAccessToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
}

// Automatically injected in apiGet/Post/etc
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
}
```

---

## Error Handling

```typescript
try {
  const reports = await apiGet('/cmvr');
} catch (error) {
  // Error includes helpful message
  Alert.alert('Error', error.message);
}
```

**Error Messages Include:**
- Network errors with troubleshooting hints
- HTTP status codes
- Server error messages

---

## File Upload/Download

### Upload Flow

```typescript
// 1. Select file
const result = await ImagePicker.launchImageLibraryAsync();

// 2. Upload
const uploaded = await uploadFileFromUri({
  uri: result.uri,
  fileName: 'photo.jpg',
});

// 3. Save path to report
useCmvrStore.getState().updateSection('attachments', [
  { path: uploaded.path, caption: 'Site photo' }
]);
```

### Download Flow

```typescript
// DOCX downloads open in browser
await generateCMVRDocx(reportId);
// File downloaded by browser
```

