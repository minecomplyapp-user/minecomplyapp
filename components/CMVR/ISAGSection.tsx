import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ISAGInfo = {
  isNA: boolean; // Added this
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
  const updateISAGInfo = (field: keyof ISAGInfo, value: string | boolean) => { // Updated value type
    setIsagInfo((prev: ISAGInfo) => ({ ...prev, [field]: value }));
  };

  const addISAGForm = () => {
    setIsagAdditionalForms([
      ...isagAdditionalForms,
      { permitHolder: "", isagNumber: "", dateOfIssuance: "" },
    ]);
  };

  const updateIsagAdditionalForm = (
    index: number,
    field: keyof ISAGAdditionalForm,
    value: string
  ) => {
    const updatedForms = [...isagAdditionalForms];
    updatedForms[index] = { ...updatedForms[index], [field]: value };
    setIsagAdditionalForms(updatedForms);
  };

  const removeIsagAdditionalForm = (index: number) => {
    setIsagAdditionalForms(
      isagAdditionalForms.filter((_: ISAGAdditionalForm, i: number) => i !== index)
    );
  };

  return (
    <View style={styles.container}>
      {/* Section Label with Checkbox */}
      <View style={styles.sectionLabelRow}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => updateISAGInfo("isNA", !isagInfo.isNA)}
        >
          {isagInfo.isNA && <View style={styles.checkboxChecked} />}
        </TouchableOpacity>
        <Text style={styles.sectionLabel}>ISAG/MPP</Text>
      </View>

      {/* Name of Permit Holder */}
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Name of Permit Holder:</Text>
        <View style={styles.inputWithButton}>
          <TextInput
            style={[styles.input, isagInfo.isNA && styles.disabledInput]}
            value={isagInfo.permitHolder}
            onChangeText={(text) => updateISAGInfo("permitHolder", text)}
            placeholder="Type here..."
            placeholderTextColor="#999"
            editable={!isagInfo.isNA}
          />
          <TouchableOpacity
            style={[styles.submitButton, isagInfo.isNA && styles.disabledButton]}
            disabled={isagInfo.isNA}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ISAG Permit Number */}
      <View style={styles.fieldRow}>
        <Text style={styles.label}>ISAG Permit Number:</Text>
        <TextInput
          style={[styles.input, isagInfo.isNA && styles.disabledInput]}
          value={isagInfo.isagNumber}
          onChangeText={(text) => updateISAGInfo("isagNumber", text)}
          placeholder="Type here..."
          placeholderTextColor="#999"
          editable={!isagInfo.isNA}
        />
      </View>

      {/* Date of Issuance */}
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Date of Issuance:</Text>
        <TextInput
          style={[styles.input, isagInfo.isNA && styles.disabledInput]}
          value={isagInfo.dateOfIssuance}
          onChangeText={(text) => updateISAGInfo("dateOfIssuance", text)}
          placeholder="Month/Date/Year"
          placeholderTextColor="#999"
          editable={!isagInfo.isNA}
        />
      </View>

      {/* Add More Button */}
      <TouchableOpacity
        style={[styles.addMoreButton, isagInfo.isNA && styles.disabledButton]}
        onPress={addISAGForm}
        disabled={isagInfo.isNA}
      >
        <Text style={styles.addMoreText}>+ Add more names</Text>
      </TouchableOpacity>

      {/* Additional Forms */}
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
                style={[styles.input, isagInfo.isNA && styles.disabledInput]}
                value={form.permitHolder}
                onChangeText={(text) =>
                  updateIsagAdditionalForm(index, "permitHolder", text)
                }
                placeholder="Type here..."
                placeholderTextColor="#999"
                editable={!isagInfo.isNA}
              />
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isagInfo.isNA && styles.disabledButton,
                ]}
                disabled={isagInfo.isNA}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.label}>ISAG Permit Number:</Text>
            <TextInput
              style={[styles.input, isagInfo.isNA && styles.disabledInput]}
              value={form.isagNumber}
              onChangeText={(text) =>
                updateIsagAdditionalForm(index, "isagNumber", text)
              }
              placeholder="Type here..."
              placeholderTextColor="#999"
              editable={!isagInfo.isNA}
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.label}>Date of Issuance:</Text>
            <TextInput
              style={[styles.input, isagInfo.isNA && styles.disabledInput]}
              value={form.dateOfIssuance}
              onChangeText={(text) =>
                updateIsagAdditionalForm(index, "dateOfIssuance", text)
              }
              placeholder="Month/Date/Year"
              placeholderTextColor="#999"
              editable={!isagInfo.isNA}
            />
          </View>
        </View>
      ))}

      {/* Project Current Name */}
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Project Current Name:</Text>
        <TextInput
          style={[styles.input, isagInfo.isNA && styles.disabledInput]}
          value={isagInfo.currentName}
          onChangeText={(text) => updateISAGInfo("currentName", text)}
          placeholder="Type here..."
          placeholderTextColor="#999"
          editable={!isagInfo.isNA}
        />
      </View>

      {/* Project Name in the ECC */}
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Project  Name in the ECC:{"\n"}N/A</Text>
        <TextInput
          style={[styles.input, isagInfo.isNA && styles.disabledInput]}
          value={isagInfo.nameInECC}
          onChangeText={(text) => updateISAGInfo("nameInECC", text)}
          placeholder="Type here..."
          placeholderTextColor="#999"
          editable={!isagInfo.isNA}
        />
      </View>

      {/* Project Status */}
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Project Status:</Text>
        <TextInput
          style={[styles.input, isagInfo.isNA && styles.disabledInput]}
          value={isagInfo.projectStatus}
          onChangeText={(text) => updateISAGInfo("projectStatus", text)}
          placeholder="Type here..."
          placeholderTextColor="#999"
          editable={!isagInfo.isNA}
        />
      </View>

      {/* Project Geographical Coordinates */}
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Project Geographical Coordinates:</Text>
        <View style={styles.coordinatesContainer}>
          <View style={styles.coordinateField}>
            <Text style={styles.coordinateLabel}>x</Text>
            <TextInput
              style={[
                styles.coordinateInput,
                isagInfo.isNA && styles.disabledInput,
              ]}
              value={isagInfo.gpsX}
              onChangeText={(text) => updateISAGInfo("gpsX", text)}
              placeholder="Type here..."
              placeholderTextColor="#999"
              editable={!isagInfo.isNA}
            />
          </View>
          <View style={styles.coordinateField}>
            <Text style={styles.coordinateLabel}>y</Text>
            <TextInput
              style={[
                styles.coordinateInput,
                isagInfo.isNA && styles.disabledInput,
              ]}
              value={isagInfo.gpsY}
              onChangeText={(text) => updateISAGInfo("gpsY", text)}
              placeholder="Type here..."
              placeholderTextColor="#999"
              editable={!isagInfo.isNA}
            />
          </View>
        </View>
      </View>

      {/* Proponent Name */}
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Proponent Name:</Text>
        <TextInput
          style={[styles.input, isagInfo.isNA && styles.disabledInput]}
          value={isagInfo.proponentName}
          onChangeText={(text) => updateISAGInfo("proponentName", text)}
          placeholder="Type here..."
          placeholderTextColor="#999"
          editable={!isagInfo.isNA}
        />
      </View>

      {/* Proponent Contact Person & Position */}
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Proponent Contact Person & Position:</Text>
        <TextInput
          style={[styles.input, isagInfo.isNA && styles.disabledInput]}
          value={isagInfo.proponentContact}
          onChangeText={(text) => updateISAGInfo("proponentContact", text)}
          placeholder="Type here..."
          placeholderTextColor="#999"
          editable={!isagInfo.isNA}
        />
      </View>

      {/* Proponent Mailing Address */}
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Proponent Mailing Address:</Text>
        <TextInput
          style={[styles.input, isagInfo.isNA && styles.disabledInput]}
          value={isagInfo.proponentAddress}
          onChangeText={(text) => updateISAGInfo("proponentAddress", text)}
          placeholder="Type here..."
          placeholderTextColor="#999"
          editable={!isagInfo.isNA}
        />
      </View>

      {/* Proponent Telephone No./ Fax No. */}
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Proponent Telephone No./ Fax No.:</Text>
        <TextInput
          style={[styles.input, isagInfo.isNA && styles.disabledInput]}
          value={isagInfo.proponentPhone}
          onChangeText={(text) => updateISAGInfo("proponentPhone", text)}
          placeholder="09xx-xxx-xxxx"
          placeholderTextColor="#999"
          editable={!isagInfo.isNA}
        />
      </View>

      {/* Proponent Email Address */}
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Proponent Email Address:</Text>
        <TextInput
          style={[styles.input, isagInfo.isNA && styles.disabledInput]}
          value={isagInfo.proponentEmail}
          onChangeText={(text) => updateISAGInfo("proponentEmail", text)}
          placeholder="email@domain.com"
          placeholderTextColor="#999"
          keyboardType="email-address"
          editable={!isagInfo.isNA}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  checkbox: {
    width: 20, // Updated
    height: 20, // Updated
    borderWidth: 1.5,
    borderColor: "#D0D0D0",
    borderRadius: 4, // Updated
    backgroundColor: "white",
    justifyContent: "center", // Added
    alignItems: "center", // Added
  },
  checkboxChecked: { // Added
    width: 12,
    height: 12,
    backgroundColor: "#8B7FE8", // Used color from submitButton
    borderRadius: 2,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "400",
    color: "#000",
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "400",
    color: "#000",
    width: 140,
    paddingTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#000",
  },
  disabledInput: { // Added
    opacity: 0.5,
  },
  inputWithButton: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  submitButton: {
    backgroundColor: "#8B7FE8",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    justifyContent: "center",
  },
  disabledButton: { // Added
    opacity: 0.5,
  },
  submitButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  addMoreButton: {
    backgroundColor: "#E8E8E8",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "center",
    marginVertical: 8,
  },
  addMoreText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "400",
  },
  coordinatesContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  coordinateField: {
    flex: 1,
  },
  coordinateLabel: {
    fontSize: 13,
    fontWeight: "400",
    color: "#000",
    marginBottom: 6,
  },
  coordinateInput: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#000",
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