import { StyleSheet } from "react-native";
import { theme } from "../../../theme/theme";
import { scale, verticalScale, normalizeFont, moderateScale, isTablet } from "../../../utils/responsive";

export const attendanceRecordStyles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: verticalScale(theme.spacing.xl),
  },
  headerContainer: {
    paddingHorizontal: scale(theme.spacing.lg),
    paddingTop: verticalScale(theme.spacing.lg),
    paddingBottom: verticalScale(theme.spacing.lg),
  },
  headerTitle: {
    fontFamily: theme.typography.bold,
    fontSize: normalizeFont(isTablet() ? 30 : theme.typography.sizes.xxl),
    color: theme.colors.primaryDark,
  },
  headerSubtitle: {
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(isTablet() ? 16 : theme.typography.sizes.sm),
    color: theme.colors.textLight,
    marginTop: verticalScale(4),
  },
  actionButtonWrapper: {
    paddingHorizontal: scale(theme.spacing.lg),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'center',
    gap: scale(10),
    backgroundColor: theme.colors.primaryLight + '15',
    borderRadius: moderateScale(theme.radii.md),
    paddingVertical: verticalScale(theme.spacing.md),
    borderWidth: 0,
  },
  actionButtonText: {
    color: theme.colors.primaryDark,
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(isTablet() ? 18 : theme.typography.sizes.md),
  },
  section: {
    marginTop: verticalScale(theme.spacing.xl),
    paddingHorizontal: scale(theme.spacing.lg),
  },
  sectionHeader: {
    marginBottom: verticalScale(theme.spacing.md),
  },
  sectionTitle: {
    fontFamily: theme.typography.bold,
    fontSize: normalizeFont(isTablet() ? 22 : theme.typography.sizes.lg),
    color: theme.colors.title,
  },
  recordsContainer: {
    gap: verticalScale(theme.spacing.md),
  },
  recordCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: moderateScale(theme.radii.lg),
    ...theme.shadows.light,
  },
  recordInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: scale(theme.spacing.lg),
  },
  recordInfo: {
    flex: 1,
    marginRight: scale(theme.spacing.md),
  },
  recordTitle: {
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(isTablet() ? 18 : theme.typography.sizes.md),
    color: theme.colors.title,
    marginBottom: verticalScale(4),
  },
  recordMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
  },
  recordMetaText: {
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(isTablet() ? 15 : theme.typography.sizes.sm),
    color: theme.colors.textLight,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(theme.spacing.sm),
  },
  iconButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    alignItems: "center",
    justifyContent: "center",
  },
  downloadButton: {
    backgroundColor: theme.colors.primaryLight + "20",
  },
  deleteButton: {
    backgroundColor: theme.colors.error + "1A",
  },
  emptyStateCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: moderateScale(theme.radii.lg),
    ...theme.shadows.light,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: scale(theme.spacing.xl),
  },
  emptyStateTitle: {
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(isTablet() ? 20 : theme.typography.sizes.lg),
    color: theme.colors.title,
    marginTop: verticalScale(theme.spacing.md),
  },
  emptyStateText: {
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(isTablet() ? 16 : theme.typography.sizes.sm),
    color: theme.colors.textLight,
    marginTop: verticalScale(4),
    textAlign: "center",
  },
});
