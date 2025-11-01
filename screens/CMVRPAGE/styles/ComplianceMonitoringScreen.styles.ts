// ComplianceMonitoringScreen.styles.ts
import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 12 : 12,
    paddingBottom: 12,
    backgroundColor: "white",
    zIndex: 1,
    shadowColor: "#02217C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  parametersHeader: {
    marginBottom: 14,
    marginTop: -6,
    paddingHorizontal: 4,
  },
  parametersText: {
    fontWeight: "700",
    fontSize: 12,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  saveNextButton: {
    backgroundColor: "#02217C",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
    marginHorizontal: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#02217C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveNextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
