// AppNavigator.tsx

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../contexts/AuthContext";
import { FileNameProvider } from "../contexts/FileNameContext";

// Screens
import AuthScreen from "../screens/AuthScreen";
import RoleSelectionScreen from "../screens/RoleSelectionScreen";
import DashboardScreen from "../screens/DashboardScreen";
import SubmissionsScreen from "../screens/SubmissionsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CMVRReportScreen from "../screens/CMVRPAGE/CMVRReportScreen";
import CMVRPage2Screen from "../screens/CMVRPAGE/CMVRPage2Screen";
import CreateAttendanceScreen from "../screens/CreateAttendanceScreen";
import AttendanceRecordScreen from "../screens/AttendanceRecordScreen";
import ReportsScreen from "../screens/ReportsScreen";
import ComplianceMonitoringScreen from "../screens/CMVRPAGE/ComplianceMonitoringScreen";
import EIAComplianceScreen from "../screens/CMVRPAGE/EIAComplianceScreen";
import EnvironmentalComplianceScreen from "../screens/CMVRPAGE/EnvironmentalComplianceScreen";
import WaterQualityScreen from "../screens/CMVRPAGE/WaterQualityScreen";
import NoiseQualityScreen from "../screens/CMVRPAGE/NoiseQualityScreen";
import WasteManagementScreen from "../screens/CMVRPAGE/WasteManagementScreen";
import ChemicalSafetyScreen from "../screens/CMVRPAGE/ChemicalSafetyScreen";
import RecommendationsScreen from "../screens/CMVRPAGE/RecommendationsScreen";
// --- 1. IMPORT THE EXPORT SCREEN ---
import CMVRDocumentExportScreen from "../screens/CMVRPAGE/CMVRDocumentExportScreen";

const RootStack = createStackNavigator();

const AppNavigator = () => {
  const { session, loading } = useAuth();

  if (loading) return null;

  return (
    <FileNameProvider>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: true }}>
          {!session ? (
            <RootStack.Screen
              name="Auth"
              component={AuthScreen}
              options={{ headerShown: false }}
            />
          ) : (
            <>
              <RootStack.Screen
                name="RoleSelection"
                component={RoleSelectionScreen}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{ headerShown: false }}
              />
              <RootStack.Screen name="AttendanceRecords" component={AttendanceRecordScreen} />
              <RootStack.Screen name="CreateAttendance" component={CreateAttendanceScreen} />
              <RootStack.Screen name="Reports" component={ReportsScreen} />
              <RootStack.Screen name="Submissions" component={SubmissionsScreen} />
              <RootStack.Screen name="Profile" component={ProfileScreen} />
              <RootStack.Screen name="CMVRReport" component={CMVRReportScreen} />
              <RootStack.Screen name="CMVRPage2" component={CMVRPage2Screen} />
              <RootStack.Screen
                name="ComplianceMonitoring"
                component={ComplianceMonitoringScreen}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="EIACompliance"
                component={EIAComplianceScreen}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="EnvironmentalCompliance"
                component={EnvironmentalComplianceScreen}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="WaterQuality"
                component={WaterQualityScreen}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="NoiseQuality"
                component={NoiseQualityScreen}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="WasteManagement"
                component={WasteManagementScreen}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="ChemicalSafety"
                component={ChemicalSafetyScreen}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="Recommendations"
                component={RecommendationsScreen}
                options={{ headerShown: false }}
              />
              
              {/* --- 2. ADD THE SCREEN TO THE NAVIGATOR --- */}
              <RootStack.Screen
                name="CMVRDocumentExport"
                component={CMVRDocumentExportScreen}
                options={{ headerShown: false }}
              />
            </>
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </FileNameProvider>
  );
};

export default AppNavigator;