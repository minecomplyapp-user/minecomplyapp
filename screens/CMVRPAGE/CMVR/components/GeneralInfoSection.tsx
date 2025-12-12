import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { styles } from "../styles/generalInfo.styles";
import type {
  GeneralInfoProps,
} from "../types/generalInfo.types";

export const GeneralInfoSection: React.FC<GeneralInfoProps> = ({
  fileName,
  companyName,
  projectName,
  location,
  region,
  province,
  municipality,
  quarter,
  year,
  dateOfCompliance,
  monitoringPeriod,
  dateOfCMRSubmission,
  onChange,
}) => {
  // ✅ NEW: Date picker states
  const [showDateOfCompliancePicker, setShowDateOfCompliancePicker] = useState(false);
  const [showDateOfCMRSubmissionPicker, setShowDateOfCMRSubmissionPicker] = useState(false);
  
  // Helper function to parse date string (MM/DD/YYYY) to Date object
  const parseDateString = (dateString: string | undefined): Date | null => {
    if (!dateString || dateString.trim() === "") return null;
    // Try to parse MM/DD/YYYY format
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const month = parseInt(parts[0], 10) - 1; // Month is 0-indexed
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    // Try to parse as ISO string or default Date constructor
    const parsed = new Date(dateString);
    return isNaN(parsed.getTime()) ? null : parsed;
  };
  
  // Helper function to format Date to MM/DD/YYYY string
  const formatDateToString = (date: Date | null): string => {
    if (!date) return "";
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };
  
  const handleDateOfComplianceConfirm = (selectedDate: Date) => {
    setShowDateOfCompliancePicker(false);
    onChange("dateOfCompliance", formatDateToString(selectedDate));
  };
  
  const handleDateOfCMRSubmissionConfirm = (selectedDate: Date) => {
    setShowDateOfCMRSubmissionPicker(false);
    onChange("dateOfCMRSubmission", formatDateToString(selectedDate));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name="information-circle" size={24} color="#02217C" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.sectionTitle}>General Information</Text>
            <Text style={styles.sectionSubtitle}>
              Project and company details
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.sectionContent}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            File Name <Text style={{ color: "#EF4444" }}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              (!fileName || fileName.trim() === "") && {
                borderColor: "#FCA5A5",
                backgroundColor: "#FEF2F2",
              },
            ]}
            value={fileName || ""}
            onChangeText={(text) => onChange("fileName", text)}
            placeholder="Enter file name (required)"
            placeholderTextColor="#94A3B8"
          />
          {(!fileName || fileName.trim() === "") && (
            <Text style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>
              File name is required to continue
            </Text>
          )}
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Company Name</Text>
          <TextInput
            style={styles.input}
            value={companyName || ""}
            onChangeText={(text) => onChange("companyName", text)}
            placeholder="Enter company name"
            placeholderTextColor="#94A3B8"
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Project Name</Text>
          <TextInput
            style={styles.input}
            value={projectName || ""}
            onChangeText={(text) => onChange("projectName", text)}
            placeholder="Enter project name"
            placeholderTextColor="#94A3B8"
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Project Location</Text>
          <TextInput
            style={[styles.input, styles.locationInput]}
            value={location || ""}
            onChangeText={(text) => onChange("location", text)}
            placeholder="Enter project location address"
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
          />
        </View>
        <View style={styles.rowContainer}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Quarter</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={quarter || ""}
                onValueChange={(value: string) => onChange("quarter", value)}
                style={styles.picker}
              >
                <Picker.Item label="Select Quarter" value="" />
                <Picker.Item label="1st Quarter" value="1st" />
                <Picker.Item label="2nd Quarter" value="2nd" />
                <Picker.Item label="3rd Quarter" value="3rd" />
                <Picker.Item label="4th Quarter" value="4th" />
              </Picker>
            </View>
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>Year</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={year || ""}
                onValueChange={(value: string) => onChange("year", value)}
                style={styles.picker}
              >
                <Picker.Item label="Select Year" value="" />
                {Array.from({ length: 51 }, (_, i) => {
                  const yearValue = (
                    new Date().getFullYear() -
                    25 +
                    i
                  ).toString();
                  return (
                    <Picker.Item
                      key={yearValue}
                      label={yearValue}
                      value={yearValue}
                    />
                  );
                })}
              </Picker>
            </View>
          </View>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Date of Compliance Monitoring and Validation
          </Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDateOfCompliancePicker(true)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ color: dateOfCompliance ? "#1E293B" : "#94A3B8" }}>
                {dateOfCompliance || "Month/Date/Year"}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#94A3B8" />
            </View>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={showDateOfCompliancePicker}
            mode="date"
            date={parseDateString(dateOfCompliance) || new Date()}
            onConfirm={handleDateOfComplianceConfirm}
            onCancel={() => setShowDateOfCompliancePicker(false)}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            textColor={Platform.OS === "ios" ? "#000000" : undefined}
            pickerContainerStyleIOS={{
              backgroundColor: "#FFFFFF",
            }}
            modalStyleIOS={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Monitoring Period Covered</Text>
          <TextInput
            style={styles.input}
            value={monitoringPeriod || ""}
            onChangeText={(text) => onChange("monitoringPeriod", text)}
            placeholder="Enter monitoring period"
            placeholderTextColor="#94A3B8"
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Date of CMR Submission</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDateOfCMRSubmissionPicker(true)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ color: dateOfCMRSubmission ? "#1E293B" : "#94A3B8" }}>
                {dateOfCMRSubmission || "Month/Date/Year"}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#94A3B8" />
            </View>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={showDateOfCMRSubmissionPicker}
            mode="date"
            date={parseDateString(dateOfCMRSubmission) || new Date()}
            onConfirm={handleDateOfCMRSubmissionConfirm}
            onCancel={() => setShowDateOfCMRSubmissionPicker(false)}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            textColor={Platform.OS === "ios" ? "#000000" : undefined}
            pickerContainerStyleIOS={{
              backgroundColor: "#FFFFFF",
            }}
            modalStyleIOS={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default GeneralInfoSection;
