import { Platform, StatusBar, StyleSheet } from "react-native";
import { theme } from "../../../theme/theme";
import {
  scale,
  verticalScale,
  moderateScale,
  normalizeFont,
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
    paddingBottom: verticalScale(50),
  },

  /* ===== HEADER ===== */
  header: {
    paddingHorizontal: scale(22),
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(16),
  },
  headerTitle: {
    fontFamily: theme.typography.bold,
    fontSize: normalizeFont(26),
    color: theme.colors.primaryDark,
    marginBottom: verticalScale(4),
  },
  headerSubtitle: {
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(15),
    color: theme.colors.textLight,
  },

  /* ===== SECTIONS ===== */
  section: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(10),
  },
  sectionTitle: {
    fontFamily: theme.typography.bold,
    fontSize: normalizeFont(20),
    color: theme.colors.title,
    marginBottom: verticalScale(12),
    paddingHorizontal: scale(22),
  },
    fileInfoSection: {
    paddingHorizontal: scale(22),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(10),
  },

  /* ===== CARDS ===== */
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: moderateScale(12),
    padding: scale(18),
    marginHorizontal: 18,
    marginTop: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  permitTitle: {
    fontFamily: theme.typography.bold,
    fontSize: 20,
    color: theme.colors.primaryDark,
    marginBottom: 12,
  },

  /* ===== INPUTS ===== */
  inputContainer: {
    marginBottom: verticalScale(18),
  },
  label: {
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(15),
    color: theme.colors.text,
    marginBottom: verticalScale(6),
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(14),
    fontSize: normalizeFont(16),
    color: theme.colors.text,
    fontFamily: theme.typography.regular,
    backgroundColor: "#FFFFFF",
  },

  /* ===== GPS BUTTON ===== */
  gpsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(8),
    backgroundColor: theme.colors.primaryDark,
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(14),
  },
  gpsButtonText: {
    color: "#fff",
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(15),
  },

  /* ===== RADIO BUTTONS ===== */
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(30),
    marginTop: verticalScale(6),
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
    borderColor: "#CCC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(8),
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
    fontSize: normalizeFont(15),
  },

  /* ===== DATE PICKER ===== */
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
    backgroundColor: "#F6F6F6",
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(14),
  },
  datePickerWrapper: {
    marginTop: verticalScale(10),
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
    paddingTop: verticalScale(6),
  },
  datePickerDoneText: {
    color: theme.colors.primaryDark,
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(16),
  },
  dateText: {
    color: theme.colors.text,
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(16),
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

  /* ===== REMARKS & ADD BUTTON ===== */
  remarkDeleteButton: {
    width: moderateScale(36),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: scale(8),
    paddingTop: verticalScale(40),
  },
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

  /* ===== SAVE BUTTON ===== */
  saveButton: {
    marginHorizontal: scale(22),
    marginTop: verticalScale(30),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: scale(8),
    backgroundColor: theme.colors.primaryDark,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(14),
  },
  saveButtonText: {
    color: "#fff",
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(16),
  },

  /* ===== AUTO-POPULATE ===== */
  autoPopulateButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 10,
  },
  autoPopulateText: {
    color: theme.colors.primaryDark,
    fontWeight: "500",
    marginLeft: 6,
    fontSize: 13,
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
});
