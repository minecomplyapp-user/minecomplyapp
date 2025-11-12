import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    shadowColor: "#02217C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  mainParameterContainer: {
    marginBottom: 16,
  },
  mainParameterTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#02217C",
    marginBottom: 12,
    paddingLeft: 4,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#3B82F6",
    borderStyle: "dashed",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#02217C",
    marginLeft: 8,
  },
});
