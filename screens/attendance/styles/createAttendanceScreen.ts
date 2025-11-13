import { StyleSheet } from "react-native";
import { theme } from "../../../theme/theme";
import {
  scale,
  verticalScale,
  moderateScale,
  normalizeFont,
  isTablet,
} from "../../../utils/responsive";

export const createAttendanceStyles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: verticalScale(theme.spacing.xl),
  },

  // HEADER
  header: {
    paddingHorizontal: scale(theme.spacing.lg),
    paddingTop: verticalScale(theme.spacing.lg),
    paddingBottom: verticalScale(theme.spacing.md),
  },
  headerTitle: {
    fontFamily: theme.typography.bold,
    fontSize: normalizeFont(isTablet() ? 28 : theme.typography.sizes.xxl),
    color: theme.colors.primaryDark,
  },
  headerSubtitle: {
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(isTablet() ? 16 : theme.typography.sizes.sm),
    color: theme.colors.textLight,
    marginTop: verticalScale(4),
  },

  // TOP INPUTS
  topInputsContainer: {
    paddingHorizontal: scale(theme.spacing.lg),
    gap: verticalScale(theme.spacing.md),
    marginBottom: verticalScale(theme.spacing.lg),
  },

  // SECTION
  section: {
    paddingHorizontal: scale(theme.spacing.lg),
    gap: verticalScale(theme.spacing.md),
    marginBottom: verticalScale(theme.spacing.lg),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(theme.spacing.sm),
  },
  sectionTitle: {
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(isTablet() ? 20 : theme.typography.sizes.lg),
    color: theme.colors.title,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: moderateScale(theme.radii.md),
    padding: scale(theme.spacing.lg),
    ...theme.shadows.light,
  },

  // INPUTS
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
    borderColor: "#E0E0E0",
    borderRadius: moderateScale(theme.radii.md),
    paddingVertical: verticalScale(theme.spacing.md),
    paddingHorizontal: scale(theme.spacing.md),
    fontSize: normalizeFont(isTablet() ? 16 : theme.typography.sizes.md),
    color: theme.colors.text,
    fontFamily: theme.typography.regular,
    backgroundColor: theme.colors.surface,
  },
  // Use this when mimicking TextInput text in non-TextInput elements (e.g., date display)
  inputText: {
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(isTablet() ? 16 : theme.typography.sizes.md),
    color: theme.colors.text,
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
    fontSize: normalizeFont(isTablet() ? 13 : theme.typography.sizes.xs),
    color: theme.colors.error,
    marginTop: verticalScale(2),
    marginLeft: scale(theme.spacing.xs),
  },

  // RADIO
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: scale(theme.spacing.md),
    marginTop: verticalScale(theme.spacing.sm),
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButton: {
    height: moderateScale(20),
    width: moderateScale(20),
    borderRadius: moderateScale(10),
    borderWidth: 2,
    borderColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(theme.spacing.xs),
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
  radioError: {
    borderColor: theme.colors.error,
  },

  // SIGNATURE
  signatureWrapper: {
    position: "relative",
    marginTop: verticalScale(theme.spacing.md),
  },
  signatureContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: moderateScale(theme.radii.md),
    height: verticalScale(isTablet() ? 260 : 220),
    overflow: "hidden",
    backgroundColor: theme.colors.surface,
  },
  signatureActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: scale(theme.spacing.lg),
    marginTop: verticalScale(theme.spacing.sm),
  },
  sigActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(theme.spacing.xs),
  },
  sigActionText: {
    fontFamily: theme.typography.medium,
    color: theme.colors.primaryDark,
    fontSize: normalizeFont(isTablet() ? 15 : theme.typography.sizes.sm),
  },
  signaturePreviewContainer: {
    position: "relative",
    marginTop: 8,
  },
  signaturePreview: {
    width: "100%",
    height: 100,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  removeSignatureButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 4,
    ...theme.shadows.light,
  },
  addSignatureButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: theme.colors.primaryDark,
    borderStyle: "dashed",
    backgroundColor: theme.colors.primaryDark + "08",
    marginTop: 8,
  },
  addSignatureText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primaryDark,
  },
// Modal Container
  signatureModalContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface, // Use white surface for the modal
  },
  // Modal Header
  signatureModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(theme.spacing.md),
    paddingTop: verticalScale(theme.spacing.md),
    paddingBottom: verticalScale(theme.spacing.lg), // Extra space below header
  },
  signatureModalTitle: {
    fontFamily: theme.typography.bold,
    fontSize: normalizeFont(theme.typography.sizes.lg),
    color: theme.colors.primaryDark,
  },

  // Modal Canvas Area
  signatureModalCanvas: {
    flex: 1, // allow canvas to fill available middle space
    paddingHorizontal: scale(theme.spacing.md), // scaled padding so it looks proportional on tablet
    paddingTop: verticalScale(theme.spacing.sm),
    paddingBottom: verticalScale(theme.spacing.sm),
  },

  // Modal Footer
  signatureModalFooter: {
    paddingHorizontal: scale(theme.spacing.md),
    paddingTop: verticalScale(theme.spacing.lg), // Extra space above buttons
    paddingBottom: verticalScale(theme.spacing.md),
    backgroundColor: theme.colors.surface,
    // subtle top border for separation
    borderTopWidth: 1,
    borderTopColor: theme.colors.background,
  },
  signatureModalButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(theme.spacing.md), // scaled gap for consistent spacing
  },

  // Base Button Styles
  signatureModalButton: {
    flex: 1,
    paddingVertical: verticalScale(theme.spacing.md),
    borderRadius: moderateScale(theme.radii.md),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    backgroundColor: theme.colors.surface, // White
    borderColor: theme.colors.border,
  },
  signatureModalButtonText: {
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(theme.typography.sizes.md),
    color: theme.colors.text,
  },

  // "Cancel" Button Modifier
  signatureModalCancelButton: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.background,
  },

  // "Save" Button Modifier
  signatureModalSaveButton: {
    backgroundColor: theme.colors.primaryDark,
    borderColor: theme.colors.primaryDark,
  },
  signatureModalSaveText: {
    color: theme.colors.surface,
  },
  removeIconButton: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(15),
    backgroundColor: theme.colors.error + "1A",
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: scale(theme.spacing.md),
    paddingVertical: verticalScale(theme.spacing.sm),
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(theme.spacing.sm),
    paddingHorizontal: scale(theme.spacing.sm),
    gap: scale(theme.spacing.xs),
  },
  clearButtonText: {
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(theme.typography.sizes.md),
    color: theme.colors.primaryDark,
    marginLeft: scale(theme.spacing.xs),
  },
  // BUTTONS
  bottomButtonsContainer: {
    paddingHorizontal: scale(theme.spacing.lg),
    marginTop: verticalScale(theme.spacing.xl),
    gap: verticalScale(theme.spacing.md),
  },
  actionButtonWrapper: {
    width: "100%",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(8),
    backgroundColor: theme.colors.primaryLight + "15",
    borderRadius: moderateScale(theme.radii.md),
    paddingVertical: verticalScale(theme.spacing.md),
  },
  actionButtonText: {
    color: theme.colors.primaryDark,
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(isTablet() ? 18 : theme.typography.sizes.md),
  },
  saveButton: {
    flexDirection: "row",
    gap: scale(theme.spacing.sm),
    backgroundColor: theme.colors.primaryDark,
    borderRadius: moderateScale(theme.radii.md),
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(theme.spacing.md),
    ...theme.shadows.light,
  },
  saveButtonText: {
    color: "#fff",
    fontFamily: theme.typography.bold,
    fontSize: normalizeFont(isTablet() ? 18 : theme.typography.sizes.md),
  },
});
