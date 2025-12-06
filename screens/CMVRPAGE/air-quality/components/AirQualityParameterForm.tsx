import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { styles } from "./AirQualityParameterForm.styles";
import { AIR_QUALITY_PARAMETERS, AIR_QUALITY_UNITS } from "../../types/AirQualityScreen.types";

export type AirQualityParameterFormProps = {
  parameter: string;
  unit?: string; // ✅ NEW: Unit field
  currentSMR: string;
  previousSMR: string;
  currentMMT: string;
  previousMMT: string;
  eqplRedFlag: string;
  action: string;
  limitPM25: string;
  remarks: string;
  isMain: boolean;
  index?: number;
  onUpdate: (field: string, value: string) => void;
  onDelete?: () => void;
};

export const AirQualityParameterForm: React.FC<
  AirQualityParameterFormProps
> = ({
  parameter,
  unit,
  currentSMR,
  previousSMR,
  currentMMT,
  previousMMT,
  eqplRedFlag,
  action,
  limitPM25,
  remarks,
  isMain,
  index,
  onUpdate,
  onDelete,
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {isMain ? "Parameter 1" : `Parameter ${index}`}
        </Text>
        {!isMain && onDelete && (
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>

      {/* ✅ UPDATED: Parameter Dropdown */}
      <View style={styles.field}>
        <Text style={styles.label}>
          Parameter <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={parameter}
            onValueChange={(value) => onUpdate("parameter", value)}
            style={styles.picker}
          >
            <Picker.Item label="Select Parameter" value="" />
            {AIR_QUALITY_PARAMETERS.map((param) => (
              <Picker.Item key={param} label={param} value={param} />
            ))}
          </Picker>
        </View>
      </View>

      {/* ✅ NEW: Unit Dropdown */}
      <View style={styles.field}>
        <Text style={styles.label}>
          Unit <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={unit || ""}
            onValueChange={(value) => onUpdate("unit", value)}
            style={styles.picker}
          >
            <Picker.Item label="Select Unit" value="" />
            {AIR_QUALITY_UNITS.map((u) => (
              <Picker.Item key={u} label={u} value={u} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Results - In SMR */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Results - In SMR</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.halfField}>
          <Text style={styles.label}>Current</Text>
          <TextInput
            style={styles.input}
            value={currentSMR}
            onChangeText={(value) => onUpdate("currentSMR", value)}
            placeholder="e.g., 120 µg/Nm³"
            placeholderTextColor="#94A3B8"
          />
        </View>
        <View style={styles.halfField}>
          <Text style={styles.label}>Previous</Text>
          <TextInput
            style={styles.input}
            value={previousSMR}
            onChangeText={(value) => onUpdate("previousSMR", value)}
            placeholder="e.g., 115 µg/Nm³"
            placeholderTextColor="#94A3B8"
          />
        </View>
      </View>

      {/* Results - MMT Confirmatory Sampling */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Results - MMT Confirmatory Sampling
        </Text>
      </View>

      <View style={styles.row}>
        <View style={styles.halfField}>
          <Text style={styles.label}>Current</Text>
          <TextInput
            style={styles.input}
            value={currentMMT}
            onChangeText={(value) => onUpdate("currentMMT", value)}
            placeholder="e.g., 118 µg/Nm³"
            placeholderTextColor="#94A3B8"
          />
        </View>
        <View style={styles.halfField}>
          <Text style={styles.label}>Previous</Text>
          <TextInput
            style={styles.input}
            value={previousMMT}
            onChangeText={(value) => onUpdate("previousMMT", value)}
            placeholder="e.g., 112 µg/Nm³"
            placeholderTextColor="#94A3B8"
          />
        </View>
      </View>

      {/* EQPL Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>EQPL</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Red Flag</Text>
        <TextInput
          style={styles.input}
          value={eqplRedFlag}
          onChangeText={(value) => onUpdate("eqplRedFlag", value)}
          placeholder="e.g., No, Yes"
          placeholderTextColor="#94A3B8"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Action</Text>
        <TextInput
          style={styles.input}
          value={action}
          onChangeText={(value) => onUpdate("action", value)}
          placeholder="e.g., Continue monitoring"
          placeholderTextColor="#94A3B8"
          multiline
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Limit (PM2.5/PM10/TSP)</Text>
        <TextInput
          style={styles.input}
          value={limitPM25}
          onChangeText={(value) => onUpdate("limitPM25", value)}
          placeholder="e.g., 230 µg/Nm³"
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* Remarks */}
      <View style={styles.field}>
        <Text style={styles.label}>Remarks</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={remarks}
          onChangeText={(value) => onUpdate("remarks", value)}
          placeholder="Enter remarks..."
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={3}
        />
      </View>
    </View>
  );
};
