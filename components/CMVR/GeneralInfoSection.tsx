import React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface GeneralInfoProps {
  companyName: string;
  projectName: string;
  location: string;
  region: string;
  province: string;
  municipality: string;
  onChange: (field: string, value: string) => void;
}

export const GeneralInfoSection: React.FC<GeneralInfoProps> = ({
  companyName,
  projectName,
  location,
  region,
  province,
  municipality,
  onChange,
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name="information-circle" size={24} color="#2563EB" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.sectionTitle}>General Information</Text>
            <Text style={styles.sectionSubtitle}>
              Project and company details
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.sectionContent}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Company Name</Text>
          <TextInput
            style={styles.input}
            value={companyName}
            onChangeText={(text) => onChange("companyName", text)}
            placeholder="Enter company name"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Project Name</Text>
          <TextInput
            style={styles.input}
            value={projectName}
            onChangeText={(text) => onChange("projectName", text)}
            placeholder="Enter project name"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Project Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={(text) => onChange("location", text)}
            placeholder="Enter full address or coordinates"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={styles.multiFieldContainer}>
          <View style={styles.multiField}>
            <Text style={styles.label}>Region</Text>
            <TextInput
              style={styles.input}
              value={region}
              onChangeText={(text) => onChange("region", text)}
              placeholder="Region"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.multiField}>
            <Text style={styles.label}>Province</Text>
            <TextInput
              style={styles.input}
              value={province}
              onChangeText={(text) => onChange("province", text)}
              placeholder="Province"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.multiField}>
            <Text style={styles.label}>Municipality / City</Text>
            <TextInput
              style={styles.input}
              value={municipality}
              onChangeText={(text) => onChange("municipality", text)}
              placeholder="Municipality"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Ionicons name="save" size={18} color="white" />
          <Text style={styles.saveButtonText}>Save General Info</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#EFF6FF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#BFDBFE",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E3A8A",
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },
  sectionContent: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0F172A",
  },
  multiFieldContainer: {
    flexDirection: "column",
    gap: 16,
    marginBottom: 20,
  },
  multiField: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default GeneralInfoSection;
