# MineComply Mobile App - State Management Documentation

> Last Updated: December 2025

## Table of Contents

- [Overview](#overview)
- [Zustand Store Architecture](#zustand-store-architecture)
- [CMVR Store](#cmvr-store)
- [ECC Store](#ecc-store)
- [ECC Draft Store](#ecc-draft-store)
- [Store Interactions](#store-interactions)
- [Best Practices](#best-practices)

---

## Overview

The MineComply app uses **Zustand** for global state management. Zustand provides a simple, hook-based API for managing application state without the complexity of Redux.

**Why Zustand?**
- Minimal boilerplate
- No providers needed
- Works with TypeScript
- Small bundle size (~1KB)
- Easy to test
- React-first approach

---

## Zustand Store Architecture

### Store Structure

```javascript
const useStore = create((set, get) => ({
  // STATE
  data: initialData,
  isLoading: false,
  error: null,
  
  // ACTIONS
  fetchData: async () => {
    set({ isLoading: true });
    try {
      const data = await api.get('/data');
      set({ data, isLoading: false });
    } catch (error) {
      set({ error, isLoading: false });
    }
  },
  
  updateData: (newData) => set({ data: newData }),
}));
```

### Usage in Components

```typescript
// Subscribe to specific state
const data = useStore((state) => state.data);
const isLoading = useStore((state) => state.isLoading);

// Call actions
const fetchData = useStore((state) => state.fetchData);
const updateData = useStore((state) => state.updateData);

// Use in component
useEffect(() => {
  fetchData();
}, [fetchData]);
```

---

## CMVR Store

**Location**: `store/cmvrStore.js`

**Purpose**: Manage CMVR report state, drafts, and API operations

### State Shape

```javascript
{
  // Current report data
  currentReport: {
    generalInfo: {},
    permitHolderList: [],
    eccInfo: {},
    executiveSummaryOfCompliance: {},
    processDocumentationOfActivitiesUndertaken: {},
    complianceToProjectLocationAndCoverageLimits: {},
    complianceToImpactManagementCommitments: {},
    airQualityImpactAssessment: {},
    waterQualityImpactAssessment: {},
    noiseQualityImpactAssessment: {},
    complianceWithGoodPracticeInSolidAndHazardousWasteManagement: {},
    complianceWithGoodPracticeInChemicalSafetyManagement: {},
    complaintsVerificationAndManagement: [],
    recommendationsData: {},
    attendanceId: null,
  },
  
  // Metadata
  fileName: "Untitled",
  submissionId: null,
  projectId: null,
  projectName: "",
  createdById: null,
  
  // Lists
  submittedReports: [],
  
  // UI state
  isLoading: false,
  isSaving: false,
  error: null,
  isDirty: false,
  editedSections: [],
  isDraftLoaded: false,
  lastSavedAt: null,
}
```

### Key Actions

#### Report Management

**`initializeNewReport(fileName)`**
```javascript
// Create a new empty report
useCmvrStore.getState().initializeNewReport("Q3_2025_CMVR");
```

**`loadReport(reportData)`**
```javascript
// Load existing report into store
const report = await fetchReportById(id);
useCmvrStore.getState().loadReport(report);
```

**`clearReport()`**
```javascript
// Clear current report and reset state
useCmvrStore.getState().clearReport();
```

#### Section Updates

**`updateSection(sectionName, sectionData)`**
```javascript
// Update a single section
useCmvrStore.getState().updateSection('generalInfo', {
  companyName: "Acme Mining",
  location: "Region 1",
  // ... more fields
});
```

**`updateMultipleSections(sectionsData)`**
```javascript
// Update multiple sections at once
useCmvrStore.getState().updateMultipleSections({
  generalInfo: { ... },
  executiveSummaryOfCompliance: { ... },
});
```

#### Draft Management

**`saveDraft()`**
```javascript
// Save current report as draft
const result = await useCmvrStore.getState().saveDraft();
if (result.success) {
  console.log('Draft saved at:', result.savedAt);
}
```

**`loadDraft()`**
```javascript
// Load draft from AsyncStorage
const result = await useCmvrStore.getState().loadDraft();
if (result.success) {
  console.log('Draft loaded');
}
```

**`deleteDraft()`**
```javascript
// Delete draft from AsyncStorage
await useCmvrStore.getState().deleteDraft();
```

**`hasDraft()`**
```javascript
// Check if draft exists
const exists = await useCmvrStore.getState().hasDraft();
```

#### API Operations

**`submitReport(token)`**
```javascript
// Submit report to API
const result = await useCmvrStore.getState().submitReport(token);
if (result.success) {
  console.log('Report submitted:', result.report.id);
}
```

**`updateSubmittedReport(reportId, token)`**
```javascript
// Update existing submission
const result = await useCmvrStore.getState().updateSubmittedReport(reportId, token);
```

**`fetchUserReports(userId, token)`**
```javascript
// Fetch all reports for user
const result = await useCmvrStore.getState().fetchUserReports(userId, token);
if (result.success) {
  console.log('Fetched reports:', result.reports);
}
```

**`deleteSubmittedReport(reportId, token)`**
```javascript
// Delete a submitted report
await useCmvrStore.getState().deleteSubmittedReport(reportId, token);
```

#### Utilities

**`getCurrentReport()`**
```javascript
// Get complete current report data
const reportData = useCmvrStore.getState().getCurrentReport();
```

**`transformToDTO()`**
```javascript
// Transform store data to API DTO format
const dto = useCmvrStore.getState().transformToDTO();
```

**`markAsDirty()` / `markAsClean()`**
```javascript
// Track unsaved changes
useCmvrStore.getState().markAsDirty();
useCmvrStore.getState().markAsClean();
```

**`fillAllTestData()`**
```javascript
// Fill store with test data (development)
useCmvrStore.getState().fillAllTestData();
```

### Data Normalization

The CMVR store includes robust data normalization to handle various input formats:

```javascript
// Normalize operations section
const normalizeOperationSection = (incoming, title) => {
  const base = createOperationSection(title);
  if (!isObject(incoming)) return base;
  return {
    ...base,
    ...incoming,
    measures: ensureArray(incoming.measures, base.measures),
  };
};

// Usage in component
const reportData = useCmvrStore((state) => state.currentReport);
// Always has proper structure even if data is incomplete
```

### Usage Example

```typescript
// In CMVR screen component
import { useCmvrStore } from '../../store/cmvrStore';

function GeneralInfoScreen() {
  // Subscribe to specific state
  const generalInfo = useCmvrStore((state) => 
    state.currentReport?.generalInfo || {}
  );
  const updateSection = useCmvrStore((state) => state.updateSection);
  const saveDraft = useCmvrStore((state) => state.saveDraft);
  
  const [formData, setFormData] = useState(generalInfo);
  
  const handleSave = async () => {
    // Update store
    updateSection('generalInfo', formData);
    
    // Save draft
    const result = await saveDraft();
    if (result.success) {
      Alert.alert('Success', 'Draft saved');
      navigation.goBack();
    }
  };
  
  return (
    <View>
      <TextInput
        value={formData.companyName}
        onChangeText={(text) => 
          setFormData({ ...formData, companyName: text })
        }
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}
```

---

## ECC Store

**Location**: `store/eccStore.js`

**Purpose**: Manage ECC report state and API operations

### State Shape

```javascript
{
  // Reports list
  eccReports: [],
  
  // Selected report
  selectedReport: null,
  
  // UI state
  isLoading: false,
  error: null,
}
```

### Key Actions

**`addReport(report)`**
```javascript
// Add new report to list
useEccStore.getState().addReport(newReport);
```

**`fetchReportsByUser(userId, token)`**
```javascript
// Fetch user's ECC reports
await useEccStore.getState().fetchReportsByUser(userId, token);
```

**`selectReport(report)`**
```javascript
// Set selected report for editing
useEccStore.getState().selectReport(report);
```

**`clearSelectedReport()`**
```javascript
// Clear selected report
useEccStore.getState().clearSelectedReport();
```

**`createAndDownloadReport(reportData, token)`**
```javascript
// Create report and download documents
const result = await useEccStore.getState().createAndDownloadReport(
  reportData,
  token
);
```

### Usage Example

```typescript
import { useEccStore } from '../../store/eccStore';

function ECCMonitoringScreen() {
  const eccReports = useEccStore((state) => state.eccReports);
  const isLoading = useEccStore((state) => state.isLoading);
  const fetchReports = useEccStore((state) => state.fetchReportsByUser);
  
  useEffect(() => {
    if (user?.id && token) {
      fetchReports(user.id, token);
    }
  }, [user, token]);
  
  return (
    <FlatList
      data={eccReports}
      renderItem={({ item }) => <ReportCard report={item} />}
      refreshing={isLoading}
      onRefresh={() => fetchReports(user.id, token)}
    />
  );
}
```

---

## ECC Draft Store

**Location**: `store/eccDraftStore.js`

**Purpose**: Specialized draft management for ECC reports

### State Shape

```javascript
{
  drafts: [],
  isLoading: false,
  error: null,
}
```

### Key Actions

**`saveDraft(draftKey, draftData)`**
```javascript
// Save ECC draft
await useEccDraftStore.getState().saveDraft('ecc_draft_001', draftData);
```

**`loadDraft(draftKey)`**
```javascript
// Load specific draft
const draft = await useEccDraftStore.getState().loadDraft('ecc_draft_001');
```

**`getAllDrafts()`**
```javascript
// Get all draft metadata
const drafts = await useEccDraftStore.getState().getAllDrafts();
```

**`deleteDraft(draftKey)`**
```javascript
// Delete specific draft
await useEccDraftStore.getState().deleteDraft('ecc_draft_001');
```

**`updateDraft(draftKey, updatedData)`**
```javascript
// Update existing draft
await useEccDraftStore.getState().updateDraft('ecc_draft_001', newData);
```

---

## Store Interactions

### Cross-Store Communication

Stores are independent but can interact through actions:

```javascript
// In CMVR screen - link attendance to report
const attendanceId = route.params.attendanceId;
const updateMultipleSections = useCmvrStore((state) => state.updateMultipleSections);

updateMultipleSections({
  attendanceId: attendanceId,
  attendanceUrl: attendanceId, // Legacy compatibility
});
```

### Store + API Integration

Stores handle API calls internally:

```javascript
// CMVR Store - submitReport action
submitReport: async (token) => {
  const state = get();
  
  set({ isLoading: true, error: null });
  
  try {
    // Transform to DTO
    const payload = get().transformToDTO();
    
    // API call
    const response = await fetch(`${BASE_URL}/cmvr`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    
    const report = await response.json();
    
    set({
      submissionId: report.id,
      isLoading: false,
      isDirty: false,
    });
    
    // Delete draft after successful submission
    await get().deleteDraft();
    
    return { success: true, report };
  } catch (error) {
    set({ isLoading: false, error: error.message });
    return { success: false, error: error.message };
  }
},
```

### Store + AsyncStorage Integration

Drafts persist to AsyncStorage:

```javascript
// CMVR Store - saveDraft action
saveDraft: async () => {
  const state = get();
  
  try {
    const draftData = {
      ...state.currentReport,
      fileName: state.fileName,
      savedAt: new Date().toISOString(),
    };
    
    // Save to multi-file system
    await saveDraftToStorage(state.fileName, draftData);
    
    // Also save to single slot for quick resume
    await AsyncStorage.setItem(
      CMVR_DRAFT_STORAGE_KEY,
      JSON.stringify(draftData)
    );
    
    set({ isDirty: false, lastSavedAt: draftData.savedAt });
    
    return { success: true, savedAt: draftData.savedAt };
  } catch (error) {
    return { success: false, error: error.message };
  }
},
```

---

## Best Practices

### 1. Selective Subscriptions

Subscribe only to needed state to avoid unnecessary re-renders:

```typescript
// ❌ Bad - subscribes to entire store
const store = useCmvrStore();

// ✅ Good - subscribe to specific values
const generalInfo = useCmvrStore((state) => state.currentReport?.generalInfo);
const updateSection = useCmvrStore((state) => state.updateSection);
```

### 2. Avoid Inline Selectors

Extract selectors for better performance:

```typescript
// ❌ Bad - creates new function every render
const data = useCmvrStore((state) => state.currentReport?.generalInfo?.companyName);

// ✅ Good - stable selector function
const selectCompanyName = (state) => state.currentReport?.generalInfo?.companyName;
const companyName = useCmvrStore(selectCompanyName);
```

### 3. Use Actions for Complex Logic

Keep components simple, put logic in store actions:

```typescript
// ❌ Bad - complex logic in component
const handleSave = async () => {
  const token = await getToken();
  const dto = transformData(formData);
  const response = await fetch(...);
  // ... more logic
};

// ✅ Good - logic in store action
const submitReport = useCmvrStore((state) => state.submitReport);
const handleSave = async () => {
  const result = await submitReport(token);
  if (result.success) {
    navigation.navigate('Dashboard');
  }
};
```

### 4. Normalize Data

Use normalization helpers to ensure consistent data structure:

```typescript
// Store includes normalization
const normalizeReportData = (reportData = {}) => {
  const base = createEmptyReportState();
  return {
    generalInfo: mergeObjects(base.generalInfo, reportData.generalInfo),
    permitHolderList: ensureArray(reportData.permitHolderList, []),
    // ... more normalization
  };
};

// Apply when loading data
loadReport: (reportData) => {
  set({
    currentReport: normalizeReportData(reportData),
    // ... other state
  });
},
```

### 5. Handle Loading States

Always track loading/error states for better UX:

```typescript
fetchData: async () => {
  set({ isLoading: true, error: null });
  try {
    const data = await api.fetch();
    set({ data, isLoading: false });
  } catch (error) {
    set({ error: error.message, isLoading: false });
  }
},
```

### 6. Persist Critical State

Save important state to AsyncStorage:

```typescript
// Auto-persist on changes
useEffect(() => {
  const unsubscribe = useCmvrStore.subscribe(
    (state) => state.isDirty,
    (isDirty) => {
      if (isDirty) {
        // Debounce and save
        debouncedSave();
      }
    }
  );
  return unsubscribe;
}, []);
```

### 7. Clean Up on Unmount

Clear sensitive data when leaving screens:

```typescript
useEffect(() => {
  return () => {
    // Clear selected report on unmount
    useEccStore.getState().clearSelectedReport();
  };
}, []);
```

### 8. Type Safety

Use TypeScript for store definitions:

```typescript
interface CMVRState {
  currentReport: CMVRReport | null;
  fileName: string;
  isLoading: boolean;
  error: string | null;
  
  updateSection: (name: string, data: any) => void;
  saveDraft: () => Promise<SaveResult>;
}

const useCmvrStore = create<CMVRState>((set, get) => ({
  // ... implementation
}));
```

---

## Testing Stores

### Unit Testing

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useCmvrStore } from '../store/cmvrStore';

describe('CMVR Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useCmvrStore.getState().clearReport();
  });
  
  it('should initialize with empty report', () => {
    const { result } = renderHook(() => useCmvrStore());
    expect(result.current.currentReport).toBeNull();
  });
  
  it('should update section', () => {
    const { result } = renderHook(() => useCmvrStore());
    
    act(() => {
      result.current.updateSection('generalInfo', {
        companyName: 'Test Company',
      });
    });
    
    expect(result.current.currentReport.generalInfo.companyName).toBe('Test Company');
    expect(result.current.isDirty).toBe(true);
  });
});
```

---

## Performance Optimization

### 1. Memoize Selectors

```typescript
import { useMemo } from 'react';

const selectFilteredReports = (state) => 
  state.reports.filter(r => r.status === 'active');

const filteredReports = useCmvrStore(selectFilteredReports);
```

### 2. Split Large Stores

If a store becomes too large, split into focused stores:

```typescript
// Instead of one large store
const useAppStore = create(...)

// Split into domain stores
const useCmvrStore = create(...)
const useEccStore = create(...)
const useAttendanceStore = create(...)
```

### 3. Debounce Updates

For frequent updates, debounce store calls:

```typescript
import { debounce } from 'lodash';

const debouncedUpdate = useMemo(
  () => debounce((data) => {
    useCmvrStore.getState().updateSection('generalInfo', data);
  }, 500),
  []
);

const handleChange = (field, value) => {
  setLocalState({ ...localState, [field]: value });
  debouncedUpdate({ ...localState, [field]: value });
};
```

---

## Troubleshooting

### Store Not Updating UI

**Problem**: Changes to store don't trigger re-render

**Solution**: Ensure you're subscribing with a selector:

```typescript
// ❌ Wrong
const store = useCmvrStore();

// ✅ Correct
const data = useCmvrStore((state) => state.currentReport);
```

### Data Lost on Navigation

**Problem**: Store data disappears after navigation

**Solution**: Store persists during app session. Use `saveDraft()` for persistence:

```typescript
useEffect(() => {
  return () => {
    // Save on unmount
    useCmvrStore.getState().saveDraft();
  };
}, []);
```

### Circular Dependencies

**Problem**: Store actions calling each other causes issues

**Solution**: Use get() to access other actions:

```typescript
create((set, get) => ({
  action1: () => {
    const action2 = get().action2;
    action2();
  },
  action2: () => {
    // ...
  },
}));
```

---

**Remember**: Zustand stores are the single source of truth for application state. Keep stores focused, normalized, and well-tested!

