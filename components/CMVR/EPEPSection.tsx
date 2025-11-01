import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type EPEPInfo = {
  isNA: boolean;
  permitHolder: string;
  epepNumber: string;
  dateOfApproval: string;
};

type EPEPAdditionalForm = {
  permitHolder: string;
  epepNumber: string;
  dateOfApproval: string;
};

type EPEPSectionProps = {
  epepInfo: EPEPInfo;
  setEpepInfo: React.Dispatch<React.SetStateAction<EPEPInfo>>;
  epepAdditionalForms: EPEPAdditionalForm[];
  setEpepAdditionalForms: React.Dispatch<React.SetStateAction<EPEPAdditionalForm[]>>;
};

const EPEPSection: React.FC<EPEPSectionProps> = ({
  epepInfo,
  setEpepInfo,
  epepAdditionalForms,
  setEpepAdditionalForms,
}) => {
  const updateEPEPInfo = (field: keyof EPEPInfo, value: string | boolean) => {
    setEpepInfo((prev) => ({ ...prev, [field]: value }));
  };

  const addEPEPForm = () => {
    setEpepAdditionalForms([
      ...epepAdditionalForms,
      { permitHolder: "", epepNumber: "", dateOfApproval: "" },
    ]);
  };

  const updateEpepAdditionalForm = (
    index: number,
    field: keyof EPEPAdditionalForm,
    value: string
  ) => {
    const updatedForms = [...epepAdditionalForms];
    updatedForms[index] = { ...updatedForms[index], [field]: value };
    setEpepAdditionalForms(updatedForms);
  };

  const removeEpepAdditionalForm = (index: number) => {
    setEpepAdditionalForms(epepAdditionalForms.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.iconContainer}>
          <Ionicons name="leaf" size={24} color="#1E40AF" />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.sectionTitle}>EPEP / FMRDP</Text>
          <Text style={styles.sectionSubtitle}>Environmental Protection Plan</Text>
        </View>
        <TouchableOpacity
          style={styles.naButton}
          onPress={() => updateEPEPInfo("isNA", !epepInfo.isNA)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, epepInfo.isNA && styles.checkboxChecked]}>
            {epepInfo.isNA && <Ionicons name="checkmark" size={16} color="white" />}
          </View>
          <Text style={styles.naLabel}>N/A</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.formContent, epepInfo.isNA && styles.disabledContent]}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Name of Permit Holder</Text>
          <View style={styles.inputWithButton}>
            <TextInput
              style={[styles.input, styles.flexInput]}
              value={epepInfo.permitHolder}
              onChangeText={(text) => updateEPEPInfo("permitHolder", text)}
              placeholder="Enter permit holder name"
              placeholderTextColor="#94A3B8"
              editable={!epepInfo.isNA}
            />
            <TouchableOpacity
              style={[styles.submitButton, epepInfo.isNA && styles.disabledButton]}
              disabled={epepInfo.isNA}
            >
              <Ionicons name="checkmark-circle" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>EPEP Number</Text>
          <TextInput
            style={styles.input}
            value={epepInfo.epepNumber}
            onChangeText={(text) => updateEPEPInfo("epepNumber", text)}
            placeholder="Enter EPEP number"
            placeholderTextColor="#94A3B8"
            editable={!epepInfo.isNA}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Date of Approval</Text>
          <TextInput
            style={styles.input}
            value={epepInfo.dateOfApproval}
            onChangeText={(text) => updateEPEPInfo("dateOfApproval", text)}
            placeholder="MM/DD/YYYY"
            placeholderTextColor="#94A3B8"
            editable={!epepInfo.isNA}
          />
        </View>

        <TouchableOpacity
          style={[styles.addButton, epepInfo.isNA && styles.disabledButton]}
          onPress={addEPEPForm}
          disabled={epepInfo.isNA}
        >
          <Ionicons name="add-circle" size={20} color={epepInfo.isNA ? "#94A3B8" : "#1E40AF"} />
          <Text style={[styles.addButtonText, epepInfo.isNA && styles.disabledText]}>
            Add More Permit Holders
          </Text>
        </TouchableOpacity>

        {epepAdditionalForms.map((form, index) => (
          <View key={index} style={styles.additionalForm}>
            <View style={styles.additionalFormHeader}>
              <View style={styles.badgeContainer}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>#{index + 2}</Text>
                </View>
                <Text style={styles.additionalFormTitle}>EPEP/FMRDP Permit</Text>
              </View>
              <TouchableOpacity 
                onPress={() => removeEpepAdditionalForm(index)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash" size={20} color="#DC2626" />
              </TouchableOpacity>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Name of Permit Holder</Text>
              <View style={styles.inputWithButton}>
                <TextInput
                  style={[styles.input, styles.flexInput]}
                  value={form.permitHolder}
                  onChangeText={(text) =>
                    updateEpepAdditionalForm(index, "permitHolder", text)
                  }
                  placeholder="Enter permit holder name"
                  placeholderTextColor="#94A3B8"
                />
                <TouchableOpacity style={styles.submitButton}>
                  <Ionicons name="checkmark-circle" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>EPEP Number</Text>
              <TextInput
                style={styles.input}
                value={form.epepNumber}
                onChangeText={(text) =>
                  updateEpepAdditionalForm(index, "epepNumber", text)
                }
                placeholder="Enter EPEP number"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Date of Approval</Text>
              <TextInput
                style={styles.input}
                value={form.dateOfApproval}
                onChangeText={(text) =>
                  updateEpepAdditionalForm(index, "dateOfApproval", text)
                }
                placeholder="MM/DD/YYYY"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        ))}
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
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E0E7FF",
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
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: '#02217C',
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
    color: '#02217C',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },
  naButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    borderRadius: 6,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: '#02217C',
    borderColor: '#02217C',
  },
  naLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  formContent: {
    padding: 20,
  },
  disabledContent: {
    opacity: 0.5,
  },
  fieldGroup: {
    marginBottom: 20,
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
  flexInput: {
    flex: 1,
  },
  inputWithButton: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: '#02217C',
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  addButton: {
    backgroundColor: "#EFF6FF",
    borderWidth: 2,
    borderColor: "#BFDBFE",
    borderStyle: "dashed",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  addButtonText: {
    fontSize: 14,
    color: '#02217C',
    fontWeight: "600",
  },
  disabledText: {
    color: "#94A3B8",
  },
  additionalForm: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
  },
  additionalFormHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: "#E2E8F0",
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  badge: {
    backgroundColor: '#02217C',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "white",
  },
  additionalFormTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: '#02217C',
  },
  deleteButton: {
    padding: 6,
  },
});

export default EPEPSection;
