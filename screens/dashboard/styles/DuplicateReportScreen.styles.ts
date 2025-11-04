import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../../theme/theme";
import { scale, verticalScale, normalizeFont, moderateScale } from "../../../utils/responsive";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;

export const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: verticalScale(theme.spacing.xl),
  },
  scrollContentTablet: {
    alignItems: "center",
  },
  contentWrapper: {
    width: "100%",
  },
  contentWrapperTablet: {
    width: "100%",
    maxWidth: 900,
    paddingHorizontal: scale(theme.spacing.xl),
  },
  header: {
    paddingHorizontal: scale(theme.spacing.lg),
    paddingTop: verticalScale(theme.spacing.lg),
    paddingBottom: verticalScale(theme.spacing.md),
  },
  title: {
    fontFamily: theme.typography.bold,
    fontSize: normalizeFont(theme.typography.sizes.xxl),
    color: theme.colors.primaryDark,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(theme.typography.sizes.sm),
    color: theme.colors.textLight,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: scale(theme.spacing.lg),
    gap: scale(theme.spacing.sm),
    marginBottom: verticalScale(theme.spacing.lg),
  },
  filterContainerTablet: {
    gap: scale(theme.spacing.md),
    paddingHorizontal: scale(theme.spacing.xl),
  },
  filterTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(isTablet ? 14 : 12),
    paddingHorizontal: scale(isTablet ? theme.spacing.lg : 6),
    backgroundColor: theme.colors.surface,
    borderRadius: moderateScale(theme.radii.lg),
    gap: scale(4),
    borderWidth: 2,
    borderColor: "transparent",
    ...theme.shadows.light,
  },
  filterTabActive: {
    backgroundColor: theme.colors.primaryDark,
    borderColor: theme.colors.primaryDark,
    ...theme.shadows.medium,
  },
  filterTabText: {
    fontFamily: theme.typography.medium,
    fontSize: normalizeFont(isTablet ? 15 : 13),
    color: theme.colors.text,
    flexShrink: 0,
  },
  filterTabTextActive: {
    fontFamily: theme.typography.bold,
    color: theme.colors.surface,
  },
  filterBadge: {
    backgroundColor: theme.colors.primaryLight + "30",
    paddingHorizontal: scale(isTablet ? 10 : 8),
    paddingVertical: verticalScale(isTablet ? 4 : 3),
    borderRadius: moderateScale(isTablet ? 14 : 12),
    minWidth: moderateScale(isTablet ? 28 : 24),
    alignItems: "center",
    justifyContent: "center",
  },
  filterBadgeActive: {
    backgroundColor: theme.colors.surface + "30",
  },
  filterBadgeText: {
    fontFamily: theme.typography.bold,
    fontSize: normalizeFont(isTablet ? 13 : theme.typography.sizes.xs),
    color: theme.colors.primaryDark,
  },
  filterBadgeTextActive: {
    color: theme.colors.surface,
  },
  section: {
    paddingHorizontal: scale(theme.spacing.lg),
  },
  recordsContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: moderateScale(theme.radii.lg),
    ...theme.shadows.light,
    overflow: "hidden",
  },
  recordsContainerTablet: {
    ...theme.shadows.medium,
  },
  recordCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(theme.spacing.lg),
    backgroundColor: theme.colors.surface,
  },
  recordCardTablet: {
    padding: scale(theme.spacing.xl),
  },
  recordCardSelected: {
    backgroundColor: theme.colors.primaryLight + "10",
  },
  recordIconCircle: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: theme.colors.primaryLight + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  recordContent: {
    flex: 1,
    marginHorizontal: scale(theme.spacing.md),
  },
  recordTitle: {
    fontFamily: theme.typography.medium,
    fontSize: normalizeFont(theme.typography.sizes.md),
    color: theme.colors.title,
    marginBottom: 4,
  },
  recordMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  recordMetaText: {
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(theme.typography.sizes.xs),
    color: theme.colors.textLight,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: theme.colors.textLight,
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
    backgroundColor: theme.colors.surface,
    borderRadius: moderateScale(theme.radii.lg),
    ...theme.shadows.light,
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
});