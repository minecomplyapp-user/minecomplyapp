import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  titleContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 24,
    borderLeftWidth: 5,
    borderLeftColor: "#1E3A8A",
    ...Platform.select({
      ios: {
        shadowColor: "#1E3A8A",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  titleAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "#1E3A8A",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  titleText: {
    fontWeight: "700",
    fontSize: 16,
    color: "#1E3A8A",
    textAlign: "center",
    letterSpacing: 0.5,
    lineHeight: 22,
  },
});
