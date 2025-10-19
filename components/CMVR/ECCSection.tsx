import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ECCInfo = {
  isNA: boolean;
  permitHolder: string;
  eccNumber: string;
  dateOfIssuance: string;
};

type ECCAdditionalForm = {
  permitHolder: string;
  eccNumber: string;
  dateOfIssuance: string;
};

type ECCSectionProps = {
  eccInfo: ECCInfo;
  setEccInfo: React.Dispatch<React.SetStateAction<ECCInfo>>;
  eccAdditionalForms: ECCAdditionalForm[];
  setEccAdditionalForms: React.Dispatch<React.SetStateAction<ECCAdditionalForm[]>>;
};

const ECCSection: React.FC<ECCSectionProps> = ({
  eccInfo,
  setEccInfo,
  eccAdditionalForms,
  setEccAdditionalForms,
}) => {
  const updateECCInfo = (field: keyof ECCInfo, value: string | boolean) => {
    setEccInfo((prev) => ({ ...prev, [field]: value }));
  };

  const addECCForm = () => {
    setEccAdditionalForms([
      ...eccAdditionalForms,
      { permitHolder: "", eccNumber: "", dateOfIssuance: "" },
    ]);
  };

  const updateEccAdditionalForm = (
    index: number,
    field: keyof ECCAdditionalForm,
    value: string
  ) => {
    const updated = [...eccAdditionalForms];
    updated[index] = { ...updated[index], [field]: value };
    setEccAdditionalForms(updated);
  };

  const removeEccAdditionalForm = (index: number) => {
    setEccAdditionalForms(
      eccAdditionalForms.filter((_: ECCAdditionalForm, i: number) => i !== index)
    );
  };

  return (
    <View style={styles.container}>
      {/* Section Header with Checkbox */}
      <View style={styles.sectionHeaderRow}>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => updateECCInfo("isNA", !eccInfo.isNA)}
          >
            {eccInfo.isNA && <View style={styles.checkboxChecked} />}
          </TouchableOpacity>
          <Text style={styles.sectionLabel}>ECC</Text>
        </View>
      </View>

      {/* Name of Permit Holder */}
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Name of Permit Holder:</Text>
        <View style={styles.inputWithButton}>
          <TextInput
            style={[styles.input, eccInfo.isNA && styles.disabledInput]}
            value={eccInfo.permitHolder}
            onChangeText={(text) => updateECCInfo("permitHolder", text)}
            placeholder="Type here..."
            placeholderTextColor="#999"
            editable={!eccInfo.isNA}
          />
          <TouchableOpacity
            style={[styles.submitButton, eccInfo.isNA && styles.disabledButton]}
            disabled={eccInfo.isNA}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ECC Number */}
      <View style={styles.fieldRow}>
        <Text style={styles.label}>ECC Number:</Text>
        <TextInput
          style={[styles.input, eccInfo.isNA && styles.disabledInput]}
          value={eccInfo.eccNumber}
          onChangeText={(text) => updateECCInfo("eccNumber", text)}
          placeholder="Type here..."
          placeholderTextColor="#999"
          editable={!eccInfo.isNA}
        />
      </View>

      {/* Date of Issuance */}
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Date of Issuance:</Text>
        <TextInput
          style={[styles.input, eccInfo.isNA && styles.disabledInput]}
          value={eccInfo.dateOfIssuance}
          onChangeText={(text) => updateECCInfo("dateOfIssuance", text)}
          placeholder="Month/Date/Year"
          placeholderTextColor="#999"
          editable={!eccInfo.isNA}
        />
      </View>

      {/* Add More Button */}
      <TouchableOpacity
        style={[styles.addMoreButton, eccInfo.isNA && styles.disabledButton]}
        onPress={addECCForm}
        disabled={eccInfo.isNA}
      >
        <Text style={styles.addMoreText}>+ Add more names</Text>
      </TouchableOpacity>

      {/* Additional Forms */}
      {eccAdditionalForms.map((form: ECCAdditionalForm, index: number) => (
        <View key={index} style={styles.additionalFormContainer}>
          <View style={styles.additionalFormHeader}>
            <Text style={styles.additionalFormTitle}>ECC #{index + 2}</Text>
            <TouchableOpacity onPress={() => removeEccAdditionalForm(index)}>
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
                  updateEccAdditionalForm(index, "permitHolder", text)
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
            <Text style={styles.label}>ECC Number:</Text>
            <TextInput
              style={styles.input}
              value={form.eccNumber}
              onChangeText={(text) =>
                updateEccAdditionalForm(index, "eccNumber", text)
              }
              placeholder="Type here..."
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Date of Issuance:</Text>
            <TextInput
              style={styles.input}
              value={form.dateOfIssuance}
              onChangeText={(text) =>
                updateEccAdditionalForm(index, "dateOfIssuance", text)
              }
              placeholder="Month/Date/Year"
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
    alignItems: "center",
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: "#D0D0D0",
    borderRadius: 4,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    backgroundColor: "#7C6FDB",
    borderRadius: 2,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  fieldRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 6,
  },
  input: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 6,
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
  },
  submitButton: {
    backgroundColor: "#7C6FDB",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    justifyContent: "center",
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
    paddingHorizontal: 16,
    borderRadius: 20,
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

export default ECCSection;
