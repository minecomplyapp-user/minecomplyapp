import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  titleContainer: {
    backgroundColor: "#EFF6FF",
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 10,
    gap: 12,
    shadowColor: "#02217C",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  titleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#02217C",
    flex: 1,
    letterSpacing: 0.3,
    lineHeight: 20,
    textAlign: "center",
  },
});
