# CMVR Missing Data - Fix Guide

## Problem Identified

The CMVR submission is only sending Page 1 data (generalInfo, permits, funds) but **missing all Page 2+ data** (executive summary, water quality, air quality, waste management, etc.) even though you've filled it in the frontend.

## Root Cause

The CMVR screens are **NOT passing their data through navigation**. When you navigate from one screen to another, the data collected on each screen is lost because it's not being included in the navigation params.

## What I Fixed

### 1. ✅ Updated `CMVRDocumentExportParams` Type

Added all compliance monitoring fields so they can be passed through navigation:

```typescript
type CMVRDocumentExportParams = {
  // ... existing Page 1 fields ...

  // NEW: Page 2+ fields
  executiveSummaryOfCompliance?: any;
  processDocumentationOfActivitiesUndertaken?: any;
  complianceToProjectLocationAndCoverageLimits?: any;
  complianceToImpactManagementCommitments?: any;
  airQualityImpactAssessment?: any;
  waterQualityImpactAssessment?: any;
  noiseQualityImpactAssessment?: any;
  complianceWithGoodPracticeInSolidAndHazardousWasteManagement?: any;
  complianceWithGoodPracticeInChemicalSafetyManagement?: any;
  complaintsVerificationAndManagement?: any;
  recommendationFromPrevQuarter?: any;
  recommendationForNextQuarter?: any;
  attendanceUrl?: string;
  documentation?: any;
};
```

### 2. ✅ Updated Route Params Extraction

Now extracts all the new fields from `route.params` when navigating to Export screen.

### 3. ✅ Updated `routeDraftUpdate`

Now merges all the new fields from route params into the draft snapshot.

### 4. ✅ Added Debug Logging

Added console.log statements to help you see what data is actually present when submitting.

## What YOU Need to Fix 🚨

**Each CMVR screen must pass its data forward when navigating to the next screen.**

### Pattern to Follow

When navigating from any CMVR screen to the next, you must:

```typescript
// 1. Accept previous data from route params
const route = useRoute();
const previousData = route.params || {};

// 2. Collect this screen's data
const [myScreenData, setMyScreenData] = useState({...});

// 3. When navigating, pass ALL data forward
navigation.navigate('NextScreen', {
  ...previousData,  // ⬅️ CRITICAL: Pass everything from previous screens
  myFieldName: myScreenData,  // ⬅️ Add this screen's data
});
```

### Example: Water Quality Screen

```typescript
// WaterQualityScreen.tsx
const WaterQualityScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // Accept all previous data
  const previousData = route.params || {};

  // Collect water quality data
  const [waterQualityData, setWaterQualityData] = useState({
    quarry: "",
    plant: "",
    parameters: [],
    samplingDate: "",
    weatherAndWind: "",
    overallAssessment: ""
  });

  const handleNext = () => {
    // Pass everything forward
    navigation.navigate('NoiseQualityScreen', {
      ...previousData,  // All data from Page 1, Page 2, etc.
      waterQualityImpactAssessment: waterQualityData,  // This screen's data
    });
  };

  return (
    // ... UI ...
  );
};
```

## Screens That Need Updates

Based on the navigation flow in your app:

1. **CMVRPage1Screen** → Already works (passes generalInfo, permits, etc.)
2. **CMVRPage2Screen** → Must pass `executiveSummaryOfCompliance` and `processDocumentationOfActivitiesUndertaken`
3. **ComplianceMonitoringScreen** → Must pass `complianceToProjectLocationAndCoverageLimits` and `complianceToImpactManagementCommitments`
4. **WaterQualityScreen** → Must pass `waterQualityImpactAssessment`
5. **NoiseQualityScreen** → Must pass `noiseQualityImpactAssessment`
6. **AirQualityScreen** → Must pass `airQualityImpactAssessment`
7. **WasteManagementScreen** → Must pass `complianceWithGoodPracticeInSolidAndHazardousWasteManagement`
8. **ChemicalSafetyScreen** → Must pass `complianceWithGoodPracticeInChemicalSafetyManagement`
9. **ComplaintsScreen** → Must pass `complaintsVerificationAndManagement`
10. **RecommendationsScreen** → Must pass `recommendationsData`
11. **AttendanceScreen** → Must pass `attendanceUrl`
12. **DocumentationScreen** → Must pass `documentation`
13. **CMVRDocumentExportScreen** → Already updated, ready to receive all data

## How to Debug

### Step 1: Check Console Logs

When you submit the CMVR report, check the console for:

```
=== DEBUG: Snapshot for submission ===
Has executiveSummaryOfCompliance: true/false
Has processDocumentationOfActivitiesUndertaken: true/false
Has waterQualityImpactAssessment: true/false
...
Full snapshot keys: [...]
```

If any of these shows `false`, that means the data is not being passed through navigation.

### Step 2: Verify Navigation Calls

Search for `navigation.navigate` calls in each screen and ensure they follow this pattern:

```typescript
navigation.navigate("NextScreen", {
  ...route.params, // ⬅️ Must have this!
  myNewField: myData,
});
```

### Step 3: Check Each Screen

For each screen that collects data:

1. Does it accept `route.params` at the top?
2. Does it spread `...route.params` when navigating?
3. Does it add its own field to the navigation params?

## Quick Fix Checklist

For **each screen** that collects data:

- [ ] Import `useRoute` from `@react-navigation/native`
- [ ] Get route params: `const previousData = route.params || {};`
- [ ] When navigating, spread previous data: `...previousData`
- [ ] Add this screen's data with the correct field name
- [ ] Verify the field name matches what's in `CMVRDocumentExportParams`

## Testing

After fixing a screen:

1. Fill in data on that screen
2. Navigate to the export screen
3. Click "Submit to Database"
4. Check the console logs
5. Verify the field shows `true` in the debug output
6. Verify the data appears in the JSON payload

## Expected Result

After fixing all screens, the debug output should show:

```
=== DEBUG: Snapshot for submission ===
Has executiveSummaryOfCompliance: true
Has processDocumentationOfActivitiesUndertaken: true
Has waterQualityImpactAssessment: true
Has airQualityImpactAssessment: true
Has noiseQualityImpactAssessment: true
... (all should be true if data was filled)
```

And the payload should be **complete** like your example payload with all the nested objects filled in.

## Need Help?

If a screen still doesn't pass data after following this guide:

1. Check the console logs to see which field is missing
2. Find the screen that should set that field (reference the list above)
3. Verify the navigation call in that screen
4. Make sure the field name matches exactly what's in `CMVRDocumentExportParams`
