# MineComply Mobile App - Screens & Navigation

> Last Updated: December 2025

## Table of Contents

- [Navigation Structure](#navigation-structure)
- [Screen Catalog](#screen-catalog)
- [Navigation Patterns](#navigation-patterns)
- [Deep Linking](#deep-linking)

---

## Navigation Structure

**Navigator**: React Navigation Stack Navigator

**Stack Types:**
- **Auth Stack**: Unauthenticated screens
- **Main Stack**: Authenticated screens

---

## Screen Catalog

### Auth Stack

| Screen | Route | Component | Purpose |
|--------|-------|-----------|---------|
| Auth | `Auth` | `screens/auth/AuthScreen.tsx` | Login/Signup |

### Main Stack

| Screen | Route | Component | Purpose |
|--------|-------|-----------|---------|
| Role Selection | `RoleSelection` | `screens/role-selection/RoleSelectionScreen.tsx` | Select user role |
| Dashboard | `Dashboard` | `screens/dashboard/DashboardScreen.tsx` | Main dashboard |
| Guest Dashboard | `GuestDashboard` | `screens/dashboard/GuestDashboardScreen.tsx` | Guest view |
| Duplicate Report | `DuplicateReport` | `screens/dashboard/DuplicateReportScreen.tsx` | Duplicate existing report |

### CMVR Screens

| Screen | Route | Component | Purpose |
|--------|-------|-----------|---------|
| CMVR Report | `CMVRReport` | `screens/CMVRPAGE/CMVR/CMVRReportScreen.tsx` | CMVR entry point |
| CMVR Page 2 | `CMVRPage2` | `screens/CMVRPAGE/CMVRPage2/CMVRPage2Screen.tsx` | General info & navigation hub |
| CMVR Drafts | `CMVRDrafts` | `screens/CMVRPAGE/CMVRDraftsScreen.tsx` | List saved drafts |
| Env Compliance | `EnvironmentalCompliance` | `screens/CMVRPAGE/EnvironmentalCompliance/EnvironmentalComplianceScreen.tsx` | Environmental hub |
| Air Quality | `AirQuality` | `screens/CMVRPAGE/air-quality/AirQualityScreen.tsx` | Air quality monitoring |
| Water Quality | `WaterQuality` | `screens/CMVRPAGE/water-quality/WaterQualityScreen.tsx` | Water quality monitoring |
| Noise Quality | `NoiseQuality` | `screens/CMVRPAGE/NoiseQuality/NoiseQualityScreen.tsx` | Noise monitoring |
| Waste Management | `WasteManagement` | `screens/CMVRPAGE/WasteManagement/WasteManagementScreen.tsx` | Waste management tracking |
| Chemical Safety | `ChemicalSafety` | `screens/CMVRPAGE/chemical/ChemicalSafetyScreen.tsx` | Chemical safety management |
| CMS | `ComplianceMonitoring` | `screens/CMVRPAGE/CMS/ComplianceMonitoringScreen.tsx` | Compliance monitoring summary |
| EIA Compliance | `EIACompliance` | `screens/CMVRPAGE/EIA/EIAComplianceScreen.tsx` | EIA compliance |
| Recommendations | `Recommendations` | `screens/CMVRPAGE/recommendations/RecommendationsScreen.tsx` | Report recommendations |
| CMVR Attachments | `CMVRAttachments` | `screens/CMVRPAGE/CMVRAttachmentsScreen.tsx` | Manage attachments |
| Document Export | `CMVRDocumentExport` | `screens/CMVRPAGE/CMVRDocumentExportScreen.tsx` | Export configuration |
| Export Report | `ExportReport` | `screens/CMVRPAGE/ExportReportScreen.tsx` | Generate documents |
| Attendance List | `AttendanceList` | `screens/CMVRPAGE/AttendanceListScreen.tsx` | Select attendance for CMVR |

### ECC Screens

| Screen | Route | Component | Purpose |
|--------|-------|-----------|---------|
| ECC Monitoring | `ECCMonitoring` | `screens/ecc/ECCMonitoringScreen.tsx` | ECC main screen |
| ECC Conditions | `ECCMonitoring2` | `screens/ecc/conditions.tsx` | Condition tracking |
| ECC Drafts | `ECCDraftScreen` | `screens/ecc/ECCDraftsScreen.tsx` | List ECC drafts |
| EPEP | `EPEP` | `screens/EPEP/epepScreen.tsx` | EPEP compliance |

### Attendance Screens

| Screen | Route | Component | Purpose |
|--------|-------|-----------|---------|
| Create Attendance | `CreateAttendance` | `screens/attendance/CreateAttendanceScreen.tsx` | New attendance record |
| Attendance Records | `AttendanceRecords` | `screens/attendance/AttendanceRecordScreen.tsx` | View/edit attendance |

### Profile Screens

| Screen | Route | Component | Purpose |
|--------|-------|-----------|---------|
| Profile | `Profile` | `screens/profile/ProfileScreen.tsx` | View profile |
| Edit Profile | `EditProfile` | `screens/profile/EditProfileScreen.tsx` | Edit profile |

### Other Screens

| Screen | Route | Component | Purpose |
|--------|-------|-----------|---------|
| Reports | `Reports` | `screens/reports/ReportsScreen.tsx` | View all reports |
| Submissions | `Submissions` | `screens/SubmissionsScreen.tsx` | View submissions |

---

## Navigation Patterns

### Basic Navigation

```typescript
navigation.navigate('ScreenName');
navigation.navigate('ScreenName', { param1: value1 });
```

### Go Back

```typescript
navigation.goBack();
```

### Replace Screen

```typescript
navigation.replace('ScreenName');
```

### Reset Navigation

```typescript
navigation.reset({
  index: 0,
  routes: [{ name: 'Dashboard' }],
});
```

---

## Deep Linking

**Status**: ⚪ Not yet implemented

**Planned URL Scheme**: `minecomply://`

**Example Links:**
- `minecomply://report/:id`
- `minecomply://draft/:id`
- `minecomply://attendance/:id`

