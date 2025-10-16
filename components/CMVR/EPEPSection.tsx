import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Define types for your props and state
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
    setEpepInfo((prev: EPEPInfo) => ({ ...prev, [field]: value }));
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
    const updated = [...epepAdditionalForms];
    updated[index] = { ...updated[index], [field]: value };
    setEpepAdditionalForms(updated);
  };

  const removeEpepAdditionalForm = (index: number) => {
    setEpepAdditionalForms(
      epepAdditionalForms.filter((_: EPEPAdditionalForm, i: number) => i !== index)
    );
  };

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeaderWithBadge}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>EPEP/ FMRDP Status</Text>
        </View>
        <View style={styles.naCheckboxInline}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => updateEPEPInfo("isNA", !epepInfo.isNA)}
          >
            {epepInfo.isNA && <View style={styles.checkboxChecked} />}
          </TouchableOpacity>
          <Text style={styles.naLabel}>N/A</Text>
        </View>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Name of Permit Holder:</Text>
        <View style={styles.inputWithButton}>
          <TextInput
            style={[styles.input, styles.flexInput]}
            value={epepInfo.permitHolder}
            onChangeText={(text) => updateEPEPInfo("permitHolder", text)}
            placeholder="Type here..."
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
      <View style={styles.fieldRow}>
        <Text style={styles.label}>EPEP Number:</Text>
        <TextInput
          style={styles.input}
          value={epepInfo.epepNumber}
          onChangeText={(text) => updateEPEPInfo("epepNumber", text)}
          placeholder="Type here..."
          editable={!epepInfo.isNA}
        />
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Date of Approval:</Text>
        <TextInput
          style={styles.input}
          value={epepInfo.dateOfApproval}
          onChangeText={(text) => updateEPEPInfo("dateOfApproval", text)}
          placeholder="Type here..."
          editable={!epepInfo.isNA}
        />
      </View>
      <TouchableOpacity
        style={[styles.addMoreButton, epepInfo.isNA && styles.disabledButton]}
        onPress={addEPEPForm}
        disabled={epepInfo.isNA}
      >
        <Text style={styles.addMoreText}>+ Add more names</Text>
      </TouchableOpacity>
      {epepAdditionalForms.map((form: EPEPAdditionalForm, index: number) => (
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
                style={[styles.input, styles.flexInput]}
                value={form.permitHolder}
                onChangeText={(text) =>
                  updateEpepAdditionalForm(index, "permitHolder", text)
                }
                placeholder="Type here..."
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
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: "white",
    marginTop: 10,
    padding: 16,
  },
  sectionHeaderWithBadge: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  badgeContainer: {
    backgroundColor: "#E8E3FF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
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
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
  },
  inputWithButton: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  flexInput: {
    flex: 1,
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
  naCheckboxInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  naLabel: {
    fontSize: 14,
    color: "#666",
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
