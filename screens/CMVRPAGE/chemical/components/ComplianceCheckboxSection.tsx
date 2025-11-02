import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ComplianceCheckboxSectionProps } from '../types/ComplianceCheckboxSection.types';
import { styles } from '../styles/ComplianceCheckboxSection.styles';

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