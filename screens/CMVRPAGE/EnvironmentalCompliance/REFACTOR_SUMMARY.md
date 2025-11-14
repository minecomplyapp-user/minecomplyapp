# Environmental Compliance Screen Refactor - Summary

## Overview

Refactored `EnvironmentalComplianceScreen.tsx` from a single shared form to location-based sections, matching the pattern used in `WaterQualityScreen.tsx`. Each location (Quarry, Plant, Port, Quarry/Plant) now has its own dedicated section that only appears when the corresponding checkbox is selected.

## Changes Made

### 1. New Component Created

**File:** `components/AirQualityLocationSection.tsx`

- Reusable component for rendering air quality data for a single location
- Includes:
  - Location header with icon badge
  - Location description input
  - Main parameter form
  - Additional parameters list with add/delete
  - Sampling details (date/time, weather/wind, explanation)
  - Overall compliance assessment
- Props: locationName, all data fields, and all handlers

**File:** `styles/AirQualityLocationSection.styles.ts`

- Styles matching Water Quality pattern
- Blue location badge, organized sections with borders

### 2. Types Updated

**File:** `types/EnvironmentalComplianceScreen.types.ts`

- Added `LocationData` interface:
  - `locationInput`: string (location description)
  - `parameter`, `currentSMR`, `previousSMR`, etc.: Main parameter fields
  - `parameters`: Array of additional parameters
  - `dateTime`, `weatherWind`, `explanation`: Sampling details
  - `overallCompliance`: Overall assessment
- Added `createEmptyLocationData()` helper function

### 3. State Management Changes

**File:** `EnvironmentalComplianceScreen.tsx`

**Added State:**

```typescript
const [quarryData, setQuarryData] = useState<LocationData>(
  createEmptyLocationData()
);
const [plantData, setPlantData] = useState<LocationData>(
  createEmptyLocationData()
);
const [portData, setPortData] = useState<LocationData>(
  createEmptyLocationData()
);
const [quarryPlantData, setQuarryPlantData] = useState<LocationData>(
  createEmptyLocationData()
);
```

**Kept Legacy State:**

- `data` state retained for backward compatibility

### 4. Handlers Added

**Quarry Handlers:**

- `addQuarryParameter()` - Add new parameter to quarry
- `updateQuarryParameter(id, field, value)` - Update parameter field
- `deleteQuarryParameter(id)` - Remove parameter with confirmation

**Plant Handlers:**

- `addPlantParameter()`, `updatePlantParameter()`, `deletePlantParameter()`

**Port Handlers:**

- `addPortParameter()`, `updatePortParameter()`, `deletePortParameter()`

**Quarry/Plant Handlers:**

- `addQuarryPlantParameter()`, `updateQuarryPlantParameter()`, `deleteQuarryPlantParameter()`

### 5. Hydration Logic Updated

**useEffect:**

- Now loads `quarryData`, `plantData`, `portData`, `quarryPlantData` from route params
- Maintains backward compatibility by also loading legacy `data`

### 6. Save Functions Updated

**All three save functions updated:**

- `handleSave()` - Auto-save every 20 seconds
- `handleSaveToDraft()` - Manual draft save
- `handleSaveNext()` - Save and navigate to next screen

**Payload structure:**

```typescript
const airQualityImpactAssessment = {
  selectedLocations,
  quarryData,
  plantData,
  portData,
  quarryPlantData,
  // Legacy support
  data,
  uploadedEccFile,
  uploadedImage,
};
```

### 7. Test Data Updated

**fillTestData():**

- Now populates `quarryData` with test parameters (TSP + 2 additional)
- Populates `plantData` with test parameters (TSP + 1 additional)
- Sets `selectedLocations` to show Quarry and Plant
- Clears legacy `data.parameters` array

### 8. Render Section Refactored

**Removed:**

- Single shared `ParameterForm` section
- Global "Additional Parameters" list
- Global "Additional Fields" section
- Global "Overall Compliance" section

**Added:**

- Conditional `AirQualityLocationSection` for Quarry (shown when `selectedLocations.quarry === true`)
- Conditional `AirQualityLocationSection` for Plant (shown when `selectedLocations.plant === true`)
- Conditional `AirQualityLocationSection` for Port (shown when `selectedLocations.port === true`)
- Conditional `AirQualityLocationSection` for Quarry/Plant (shown when `selectedLocations.quarryPlant === true`)

**Each location section includes:**

- All parameter fields (main + additional)
- Sampling details
- Overall compliance
- NA checkbox (shared across all locations)

## User Experience Changes

### Before:

1. Select location checkboxes (just for data tracking)
2. Fill single shared form for all locations
3. All locations use same parameters and sampling details

### After:

1. Select location checkboxes
2. Separate section appears for each selected location
3. Each location has independent:
   - Location description
   - Main parameter
   - Additional parameters (can add/remove independently)
   - Sampling date/time, weather/wind
   - Explanation
   - Overall compliance assessment

## Data Flow

### Input → Storage:

1. User enters data in location-specific `AirQualityLocationSection`
2. Handlers update corresponding location state (`quarryData`, `plantData`, etc.)
3. Save functions bundle all location data into `airQualityImpactAssessment` object
4. Data passed to next screen via navigation params

### Storage → Display:

1. Screen receives `airQualityImpactAssessment` from route params
2. `useEffect` extracts location-specific data
3. Sets state for each location
4. Conditional rendering shows `AirQualityLocationSection` for selected locations

## Backend Integration

- Backend DTOs and PDF/DOCX generators already updated in previous session
- Expects structure: `{ selectedLocations, quarryData, plantData, portData, quarryPlantData }`
- Each location data includes: `locationInput`, `parameters[]`, sampling details, overall compliance

## Testing Checklist

- [ ] Select Quarry checkbox - Quarry section appears
- [ ] Deselect Quarry checkbox - Quarry section disappears (data retained in state)
- [ ] Add parameters in Quarry section - Parameters only added to Quarry
- [ ] Fill test data - Quarry and Plant sections populate independently
- [ ] Save to draft - All location data persists
- [ ] Navigate away and back - All location data hydrates correctly
- [ ] Save & Next - All location data passes to WaterQuality screen
- [ ] Backend submission - PDF/DOCX generate correctly with location sections

## Files Modified

1. `EnvironmentalComplianceScreen.tsx` - Main screen refactor
2. `EnvironmentalComplianceScreen.types.ts` - Added LocationData type
3. `components/AirQualityLocationSection.tsx` - New component
4. `styles/AirQualityLocationSection.styles.ts` - New styles

## Migration Notes

- Old saved data using legacy structure will still load via `data` state
- New saves use location-specific structure
- Backend supports both structures for transition period
- Consider data migration script if needed for existing drafts

## Related Files (Backend - Already Updated)

- `minecomplyapi/src/cmvr/cmvr-pdf-rendering.helpers.ts` - PDF table rendering
- `minecomplyapi/src/cmvr/cmvr-docx-generator.helpers.ts` - DOCX generation
- `minecomplyapi/src/cmvr/dto/create-cmvr.dto.ts` - Data validation
