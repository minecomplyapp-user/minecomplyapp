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
    paddingBottom: verticalScale(theme.spacing.xl),
  },
  header: {
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
  topInputsContainer: {
    paddingHorizontal: scale(theme.spacing.lg),
    gap: verticalScale(theme.spacing.md),
    marginBottom: verticalScale(theme.spacing.md),
  },
  section: {
    paddingHorizontal: scale(theme.spacing.lg),
    gap: verticalScale(theme.spacing.lg),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(theme.spacing.md),
  },
  sectionTitle: {
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(isTablet() ? 20 : theme.typography.sizes.lg),
    color: theme.colors.title,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: moderateScale(theme.radii.lg),
    padding: scale(theme.spacing.lg),
    ...theme.shadows.light,
  },
  inputContainer: {
    marginBottom: verticalScale(theme.spacing.md),
  },
  label: {
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(isTablet() ? 15 : theme.typography.sizes.sm),
    color: theme.colors.text,
    marginBottom: verticalScale(theme.spacing.xs),
  },
  input: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: moderateScale(theme.radii.md),
    paddingVertical: verticalScale(theme.spacing.md),
    paddingHorizontal: scale(theme.spacing.md),
    fontSize: normalizeFont(isTablet() ? 16 : theme.typography.sizes.md),
    color: theme.colors.text,
    fontFamily: theme.typography.regular,
    backgroundColor: theme.colors.surface,
  },
  inputFilled: {
    borderColor: theme.colors.primaryDark,
    borderWidth: 1,
  },
  inputError: {
    borderColor: theme.colors.error,
    borderWidth: 1,
  },
  labelError: {
    color: theme.colors.error,
  },
  errorText: {
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(isTablet() ? 14 : theme.typography.sizes.sm),
    color: theme.colors.error,
    marginTop: verticalScale(4),
    marginLeft: scale(theme.spacing.xs),
  },
  radioError: {
    borderColor: theme.colors.error,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between', // Distributes items evenly
    marginTop: verticalScale(theme.spacing.xs),
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginRight is no longer needed
  },
  radioButton: {
    height: moderateScale(20),
    width: moderateScale(20),
    borderRadius: moderateScale(10),
    borderWidth: 2,
    borderColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(theme.spacing.sm),
  },
  radioButtonSelected: {
    borderColor: theme.colors.primaryDark,
  },
  radioButtonInner: {
    height: moderateScale(10),
    width: moderateScale(10),
    borderRadius: moderateScale(5),
    backgroundColor: theme.colors.primaryDark,
  },
  radioButtonLabel: {
    fontFamily: theme.typography.medium,
    color: theme.colors.text,
    fontSize: normalizeFont(isTablet() ? 15 : theme.typography.sizes.sm),
  },
  signatureWrapper: {
    position: "relative",
  },
  signatureContainer: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: moderateScale(theme.radii.md),
    height: verticalScale(180),
    overflow: "hidden",
    backgroundColor: theme.colors.surface,
  },
  signatureActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: scale(theme.spacing.lg),
    marginTop: verticalScale(theme.spacing.sm),
  },
  sigActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(theme.spacing.xs),
  },
  sigActionText: {
    fontFamily: theme.typography.medium,
    color: theme.colors.primaryDark,
    fontSize: normalizeFont(isTablet() ? 15 : theme.typography.sizes.sm),
  },
  removeIconButton: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(15),
    backgroundColor: theme.colors.error + "1A",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomButtonsContainer: {
    paddingHorizontal: scale(theme.spacing.lg),
    marginTop: verticalScale(theme.spacing.lg),
    gap: verticalScale(theme.spacing.md),
  },
  actionButtonWrapper: {
    width: "100%",
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'center',
    gap: scale(8),
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
  saveButton: {
    flexDirection: 'row',
    gap: scale(theme.spacing.sm),
    backgroundColor: theme.colors.primaryDark,
    borderRadius: moderateScale(theme.radii.md),
    alignItems: "center",
    justifyContent: 'center',
    paddingVertical: verticalScale(theme.spacing.lg),
    ...theme.shadows.light,
  },
  saveButtonText: {
    color: "#fff",
    fontFamily: theme.typography.bold,
    fontSize: normalizeFont(isTablet() ? 18 : theme.typography.sizes.md),
  },
});

