import { StyleSheet } from "react-native";
import { theme } from "../theme/theme";
import { scale, verticalScale, normalizeFont, isTablet, moderateScale } from "../utils/responsive";

export const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: verticalScale(theme.spacing.xl),
  },
  header: {
    paddingHorizontal: scale(theme.spacing.lg),
    paddingTop: verticalScale(theme.spacing.xl),
    paddingBottom: verticalScale(theme.spacing.xl),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontFamily: theme.typography.bold,
    fontSize: normalizeFont(theme.typography.sizes.xxl),
    color: theme.colors.primaryDark,
  },
  subGreeting: {
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(theme.typography.sizes.sm),
    color: theme.colors.textLight,
  },
  avatar: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    backgroundColor: theme.colors.primaryLight + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(theme.typography.sizes.md),
    color: theme.colors.primaryDark,
  },
  section: {
    paddingHorizontal: scale(theme.spacing.lg),
    marginBottom: verticalScale(theme.spacing.xl),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(theme.spacing.md),
  },
  sectionTitle: {
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(theme.typography.sizes.lg),
    color: theme.colors.title,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  viewAllButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  viewAllText: {
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(theme.typography.sizes.sm),
    color: theme.colors.primaryDark,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  actionsContainer: {
    marginTop: verticalScale(theme.spacing.md),
    flexDirection: "column", // always stacked vertically
    gap: scale(theme.spacing.md),
  },
  actionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: moderateScale(theme.radii.lg),
    ...theme.shadows.light,
    padding: scale(theme.spacing.lg),
    flexDirection: "row",
    alignItems: "center",
    // Removed tablet-based flexBasis, to keep stacked layout
  },
  actionIconCircle: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: theme.colors.primaryLight + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  actionTextContainer: {
    flex: 1,
    marginHorizontal: scale(theme.spacing.md),
  },
  actionTitle: {
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(theme.typography.sizes.md),
    color: theme.colors.title,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(theme.typography.sizes.sm),
    color: theme.colors.textLight,
  },
  summaryContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: moderateScale(theme.radii.lg),
    ...theme.shadows.light,
    overflow: "hidden",
  },
  reportsContainer: {},
  reportCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: scale(theme.spacing.lg),
    backgroundColor: theme.colors.surface,
  },
  reportContent: {
    flex: 1,
    marginRight: scale(theme.spacing.sm),
  },
  reportTitle: {
    fontFamily: theme.typography.medium,
    fontSize: normalizeFont(theme.typography.sizes.sm),
    color: theme.colors.title,
    marginBottom: 4,
  },
  reportMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  reportMetaText: {
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(theme.typography.sizes.xs),
    color: theme.colors.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: "#EAEAEA",
    marginHorizontal: scale(theme.spacing.lg),
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: scale(theme.spacing.xl),
  },
  emptyStateTitle: {
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(theme.typography.sizes.lg),
    color: theme.colors.title,
    marginTop: verticalScale(theme.spacing.md),
  },
  emptyStateText: {
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(theme.typography.sizes.sm),
    color: theme.colors.textLight,
    marginTop: 4,
    textAlign: "center",
  },

  // ---------------------------------
  // 👇 NEW RESPONSIVE MODAL STYLES
  // ---------------------------------
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(theme.spacing.lg), // Ensures modal isn't flush with edges
  },
  modalContent: {
    width: '100%', // Take up 90% of screen, defined in backdrop padding
    maxWidth: moderateScale(400), // Max width on large devices
    backgroundColor: theme.colors.surface,
    borderRadius: moderateScale(theme.radii.lg),
    padding: scale(theme.spacing.lg),
    ...theme.shadows.medium,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(theme.spacing.lg),
  },
  modalTitle: {
    fontFamily: theme.typography.bold,
    fontSize: normalizeFont(theme.typography.sizes.lg),
    color: theme.colors.title,
  },
  modalCloseButton: {
    padding: moderateScale(4), // Hitbox
  },
  modalOptionsContainer: {
    gap: verticalScale(theme.spacing.sm),
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(theme.spacing.md),
    backgroundColor: theme.colors.background,
    borderRadius: moderateScale(theme.radii.md),
  },
  modalButtonIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: theme.colors.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    flex: 1,
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(theme.typography.sizes.md),
    color: theme.colors.title,
    marginLeft: scale(theme.spacing.md),
  },
});