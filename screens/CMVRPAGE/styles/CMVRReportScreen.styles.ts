// CMVRReportScreen.styles.ts
import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 12 : 12,
    paddingBottom: 12,
    backgroundColor: "white",
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  divider: {
    height: 8,
    backgroundColor: "#F8F9FA",
  },
  saveNextButton: {
    backgroundColor: "#02217C",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#02217C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveNextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
