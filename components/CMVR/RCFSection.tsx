import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Define types for your props and state
type FundInfo = {
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
  setRcfAdditionalForms: React.Dispatch<React.SetStateAction<FundAdditionalForm[]>>;
  mtfInfo: FundInfo;
  setMtfInfo: React.Dispatch<React.SetStateAction<FundInfo>>;
  mtfAdditionalForms: FundAdditionalForm[];
  setMtfAdditionalForms: React.Dispatch<React.SetStateAction<FundAdditionalForm[]>>;
  fmrdfInfo: FundInfo;
  setFmrdfInfo: React.Dispatch<React.SetStateAction<FundInfo>>;
  fmrdfAdditionalForms: FundAdditionalForm[];
  setFmrdfAdditionalForms: React.Dispatch<React.SetStateAction<FundAdditionalForm[]>>;
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
  const updateRCFInfo = (field: keyof FundInfo, value: string) => {
    setRcfInfo((prev: FundInfo) => ({ ...prev, [field]: value }));
  };

  const updateMTFInfo = (field: keyof FundInfo, value: string) => {
    setMtfInfo((prev: FundInfo) => ({ ...prev, [field]: value }));
  };

  const updateFMRDFInfo = (field: keyof FundInfo, value: string) => {
    setFmrdfInfo((prev: FundInfo) => ({ ...prev, [field]: value }));
  };

  const addRCFForm = () => {
    setRcfAdditionalForms([
      ...rcfAdditionalForms,
      { permitHolder: "", savingsAccount: "", amountDeposited: "", dateUpdated: "" },
    ]);
  };

  const addMTFForm = () => {
    setMtfAdditionalForms([
      ...mtfAdditionalForms,
      { permitHolder: "", savingsAccount: "", amountDeposited: "", dateUpdated: "" },
    ]);
  };

  const addFMRDFForm = () => {
    setFmrdfAdditionalForms([
      ...fmrdfAdditionalForms,
      { permitHolder: "", savingsAccount: "", amountDeposited: "", dateUpdated: "" },
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
    setRcfAdditionalForms(rcfAdditionalForms.filter((_: FundAdditionalForm, i: number) => i !== index));
  };

  const removeMtfAdditionalForm = (index: number) => {
    setMtfAdditionalForms(mtfAdditionalForms.filter((_: FundAdditionalForm, i: number) => i !== index));
  };

  const removeFmrdfAdditionalForm = (index: number) => {
    setFmrdfAdditionalForms(fmrdfAdditionalForms.filter((_: FundAdditionalForm, i: number) => i !== index));
  };

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeaderColored}>
        <Text style={styles.sectionTitleColored}>RCF/ MTF and FMRDF Status</Text>
      </View>
      {/* Rehabilitation Cash Funds */}
      <View style={styles.subsectionHeader}>
        <TouchableOpacity style={styles.checkbox}>
          <View style={styles.checkboxChecked} />
        </TouchableOpacity>
        <Text style={styles.subsectionTitle}>Rehabilitation Cash Funds</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Name of Permit Holder:</Text>
        <View style={styles.inputWithButton}>
          <TextInput
            style={[styles.input, styles.flexInput]}
            value={rcfInfo.permitHolder}
            onChangeText={(text) => updateRCFInfo("permitHolder", text)}
            placeholder="Type here..."
          />
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.labelLong}>Savings Account Number:</Text>
        <TextInput
          style={styles.input}
          value={rcfInfo.savingsAccount}
          onChangeText={(text) => updateRCFInfo("savingsAccount", text)}
          placeholder="Type here..."
        />
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.labelLong}>Amount Deposited (Php):</Text>
        <TextInput
          style={styles.input}
          value={rcfInfo.amountDeposited}
          onChangeText={(text) => updateRCFInfo("amountDeposited", text)}
          placeholder="Type here..."
          keyboardType="numeric"
        />
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Date of updated:</Text>
        <TextInput
          style={styles.input}
          value={rcfInfo.dateUpdated}
          onChangeText={(text) => updateRCFInfo("dateUpdated", text)}
          placeholder="Month/Date/Year"
        />
      </View>
      <TouchableOpacity style={styles.addMoreButton} onPress={addRCFForm}>
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
                style={[styles.input, styles.flexInput]}
                value={form.permitHolder}
                onChangeText={(text) => updateRcfAdditionalForm(index, "permitHolder", text)}
                placeholder="Type here..."
              />
              <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.labelLong}>Savings Account Number:</Text>
            <TextInput
              style={styles.input}
              value={form.savingsAccount}
              onChangeText={(text) => updateRcfAdditionalForm(index, "savingsAccount", text)}
              placeholder="Type here..."
            />
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.labelLong}>Amount Deposited (Php):</Text>
            <TextInput
              style={styles.input}
              value={form.amountDeposited}
              onChangeText={(text) => updateRcfAdditionalForm(index, "amountDeposited", text)}
              placeholder="Type here..."
              keyboardType="numeric"
            />
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Date of updated:</Text>
            <TextInput
              style={styles.input}
              value={form.dateUpdated}
              onChangeText={(text) => updateRcfAdditionalForm(index, "dateUpdated", text)}
              placeholder="Month/Date/Year"
            />
          </View>
        </View>
      ))}
      {/* Monitoring Trust Fund */}
      <View style={styles.subsectionHeader}>
        <TouchableOpacity style={styles.checkbox}>
          <View style={styles.checkboxChecked} />
        </TouchableOpacity>
        <Text style={styles.subsectionTitle}>Monitoring Trust Fund</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Name of Permit Holder:</Text>
        <View style={styles.inputWithButton}>
          <TextInput
            style={[styles.input, styles.flexInput]}
            value={mtfInfo.permitHolder}
            onChangeText={(text) => updateMTFInfo("permitHolder", text)}
            placeholder="Type here..."
          />
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.labelLong}>Savings Account Number:</Text>
        <TextInput
          style={styles.input}
          value={mtfInfo.savingsAccount}
          onChangeText={(text) => updateMTFInfo("savingsAccount", text)}
          placeholder="Type here..."
        />
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.labelLong}>Amount Deposited (Php):</Text>
        <TextInput
          style={styles.input}
          value={mtfInfo.amountDeposited}
          onChangeText={(text) => updateMTFInfo("amountDeposited", text)}
          placeholder="Type here..."
          keyboardType="numeric"
        />
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Date of updated:</Text>
        <TextInput
          style={styles.input}
          value={mtfInfo.dateUpdated}
          onChangeText={(text) => updateMTFInfo("dateUpdated", text)}
          placeholder="Month/Date/Year"
        />
      </View>
      <TouchableOpacity style={styles.addMoreButton} onPress={addMTFForm}>
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
                style={[styles.input, styles.flexInput]}
                value={form.permitHolder}
                onChangeText={(text) => updateMtfAdditionalForm(index, "permitHolder", text)}
                placeholder="Type here..."
              />
              <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.labelLong}>Savings Account Number:</Text>
            <TextInput
              style={styles.input}
              value={form.savingsAccount}
              onChangeText={(text) => updateMtfAdditionalForm(index, "savingsAccount", text)}
              placeholder="Type here..."
            />
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.labelLong}>Amount Deposited (Php):</Text>
            <TextInput
              style={styles.input}
              value={form.amountDeposited}
              onChangeText={(text) => updateMtfAdditionalForm(index, "amountDeposited", text)}
              placeholder="Type here..."
              keyboardType="numeric"
            />
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Date of updated:</Text>
            <TextInput
              style={styles.input}
              value={form.dateUpdated}
              onChangeText={(text) => updateMtfAdditionalForm(index, "dateUpdated", text)}
              placeholder="Month/Date/Year"
            />
          </View>
        </View>
      ))}
      {/* Final Mine Rehabilitation and Decommissioning Fund */}
      <View style={styles.subsectionHeader}>
        <TouchableOpacity style={styles.checkbox}>
          <View style={styles.checkboxChecked} />
        </TouchableOpacity>
        <Text style={styles.subsectionTitle}>Final Mine Rehabilitation and Decommissioning Fund</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Name of Permit Holder:</Text>
        <View style={styles.inputWithButton}>
          <TextInput
            style={[styles.input, styles.flexInput]}
            value={fmrdfInfo.permitHolder}
            onChangeText={(text) => updateFMRDFInfo("permitHolder", text)}
            placeholder="Type here..."
          />
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.labelLong}>Savings Account Number:</Text>
        <TextInput
          style={styles.input}
          value={fmrdfInfo.savingsAccount}
          onChangeText={(text) => updateFMRDFInfo("savingsAccount", text)}
          placeholder="Type here..."
        />
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.labelLong}>Amount Deposited (Php):</Text>
        <TextInput
          style={styles.input}
          value={fmrdfInfo.amountDeposited}
          onChangeText={(text) => updateFMRDFInfo("amountDeposited", text)}
          placeholder="Type here..."
          keyboardType="numeric"
        />
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Date of updated:</Text>
        <TextInput
          style={styles.input}
          value={fmrdfInfo.dateUpdated}
          onChangeText={(text) => updateFMRDFInfo("dateUpdated", text)}
          placeholder="Month/Date/Year"
        />
      </View>
      <TouchableOpacity style={styles.addMoreButton} onPress={addFMRDFForm}>
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
                style={[styles.input, styles.flexInput]}
                value={form.permitHolder}
                onChangeText={(text) => updateFmrdfAdditionalForm(index, "permitHolder", text)}
                placeholder="Type here..."
              />
              <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.labelLong}>Savings Account Number:</Text>
            <TextInput
              style={styles.input}
              value={form.savingsAccount}
              onChangeText={(text) => updateFmrdfAdditionalForm(index, "savingsAccount", text)}
              placeholder="Type here..."
            />
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.labelLong}>Amount Deposited (Php):</Text>
            <TextInput
              style={styles.input}
              value={form.amountDeposited}
              onChangeText={(text) => updateFmrdfAdditionalForm(index, "amountDeposited", text)}
              placeholder="Type here..."
              keyboardType="numeric"
            />
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Date of updated:</Text>
            <TextInput
              style={styles.input}
              value={form.dateUpdated}
              onChangeText={(text) => updateFmrdfAdditionalForm(index, "dateUpdated", text)}
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
  sectionHeaderColored: {
    backgroundColor: "#E8E3FF",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 16,
  },
  sectionTitleColored: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  subsectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 12,
    gap: 8,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
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
