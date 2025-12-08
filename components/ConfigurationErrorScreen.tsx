import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

interface ConfigurationErrorScreenProps {
  error: string;
  details?: string;
}

const ConfigurationErrorScreen: React.FC<ConfigurationErrorScreenProps> = ({ error, details }) => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.title}>Configuration Error</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Unable to Start Application</Text>
          <Text style={styles.errorMessage}>{error}</Text>
        </View>

        {details && (
          <View style={styles.detailsBox}>
            <Text style={styles.detailsTitle}>Details:</Text>
            <Text style={styles.detailsText}>{details}</Text>
          </View>
        )}

        <View style={styles.instructionsBox}>
          <Text style={styles.instructionsTitle}>📋 What You Need to Do:</Text>
          
          <Text style={styles.instructionStep}>1. Contact Your Administrator</Text>
          <Text style={styles.instructionText}>
            This app requires proper configuration before it can be used. Please contact your system administrator or development team.
          </Text>

          <Text style={styles.instructionStep}>2. Required Configuration</Text>
          <Text style={styles.instructionText}>
            The following environment variables must be set when building the app:
          </Text>
          <Text style={styles.codeBlock}>
            • EXPO_PUBLIC_SUPABASE_URL{'\n'}
            • EXPO_PUBLIC_SUPABASE_ANON_KEY{'\n'}
            • PRODUCTION_API_BASE_URL (optional)
          </Text>

          <Text style={styles.instructionStep}>3. For Developers</Text>
          <Text style={styles.instructionText}>
            Rebuild the APK with the required environment variables configured. See BUILD_INSTRUCTIONS.md for details.
          </Text>
        </View>

        <View style={styles.helpBox}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpText}>
            • Check the README.md file in the project repository
          </Text>
          <Text style={styles.helpText}>
            • Review BUILD_INSTRUCTIONS.md for build configuration
          </Text>
          <Text style={styles.helpText}>
            • Contact the development team for support
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>MineComply Configuration Error</Text>
        <Text style={styles.footerSubtext}>Please rebuild with proper configuration</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#16213e",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#e94560",
  },
  icon: {
    fontSize: 48,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  errorBox: {
    backgroundColor: "#e94560",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: "#ffffff",
    lineHeight: 20,
  },
  detailsBox: {
    backgroundColor: "#16213e",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e94560",
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#e94560",
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 12,
    color: "#ffffff",
    lineHeight: 18,
    fontFamily: "monospace",
  },
  instructionsBox: {
    backgroundColor: "#16213e",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f3460",
    marginBottom: 16,
  },
  instructionStep: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#00d2ff",
    marginTop: 12,
    marginBottom: 6,
  },
  instructionText: {
    fontSize: 13,
    color: "#cccccc",
    lineHeight: 20,
    marginBottom: 8,
  },
  codeBlock: {
    fontSize: 12,
    color: "#00ff9f",
    backgroundColor: "#0a0e27",
    padding: 12,
    borderRadius: 4,
    fontFamily: "monospace",
    marginTop: 8,
    marginBottom: 8,
  },
  helpBox: {
    backgroundColor: "#0f3460",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 12,
  },
  helpText: {
    fontSize: 13,
    color: "#cccccc",
    lineHeight: 20,
    marginBottom: 6,
  },
  footer: {
    padding: 16,
    backgroundColor: "#16213e",
    borderTopWidth: 1,
    borderTopColor: "#e94560",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "bold",
  },
  footerSubtext: {
    fontSize: 10,
    color: "#cccccc",
    marginTop: 4,
  },
});

export default ConfigurationErrorScreen;

