import React from "react";
import { View, Text, TextInput } from "react-native";
import { CustomPicker } from "./CustomPicker";
import { styles } from "../styles/RecommendationsScreen.styles";

interface QuarterSelectorProps {
  selectedQuarter: string;
  onQuarterChange: (quarter: string) => void;
  year: string;
  onYearChange: (year: string) => void;
}

const quarterItems = [
  { label: "1st", value: "1st" },
  { label: "2nd", value: "2nd" },
  { label: "3rd", value: "3rd" },
  { label: "4th", value: "4th" },
];

export const QuarterSelector: React.FC<QuarterSelectorProps> = ({
  selectedQuarter,
  onQuarterChange,
  year,
  onYearChange,
}) => (
  <View style={styles.quarterSelectorCard}>
    <View style={styles.quarterRow}>
      <Text style={styles.fieldLabel}>Prev Quarter:</Text>
      <CustomPicker
        selectedValue={selectedQuarter}
        onValueChange={onQuarterChange}
        items={quarterItems}
      />
    </View>
    <View style={styles.quarterRow}>
      <Text style={styles.fieldLabel}>Year:</Text>
      <TextInput
        style={[styles.input, styles.yearInput]}
        placeholder="YYYY"
        placeholderTextColor="#94A3B8"
        value={year}
        onChangeText={onYearChange}
        keyboardType="numeric"
        maxLength={4}
      />
    </View>
  </View>
);
