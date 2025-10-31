import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type Complaint = {
  id: string;
  isNA: boolean;
  dateFiled: string;
  filedLocation: 'DENR' | 'Company' | 'MMT' | 'Others' | null;
  othersSpecify: string;
  nature: string;
  resolutions: string;
};

interface ComplaintsSectionProps {
  complaints: Complaint[];
  updateComplaint: (id: string, field: keyof Omit<Complaint, 'id'>, value: string | boolean | Complaint['filedLocation']) => void;
  addComplaint: () => void;
  removeComplaint: (id: string) => void;
}

export const ComplaintsSection: React.FC<ComplaintsSectionProps> = ({
  complaints,
  updateComplaint,
  addComplaint,
  removeComplaint,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.iconContainer}>
          <Ionicons name="chatbox-ellipses" size={24} color="#2563EB" />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.sectionNumber}>7.</Text>
          <Text style={styles.sectionTitle}>Complaints Verification</Text>
        </View>
      </View>

      <View style={styles.sectionContent}>
        {complaints.map((complaint, index) => (
          <View key={complaint.id} style={[styles.complaintCard, index > 0 && styles.complaintCardMargin]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Complaint #{index + 1}</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.naButton}
                  onPress={() => updateComplaint(complaint.id, 'isNA', !complaint.isNA)}
                >
                  <View style={[styles.checkbox, complaint.isNA && styles.checkboxChecked]}>
                    {complaint.isNA && <Ionicons name="checkmark" size={14} color="white" />}
                  </View>
                  <Text style={styles.naButtonText}>N/A</Text>
                </TouchableOpacity>
                {complaints.length > 1 && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => removeComplaint(complaint.id)}
                  >
                    <Ionicons name="trash" size={20} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={[styles.contentWrapper, complaint.isNA && styles.disabledContent]}>
              <View style={styles.fieldGroup}>
                <Text style={styles.labelSmall}>DATE FILED</Text>
                <TextInput
                  style={[styles.input, complaint.isNA && styles.disabledInput]}
                  value={complaint.dateFiled}
                  onChangeText={(text) => updateComplaint(complaint.id, 'dateFiled', text)}
                  placeholder="MM/DD/YYYY"
                  placeholderTextColor="#94A3B8"
                  editable={!complaint.isNA}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.labelSmall}>WHERE IS IT FILED?</Text>
                <View style={styles.radioGroup}>
                  {(['DENR', 'Company', 'MMT', 'Others'] as const).map((loc) => (
                    <TouchableOpacity
                      key={loc}
                      style={styles.radioOption}
                      onPress={() => updateComplaint(complaint.id, 'filedLocation', loc)}
                      disabled={complaint.isNA}
                    >
                      <View style={[
                        styles.radio,
                        complaint.filedLocation === loc && styles.radioSelected,
                        complaint.isNA && styles.disabledRadio
                      ]}>
                        {complaint.filedLocation === loc && <View style={styles.radioDot} />}
                      </View>
                      <Text style={[styles.optionLabel, complaint.isNA && styles.disabledText]}>
                        {loc === 'Others' ? 'Others' : loc}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {complaint.filedLocation === 'Others' && (
                  <TextInput
                    style={[styles.input, styles.specifyInput, complaint.isNA && styles.disabledInput]}
                    value={complaint.othersSpecify}
                    onChangeText={(text) => updateComplaint(complaint.id, 'othersSpecify', text)}
                    placeholder="Please specify..."
                    placeholderTextColor="#94A3B8"
                    editable={!complaint.isNA}
                  />
                )}
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.labelSmall}>NATURE OF COMPLAINT</Text>
                <TextInput
                  style={[styles.input, styles.textArea, complaint.isNA && styles.disabledInput]}
                  value={complaint.nature}
                  onChangeText={(text) => updateComplaint(complaint.id, 'nature', text)}
                  placeholder="Describe the nature of complaint..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={3}
                  editable={!complaint.isNA}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.labelSmall}>RESOLUTIONS MADE</Text>
                <TextInput
                  style={[styles.input, styles.textArea, complaint.isNA && styles.disabledInput]}
                  value={complaint.resolutions}
                  onChangeText={(text) => updateComplaint(complaint.id, 'resolutions', text)}
                  placeholder="Describe resolutions..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={3}
                  editable={!complaint.isNA}
                />
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addComplaint}>
          <Ionicons name="add-circle" size={20} color="#2563EB" />
          <Text style={styles.addButtonText}>Add More Complaint</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: "#1E40AF",
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
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563EB",
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
    color: "#2563EB",
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E40AF",
    flexShrink: 1,
  },
  sectionContent: {
    padding: 20,
  },
  complaintCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  complaintCardMargin: {
    marginTop: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E40AF",
    flexShrink: 1,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  naButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#DBEAFE",
  },
  naButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 6,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  deleteButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#FEF2F2",
  },
  contentWrapper: {
    gap: 16,
  },
  disabledContent: {
    opacity: 0.5,
  },
  fieldGroup: {
    gap: 8,
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0F172A",
  },
  disabledInput: {
    backgroundColor: "#F1F5F9",
    color: "#94A3B8",
    borderColor: "#E2E8F0",
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
    paddingTop: 14,
  },
  specifyInput: {
    marginTop: 8,
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  radio: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    borderColor: "#2563EB",
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#2563EB",
  },
  disabledRadio: {
    borderColor: "#E2E8F0",
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
  },
  disabledText: {
    color: "#94A3B8",
  },
  addButton: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1.5,
    borderColor: "#BFDBFE",
    borderStyle: "dashed",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
  },
  addButtonText: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "600",
  },
});