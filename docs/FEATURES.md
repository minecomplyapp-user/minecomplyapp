# MineComply Mobile App - Features Documentation

> Last Updated: December 2025

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Role Selection](#role-selection)
- [Dashboard](#dashboard)
- [CMVR Reports](#cmvr-reports)
- [ECC Monitoring](#ecc-monitoring)
- [Attendance Management](#attendance-management)
- [Profile Management](#profile-management)
- [Draft System](#draft-system)
- [Document Export](#document-export)
- [File Management](#file-management)

---

## Overview

The MineComply Mobile App provides comprehensive tools for managing mining compliance activities. Users can create detailed compliance reports, track environmental conditions, manage meeting attendance, and generate official documents.

---

## Authentication

### Sign In
**Screen**: `screens/auth/AuthScreen.tsx`

**Features:**
- Email and password authentication via Supabase
- Session persistence across app restarts
- Automatic token refresh
- Profile sync on login

**User Flow:**
1. User enters email and password
2. App validates with Supabase Auth
3. Session token stored securely
4. Profile data synced from database
5. Redirect to Role Selection

### Sign Up
**Screen**: `screens/auth/AuthScreen.tsx`

**Features:**
- New user registration
- Email verification
- Extended profile fields:
  - First name, last name
  - Phone number
  - Mailing address
  - Fax number
  - Position/title
- Automatic profile creation in database
- Duplicate email detection

**Profile Fields:**
```typescript
{
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  mailingAddress?: string;
  fax?: string;
  position?: string;
}
```

### Password Reset
**Status**: ❌ Not yet implemented

**Planned Features:**
- Email-based password reset
- Reset confirmation
- Password strength validation

---

## Role Selection

**Screen**: `screens/role-selection/RoleSelectionScreen.tsx`

**Purpose**: Allow users to select their operational role for the session

**Available Roles:**
- **Proponent**: Mining company representative
- **MMT (Multi-partite Monitoring Team)**: Monitoring team member
- **Regulator**: Government regulatory official
- **Admin**: System administrator

**Role-Based Features:**
- Different dashboard views per role
- Role-specific workflows
- Customized permissions

---

## Dashboard

**Screens**:
- `screens/dashboard/DashboardScreen.tsx` - Main dashboard
- `screens/dashboard/GuestDashboardScreen.tsx` - Guest view
- `screens/dashboard/DuplicateReportScreen.tsx` - Report duplication

### Main Dashboard

**Features:**
- Quick access cards for main features
- Recent reports overview
- Draft resume capability
- Report statistics
- Navigation hub

**Dashboard Cards:**
1. **CMVR Reports**: Create or view CMVR reports
2. **ECC Monitoring**: Track ECC conditions
3. **Attendance**: Manage meeting attendance
4. **Submissions**: View all submissions
5. **Reports**: Access saved reports
6. **Profile**: Manage user profile

### Draft Resume
- Show "Resume Draft" card if draft exists
- Display last saved timestamp
- Quick access to continue editing
- Draft preview information

### Report Duplication
**Screen**: `screens/dashboard/DuplicateReportScreen.tsx`

**Features:**
- Select existing report to duplicate
- Copy all data to new report
- Edit duplicated report
- Save as new submission

---

## CMVR Reports

**Location**: `screens/CMVRPAGE/` (180+ files)

### Overview
Compliance Monitoring and Validation Reports (CMVR) are comprehensive documents tracking mining compliance across multiple environmental and operational categories.

### CMVR Workflow

```
Dashboard → CMVR Report Screen → General Info → Individual Sections → Export
```

### Main CMVR Screen
**Screen**: `screens/CMVRPAGE/CMVR/CMVRReportScreen.tsx`

**Features:**
- New report creation
- Existing report selection
- Draft management
- Report overview

### General Information
**Screen**: `screens/CMVRPAGE/CMVRPage2/CMVRPage2Screen.tsx`

**Required Fields:**
- Company name
- Project location (region, province, municipality)
- Reporting period (quarter, year)
- Date of compliance monitoring
- Monitoring period covered
- Date of CMR submission
- Permit holder information with ECC details

**Permit Holder Entry:**
```typescript
{
  permitHolderName: string;
  savingsAccountNumber: string;
  amountDeposited: string;
  dateUpdated: string;
}
```

### Executive Summary of Compliance
**Screen**: `screens/CMVRPAGE/ExecutiveSummary/ExecutiveSummaryScreen.tsx`

**Sections:**
1. **EPEP Commitments**:
   - Safety compliance
   - Social commitment compliance
   - Rehabilitation commitment compliance
   - Remarks

2. **SDMP Commitments**:
   - Complied/Not complied status
   - Remarks

3. **Complaints Management**:
   - Complaint receiving setup
   - Case investigation
   - Implementation of control measures
   - Communication with complainant
   - Documentation
   - N/A option for all
   - Remarks

4. **Accountability**:
   - Compliance status
   - Remarks

5. **Others**:
   - Specify additional items
   - N/A option

### Process Documentation
**Screen**: `screens/CMVRPAGE/ProcessDocumentation/ProcessDocumentationScreen.tsx`

**Information Captured:**
- Date(s) of activities conducted
- Option for same date across all activities
- MMT members involved in:
  - ECC conditions compliance monitoring
  - EPEP/AEPEP conditions monitoring
  - Site ocular validation
- Site validation/confirmatory sampling:
  - Applicable/None selection
  - Date conducted
  - MMT members involved
  - Sampling remarks
- Merged methodology/remarks section

### Compliance to Project Location and Coverage Limits
**Screen**: `screens/CMVRPAGE/ProjectLocationAndCoverageLimits/`

**Features:**
- Dynamic parameter entry
- Image upload for each parameter
- Within/Out of specs indicators
- Specification tracking
- Remarks for each parameter
- Other components section

**Parameter Fields:**
```typescript
{
  name: string;
  specification: string | object;
  remarks: string;
  withinSpecs: boolean;
  imageUri?: string;
}
```

### Compliance to Impact Management Commitments
**Screen**: `screens/CMVRPAGE/ImpactManagementCommitments/`

**Sections:**
1. **Pre-Construction**: N/A or custom measures
2. **Construction**: N/A or custom measures
3. **Operations**:
   - Quarry Operation
   - Plant Operation
   - Port Operation

**Measure Entry:**
```typescript
{
  plannedMeasure: string;
  actualObservation: string;
  isEffective: boolean;
  recommendations: string;
}
```

**Features:**
- Multiple measures per operation
- Add/remove measures dynamically
- N/A option per section
- Overall compliance assessment

### Environmental Compliance Screen
**Screen**: `screens/CMVRPAGE/EnvironmentalCompliance/EnvironmentalComplianceScreen.tsx`

**Hub for:**
- Air Quality Impact Assessment
- Water Quality Impact Assessment  
- Noise Quality Impact Assessment
- Waste Management
- Chemical Safety

Each sub-section accessible from this screen.

#### Air Quality Impact Assessment
**Screen**: `screens/CMVRPAGE/air-quality/AirQualityScreen.tsx`

**Features:**
- Location selection (Quarry, Plant, Quarry & Plant, Port)
- Location-specific descriptions
- Parameter tables with:
  - Parameter name (TSP, PM10, etc.)
  - Current SMR reading
  - Previous SMR reading
  - Current MMT reading
  - Previous MMT reading
  - EQPL red flag
  - Action required
  - DENR limit
  - Remarks
- Sampling metadata:
  - Date/time of sampling
  - Weather and wind conditions
  - Explanation for confirmatory sampling
  - Overall compliance assessment

#### Water Quality Impact Assessment
**Screen**: `screens/CMVRPAGE/water-quality/WaterQualityScreen.tsx`

**Features:**
- Separate sections for operations (Quarry, Plant, Quarry & Plant) and Port
- Multiple parameters per location
- Parameter entry:
  - Parameter name (TSS, pH, etc.)
  - Internal monitoring results:
    - Month
    - Multiple reading locations
    - Current and previous values
  - MMT confirmatory sampling:
    - Current and previous values
    - N/A option
  - DENR standard tracking:
    - Red flag indicator
    - Action required
    - Limit value (mg/L)
  - Remarks
- Sampling metadata per section
- Overall assessment

**Port Water Quality:**
- Separate parameters
- Additional location entry
- Same data structure as operations

#### Noise Quality Impact Assessment
**Screen**: `screens/CMVRPAGE/NoiseQuality/NoiseQualityScreen.tsx`

**Features:**
- Internal noise monitoring toggle
- File upload for noise data
- Multiple parameters:
  - Parameter name/description
  - N/A option per parameter
  - Current and previous SMR readings
  - Current and previous MMT readings
  - EQPL red flag (with checkbox)
  - Action required (with checkbox)
  - DENR limit (with checkbox)
  - Remarks
- Sampling metadata
- Quarterly overall assessment:
  - First quarter assessment (with checkbox)
  - Second quarter assessment (with checkbox)
  - Third quarter assessment (with checkbox)
  - Fourth quarter assessment (with checkbox)

#### Waste Management
**Screen**: `screens/CMVRPAGE/WasteManagement/WasteManagementScreen.tsx`

**Features:**
- Three location categories:
  - Quarry
  - Plant
  - Port
- Per location options:
  - "No significant impact" toggle
  - "Generate table" toggle
  - "N/A" toggle
- Waste table entry (when "Generate table" enabled):
  - Type of waste
  - ECC/EPEP commitments:
    - Handling procedures
    - Storage procedures
    - Disposal procedures
  - Adequate (Yes/No)
  - Previous record amount
  - Current quarter waste generated
  - Total (auto-calculated)
- Quarter selection for reporting

#### Chemical Safety Management
**Screen**: `screens/CMVRPAGE/chemical/ChemicalSafetyScreen.tsx`

**Features:**
- Chemical safety section:
  - N/A toggle
  - Risk management compliance
  - Training compliance
  - Handling compliance
  - Emergency preparedness compliance
  - Remarks field
  - Chemical category
  - Others (specify)
- Additional checkboxes:
  - Health & Safety checked
  - Social Development checked

### Complaints Verification and Management
**Screen**: `screens/CMVRPAGE/complaints/ComplaintsScreen.tsx`

**Features:**
- Multiple complaint entries
- Per complaint:
  - N/A toggle
  - Date filed
  - Filed location:
    - DENR
    - Company
    - MMT
    - Others (specify)
  - Nature of complaint (text area)
  - Resolutions made (text area)
- Add/remove complaint entries

### Recommendations
**Screen**: `screens/CMVRPAGE/recommendations/RecommendationsScreen.tsx`

**Features:**
- Two sets of recommendations:
  1. **Previous Quarter Recommendations**:
     - Quarter and year selection
     - Plant, Quarry, Port sections
     - N/A option per section
     - Multiple recommendation items per section
  2. **Current Quarter Recommendations**:
     - Automatically uses next quarter
     - Same structure as previous

**Recommendation Item:**
```typescript
{
  recommendation: string;
  commitment: string;
  status: string;
}
```

### Attachments
**Screen**: `screens/CMVRPAGE/CMVRAttachmentsScreen.tsx`

**Features:**
- Upload multiple files/images
- Add caption per attachment
- Preview attachments
- Remove attachments
- Attachment types supported:
  - Images (camera or gallery)
  - Documents (via document picker)

**Attachment Structure:**
```typescript
{
  path: string;        // Storage path
  uri: string;         // Local URI
  caption?: string;    // Optional caption
  type: string;        // MIME type
}
```

### Attendance Linking
**Screen**: `screens/CMVRPAGE/AttendanceListScreen.tsx`

**Features:**
- View existing attendance records
- Select attendance for current CMVR
- Create new attendance record
- Link attendance ID to CMVR report

### Document Export
**Screen**: `screens/CMVRPAGE/ExportReportScreen.tsx`

**Features:**
- Generate PDF report (preview only in Expo Go)
- Generate DOCX report (full download)
- Export includes all sections and attachments
- Attendance integration in exports
- File naming customization

**Export Flow:**
1. User completes all required sections
2. Navigate to Export screen
3. Choose PDF or DOCX
4. App uploads attachments to storage
5. API generates document
6. Document downloads to device

### CMVR Drafts
**Screen**: `screens/CMVRPAGE/CMVRDraftsScreen.tsx`

**Features:**
- List all saved CMVR drafts
- Draft metadata display:
  - File name
  - Project name
  - Last saved date
- Load draft for editing
- Delete drafts
- Create new report

---

## ECC Monitoring

**Location**: `screens/ecc/`

### Overview
Environmental Compliance Certificate (ECC) monitoring tracks compliance with specific ECC conditions and permit requirements.

### ECC Monitoring Screen
**Screen**: `screens/ecc/ECCMonitoringScreen.tsx`

**Features:**
- General information entry:
  - File name
  - Company name
  - Status (Complied, Partially Complied, Not Complied)
  - Date
- MMT information:
  - Contact person
  - Position
  - Mailing address
  - Telephone number
  - Fax number
  - Email address
- Permit holder management:
  - Add multiple permit holders
  - Track monitoring state per holder
- Recommendations entry
- Generate and download reports

### ECC Conditions Screen
**Screen**: `screens/ecc/conditions.tsx`

**Features:**
- Default ECC conditions pre-loaded
- Condition hierarchy (nested conditions)
- Per permit holder:
  - Condition selection
  - Status tracking (Complied, Partially Complied, Not Complied)
  - Remarks entry
  - Section organization
- Add custom conditions
- Remove conditions
- Duplicate conditions across permit holders

**Condition Structure:**
```typescript
{
  id: string;
  title: string;
  descriptions: {
    complied: string;
    partial: string;
    not: string;
  };
  status?: 'Complied' | 'Partially Complied' | 'Not Complied';
  remarks?: string[];
  nested_to?: string;  // Parent condition ID
  section?: number;
}
```

### ECC Drafts
**Screen**: `screens/ecc/ECCDraftsScreen.tsx`

**Features:**
- List saved ECC drafts
- Load draft for editing
- Delete drafts
- Create new ECC report

---

## Attendance Management

**Location**: `screens/attendance/`

### Overview
Attendance management allows users to record meeting participants, capture signatures, and generate attendance sheets.

### Create Attendance
**Screen**: `screens/attendance/CreateAttendanceScreen.tsx`

**Features:**
- Meeting details:
  - File name
  - Title
  - Description
  - Meeting date and time
  - Location
- Attendee management:
  - Add multiple attendees
  - Per attendee:
    - Name
    - Organization
    - Position
    - Digital signature (draw or upload)
- Save as draft
- Submit to database
- Generate PDF/DOCX

**Attendee Entry:**
```typescript
{
  name: string;
  organization: string;
  position: string;
  signature: string;  // Base64 image
}
```

### Attendance Records
**Screen**: `screens/attendance/AttendanceRecordScreen.tsx`

**Features:**
- View attendance record details
- Edit existing records
- Export to PDF/DOCX
- Delete records
- Duplicate records

### Attendance List
**Screen**: `screens/CMVRPAGE/AttendanceListScreen.tsx`

**Features:**
- List all attendance records
- Filter by user
- Search by title/file name
- Quick preview
- Select for CMVR linking

---

## Profile Management

**Location**: `screens/profile/`

### View Profile
**Screen**: `screens/profile/ProfileScreen.tsx`

**Features:**
- Display user information:
  - Full name
  - Email
  - Phone number
  - Position
  - Mailing address
- QR code display (if available)
- Navigation to edit profile
- Sign out option

### Edit Profile
**Screen**: `screens/profile/EditProfileScreen.tsx`

**Features:**
- Edit profile fields:
  - First name
  - Last name
  - Phone number
  - Position
  - Mailing address
  - Telephone
  - Fax
- Save changes to database
- Profile sync with Supabase Auth
- Validation and error handling

---

## Draft System

### Overview
The draft system allows users to save their work locally and resume later, even without internet connectivity.

### Features

#### CMVR Drafts
**Implementation**: `lib/drafts.ts` + `store/cmvrStore.js`

**Capabilities:**
- Auto-save on section completion
- Manual save button
- Multiple named drafts
- Draft metadata tracking
- Resume from dashboard
- Delete unused drafts

**Draft Data Includes:**
- All form sections
- File name
- Project information
- Last saved timestamp
- Creation timestamp

#### ECC Drafts
**Implementation**: `store/eccDraftStore.js`

**Capabilities:**
- Save ECC reports locally
- Multi-draft support
- Draft metadata
- Load and continue editing

#### Storage Location
- **AsyncStorage**: React Native local storage
- **Key Prefix**: `cmvr_draft_` or `ecc_draft_`
- **Persistence**: Survives app restarts
- **Size Limit**: ~6MB per entry (platform dependent)

### Draft Management Flow

```
User Input → Store Update → Save Draft → AsyncStorage
                                ↓
User Resumes → Load Draft → Restore Store → Continue Editing
                                ↓
User Submits → API Post → Delete Draft
```

---

## Document Export

### Overview
Generate official PDF and DOCX documents from reports for submission to regulatory authorities.

### PDF Generation
**Status**: ⚠️ Preview only in Expo Go (full support in standalone build)

**Features:**
- Generate from API
- Preview in-app (Expo Go limitation)
- Share functionality
- All sections included

**Flow:**
1. User completes report
2. Tap "Generate PDF"
3. App calls API endpoint
4. API generates PDF with PDFKit
5. Returns PDF buffer
6. App displays or saves PDF

### DOCX Generation
**Status**: ✅ Fully functional

**Features:**
- Generate from API
- Automatic download
- Opens in device's default app
- Includes all sections and attachments
- Attendance sheet integration

**Flow:**
1. User completes report
2. Tap "Generate DOCX"
3. App uploads attachments (if any)
4. App calls API endpoint with attachment paths
5. API generates DOCX with docx library
6. Opens download URL in browser
7. File downloads to device

**Document Types:**
- CMVR Report (DOCX) - Comprehensive compliance report
- ECC Report (PDF/DOCX) - Condition tracking document
- Attendance Sheet (PDF/DOCX) - Meeting attendance record

---

## File Management

### Overview
Upload, manage, and attach files to reports using Supabase Storage.

### Features

#### File Upload
**Implementation**: `lib/storage.ts`

**Supported Sources:**
- Camera (photos)
- Photo gallery
- Document picker
- File system

**Upload Flow:**
1. User selects file/takes photo
2. App requests signed upload URL from API
3. API generates Supabase Storage signed URL
4. App uploads file directly to Supabase Storage
5. App receives storage path
6. Path saved in report data

#### Supported File Types
- Images: JPEG, PNG, GIF, WebP
- Documents: PDF, DOCX, XLSX
- Any file type supported by device

#### File Management
- Preview images inline
- Add captions to attachments
- Remove attachments
- Reorder attachments (not yet implemented)

#### Storage Limits
- Per file: Limited by API/Supabase configuration
- Total: Limited by Supabase plan
- Recommended: Compress images before upload

---

## Additional Features

### Search and Filtering
**Status**: ⚪ Limited implementation

**Current:**
- Filter reports by creator
- Search by file name (in some screens)

**Planned:**
- Advanced search
- Filter by date range
- Filter by status
- Sort options

### Notifications
**Status**: ❌ Not implemented

**Planned:**
- Push notifications for:
  - Report approval/rejection
  - Validation requests
  - Important updates

### Offline Mode
**Status**: ⚠️ Partial support

**Current:**
- Local draft storage
- Continue editing without internet
- Submit when connection restored

**Limitations:**
- Cannot load reports from API
- Cannot generate documents
- Cannot upload files

**Planned:**
- Offline queue for API calls
- Background sync
- Conflict resolution

---

## Feature Roadmap

### Near Term (Q1 2026)
- [ ] Improved offline support
- [ ] Push notifications
- [ ] Advanced search and filtering
- [ ] Attachment reordering
- [ ] Auto-save for all screens

### Medium Term (Q2 2026)
- [ ] Report templates
- [ ] Batch operations
- [ ] Report comparison
- [ ] Analytics dashboard
- [ ] Export to Excel

### Long Term (Q3-Q4 2026)
- [ ] Real-time collaboration
- [ ] Version control for reports
- [ ] Mobile-optimized PDF preview
- [ ] Biometric authentication
- [ ] Dark mode
- [ ] Multi-language support

---

## Feature Support Matrix

| Feature | iOS | Android | Web |
|---------|-----|---------|-----|
| Authentication | ✅ | ✅ | ✅ |
| CMVR Reports | ✅ | ✅ | ✅ |
| ECC Monitoring | ✅ | ✅ | ✅ |
| Attendance | ✅ | ✅ | ⚠️ (Signature issues) |
| Drafts | ✅ | ✅ | ✅ |
| PDF Export | ⚠️ (Preview) | ✅ | ✅ |
| DOCX Export | ✅ | ✅ | ✅ |
| Camera | ✅ | ✅ | ⚠️ (Browser dependent) |
| File Upload | ✅ | ✅ | ✅ |

✅ Fully Supported | ⚠️ Partial Support | ❌ Not Supported

---

**Note**: This document should be updated as new features are added or existing features are modified.

