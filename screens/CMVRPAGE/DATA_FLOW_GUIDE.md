# CMVR Data Flow Integration Guide

## Overview

The CMVR report is built across multiple screens. Each screen collects specific data that needs to be passed to the final export screen (`CMVRDocumentExportScreen`) where it's assembled into the complete payload and sent to the backend.

## Current Implementation Status

### ✅ Fully Integrated (Page 1 - General Information)

- **CMVRReportScreen** - General Info, ECC, ISAG, EPEP, Funds, MMT
- **CMVRDocumentExportScreen** - Final assembly and submission

### ⚠️ Partially Integrated

- **RecommendationsScreen** - Passes `recommendationsData` to AttendanceList
- **AttendanceListScreen** - Passes attendance URL to Export screen

### ❌ Not Yet Integrated (Need Data Passing)

The following screens collect data but don't yet pass it to the export:

#### Page 2 Screens:

1. **CMVRPage2Screen** (`/CMVRPAGE/CMVRPage2/`)
   - Collects: `executiveSummaryOfCompliance`
   - Collects: `processDocumentationOfActivitiesUndertaken`
   - Navigation: Goes to `ComplianceMonitoring`
   - **Action Needed**: Pass collected data when navigating

#### Compliance Monitoring Screens:

2. **EnvironmentalComplianceScreen** (`/CMVRPAGE/EnvironmentalCompliance/`)
   - Collects: `complianceToProjectLocationAndCoverageLimits`
   - Collects: `complianceToImpactManagementCommitments`
   - Navigation: Goes to `WaterQuality`
   - **Action Needed**: Pass collected data when navigating

3. **WaterQualityScreen** (`/CMVRPAGE/water-quality/`)
   - Collects: `waterQualityImpactAssessment`
   - Navigation: Goes to `NoiseQuality`
   - **Action Needed**: Pass collected data when navigating

4. **NoiseQualityScreen** (`/CMVRPAGE/NoiseQuality/`)
   - Collects: `noiseQualityImpactAssessment`
   - Navigation: Goes to `WasteManagement`
   - **Action Needed**: Pass collected data when navigating

5. **WasteManagementScreen** (`/CMVRPAGE/WasteManagement/`)
   - Collects: `complianceWithGoodPracticeInSolidAndHazardousWasteManagement`
   - Navigation: Goes to `ChemicalSafety`
   - **Action Needed**: Pass collected data when navigating

6. **ChemicalSafetyScreen** (`/CMVRPAGE/chemical/`)
   - Collects: `complianceWithGoodPracticeInChemicalSafetyManagement`
   - Navigation: Goes to `Recommendations`
   - **Action Needed**: Pass collected data when navigating

## Data Flow Pattern

### How Each Screen Should Integrate:

```typescript
// 1. Accept previous screen's data via route params
const route = useRoute();
const previousData = route.params || {};

// 2. Collect your screen's data in state
const [myData, setMyData] = useState({...});

// 3. When navigating to next screen, pass ALL data forward
const handleNext = () => {
  navigation.navigate('NextScreen', {
    ...previousData,  // ← Pass forward all previous data
    myScreenData: myData,  // ← Add your screen's data
  });
};
```

### Example Integration for WaterQualityScreen:

```typescript
// Current implementation (missing data passing):
navigation.navigate("NoiseQuality");

// Should be:
navigation.navigate("NoiseQuality", {
  ...previousParams, // All data from previous screens
  waterQualityImpactAssessment: {
    quarry: data.quarry,
    plant: data.plant,
    parameters: data.parameters,
    samplingDate: data.samplingDate,
    weatherAndWind: data.weatherAndWind,
    explanationForConfirmatorySampling: data.explanationForConfirmatorySampling,
    overallAssessment: data.overallAssessment,
  },
});
```

## Updated Payload Builder

The `buildCreateCMVRPayload` function in `CMVRDocumentExportScreen.tsx` has been updated to handle:

### Page 1 (General Info) - ✅ WORKING

```typescript
✅ companyName, location, quarter, year
✅ ecc[], isagMpp[], epep[]
✅ rehabilitationCashFund[], monitoringTrustFundUnified[], fmrdf[]
✅ proponent{}, mmt{}
```

### Page 2 (Executive Summary) - 🔄 READY TO RECEIVE

```typescript
executiveSummaryOfCompliance: {
  complianceWithEpepCommitments,
  complianceWithSdmpCommitments,
  complaintsManagement,
  accountability,
  others
}

processDocumentationOfActivitiesUndertaken: {
  dateConducted,
  activities: {
    complianceWithEccConditionsCommitments,
    complianceWithEpepAepepConditions,
    siteOcularValidation,
    siteValidationConfirmatorySampling
  }
}
```

### Compliance Monitoring Report - 🔄 READY TO RECEIVE

```typescript
complianceMonitoringReport: {
  (complianceToProjectLocationAndCoverageLimits,
    complianceToImpactManagementCommitments,
    airQualityImpactAssessment,
    waterQualityImpactAssessment,
    noiseQualityImpactAssessment,
    complianceWithGoodPracticeInSolidAndHazardousWasteManagement,
    complianceWithGoodPracticeInChemicalSafetyManagement,
    complaintsVerificationAndManagement,
    recommendationFromPrevQuarter,
    recommendationForNextQuarter,
    attendanceUrl,
    documentation);
}
```

## Backend Storage

All this data gets stored in a single `cmvrData` JSON field in the database:

```typescript
// Backend service (already implemented)
async create(createCmvrDto: CreateCMVRDto) {
  const { createdById, ...cmvrData } = createCmvrDto;

  return this.prisma.cMVRReport.create({
    data: {
      cmvrData: cmvrData,  // ← Everything stored here
      createdById: createdById,
    },
  });
}
```

## Action Items for Complete Integration

### Priority 1: Update Navigation Data Passing

Each screen needs to be updated to pass its data forward:

1. [ ] **CMVRPage2Screen** → ComplianceMonitoring
2. [ ] **EnvironmentalComplianceScreen** → WaterQuality
3. [ ] **WaterQualityScreen** → NoiseQuality
4. [ ] **NoiseQualityScreen** → WasteManagement
5. [ ] **WasteManagementScreen** → ChemicalSafety
6. [ ] **ChemicalSafetyScreen** → Recommendations

### Priority 2: Update DraftSnapshot Saving

The `saveDraft` function in `CMVRDocumentExportScreen` should persist all the data sections to AsyncStorage so users can resume their work.

### Priority 3: Test Complete Flow

Once all screens pass data:

1. Fill out all CMVR screens
2. Navigate through the entire flow
3. Submit at CMVRDocumentExportScreen
4. Verify data arrives at backend with all sections populated

## Quick Test

To verify your screen is passing data correctly, add this console log:

```typescript
// In CMVRDocumentExportScreen, in the submit handler:
console.log(
  "Final snapshot before submit:",
  JSON.stringify(snapshotForSubmission, null, 2)
);
```

You should see all the sections you filled out in the various screens!
