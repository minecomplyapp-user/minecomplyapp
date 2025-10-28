import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type FundInfo = {
  isNA?: boolean; // optional: when omitted, treated as false
  permitHolder: string;
  savingsAccount: string;
  amountDeposited: string;
  dateUpdated: string;
};

type FundAdditionalForm = {
  permitHolder: string;
  savingsAccount: string;
  amountDeposited: string;
  dateUpdated: string;
};

type RCFSectionProps = {
  rcfInfo: FundInfo;
  setRcfInfo: React.Dispatch<React.SetStateAction<FundInfo>>;
  rcfAdditionalForms: FundAdditionalForm[];
  setRcfAdditionalForms: React.Dispatch<
    React.SetStateAction<FundAdditionalForm[]>
  >;
  mtfInfo: FundInfo;
  setMtfInfo: React.Dispatch<React.SetStateAction<FundInfo>>;
  mtfAdditionalForms: FundAdditionalForm[];
  setMtfAdditionalForms: React.Dispatch<
    React.SetStateAction<FundAdditionalForm[]>
  >;
  fmrdfInfo: FundInfo;
  setFmrdfInfo: React.Dispatch<React.SetStateAction<FundInfo>>;
  fmrdfAdditionalForms: FundAdditionalForm[];
  setFmrdfAdditionalForms: React.Dispatch<
    React.SetStateAction<FundAdditionalForm[]>
  >;
};

const RCFSection: React.FC<RCFSectionProps> = ({
  rcfInfo,
  setRcfInfo,
  rcfAdditionalForms,
  setRcfAdditionalForms,
  mtfInfo,
  setMtfInfo,
  mtfAdditionalForms,
  setMtfAdditionalForms,
  fmrdfInfo,
  setFmrdfInfo,
  fmrdfAdditionalForms,
  setFmrdfAdditionalForms,
}) => {
  const updateRCFInfo = (field: keyof FundInfo, value: string | boolean) => {
    setRcfInfo((prev) => ({ ...prev, [field]: value }));
  };

  const updateMTFInfo = (field: keyof FundInfo, value: string | boolean) => {
    setMtfInfo((prev) => ({ ...prev, [field]: value }));
  };

  const updateFMRDFInfo = (field: keyof FundInfo, value: string | boolean) => {
    setFmrdfInfo((prev) => ({ ...prev, [field]: value }));
  };

  const addRCFForm = () => {
    setRcfAdditionalForms([
      ...rcfAdditionalForms,
      {
        permitHolder: "",
        savingsAccount: "",
        amountDeposited: "",
        dateUpdated: "",
      },
    ]);
  };

  const addMTFForm = () => {
    setMtfAdditionalForms([
      ...mtfAdditionalForms,
      {
        permitHolder: "",
        savingsAccount: "",
        amountDeposited: "",
        dateUpdated: "",
      },
    ]);
  };

  const addFMRDFForm = () => {
    setFmrdfAdditionalForms([
      ...fmrdfAdditionalForms,
      {
        permitHolder: "",
        savingsAccount: "",
        amountDeposited: "",
        dateUpdated: "",
      },
    ]);
  };

  const updateRcfAdditionalForm = (
    index: number,
    field: keyof FundAdditionalForm,
    value: string
  ) => {
    const updated = [...rcfAdditionalForms];
    updated[index] = { ...updated[index], [field]: value };
    setRcfAdditionalForms(updated);
  };

  const updateMtfAdditionalForm = (
    index: number,
    field: keyof FundAdditionalForm,
    value: string
  ) => {
    const updated = [...mtfAdditionalForms];
    updated[index] = { ...updated[index], [field]: value };
    setMtfAdditionalForms(updated);
  };

  const updateFmrdfAdditionalForm = (
    index: number,
    field: keyof FundAdditionalForm,
    value: string
  ) => {
    const updated = [...fmrdfAdditionalForms];
    updated[index] = { ...updated[index], [field]: value };
    setFmrdfAdditionalForms(updated);
  };

  const removeRcfAdditionalForm = (index: number) => {
    setRcfAdditionalForms(rcfAdditionalForms.filter((_, i) => i !== index));
  };

  const removeMtfAdditionalForm = (index: number) => {
    setMtfAdditionalForms(mtfAdditionalForms.filter((_, i) => i !== index));
  };

  const removeFmrdfAdditionalForm = (index: number) => {
    setFmrdfAdditionalForms(fmrdfAdditionalForms.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.sectionCard}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>RCF/ MTF and FMRDF Status</Text>
      </View>

      {/* Rehabilitation Cash Funds */}
      <View style={styles.subsectionHeader}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => updateRCFInfo("isNA", !rcfInfo.isNA)}
        >
          {rcfInfo.isNA && <View style={styles.checkboxInner} />}
        </TouchableOpacity>
        <Text style={styles.subsectionTitle}>Rehabilitation Cash Funds</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Name of Permit Holder:</Text>
        <View style={styles.inputWithButton}>
          <TextInput
            style={[
              styles.input,
              styles.flexInput,
              rcfInfo.isNA && styles.disabledInput,
            ]}
            value={rcfInfo.permitHolder}
            onChangeText={(text) => updateRCFInfo("permitHolder", text)}
            placeholder="Type here..."
            editable={!rcfInfo.isNA}
          />
          <TouchableOpacity
            style={[styles.submitButton, rcfInfo.isNA && styles.disabledButton]}
            disabled={rcfInfo.isNA}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Savings Account Number:</Text>
        <TextInput
          style={[styles.input, rcfInfo.isNA && styles.disabledInput]}
          value={rcfInfo.savingsAccount}
          onChangeText={(text) => updateRCFInfo("savingsAccount", text)}
          placeholder="Type here..."
          editable={!rcfInfo.isNA}
        />
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Amount Deposited (Php):</Text>
        <TextInput
          style={[styles.input, rcfInfo.isNA && styles.disabledInput]}
          value={rcfInfo.amountDeposited}
          onChangeText={(text) => updateRCFInfo("amountDeposited", text)}
          placeholder="Type here..."
          keyboardType="numeric"
          editable={!rcfInfo.isNA}
        />
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Date of Updated:</Text>
        <TextInput
          style={[styles.input, rcfInfo.isNA && styles.disabledInput]}
          value={rcfInfo.dateUpdated}
          onChangeText={(text) => updateRCFInfo("dateUpdated", text)}
          placeholder="Month/Date/Year"
          editable={!rcfInfo.isNA}
        />
      </View>
      <TouchableOpacity
        style={[styles.addMoreButton, rcfInfo.isNA && styles.disabledButton]}
        onPress={addRCFForm}
        disabled={rcfInfo.isNA}
      >
        <Text style={styles.addMoreText}>+ Add more names</Text>
      </TouchableOpacity>
      {rcfAdditionalForms.map((form: FundAdditionalForm, index: number) => (
        <View key={index} style={styles.additionalFormContainer}>
          <View style={styles.additionalFormHeader}>
            <Text style={styles.additionalFormTitle}>RCF #{index + 2}</Text>
            <TouchableOpacity onPress={() => removeRcfAdditionalForm(index)}>
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Name of Permit Holder:</Text>
            <View style={styles.inputWithButton}>
              <TextInput
                style={[
                  styles.input,
                  styles.flexInput,
                  rcfInfo.isNA && styles.disabledInput,
                ]}
                value={form.permitHolder}
                onChangeText={(text) =>
                  updateRcfAdditionalForm(index, "permitHolder", text)
                }
                placeholder="Type here..."
                editable={!rcfInfo.isNA}
              />
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  rcfInfo.isNA && styles.disabledButton,
                ]}
                disabled={rcfInfo.isNA}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Savings Account Number:</Text>
            <TextInput
              style={[styles.input, rcfInfo.isNA && styles.disabledInput]}
              value={form.savingsAccount}
              onChangeText={(text) =>
                updateRcfAdditionalForm(index, "savingsAccount", text)
              }
              placeholder="Type here..."
              editable={!rcfInfo.isNA}
            />
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Amount Deposited (Php):</Text>
            <TextInput
              style={[styles.input, rcfInfo.isNA && styles.disabledInput]}
              value={form.amountDeposited}
              onChangeText={(text) =>
                updateRcfAdditionalForm(index, "amountDeposited", text)
              }
              placeholder="Type here..."
              keyboardType="numeric"
              editable={!rcfInfo.isNA}
            />
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Date of Updated:</Text>
            <TextInput
              style={[styles.input, rcfInfo.isNA && styles.disabledInput]}
              value={form.dateUpdated}
              onChangeText={(text) =>
                updateRcfAdditionalForm(index, "dateUpdated", text)
              }
              placeholder="Month/Date/Year"
              editable={!rcfInfo.isNA}
            />
          </View>
        </View>
      ))}

      {/* Monitoring Trust Fund */}
      <View style={styles.subsectionHeader}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => updateMTFInfo("isNA", !mtfInfo.isNA)}
        >
          {mtfInfo.isNA && <View style={styles.checkboxInner} />}
        </TouchableOpacity>
        <Text style={styles.subsectionTitle}>Monitoring Trust Fund</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Name of Permit Holder:</Text>
        <View style={styles.inputWithButton}>
          <TextInput
            style={[
              styles.input,
              styles.flexInput,
              mtfInfo.isNA && styles.disabledInput,
            ]}
            value={mtfInfo.permitHolder}
            onChangeText={(text) => updateMTFInfo("permitHolder", text)}
            placeholder="Type here..."
            editable={!mtfInfo.isNA}
          />
          <TouchableOpacity
            style={[styles.submitButton, mtfInfo.isNA && styles.disabledButton]}
            disabled={mtfInfo.isNA}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Savings Account Number:</Text>
        <TextInput
          style={[styles.input, mtfInfo.isNA && styles.disabledInput]}
          value={mtfInfo.savingsAccount}
          onChangeText={(text) => updateMTFInfo("savingsAccount", text)}
          placeholder="Type here..."
          editable={!mtfInfo.isNA}
        />
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Amount Deposited (Php):</Text>
        <TextInput
          style={[styles.input, mtfInfo.isNA && styles.disabledInput]}
          value={mtfInfo.amountDeposited}
          onChangeText={(text) => updateMTFInfo("amountDeposited", text)}
          placeholder="Type here..."
          keyboardType="numeric"
          editable={!mtfInfo.isNA}
        />
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Date of Updated:</Text>
        <TextInput
          style={[styles.input, mtfInfo.isNA && styles.disabledInput]}
          value={mtfInfo.dateUpdated}
          onChangeText={(text) => updateMTFInfo("dateUpdated", text)}
          placeholder="Month/Date/Year"
          editable={!mtfInfo.isNA}
        />
      </View>
      <TouchableOpacity
        style={[styles.addMoreButton, mtfInfo.isNA && styles.disabledButton]}
        onPress={addMTFForm}
        disabled={mtfInfo.isNA}
      >
        <Text style={styles.addMoreText}>+ Add more names</Text>
      </TouchableOpacity>
      {mtfAdditionalForms.map((form: FundAdditionalForm, index: number) => (
        <View key={index} style={styles.additionalFormContainer}>
          <View style={styles.additionalFormHeader}>
            <Text style={styles.additionalFormTitle}>MTF #{index + 2}</Text>
            <TouchableOpacity onPress={() => removeMtfAdditionalForm(index)}>
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Name of Permit Holder:</Text>
            <View style={styles.inputWithButton}>
              <TextInput
                style={[
                  styles.input,
                  styles.flexInput,
                  mtfInfo.isNA && styles.disabledInput,
                ]}
                value={form.permitHolder}
                onChangeText={(text) =>
                  updateMtfAdditionalForm(index, "permitHolder", text)
                }
                placeholder="Type here..."
                editable={!mtfInfo.isNA}
              />
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  mtfInfo.isNA && styles.disabledButton,
                ]}
                disabled={mtfInfo.isNA}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Savings Account Number:</Text>
            <TextInput
              style={[styles.input, mtfInfo.isNA && styles.disabledInput]}
              value={form.savingsAccount}
              onChangeText={(text) =>
                updateMtfAdditionalForm(index, "savingsAccount", text)
              }
              placeholder="Type here..."
              editable={!mtfInfo.isNA}
            />
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Amount Deposited (Php):</Text>
            <TextInput
              style={[styles.input, mtfInfo.isNA && styles.disabledInput]}
              value={form.amountDeposited}
              onChangeText={(text) =>
                updateMtfAdditionalForm(index, "amountDeposited", text)
              }
              placeholder="Type here..."
              keyboardType="numeric"
              editable={!mtfInfo.isNA}
            />
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Date of Updated:</Text>
            <TextInput
              style={[styles.input, mtfInfo.isNA && styles.disabledInput]}
              value={form.dateUpdated}
              onChangeText={(text) =>
                updateMtfAdditionalForm(index, "dateUpdated", text)
              }
              placeholder="Month/Date/Year"
              editable={!mtfInfo.isNA}
            />
          </View>
        </View>
      ))}

      {/* Final Mine Rehabilitation and Decommissioning Fund */}
      <View style={styles.subsectionHeader}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => updateFMRDFInfo("isNA", !fmrdfInfo.isNA)}
        >
          {fmrdfInfo.isNA && <View style={styles.checkboxInner} />}
        </TouchableOpacity>
        <Text style={styles.subsectionTitle}>
          Final Mine Rehabilitation and Decommissioning Fund
        </Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Name of Permit Holder:</Text>
        <View style={styles.inputWithButton}>
          <TextInput
            style={[
              styles.input,
              styles.flexInput,
              fmrdfInfo.isNA && styles.disabledInput,
            ]}
            value={fmrdfInfo.permitHolder}
            onChangeText={(text) => updateFMRDFInfo("permitHolder", text)}
            placeholder="Type here..."
            editable={!fmrdfInfo.isNA}
          />
          <TouchableOpacity
            style={[
              styles.submitButton,
              fmrdfInfo.isNA && styles.disabledButton,
            ]}
            disabled={fmrdfInfo.isNA}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Savings Account Number:</Text>
        <TextInput
          style={[styles.input, fmrdfInfo.isNA && styles.disabledInput]}
          value={fmrdfInfo.savingsAccount}
          onChangeText={(text) => updateFMRDFInfo("savingsAccount", text)}
          placeholder="Type here..."
          editable={!fmrdfInfo.isNA}
        />
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Amount Deposited (Php):</Text>
        <TextInput
          style={[styles.input, fmrdfInfo.isNA && styles.disabledInput]}
          value={fmrdfInfo.amountDeposited}
          onChangeText={(text) => updateFMRDFInfo("amountDeposited", text)}
          placeholder="Type here..."
          keyboardType="numeric"
          editable={!fmrdfInfo.isNA}
        />
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Date of Updated:</Text>
        <TextInput
          style={[styles.input, fmrdfInfo.isNA && styles.disabledInput]}
          value={fmrdfInfo.dateUpdated}
          onChangeText={(text) => updateFMRDFInfo("dateUpdated", text)}
          placeholder="Month/Date/Year"
          editable={!fmrdfInfo.isNA}
        />
      </View>
      <TouchableOpacity
        style={[styles.addMoreButton, fmrdfInfo.isNA && styles.disabledButton]}
        onPress={addFMRDFForm}
        disabled={fmrdfInfo.isNA}
      >
        <Text style={styles.addMoreText}>+ Add more names</Text>
      </TouchableOpacity>
      {fmrdfAdditionalForms.map((form: FundAdditionalForm, index: number) => (
        <View key={index} style={styles.additionalFormContainer}>
          <View style={styles.additionalFormHeader}>
            <Text style={styles.additionalFormTitle}>FMRDF #{index + 2}</Text>
            <TouchableOpacity onPress={() => removeFmrdfAdditionalForm(index)}>
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Name of Permit Holder:</Text>
            <View style={styles.inputWithButton}>
              <TextInput
                style={[
                  styles.input,
                  styles.flexInput,
                  fmrdfInfo.isNA && styles.disabledInput,
                ]}
                value={form.permitHolder}
                onChangeText={(text) =>
                  updateFmrdfAdditionalForm(index, "permitHolder", text)
                }
                placeholder="Type here..."
                editable={!fmrdfInfo.isNA}
              />
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  fmrdfInfo.isNA && styles.disabledButton,
                ]}
                disabled={fmrdfInfo.isNA}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Savings Account Number:</Text>
            <TextInput
              style={[styles.input, fmrdfInfo.isNA && styles.disabledInput]}
              value={form.savingsAccount}
              onChangeText={(text) =>
                updateFmrdfAdditionalForm(index, "savingsAccount", text)
              }
              placeholder="Type here..."
              editable={!fmrdfInfo.isNA}
            />
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Amount Deposited (Php):</Text>
            <TextInput
              style={[styles.input, fmrdfInfo.isNA && styles.disabledInput]}
              value={form.amountDeposited}
              onChangeText={(text) =>
                updateFmrdfAdditionalForm(index, "amountDeposited", text)
              }
              placeholder="Type here..."
              keyboardType="numeric"
              editable={!fmrdfInfo.isNA}
            />
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Date of Updated:</Text>
            <TextInput
              style={[styles.input, fmrdfInfo.isNA && styles.disabledInput]}
              value={form.dateUpdated}
              onChangeText={(text) =>
                updateFmrdfAdditionalForm(index, "dateUpdated", text)
              }
              placeholder="Month/Date/Year"
              editable={!fmrdfInfo.isNA}
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
    padding: 16,
  },
  sectionHeader: {
    backgroundColor: "#D8D8FF",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "#000",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  subsectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
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
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: "#007AFF",
    borderRadius: 2,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: "600",
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
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  disabledInput: { // Added
    opacity: 0.5,
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
  disabledButton: { // Added
    opacity: 0.5,
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

export default RCFSection;