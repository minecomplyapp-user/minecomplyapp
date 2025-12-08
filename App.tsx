import 'react-native-gesture-handler';
import "./global.css";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";
import { AuthProvider } from "./contexts/AuthContext";
import AppNavigator from "./navigation/AppNavigator";
import { ThemeProvider as AppThemeProvider } from "./theme/ThemeProvider";
import { SafeAreaWebProvider } from "./contexts/SafeAreaWebContext";

export default function App() {
  return (
    <AppThemeProvider>
        <SafeAreaWebProvider>
          <AuthProvider>
            <AppNavigator />
            <StatusBar style="auto" />
          </AuthProvider>
        </SafeAreaWebProvider>
    </AppThemeProvider>
  );
}
