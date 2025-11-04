import { StyleSheet } from "react-native";
import { theme } from "../../../theme/theme";
import { scale, verticalScale, normalizeFont, isTablet, moderateScale } from "../../../utils/responsive";

export const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: scale(theme.spacing.lg),
    paddingTop: verticalScale(theme.spacing.lg),
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(theme.typography.sizes.sm),
    color: theme.colors.primaryDark,
    marginLeft: 6,
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(theme.spacing.lg),
  },
  greeting: {
    fontFamily: theme.typography.bold,
    fontSize: normalizeFont(theme.typography.sizes.xxl),
    color: theme.colors.primaryDark,
    textAlign: "center",
    marginBottom: verticalScale(theme.spacing.lg),
  },
  qrPromptBox: {
    backgroundColor: theme.colors.primaryLight + "15",
    borderRadius: moderateScale(theme.radii.lg),
    paddingVertical: verticalScale(theme.spacing.md),
    paddingHorizontal: scale(theme.spacing.lg),
  },

  qrPromptText: {
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(theme.typography.sizes.md),
    color: theme.colors.primaryDark,
    textAlign: "center",
  },
  autoPopulateButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "auto",
    marginTop: verticalScale(10),
  },
  autoPopulateText: {
    color: theme.colors.primaryDark,
    fontWeight: "500",
    marginLeft: 6,
    fontSize: 13,
  },
  debugButton: {
    marginTop: verticalScale(12),
    backgroundColor: "#f3f4f6",
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(8),
  },
  debugButtonText: {
    color: theme.colors.primaryDark,
    fontFamily: theme.typography.semibold,
  },
  qrStatusText: {
    marginTop: verticalScale(theme.spacing.md),
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(theme.typography.sizes.sm),
    color: theme.colors.success || "#28a745",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 450,
    minWidth: 280,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    ...theme.shadows.light,
  },
  modalTitle: {
    fontSize: normalizeFont(theme.typography.sizes.lg),
    fontFamily: theme.typography.semibold,
    color: theme.colors.primaryDark,
    marginBottom: verticalScale(24),
  },
  optionButton: {
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 10,
    width: "100%",
    maxWidth: 400,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  optionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primaryLight + "20",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  optionTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  optionText: {
    fontSize: normalizeFont(theme.typography.sizes.md),
    fontFamily: theme.typography.semibold,
    color: theme.colors.primaryDark,
  },
  optionSubText: {
    fontSize: normalizeFont(theme.typography.sizes.sm),
    fontFamily: theme.typography.regular,
    color: "#6b7280",
    marginTop: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
    color: "#111827",
  },
  modalAction: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: verticalScale(24),
    gap: 12,
  },
  cancelButton: {
    backgroundColor: "transparent",
  },
  cancelText: {
    color: "#888",
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(theme.typography.sizes.md),
  },
  convertButtonText: {
    // ✅ NEW STYLE
    color: theme.colors.primaryDark,
    fontSize: normalizeFont(theme.typography.sizes.md), // Same size as cancel
    fontFamily: theme.typography.regular, // As requested
  },
});