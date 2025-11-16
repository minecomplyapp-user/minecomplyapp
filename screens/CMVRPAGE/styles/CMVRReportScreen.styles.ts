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
  statusBanner: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  statusBannerNew: {
    backgroundColor: "#E6F4EA",
    borderColor: "#34A853",
  },
  statusBannerExisting: {
    backgroundColor: "#FFF4E5",
    borderColor: "#FB8C00",
  },
  statusBannerLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  statusBannerSubtext: {
    fontSize: 12,
    color: "#475569",
    marginTop: 4,
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
