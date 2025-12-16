# CMVR PERSISTENCE & DATA INTEGRITY FIXES - December 15, 2025

**STATUS: 🟡 FOR TESTING - NOT COMPLETED**
**Date**: December 15, 2025
**Environment**: Development/Testing
**Type**: Bug Fixes - Data Persistence & Document Generation

---

## ⚠️ IMPORTANT NOTICE

**THESE FIXES ARE CURRENTLY UNDER TESTING AND HAVE NOT BEEN VERIFIED IN PRODUCTION.**

All changes require comprehensive testing before deployment. Do not deploy to production until:
1. ✅ All test cases pass
2. ✅ QA verification complete
3. ✅ Client acceptance obtained
4. ✅ Regression testing complete

---

## OVERVIEW

This document tracks three critical bug fixes for the CMVR (Certified Mine and Vegetation Report) system:

1. **ISSUE A**: ISAG/MPP Permit Holders - First entry disappears after reopening form
2. **ISSUE B**: Water Quality TSS - Added parameters don't persist after exit/reopen
3. **ISSUE C**: Document Export - Pre-Construction/Construction should show only "N/A"

---

## ISSUE A: ISAG/MPP PERMIT HOLDERS PERSISTENCE

### Problem Description

**Location**: Create CMVR Report → ECC / ISAG-MPP → Permit Holders List

**Bug**: When multiple permit holders are added (e.g., "Flor", "Joseph", "Maria"), after saving, exiting, and reopening the form, the first entry disappears and subsequent entries shift up.

**Expected**: All permit holders persist in original order.

### Root Cause

Potential issues identified:
- Race condition in state updates during rapid successive calls
- Index-based React keys causing improper item tracking during re-renders
- Lack of defensive array validation in add/remove operations

### Changes Implemented

**File**: `screens/CMVRPAGE/CMVR/components/CombinedECCISAGSection.tsx`

#### 1. Enhanced `updatePermitHolderList` Function (Lines 98-116)
```typescript
// Added defensive checks:
- Array type validation
- Duplicate detection with logging
- Success tracking with array length logging
```

#### 2. Enhanced `handleRemoveHolder` Function (Lines 117-144)
```typescript
// Added safety measures:
- Negative index validation
- Array type checking
- Bounds validation (index < length)
- Holder removal logging with details
```

#### 3. Stable React Keys (Line 283)
```typescript
// Changed from:
key={index}

// To:
key={`permit-holder-${holder}-${index}`}
```

### Risk Assessment
- **Level**: 🟢 LOW
- **Impact**: Only adds defensive checks and improves logging
- **Rollback**: Easy - remove defensive checks and revert keys

---

## ISSUE B: WATER QUALITY TSS PARAMETERS PERSISTENCE

### Problem Description

**Location**: Create CMVR Report → B.4 Water Quality Impact Assessment

**Bug**: When "Add More TSS" is clicked to add additional TSS entries (TSS 01, TSS 02, etc.), and values are input, after exiting and reopening the form, all added TSS entries disappear (only base row remains).

**Expected**: All dynamically added TSS rows persist with their values intact.

### Root Cause Analysis

**Finding**: The transformer and normalization logic are **ALREADY CORRECT**. The issue may be:
- Silent save failures
- Incorrect hydration timing
- Missing parameters in specific edge cases

### Changes Implemented

**File**: `screens/CMVRPAGE/water-quality/WaterQualityScreen.tsx`

#### 1. Enhanced Logging for Parameter Operations

**Add Water Quality Parameter** (Lines 302-328):
```typescript
console.log(`[Water Quality] Added parameter with ID: ${newId}. Total parameters: ${newParameters.length}`);
```

**Delete Water Quality Parameter** (Lines 343-366):
```typescript
console.log(`[Port Monitoring] Removed parameter "${paramToRemove?.parameter}" (ID: ${id}). Remaining: ${newParameters.length}`);
```

**Add Port Parameter** (Lines 407-433):
```typescript
console.log(`[Port Monitoring] Added parameter with ID: ${newId}. Total parameters: ${newParameters.length}`);
```

**Delete Port Parameter** (Lines 448-471):
```typescript
console.log(`[Port Monitoring] Removed parameter "${paramToRemove?.parameter}" (ID: ${id}). Remaining: ${newParameters.length}`);
```

#### 2. Enhanced Hydration Logging (Lines 163-170)
```typescript
console.log(`[Water Quality] Hydrating from store. Water Quality parameters: ${waterQualityRestoredData.parameters.length}, Port parameters: ${portRestoredData.parameters.length}`);
// Logs all restored parameter IDs for debugging
```

#### 3. Enhanced Store Sync Logging (Lines 206-213)
```typescript
console.log(`[Water Quality] Syncing to store. Water Quality parameters: ${waterQualityData.parameters.length}, Port parameters: ${portData.parameters.length}`);
// Shows parameter counts and IDs being saved
```

### Important Notes

✅ **Transformation Logic Already Correct**: The file `store/cmvrTransformers.js` (lines 870-1365) already correctly transforms parameters from frontend format to backend DTO format.

✅ **Stable IDs Already Implemented**: Parameters use timestamp-based stable IDs (`water-quality-param-${Date.now()}`), preventing index-based corruption.

### Risk Assessment
- **Level**: 🟢 VERY LOW
- **Impact**: Only adds logging, no logic changes
- **Rollback**: Easy - remove console.log statements

---

## ISSUE C: PRE-CONSTRUCTION/CONSTRUCTION N/A OUTPUT

### Problem Description

**Location**: Generated CMVR Document → Compliance to Impact Management Commitments Table

**Bug**: In the exported document (PDF/DOCX), the Pre-Construction and Construction rows either:
- Don't appear at all, OR
- Show extra text/values instead of just "N/A"

**Expected**: Both rows must display exactly "N/A" (no extra text, placeholders, or fragments).

### Root Cause Identified

**Frontend** stores `preConstruction: null` and `construction: null` by default.

**Transformer** (`store/cmvrTransformers.js` lines 214-233) was skipping these entries when null:
```javascript
// OLD CODE (BUGGY):
const buildConstructionEntry = (label, value) => {
  const hasValue = value !== undefined && value !== null && value !== "";
  if (!hasValue) return null; // ❌ Skips entry when null
  ...
};

const constructionInfo = [
  buildConstructionEntry("Pre-Construction", rawSection.preConstruction),
  buildConstructionEntry("Construction", rawSection.construction),
].filter(Boolean); // ❌ Removes null entries
```

**Result**: Backend doesn't include Pre-Construction/Construction in `constructionInfo` array → Sections don't appear in documents.

### Changes Implemented

**File**: `store/cmvrTransformers.js`

#### Modified `buildConstructionEntry` Function (Lines 214-233)
```javascript
// NEW CODE (FIXED):
const buildConstructionEntry = (label, value) => {
  // ✅ Always return entry for Pre-Construction and Construction with "N/A"
  return {
    areaName: label,
    commitments: [
      {
        plannedMeasure: `${label} compliance`,
        actualObservation: "N/A", // ✅ Always N/A
        isEffective: false,
        recommendations: "",
      },
    ],
  };
};

const constructionInfo = [
  buildConstructionEntry("Pre-Construction", rawSection.preConstruction),
  buildConstructionEntry("Construction", rawSection.construction),
]; // ✅ No filter - always include both
```

### Expected Output

**DOCX Rendering** (Already correct in `compliance-monitoring.helper.ts`):
- Column 1: "Construction" (centered, bold)
- Columns 2-5: "N/A" (centered, spanning 4 columns)
- Column 6: Empty (for Recommendations)

**PDF Rendering** (Now fixed):
- Same format as DOCX
- Clean "N/A" with no extra text

### Risk Assessment
- **Level**: 🟡 LOW-MEDIUM
- **Impact**: Changes data transformation logic
- **Rollback**: Medium - revert transformer to conditional logic with `.filter(Boolean)`

---

## FILES MODIFIED SUMMARY

| File | Lines Changed | Risk | Status |
|------|---------------|------|--------|
| `screens/CMVRPAGE/CMVR/components/CombinedECCISAGSection.tsx` | ~50 | 🟢 LOW | Testing |
| `screens/CMVRPAGE/water-quality/WaterQualityScreen.tsx` | ~60 | 🟢 VERY LOW | Testing |
| `store/cmvrTransformers.js` | ~20 | 🟡 LOW-MEDIUM | Testing |

**Total**: ~130 lines across 3 files

---

## TESTING REQUIREMENTS

### ✅ Test Case 1: ISAG/MPP Permit Holders

1. Add 3 permit holders: "Flor Mining Corp.", "Joseph Resources Ltd.", "Maria Development Inc."
2. Save draft → Exit → Reopen
3. **VERIFY**: All 3 holders present in original order
4. Remove middle holder
5. Save → Exit → Reopen
6. **VERIFY**: Only Flor and Maria remain

**Expected Logs**:
```
"Added permit holder "X". New length: Y"
"Removed permit holder "X" at index Y. New length: Z"
"Permit Holder List in draft: X items"
"Permit Holder List after restore: X items"
```

### ✅ Test Case 2: Water Quality TSS Parameters

1. Navigate to B.4 Water Quality Impact Assessment
2. Add main parameter: TSS (Current: 18.5, Previous: 6.2, Limit: 150)
3. Click "Add More Parameters"
4. Add parameter: pH (Current: 7.2, Previous: 7.1, Limit: 6.5-9.0)
5. Add parameter: Turbidity (Current: 12, Previous: 14, Limit: 50)
6. Save draft → Exit → Reopen
7. **VERIFY**: All 3 parameters present with correct values
8. Remove pH parameter
9. Save → Exit → Reopen
10. **VERIFY**: Only TSS and Turbidity remain

**Expected Logs**:
```
"[Water Quality] Added parameter with ID: water-quality-param-XXXXX. Total parameters: Y"
"[Water Quality] Syncing to store. Water Quality parameters: Y"
"[Water Quality] Hydrating from store. Water Quality parameters: Y"
"[Water Quality] Restored Water Quality parameter IDs: [...]"
```

### ✅ Test Case 3: Pre-Construction/Construction N/A

1. Create complete CMVR report
2. Generate DOCX document
3. Open document → Find "Compliance to Impact Management Commitments" table
4. **VERIFY Pre-Construction**: Shows only "N/A" (no extra text)
5. **VERIFY Construction**: Shows only "N/A" (no extra text)
6. Generate PDF document
7. **VERIFY**: Both sections show clean "N/A" in PDF

---

## ACCEPTANCE CRITERIA

**Fix is accepted ONLY if ALL are true:**

- [ ] **ISAG/MPP**: First entry never disappears, ordering stable, add/remove works
- [ ] **Water Quality**: All TSS rows persist and restore with correct values
- [ ] **Pre-Construction/Construction**: Documents show exactly "N/A" only
- [ ] **No Regressions**: All other CMVR sections work correctly
- [ ] **Console Logs**: No errors, defensive logging works as expected
- [ ] **Document Export**: PDF and DOCX generate valid files

---

## TESTING STATUS

**Current Status**: 🟡 AWAITING TESTING

| Test Case | Status | Tester | Date | Notes |
|-----------|--------|--------|------|-------|
| ISAG/MPP Permit Holders | ⏳ Pending | - | - | - |
| Water Quality TSS Parameters | ⏳ Pending | - | - | - |
| Pre-Construction/Construction N/A | ⏳ Pending | - | - | - |
| Regression Testing | ⏳ Pending | - | - | - |
| End-to-End Integration | ⏳ Pending | - | - | - |

---

## ROLLBACK PLAN

If critical issues are found during testing:

### ISAG/MPP Permit Holders
```bash
# Revert CombinedECCISAGSection.tsx changes
git checkout HEAD -- screens/CMVRPAGE/CMVR/components/CombinedECCISAGSection.tsx
```

### Water Quality TSS
```bash
# Revert WaterQualityScreen.tsx changes (remove logging only)
git checkout HEAD -- screens/CMVRPAGE/water-quality/WaterQualityScreen.tsx
```

### Pre-Construction/Construction
```bash
# Revert cmvrTransformers.js changes
git checkout HEAD -- store/cmvrTransformers.js
```

---

## NEXT STEPS

1. ✅ Code changes implemented
2. ⏳ **Run manual testing** using test cases above
3. ⏳ **Check console logs** to verify defensive logging
4. ⏳ **Test document generation** (PDF & DOCX)
5. ⏳ **Perform regression testing**
6. ⏳ **Client review and acceptance**
7. ⏳ **Deploy to production** (only after all tests pass)

---

## NOTES FOR QA TEAM

- **Enable Developer Console**: Ensure console logging is visible during testing
- **Test in Realistic Scenarios**: Use actual project data when possible
- **Document All Findings**: Log any unexpected behavior, even minor issues
- **Test Both Draft and Submit Flows**: Verify persistence in both scenarios
- **Verify Both Document Formats**: Test PDF and DOCX generation separately

---

**Document Version**: 1.0
**Last Updated**: December 15, 2025
**Author**: Development Team
**Status**: 🟡 FOR TESTING - NOT COMPLETED
