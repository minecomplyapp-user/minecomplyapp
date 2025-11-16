import { Platform, StatusBar, StyleSheet } from "react-native";
import { theme } from "../../../theme/theme";
import {
  scale,
  verticalScale,
  normalizeFont,
  isTablet,
  moderateScale,
} from "../../../utils/responsive";

export const styles = StyleSheet.create({
  /* ===== CONTAINERS ===== */
  safeContainer: {
    flex: 1,
    backgroundColor: theme.colors.background || "#F8F9FA",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background || "#F8F9FA",
  },
  scrollContent: {
    paddingBottom: 50,
  },

  /* ===== HEADER ===== */
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontFamily: theme.typography.bold,
    fontSize: 22,
    color: theme.colors.primaryDark,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: theme.typography.regular,
    fontSize: 14,
    color: theme.colors.textLight,
  },


  /* ===== CARD ===== */
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 18,
    marginHorizontal: 18,
    marginTop: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },

  permitTitle: {
    fontFamily: theme.typography.bold,
    fontSize: 20,
    color: theme.colors.primaryDark,
    marginBottom: 12,
  },

  /* ===== PERMIT BUTTONS ===== */
  permitSection: {
    marginTop: verticalScale(20),
  },
  permitButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(12),
    paddingHorizontal: scale(18),
    gap: scale(12),
  },
  permitButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primaryDark,
    borderRadius: 14,
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(16),
    elevation: 2,
  },
  permitButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: scale(4),
  },
  permitButtonText: {
    color: "#fff",
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(15),
    marginLeft: scale(8),
  },

  permitTrashButton: {
    width: moderateScale(36),
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 0,
  },

  /* ===== INPUT ===== */
  inputContainer: {
    marginBottom: 14,
  },
  label: {
    fontFamily: theme.typography.semibold,
    fontSize: 15,
    color: theme.colors.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: theme.typography.regular,
    backgroundColor: "#FFFFFF",
  },

  /* remark textarea used in monitoringSection */
  remarkInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: theme.colors.text,
    fontFamily: theme.typography.regular,
    minHeight: 80,
    textAlignVertical: "top",
  },

  /* ===== DATE PICKER ===== */
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#F6F6F6",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  datePickerWrapper: {
    marginTop: 10,
    alignSelf: "center",
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "visible",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  datePickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "visible",
    zIndex: 999,
  },
  datePicker: {
    width: "100%",
    backgroundColor: "#fff",
  },
  datePickerDoneButton: {
    alignItems: "flex-end",
    paddingTop: 6,
  },
  datePickerDoneText: {
    color: theme.colors.primaryDark,
    fontFamily: theme.typography.semibold,
    fontSize: 16,
  },
  dateText: {
    color: theme.colors.text,
    fontFamily: theme.typography.regular,
    fontSize: 16,
    marginLeft: 8,
  },

  /* ===== MONITORING SECTION ===== */
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  sectionTitle: {
    fontFamily: theme.typography.bold,
    fontSize: 20,
    color: theme.colors.primaryDark,
    marginBottom: 12,
    marginTop: 10,
  },
  instructionPill: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.primaryLight + "15",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 10,
  },
  instructionText: {
    fontFamily: theme.typography.regular,
    fontSize: 13,
    color: theme.colors.primaryDark,
  },
  // --- New Noticeable "Note" Pill Style ---
  notePill: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: theme.colors.warning, 
    borderRadius: theme.radii.sm,
    padding: theme.spacing.md,
    gap: theme.spacing.sm, 
  },
  noteText: {
    fontFamily: theme.typography.medium, 
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text, 
    flex: 1,
    lineHeight: 20,
  },
  /* ===== CONDITION CARDS ===== */
  conditionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    marginHorizontal: 0,
    ...theme.shadows.light,
  },
  childCard: {
    backgroundColor: "#FBFBFB",
  },
  condition7Title: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primaryLight + "15",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  condition7Strip: {
    width: 6,
    height: "100%",
    backgroundColor: theme.colors.primaryDark,
    borderRadius: 3,
    marginRight: 10,
  },
  condition7Text: {
    fontFamily: theme.typography.bold,
    fontSize: 15,
    color: theme.colors.primaryDark,
    flex: 1,
  },
  conditionHeader: {
    marginBottom: verticalScale(8),
  },

  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(10),
  },
  conditionIndex: {
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(12),
    color: theme.colors.surface,
  },
  conditionIndexCircle: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: theme.colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  conditionTitle: {
    fontFamily: theme.typography.medium,
    fontSize: normalizeFont(14),
    color: theme.colors.title,
    lineHeight: 20,
    textAlign: "left",
    marginRight: scale(10),
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  /* ===== RADIO BUTTONS ===== */
  radioGroup: {
    marginTop: 6,
  },
  radioRow: {
    marginBottom: 10,
  },
  radioTouch: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D0D5DD",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 2,
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
  },
  radioLabelWrap: {
    flex: 1,
  },
  radioLabel: {
    fontFamily: theme.typography.medium,
    fontSize: 14,
    color: theme.colors.title,
  },
  radioDescription: {
    fontFamily: theme.typography.regular,
    fontSize: 13,
    color: theme.colors.text,
    marginTop: 4,
  },

  /* ===== ADD BUTTON ===== */
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  addText: {
    marginLeft: 8,
    fontFamily: theme.typography.semibold,
    color: theme.colors.primaryDark,
    fontSize: 15,
  },

  /* ===== MODAL ===== */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    maxWidth: 420,
    maxHeight: "85%",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  modalTitle: {
    fontFamily: theme.typography.semibold,
    fontSize: 18,
    color: theme.colors.surface,
    alignSelf: "center",
    marginBottom: 12,
    backgroundColor: theme.colors.primaryDark,
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(14),
  },

  modalScrollArea: {
    flexGrow: 0,
    marginBottom: 10,
  },

  modalLabel: {
    fontFamily: theme.typography.semibold,
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 15,
    marginBottom: 4,
  },

  modalInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontFamily: theme.typography.regular,
    fontSize: 14,
    color: theme.colors.text,
    backgroundColor: "#fff",
  },

  modalTextarea: {
    height: 80,
    textAlignVertical: "top",
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },

  modalBtn: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
    marginRight: 10,
  },

  modalCancel: {
    backgroundColor: theme.colors.surface,
  },

  modalCancelText: {
    color: theme.colors.primaryDark,
    fontFamily: theme.typography.semibold,
    fontSize: 15,
  },

  modalSave: {
    backgroundColor: theme.colors.primaryDark,
    elevation: 3,
  },

  modalSaveText: {
    color: "#fff",
    fontFamily: theme.typography.semibold,
    fontSize: 15,
  },

  remarkDeleteButton: {
    width: moderateScale(36),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: scale(8),
    paddingTop: verticalScale(40),
  },

  /* SMALL HELPERS */
  iconButton: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
});
