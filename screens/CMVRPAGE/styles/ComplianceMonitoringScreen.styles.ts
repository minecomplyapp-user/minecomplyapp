// ComplianceMonitoringScreen.styles.ts
import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 12 : 12,
    paddingBottom: 16,
    backgroundColor: "white",
    zIndex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  parametersHeader: {
    marginBottom: 18,
    marginTop: -4,
    paddingHorizontal: 2,
    paddingVertical: 10,
    backgroundColor: "#F8FAFC",
    borderLeftWidth: 3,
    borderLeftColor: "#1E3A8A",
    borderRadius: 6,
  },
  parametersText: {
    fontWeight: "700",
    fontSize: 13,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingLeft: 12,
  },
  saveNextButton: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 28,
    marginBottom: 16,
    marginHorizontal: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#1E3A8A",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  saveNextButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
