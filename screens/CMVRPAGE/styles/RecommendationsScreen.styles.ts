// RecommendationsScreen.styles.ts
import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 60,
  },
  sectionHeaderContainer: {
    backgroundColor: "#DBEAFE",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#93C5FD",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#02217C",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E3A8A",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  quarterSelectorCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#C7D2FE",
    ...Platform.select({
      ios: {
        shadowColor: "#02217C",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  quarterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  pickerContainer: {
    flex: 1,
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F8FAFC",
    minHeight: 48,
  },
  pickerButtonText: {
    fontSize: 15,
    color: "#0F172A",
    fontWeight: "500",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 18,
    width: "85%",
    maxHeight: "55%",
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginVertical: 2,
  },
  modalItemSelected: {
    backgroundColor: "#EFF6FF",
  },
  modalItemText: {
    fontSize: 16,
    color: "#1E293B",
    fontWeight: "500",
  },
  modalItemTextSelected: {
    color: "#1E3A8A",
    fontWeight: "700",
  },
  yearInput: {
    flex: 1,
    height: 48,
  },
  sectionCard: {
    backgroundColor: "white",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#C7D2FE",
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#02217C",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 14,
      },
      android: {
        elevation: 5,
      },
    }),
    overflow: "hidden",
  },
  sectionTitleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    padding: 18,
    borderBottomWidth: 1.5,
    borderBottomColor: "#93C5FD",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1E3A8A",
    letterSpacing: 0.3,
  },
  naContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  naLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
    marginRight: 10,
    letterSpacing: 0.2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#1E3A8A",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#1E3A8A",
    borderColor: "#1E3A8A",
  },
  sectionContent: {
    padding: 20,
  },
  itemCard: {
    backgroundColor: "#FAFBFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E0E7FF",
    padding: 16,
    marginBottom: 14,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  itemNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1E3A8A",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#1E3A8A",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  itemNumberText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
  removeButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#FEE2E2",
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: "white",
    minHeight: 50,
    color: "#0F172A",
    lineHeight: 22,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#93C5FD",
    backgroundColor: "#DBEAFE",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#02217C",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  addButtonText: {
    fontSize: 15,
    color: "#1E3A8A",
    fontWeight: "700",
    marginLeft: 8,
    letterSpacing: 0.2,
  },
  saveButton: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 28,
    ...Platform.select({
      ios: {
        shadowColor: "#1E3A8A",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  saveButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
