import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Define types for your props and state
type ECCInfo = {
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
  const updateECCInfo = (field: keyof ECCInfo, value: string) => {
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
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>ECC</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Name of Permit Holder:</Text>
        <View style={styles.inputWithButton}>
          <TextInput
            style={[styles.input, styles.flexInput]}
            value={eccInfo.permitHolder}
            onChangeText={(text) => updateECCInfo("permitHolder", text)}
            placeholder="Type here..."
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
          value={eccInfo.eccNumber}
          onChangeText={(text) => updateECCInfo("eccNumber", text)}
          placeholder="Type here..."
        />
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Date of Issuance:</Text>
        <TextInput
          style={styles.input}
          value={eccInfo.dateOfIssuance}
          onChangeText={(text) => updateECCInfo("dateOfIssuance", text)}
          placeholder="Month/Date/Year"
        />
      </View>
      <TouchableOpacity style={styles.addMoreButton} onPress={addECCForm}>
        <Text style={styles.addMoreText}>+ Add more names</Text>
      </TouchableOpacity>
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
                style={[styles.input, styles.flexInput]}
                value={form.permitHolder}
                onChangeText={(text) =>
                  updateEccAdditionalForm(index, "permitHolder", text)
                }
                placeholder="Type here..."
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
  sectionHeader: {
    backgroundColor: "#E8E3FF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 16,
  },
  sectionTitle: {
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

export default ECCSection;
