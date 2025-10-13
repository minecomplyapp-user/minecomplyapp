import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Define types for your props and state
type ISAGInfo = {
  permitHolder: string;
  isagNumber: string;
  dateOfIssuance: string;
  currentName: string;
  nameInECC: string;
  projectStatus: string;
  gpsX: string;
  gpsY: string;
  proponentName: string;
  proponentContact: string;
  proponentAddress: string;
  proponentPhone: string;
  proponentEmail: string;
};

type ISAGAdditionalForm = {
  permitHolder: string;
  isagNumber: string;
  dateOfIssuance: string;
};

type ISAGSectionProps = {
  isagInfo: ISAGInfo;
  setIsagInfo: React.Dispatch<React.SetStateAction<ISAGInfo>>;
  isagAdditionalForms: ISAGAdditionalForm[];
  setIsagAdditionalForms: React.Dispatch<React.SetStateAction<ISAGAdditionalForm[]>>;
};

const ISAGSection: React.FC<ISAGSectionProps> = ({
  isagInfo,
  setIsagInfo,
  isagAdditionalForms,
  setIsagAdditionalForms,
}) => {
  // Update ISAG info with proper typing
  const updateISAGInfo = (field: keyof ISAGInfo, value: string) => {
    setIsagInfo((prev: ISAGInfo) => ({ ...prev, [field]: value }));
  };

  // Add a new ISAG form
  const addISAGForm = () => {
    setIsagAdditionalForms([
      ...isagAdditionalForms,
      { permitHolder: "", isagNumber: "", dateOfIssuance: "" },
    ]);
  };

  // Update an additional ISAG form
  const updateIsagAdditionalForm = (
    index: number,
    field: keyof ISAGAdditionalForm,
    value: string
  ) => {
    const updatedForms = [...isagAdditionalForms];
    updatedForms[index] = { ...updatedForms[index], [field]: value };
    setIsagAdditionalForms(updatedForms);
  };

  // Remove an additional ISAG form
  const removeIsagAdditionalForm = (index: number) => {
    setIsagAdditionalForms(
      isagAdditionalForms.filter((_: ISAGAdditionalForm, i: number) => i !== index)
    );
  };

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>ISAG/MPP</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Name of Permit Holder:</Text>
        <View style={styles.inputWithButton}>
          <TextInput
            style={[styles.input, styles.flexInput]}
            value={isagInfo.permitHolder}
            onChangeText={(text) => updateISAGInfo("permitHolder", text)}
            placeholder="Type here..."
          />
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>ISAG Permit Number:</Text>
        <TextInput
          style={styles.input}
          value={isagInfo.isagNumber}
          onChangeText={(text) => updateISAGInfo("isagNumber", text)}
          placeholder="Type here..."
        />
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Date of Issuance:</Text>
        <TextInput
          style={styles.input}
          value={isagInfo.dateOfIssuance}
          onChangeText={(text) => updateISAGInfo("dateOfIssuance", text)}
          placeholder="Month/Date/Year"
        />
      </View>
      <TouchableOpacity style={styles.addMoreButton} onPress={addISAGForm}>
        <Text style={styles.addMoreText}>+ Add more names</Text>
      </TouchableOpacity>
      {isagAdditionalForms.map((form: ISAGAdditionalForm, index: number) => (
        <View key={index} style={styles.additionalFormContainer}>
          <View style={styles.additionalFormHeader}>
            <Text style={styles.additionalFormTitle}>ISAG/MPP #{index + 2}</Text>
            <TouchableOpacity onPress={() => removeIsagAdditionalForm(index)}>
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
                  updateIsagAdditionalForm(index, "permitHolder", text)
                }
                placeholder="Type here..."
              />
              <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>ISAG Permit Number:</Text>
            <TextInput
              style={styles.input}
              value={form.isagNumber}
              onChangeText={(text) =>
                updateIsagAdditionalForm(index, "isagNumber", text)
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
                updateIsagAdditionalForm(index, "dateOfIssuance", text)
              }
              placeholder="Month/Date/Year"
            />
          </View>
        </View>
      ))}
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Project Current Name:</Text>
        <TextInput
          style={styles.input}
          value={isagInfo.currentName}
          onChangeText={(text) => updateISAGInfo("currentName", text)}
          placeholder="Type here..."
        />
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.labelLong}>Project Name in the ECC: (if N/A)</Text>
        <TextInput
          style={styles.input}
          value={isagInfo.nameInECC}
          onChangeText={(text) => updateISAGInfo("nameInECC", text)}
          placeholder="Type here..."
        />
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Project Status:</Text>
        <TextInput
          style={styles.input}
          value={isagInfo.projectStatus}
          onChangeText={(text) => updateISAGInfo("projectStatus", text)}
          placeholder="Type here..."
        />
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.labelLong}>Project Geographical Coordinates:</Text>
      </View>
      <View style={styles.coordinatesRow}>
        <View style={styles.coordinateField}>
          <Text style={styles.coordinateLabel}>x</Text>
          <TextInput
            style={styles.input}
            value={isagInfo.gpsX}
            onChangeText={(text) => updateISAGInfo("gpsX", text)}
            placeholder="Type here..."
          />
        </View>
        <View style={styles.coordinateField}>
          <Text style={styles.coordinateLabel}>y</Text>
          <TextInput
            style={styles.input}
            value={isagInfo.gpsY}
            onChangeText={(text) => updateISAGInfo("gpsY", text)}
            placeholder="Type here..."
          />
        </View>
      </View>
      <View style={styles.naCheckbox}>
        <Text style={styles.naLabel}>N/A</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Proponent Name:</Text>
        <TextInput
          style={styles.input}
          value={isagInfo.proponentName}
          onChangeText={(text) => updateISAGInfo("proponentName", text)}
          placeholder="Type here..."
        />
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.labelLong}>Proponent Contact Person & Position:</Text>
        <TextInput
          style={styles.input}
          value={isagInfo.proponentContact}
          onChangeText={(text) => updateISAGInfo("proponentContact", text)}
          placeholder="Type here..."
        />
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.labelLong}>Proponent Mailing Address:</Text>
        <TextInput
          style={styles.input}
          value={isagInfo.proponentAddress}
          onChangeText={(text) => updateISAGInfo("proponentAddress", text)}
          placeholder="Type here..."
        />
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.labelLong}>Proponent Telephone No./ Fax No.:</Text>
        <TextInput
          style={styles.input}
          value={isagInfo.proponentPhone}
          onChangeText={(text) => updateISAGInfo("proponentPhone", text)}
          placeholder="09xx-xxx-xxxx"
        />
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.labelLong}>Proponent Email Address:</Text>
        <TextInput
          style={styles.input}
          value={isagInfo.proponentEmail}
          onChangeText={(text) => updateISAGInfo("proponentEmail", text)}
          placeholder="email@domain.com"
          keyboardType="email-address"
        />
      </View>
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
  labelLong: {
    fontSize: 13,
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
  coordinatesRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  coordinateField: {
    flex: 1,
  },
  coordinateLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  naCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
    gap: 8,
  },
  naLabel: {
    fontSize: 14,
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

export default ISAGSection;
