import { StyleSheet } from "react-native";
import { theme } from "../../../theme/theme";
import {
  scale,
  verticalScale,
  moderateScale,
  normalizeFont,
  isTablet,
} from "../../../utils/responsive";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: verticalScale(isTablet() ? 60 : 40),
    paddingHorizontal: scale(isTablet() ? 40 : 24),
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: verticalScale(isTablet() ? 48 : 32),
  },
  logo: {
    width: scale(isTablet() ? 130 : 90),
    height: scale(isTablet() ? 130 : 90),
    marginBottom: verticalScale(isTablet() ? 24 : 16),
  },
  title: {
    fontFamily: theme.typography.bold,
    fontSize: normalizeFont(isTablet() ? 30 : 26),
    color: theme.colors.title,
    textAlign: "center",
    marginBottom: verticalScale(4),
  },
  subtitle: {
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(isTablet() ? 18 : 15),
    color: theme.colors.textLight,
    textAlign: "center",
  },
  rolesContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: isTablet() ? "space-around" : "space-between",
    paddingHorizontal: scale(4),
  },
  roleWrapper: {
    width: isTablet() ? "45%" : "47%",
    marginBottom: verticalScale(isTablet() ? 30 : 20),
  },
  roleCard: {
    backgroundColor: "#ffffff",
    borderRadius: moderateScale(20),
    paddingVertical: verticalScale(isTablet() ? 40 : 32),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconCircle: {
    width: scale(isTablet() ? 80 : 64),
    height: scale(isTablet() ? 80 : 64),
    borderRadius: scale(isTablet() ? 40 : 32),
    backgroundColor: "#E8F1FD",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(14),
  },
  roleLabel: {
    color: theme.colors.primaryDark,
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(isTablet() ? 18 : 16),
  },
});

export default styles;
