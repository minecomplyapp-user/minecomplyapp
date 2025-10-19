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
    setEpepAdditionalForms(
      epepAdditionalForms.filter((_, i) => i !== index)
    );
  };

  return (
    <View style={styles.container}>
      {/* Section Header with N/A Checkbox */}
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionLabelContainer}>
          <Text style={styles.sectionLabel}>EPEP/ FMRDP Status</Text>
        </View>
        <View style={styles.naCheckboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => updateEPEPInfo("isNA", !epepInfo.isNA)}
          >
            {epepInfo.isNA && <View style={styles.checkboxChecked} />}
          </TouchableOpacity>
          <Text style={styles.naLabel}>N/A</Text>
        </View>
      </View>

      {/* Name of Permit Holder */}
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Name of Permit Holder:</Text>
        <View style={styles.inputWithButton}>
          <TextInput
            style={[styles.input, epepInfo.isNA && styles.disabledInput]}
            value={epepInfo.permitHolder}
            onChangeText={(text) => updateEPEPInfo("permitHolder", text)}
            placeholder="Type here..."
            placeholderTextColor="#999"
            editable={!epepInfo.isNA}
          />
          <TouchableOpacity
            style={[styles.submitButton, epepInfo.isNA && styles.disabledButton]}
            disabled={epepInfo.isNA}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* EPEP Number */}
      <View style={styles.fieldRow}>
        <Text style={styles.label}>EPEP Number:</Text>
        <TextInput
          style={[styles.input, epepInfo.isNA && styles.disabledInput]}
          value={epepInfo.epepNumber}
          onChangeText={(text) => updateEPEPInfo("epepNumber", text)}
          placeholder="Type here..."
          placeholderTextColor="#999"
          editable={!epepInfo.isNA}
        />
      </View>

      {/* Date of Approval */}
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Date of Approval:</Text>
        <TextInput
          style={[styles.input, epepInfo.isNA && styles.disabledInput]}
          value={epepInfo.dateOfApproval}
          onChangeText={(text) => updateEPEPInfo("dateOfApproval", text)}
          placeholder="Type here..."
          placeholderTextColor="#999"
          editable={!epepInfo.isNA}
        />
      </View>

      {/* Add More Button */}
      <TouchableOpacity
        style={[styles.addMoreButton, epepInfo.isNA && styles.disabledButton]}
        onPress={addEPEPForm}
        disabled={epepInfo.isNA}
      >
        <Text style={styles.addMoreText}>+ Add more names</Text>
      </TouchableOpacity>

      {/* Additional Forms */}
      {epepAdditionalForms.map((form, index) => (
        <View key={index} style={styles.additionalFormContainer}>
          <View style={styles.additionalFormHeader}>
            <Text style={styles.additionalFormTitle}>EPEP/FMRDP #{index + 2}</Text>
            <TouchableOpacity onPress={() => removeEpepAdditionalForm(index)}>
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Name of Permit Holder:</Text>
            <View style={styles.inputWithButton}>
              <TextInput
                style={styles.input}
                value={form.permitHolder}
                onChangeText={(text) =>
                  updateEpepAdditionalForm(index, "permitHolder", text)
                }
                placeholder="Type here..."
                placeholderTextColor="#999"
              />
              <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>EPEP Number:</Text>
            <TextInput
              style={styles.input}
              value={form.epepNumber}
              onChangeText={(text) =>
                updateEpepAdditionalForm(index, "epepNumber", text)
              }
              placeholder="Type here..."
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Date of Approval:</Text>
            <TextInput
              style={styles.input}
              value={form.dateOfApproval}
              onChangeText={(text) =>
                updateEpepAdditionalForm(index, "dateOfApproval", text)
              }
              placeholder="Type here..."
              placeholderTextColor="#999"
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionLabelContainer: {
    backgroundColor: "#D8D8FF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#000",
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  naCheckboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    backgroundColor: "#007AFF",
    borderRadius: 2,
  },
  naLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  fieldRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  input: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
  },
  disabledInput: {
    opacity: 0.5,
  },
  inputWithButton: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#7C6FDB",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  submitButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
  addMoreButton: {
    backgroundColor: "#E8E8E8",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginTop: 4,
    marginBottom: 16,
  },
  addMoreText: {
    fontSize: 13,
    color: "#666",
  },
  additionalFormContainer: {
    backgroundColor: "#FFF9E6",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  additionalFormHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  additionalFormTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});

export default EPEPSection;