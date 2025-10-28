import { StyleSheet } from "react-native";
import { theme } from "../theme/theme";
import {
  scale,
  verticalScale,
  moderateScale,
  normalizeFont,
  isTablet,
} from "../utils/responsive";

export const createAttendanceStyles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: verticalScale(theme.spacing.lg),
  },
  header: {
    paddingHorizontal: scale(theme.spacing.md),
    paddingTop: verticalScale(theme.spacing.md),
    paddingBottom: verticalScale(theme.spacing.md),
  },
  headerTitle: {
    fontFamily: theme.typography.bold,
    fontSize: normalizeFont(isTablet() ? 24 : theme.typography.sizes.xl),
    color: theme.colors.primaryDark,
  },
  headerSubtitle: {
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(isTablet() ? 14 : theme.typography.sizes.xs),
    color: theme.colors.textLight,
    marginTop: verticalScale(2),
  },
  topInputsContainer: {
    paddingHorizontal: scale(theme.spacing.md),
    gap: verticalScale(theme.spacing.sm),
    marginBottom: verticalScale(theme.spacing.sm),
  },
  section: {
    paddingHorizontal: scale(theme.spacing.md),
    gap: verticalScale(theme.spacing.md),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(theme.spacing.sm),
  },
  sectionTitle: {
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(isTablet() ? 18 : theme.typography.sizes.md),
    color: theme.colors.title,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: moderateScale(theme.radii.md),
    padding: scale(theme.spacing.md),
    ...theme.shadows.light,
  },
  inputContainer: {
    marginBottom: verticalScale(theme.spacing.sm),
  },
  label: {
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(isTablet() ? 13 : theme.typography.sizes.xs),
    color: theme.colors.text,
    marginBottom: verticalScale(theme.spacing.xs),
  },
  input: {
    borderWidth: 1,
    borderColor: "#EAEAEA",
    borderRadius: moderateScale(theme.radii.sm),
    paddingVertical: verticalScale(theme.spacing.sm),
    paddingHorizontal: scale(theme.spacing.sm),
    fontSize: normalizeFont(isTablet() ? 14 : theme.typography.sizes.sm),
    color: theme.colors.text,
    fontFamily: theme.typography.regular,
    backgroundColor: theme.colors.surface,
  },
  inputFilled: {
    borderColor: theme.colors.primaryDark,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  labelError: {
    color: theme.colors.error,
  },
  errorText: {
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(isTablet() ? 12 : theme.typography.sizes.xs),
    color: theme.colors.error,
    marginTop: verticalScale(2),
    marginLeft: scale(theme.spacing.xs),
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: verticalScale(theme.spacing.xs),
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButton: {
    height: moderateScale(16),
    width: moderateScale(16),
    borderRadius: moderateScale(8),
    borderWidth: 2,
    borderColor: "#EAEAEA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(theme.spacing.xs),
  },
  radioButtonSelected: {
    borderColor: theme.colors.primaryDark,
  },
  radioButtonInner: {
    height: moderateScale(8),
    width: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: theme.colors.primaryDark,
  },
  radioButtonLabel: {
    fontFamily: theme.typography.medium,
    color: theme.colors.text,
    fontSize: normalizeFont(isTablet() ? 13 : theme.typography.sizes.xs),
  },
    radioError: {
    borderColor: theme.colors.error,
  },
  signatureWrapper: {
    position: "relative",
  },
signatureContainer: {
  borderWidth: 1,
  borderColor: "#EAEAEA",
  borderRadius: moderateScale(theme.radii.sm),
  height: verticalScale(isTablet() ? 240 : 200), 
  overflow: "hidden",
  backgroundColor: theme.colors.surface,
},
  signatureActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: scale(theme.spacing.md),
    marginTop: verticalScale(theme.spacing.xs),
  },
  sigActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(theme.spacing.xs),
  },
  sigActionText: {
    fontFamily: theme.typography.medium,
    color: theme.colors.primaryDark,
    fontSize: normalizeFont(isTablet() ? 13 : theme.typography.sizes.xs),
  },
  removeIconButton: {
    width: moderateScale(26),
    height: moderateScale(26),
    borderRadius: moderateScale(13),
    backgroundColor: theme.colors.error + "1A",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomButtonsContainer: {
    paddingHorizontal: scale(theme.spacing.md),
    marginTop: verticalScale(theme.spacing.md),
    gap: verticalScale(theme.spacing.sm),
  },
  actionButtonWrapper: {
    width: "100%",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(6),
    backgroundColor: theme.colors.primaryLight + "10",
    borderRadius: moderateScale(theme.radii.sm),
    paddingVertical: verticalScale(theme.spacing.sm),
  },
  actionButtonText: {
    color: theme.colors.primaryDark,
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(isTablet() ? 16 : theme.typography.sizes.sm),
  },
  saveButton: {
    flexDirection: "row",
    gap: scale(theme.spacing.xs),
    backgroundColor: theme.colors.primaryDark,
    borderRadius: moderateScale(theme.radii.sm),
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(theme.spacing.md),
    ...theme.shadows.light,
  },
  saveButtonText: {
    color: "#fff",
    fontFamily: theme.typography.bold,
    fontSize: normalizeFont(isTablet() ? 16 : theme.typography.sizes.sm),
  },
});
