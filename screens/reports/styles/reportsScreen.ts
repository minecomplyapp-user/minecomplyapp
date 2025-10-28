import { StyleSheet } from "react-native";
import { theme } from "../../../theme/theme";
import {
  scale,
  verticalScale,
  moderateScale,
  normalizeFont,
  isTablet,
} from "../../../utils/responsive";

export const reportScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: isTablet() ? scale(30) : scale(20),
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(50),
  },
  header: {
    marginBottom: verticalScale(24),
  },
  title: {
    fontFamily: theme.typography.bold,
    fontSize: normalizeFont(isTablet() ? 30 : 26),
    color: theme.colors.primaryDark,
  },
  subtitle: {
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(isTablet() ? 16 : 14),
    color: theme.colors.textLight,
    marginTop: verticalScale(4),
  },
  reportList: {
    gap: verticalScale(16),
  },
  reportCard: {
    borderRadius: moderateScale(18),
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  cardInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: scale(20),
  },
  reportInfo: {
    flex: 1,
    paddingRight: scale(16),
  },
  reportTitle: {
    fontFamily: theme.typography.bold,
    fontSize: normalizeFont(isTablet() ? 20 : 17),
    color: theme.colors.text,
    marginBottom: verticalScale(6),
  },
  reportMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
  },
  reportDate: {
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(isTablet() ? 15 : 13),
    color: theme.colors.textLight,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
  },
  iconButton: {
    width: scale(isTablet() ? 50 : 42),
    height: scale(isTablet() ? 50 : 42),
    borderRadius: scale(isTablet() ? 25 : 21),
    alignItems: "center",
    justifyContent: "center",
  },
  downloadButton: {
    backgroundColor: theme.colors.iconBackground,
  },
  deleteButton: {
    backgroundColor: theme.colors.error + "15",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(100),
  },
  emptyStateTitle: {
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(isTablet() ? 20 : 18),
    color: theme.colors.text,
    marginTop: verticalScale(16),
  },
  emptyStateText: {
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(isTablet() ? 16 : 14),
    color: theme.colors.textLight,
    textAlign: "center",
    paddingHorizontal: scale(40),
    marginTop: verticalScale(6),
  },
});
