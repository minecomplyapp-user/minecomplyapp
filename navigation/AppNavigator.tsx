import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../contexts/AuthContext";
import { FileNameProvider } from "../contexts/FileNameContext";

// Screens
import AuthScreen from "../screens/AuthScreen";
import RoleSelectionScreen from "../screens/role-selection/RoleSelectionScreen"; 
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import SubmissionsScreen from "../screens/SubmissionsScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import CMVRReportScreen from "../screens/CMVRReportScreen";
import CMVRPage2Screen from "../screens/CMVRPage2Screen";
import CreateAttendanceScreen from "../screens/attendance/CreateAttendanceScreen";
import AttendanceRecordScreen from "../screens/attendance/AttendanceRecordScreen";
import ReportsScreen from "../screens/reports/ReportsScreen";
import ComplianceMonitoringScreen from "../screens/ComplianceMonitoringScreen";
import EIAComplianceScreen from "../screens/EIAComplianceScreen";
import EnvironmentalComplianceScreen from "../screens/EnvironmentalComplianceScreen";
import WaterQualityScreen from "../screens/WaterQualityScreen";
import NoiseQualityScreen from "../screens/NoiseQualityScreen";
import ECCMonitoringScreen from "../screens/ecc/ECCMonitoringScreen"

const RootStack = createStackNavigator();

const AppNavigator = () => {
  const { session, loading } = useAuth();

  if (loading) return null;

  return (
    <FileNameProvider>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
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
              <RootStack.Screen name="ECCMonitoring" component={ECCMonitoringScreen} />
              {/* <RootStack.Screen
                name="EIACompliance"
                component={EIAComplianceScreen}
                options={{ headerShown: false }}
              /> */}
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
            </>
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </FileNameProvider>
  );
};

export default AppNavigator;