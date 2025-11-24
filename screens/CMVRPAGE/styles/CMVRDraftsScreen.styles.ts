import { StyleSheet, Platform } from "react-native";
import { theme } from "../../../theme/theme";
import {
  scale,
  verticalScale,
  normalizeFont,
  moderateScale,
  isTablet,
} from "../../../utils/responsive";

export const cmvrDraftStyles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: verticalScale(40),
  },
  headerContainer: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(theme.spacing.lg),
    paddingBottom: verticalScale(20),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerTitle: {
    fontFamily: theme.typography.bold,
    fontSize: normalizeFont(isTablet() ? 32 : 24),
    color: theme.colors.primaryDark,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(isTablet() ? 17 : 15),
    color: theme.colors.textLight,
    marginTop: verticalScale(6),
    lineHeight: normalizeFont(22),
  },
  actionButtonWrapper: {
    paddingHorizontal: scale(20),
    marginTop: verticalScale(16),
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(12),
    backgroundColor: theme.colors.primaryLight + "18",
    borderRadius: moderateScale(16),
    paddingVertical: verticalScale(18),
    borderWidth: 0,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primaryDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
    }),
  },
  actionButtonText: {
    color: theme.colors.primaryDark,
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(isTablet() ? 19 : 17),
    letterSpacing: 0.2,
  },
  section: {
    marginTop: verticalScale(24),
    paddingHorizontal: scale(20),
  },
  sectionHeader: {
    marginBottom: verticalScale(16),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontFamily: theme.typography.bold,
    fontSize: normalizeFont(isTablet() ? 24 : 20),
    color: theme.colors.title,
    letterSpacing: -0.3,
  },
  recordsContainer: {
    gap: verticalScale(16),
  },
  draftCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: moderateScale(18),
    borderWidth: 1,
    borderColor: "#E2E8F0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
    }),
  },
  draftInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: scale(20),
  },
  draftInfo: {
    flex: 1,
    marginRight: scale(16),
  },
  draftTitle: {
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(isTablet() ? 19 : 17),
    color: theme.colors.title,
    marginBottom: verticalScale(6),
    letterSpacing: -0.2,
  },
  draftMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  draftMetaText: {
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(isTablet() ? 16 : 14),
    color: theme.colors.textLight,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
  },
  openButton: {
    backgroundColor: theme.colors.primaryLight + "25",
  },
  deleteButton: {
    backgroundColor: theme.colors.error + "20",
  },
  iconButton: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  emptyStateCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: "#E2E8F0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
    }),
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: scale(40),
  },
  emptyStateTitle: {
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(isTablet() ? 22 : 19),
    color: theme.colors.title,
    marginTop: verticalScale(16),
    letterSpacing: -0.3,
  },
  emptyStateText: {
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(isTablet() ? 17 : 15),
    color: theme.colors.textLight,
    marginTop: verticalScale(8),
    textAlign: "center",
    lineHeight: normalizeFont(22),
  },
});
