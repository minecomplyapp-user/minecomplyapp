import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ComplianceCheckboxSectionProps {
  sectionNumber: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  checked: boolean;
  onToggle: () => void;
}

export const ComplianceCheckboxSection: React.FC<ComplianceCheckboxSectionProps> = ({
  sectionNumber,
  title,
  subtitle,
  icon,
  checked,
  onToggle,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={24} color='#02217C'/>
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.sectionNumber}>{sectionNumber}.</Text>
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.checkboxContent} onPress={onToggle}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked && <Ionicons name="checkmark" size={20} color="white" />}
        </View>
        <Text style={styles.checkboxLabel}>{subtitle}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
    overflow: 'hidden',
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#EFF6FF",
    borderBottomWidth: 1,
    borderBottomColor: "#DBEAFE",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTextContainer: {
    marginLeft: 16,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  sectionNumber: {
    fontSize: 22,
    fontWeight: "700",
    color: '#02217C',
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: '#02217C',
    flexShrink: 1,
  },
  checkboxContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: '#02217C',
    borderColor: '#02217C',
  },
  checkboxLabel: {
    fontSize: 15,
    color: "#334155",
    fontWeight: "500",
    flexShrink: 1,
  },
});