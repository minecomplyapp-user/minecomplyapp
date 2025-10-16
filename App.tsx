import "./global.css";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";
import { AuthProvider } from "./contexts/AuthContext";
import AppNavigator from "./navigation/AppNavigator";
import { ThemeProvider as AppThemeProvider } from "./theme/ThemeProvider";

export default function App() {
  return (
    <AppThemeProvider>
        <AuthProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </AuthProvider>
    </AppThemeProvider>
  );
}
