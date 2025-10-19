import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../contexts/AuthContext";

// Screens
import AuthScreen from "../screens/AuthScreen";
import RoleSelectionScreen from "../screens/RoleSelectionScreen"; 
import DashboardScreen from "../screens/DashboardScreen";
import SubmissionsScreen from "../screens/SubmissionsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CMVRReportScreen from "../screens/CMVRReportScreen";
import CMVRPage2Screen from "../screens/CMVRPage2Screen";
import CreateAttendanceScreen from "../screens/CreateAttendanceScreen";
import AttendanceRecordScreen from "../screens/AttendanceRecordScreen";
import ReportsScreen from "../screens/ReportsScreen";
import ComplianceMonitoringScreen from "../screens/ComplianceMonitoringScreen";

const RootStack = createStackNavigator();

const AppNavigator = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: true }}>
        {!session ? (
          <RootStack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
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
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;