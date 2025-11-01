import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type FundInfo = {
  isNA: boolean;
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
    setRcfAdditionalForms([...rcfAdditionalForms, {
      permitHolder: "", savingsAccount: "", amountDeposited: "", dateUpdated: "",
    }]);
  };

  const addMTFForm = () => {
    setMtfAdditionalForms([...mtfAdditionalForms, {
      permitHolder: "", savingsAccount: "", amountDeposited: "", dateUpdated: "",
    }]);
  };

  const addFMRDFForm = () => {
    setFmrdfAdditionalForms([...fmrdfAdditionalForms, {
      permitHolder: "", savingsAccount: "", amountDeposited: "", dateUpdated: "",
    }]);
  };

  const updateRcfAdditionalForm = (index: number, field: keyof FundAdditionalForm, value: string) => {
    const updated = [...rcfAdditionalForms];
    updated[index] = { ...updated[index], [field]: value };
    setRcfAdditionalForms(updated);
  };

  const updateMtfAdditionalForm = (index: number, field: keyof FundAdditionalForm, value: string) => {
    const updated = [...mtfAdditionalForms];
    updated[index] = { ...updated[index], [field]: value };
    setMtfAdditionalForms(updated);
  };

  const updateFmrdfAdditionalForm = (index: number, field: keyof FundAdditionalForm, value: string) => {
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
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.iconContainer}>
          <Ionicons name="cash" size={24} color="#1E40AF" />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.sectionTitle}>Fund Status</Text>
          <Text style={styles.sectionSubtitle}>RCF / MTF / FMRDF</Text>
        </View>
      </View>

      <View style={styles.formContent}>
        {/* RCF Section */}
        <View style={styles.subsectionContainer}>
          <View style={styles.subsectionHeader}>
            <View style={styles.subsectionIconContainer}>
              <Ionicons name="wallet" size={18} color="#1E40AF" />
            </View>
            <Text style={styles.subsectionTitle}>Rehabilitation Cash Funds</Text>
            <TouchableOpacity
              style={styles.naButton}
              onPress={() => updateRCFInfo("isNA", !rcfInfo.isNA)}
            >
              <View style={[styles.checkbox, rcfInfo.isNA && styles.checkboxChecked]}>
                {rcfInfo.isNA && <View style={styles.checkboxInner} />}
              </View>
              <Text style={styles.naLabel}>N/A</Text>
            </TouchableOpacity>
          </View>

          {/* --- FIX 1: Applied disabledContent style when isNA is TRUE --- */}
          <View style={[styles.fundContent, rcfInfo.isNA && styles.disabledContent]}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Name of Permit Holder</Text>
              <View style={styles.inputWithButton}>
                <TextInput
                  style={[styles.input, styles.flexInput]}
                  value={rcfInfo.permitHolder}
                  onChangeText={(text) => updateRCFInfo("permitHolder", text)}
                  placeholder="Enter name"
                  placeholderTextColor="#94A3B8"
                  /* --- FIX 2: Set editable to !rcfInfo.isNA --- */
                  editable={!rcfInfo.isNA}
                />
                <TouchableOpacity
                  /* --- FIX 3: Set disabled styles/prop when isNA is TRUE --- */
                  style={[styles.submitButton, rcfInfo.isNA && styles.disabledButton]}
                  disabled={rcfInfo.isNA}
                >
                  <Ionicons name="checkmark-circle" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Savings Account Number</Text>
              <TextInput
                style={styles.input}
                value={rcfInfo.savingsAccount}
                onChangeText={(text) => updateRCFInfo("savingsAccount", text)}
                placeholder="Enter account number"
                placeholderTextColor="#94A3B8"
                /* --- FIX 4: Set editable to !rcfInfo.isNA --- */
                editable={!rcfInfo.isNA}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Amount Deposited (₱)</Text>
              <TextInput
                style={styles.input}
                value={rcfInfo.amountDeposited}
                onChangeText={(text) => updateRCFInfo("amountDeposited", text)}
                placeholder="0.00"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                /* --- FIX 5: Set editable to !rcfInfo.isNA --- */
                editable={!rcfInfo.isNA}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Date Updated</Text>
              <TextInput
                style={styles.input}
                value={rcfInfo.dateUpdated}
                onChangeText={(text) => updateRCFInfo("dateUpdated", text)}
                placeholder="MM/DD/YYYY"
                placeholderTextColor="#94A3B8"
                /* --- FIX 6: Set editable to !rcfInfo.isNA --- */
                editable={!rcfInfo.isNA}
              />
            </View>

            <TouchableOpacity
              /* --- FIX 7: All logic inverted to disable when isNA is TRUE --- */
              style={[styles.addButton, rcfInfo.isNA && styles.disabledButton]}
              onPress={addRCFForm}
              disabled={rcfInfo.isNA}
            >
              <Ionicons name="add-circle" size={20} color={rcfInfo.isNA ? "#94A3B8" : "#1E40AF"} />
              <Text style={[styles.addButtonText, rcfInfo.isNA && styles.disabledText]}>
                Add More Entries
              </Text>
            </TouchableOpacity>

            {/* This additional forms block already had the correct logic */}
            {rcfAdditionalForms.map((form, index) => (
              <View key={index} style={styles.additionalForm}>
                <View style={styles.additionalFormHeader}>
                  <View style={styles.badgeContainer}>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>#{index + 2}</Text>
                    </View>
                    <Text style={styles.additionalFormTitle}>RCF Entry</Text>
                  </View>
                  <TouchableOpacity onPress={() => removeRcfAdditionalForm(index)}>
                    <Ionicons name="trash" size={20} color="#DC2626" />
                  </TouchableOpacity>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Name of Permit Holder</Text>
                  <View style={styles.inputWithButton}>
                    <TextInput
                      style={[styles.input, styles.flexInput]}
                      value={form.permitHolder}
                      onChangeText={(text) => updateRcfAdditionalForm(index, "permitHolder", text)}
                      placeholder="Enter name"
                      placeholderTextColor="#94A3B8"
                      editable={!rcfInfo.isNA}
                    />
                    <TouchableOpacity
                      style={[styles.submitButton, rcfInfo.isNA && styles.disabledButton]}
                      disabled={rcfInfo.isNA}
                    >
                      <Ionicons name="checkmark-circle" size={18} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Savings Account Number</Text>
                  <TextInput
                    style={styles.input}
                    value={form.savingsAccount}
                    onChangeText={(text) => updateRcfAdditionalForm(index, "savingsAccount", text)}
                    placeholder="Enter account number"
                    placeholderTextColor="#94A3B8"
                    editable={!rcfInfo.isNA}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Amount Deposited (₱)</Text>
                  <TextInput
                    style={styles.input}
                    value={form.amountDeposited}
                    onChangeText={(text) => updateRcfAdditionalForm(index, "amountDeposited", text)}
                    placeholder="0.00"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    editable={!rcfInfo.isNA}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Date Updated</Text>
                  <TextInput
                    style={styles.input}
                    value={form.dateUpdated}
                    onChangeText={(text) => updateRcfAdditionalForm(index, "dateUpdated", text)}
                    placeholder="MM/DD/YYYY"
                    placeholderTextColor="#94A3B8"
                    editable={!rcfInfo.isNA}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        {/* MTF Section (No changes needed) */}
        <View style={styles.subsectionContainer}>
          <View style={styles.subsectionHeader}>
            <View style={styles.subsectionIconContainer}>
              <Ionicons name="shield" size={18} color="#1E40AF" />
            </View>
            <Text style={styles.subsectionTitle}>Monitoring Trust Fund</Text>
            <TouchableOpacity
              style={styles.naButton}
              onPress={() => updateMTFInfo("isNA", !mtfInfo.isNA)}
            >
              <View style={[styles.checkbox, mtfInfo.isNA && styles.checkboxChecked]}>
                {mtfInfo.isNA && <View style={styles.checkboxInner} />}
              </View>
              <Text style={styles.naLabel}>N/A</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.fundContent, mtfInfo.isNA && styles.disabledContent]}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Name of Permit Holder</Text>
              <View style={styles.inputWithButton}>
                <TextInput
                  style={[styles.input, styles.flexInput]}
                  value={mtfInfo.permitHolder}
                  onChangeText={(text) => updateMTFInfo("permitHolder", text)}
                  placeholder="Enter name"
                  placeholderTextColor="#94A3B8"
                  editable={!mtfInfo.isNA}
                />
                <TouchableOpacity
                  style={[styles.submitButton, mtfInfo.isNA && styles.disabledButton]}
                  disabled={mtfInfo.isNA}
                >
                  <Ionicons name="checkmark-circle" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Savings Account Number</Text>
              <TextInput
                style={styles.input}
                value={mtfInfo.savingsAccount}
                onChangeText={(text) => updateMTFInfo("savingsAccount", text)}
                placeholder="Enter account number"
                placeholderTextColor="#94A3B8"
                editable={!mtfInfo.isNA}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Amount Deposited (₱)</Text>
              <TextInput
                style={styles.input}
                value={mtfInfo.amountDeposited}
                onChangeText={(text) => updateMTFInfo("amountDeposited", text)}
                placeholder="0.00"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                editable={!mtfInfo.isNA}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Date Updated</Text>
              <TextInput
                style={styles.input}
                value={mtfInfo.dateUpdated}
                onChangeText={(text) => updateMTFInfo("dateUpdated", text)}
                placeholder="MM/DD/YYYY"
                placeholderTextColor="#94A3B8"
                editable={!mtfInfo.isNA}
              />
            </View>

            <TouchableOpacity
              style={[styles.addButton, mtfInfo.isNA && styles.disabledButton]}
              onPress={addMTFForm}
              disabled={mtfInfo.isNA}
            >
              <Ionicons name="add-circle" size={20} color={mtfInfo.isNA ? "#94A3B8" : "#1E40AF"} />
              <Text style={[styles.addButtonText, mtfInfo.isNA && styles.disabledText]}>
                Add More Entries
              </Text>
            </TouchableOpacity>

            {mtfAdditionalForms.map((form, index) => (
              <View key={index} style={styles.additionalForm}>
                <View style={styles.additionalFormHeader}>
                  <View style={styles.badgeContainer}>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>#{index + 2}</Text>
                    </View>
                    <Text style={styles.additionalFormTitle}>MTF Entry</Text>
                  </View>
                  <TouchableOpacity onPress={() => removeMtfAdditionalForm(index)}>
                    <Ionicons name="trash" size={20} color="#DC2626" />
                  </TouchableOpacity>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Name of Permit Holder</Text>
                  <View style={styles.inputWithButton}>
                    <TextInput
                      style={[styles.input, styles.flexInput]}
                      value={form.permitHolder}
                      onChangeText={(text) => updateMtfAdditionalForm(index, "permitHolder", text)}
                      placeholder="Enter name"
                      placeholderTextColor="#94A3B8"
                      editable={!mtfInfo.isNA}
                    />
                    <TouchableOpacity
                      style={[styles.submitButton, mtfInfo.isNA && styles.disabledButton]}
                      disabled={mtfInfo.isNA}
                    >
                      <Ionicons name="checkmark-circle" size={18} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Savings Account Number</Text>
                  <TextInput
                    style={styles.input}
                    value={form.savingsAccount}
                    onChangeText={(text) => updateMtfAdditionalForm(index, "savingsAccount", text)}
                    placeholder="Enter account number"
                    placeholderTextColor="#94A3B8"
                    editable={!mtfInfo.isNA}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Amount Deposited (₱)</Text>
                  <TextInput
                    style={styles.input}
                    value={form.amountDeposited}
                    onChangeText={(text) => updateMtfAdditionalForm(index, "amountDeposited", text)}
                    placeholder="0.00"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    editable={!mtfInfo.isNA}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Date Updated</Text>
                  <TextInput
                    style={styles.input}
                    value={form.dateUpdated}
                    onChangeText={(text) => updateMtfAdditionalForm(index, "dateUpdated", text)}
                    placeholder="MM/DD/YYYY"
                    placeholderTextColor="#94A3B8"
                    editable={!mtfInfo.isNA}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        {/* FMRDF Section (No changes needed) */}
        <View style={styles.subsectionContainer}>
          <View style={styles.subsectionHeader}>
            <View style={styles.subsectionIconContainer}>
              <Ionicons name="leaf-outline" size={18} color="#1E40AF" />
            </View>
            <Text style={styles.subsectionTitle}>Final Mine Rehabilitation Fund</Text>
            <TouchableOpacity
              style={styles.naButton}
              onPress={() => updateFMRDFInfo("isNA", !fmrdfInfo.isNA)}
            >
              <View style={[styles.checkbox, fmrdfInfo.isNA && styles.checkboxChecked]}>
                {fmrdfInfo.isNA && <View style={styles.checkboxInner} />}
              </View>
              <Text style={styles.naLabel}>N/A</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.fundContent, fmrdfInfo.isNA && styles.disabledContent]}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Name of Permit Holder</Text>
              <View style={styles.inputWithButton}>
                <TextInput
                  style={[styles.input, styles.flexInput]}
                  value={fmrdfInfo.permitHolder}
                  onChangeText={(text) => updateFMRDFInfo("permitHolder", text)}
                  placeholder="Enter name"
                  placeholderTextColor="#94A3B8"
                  editable={!fmrdfInfo.isNA}
                />
                <TouchableOpacity
                  style={[styles.submitButton, fmrdfInfo.isNA && styles.disabledButton]}
                  disabled={fmrdfInfo.isNA}
                >
                  <Ionicons name="checkmark-circle" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Savings Account Number</Text>
              <TextInput
                style={styles.input}
                value={fmrdfInfo.savingsAccount}
                onChangeText={(text) => updateFMRDFInfo("savingsAccount", text)}
                placeholder="Enter account number"
                placeholderTextColor="#94A3B8"
                editable={!fmrdfInfo.isNA}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Amount Deposited (₱)</Text>
              <TextInput
                style={styles.input}
                value={fmrdfInfo.amountDeposited}
                onChangeText={(text) => updateFMRDFInfo("amountDeposited", text)}
                placeholder="0.00"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                editable={!fmrdfInfo.isNA}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Date Updated</Text>
              <TextInput
                style={styles.input}
                value={fmrdfInfo.dateUpdated}
                onChangeText={(text) => updateFMRDFInfo("dateUpdated", text)}
                placeholder="MM/DD/YYYY"
                placeholderTextColor="#94A3B8"
                editable={!fmrdfInfo.isNA}
              />
            </View>

            <TouchableOpacity
              style={[styles.addButton, fmrdfInfo.isNA && styles.disabledButton]}
              onPress={addFMRDFForm}
              disabled={fmrdfInfo.isNA}
            >
              <Ionicons name="add-circle" size={20} color={fmrdfInfo.isNA ? "#94A3B8" : "#1E40AF"} />
              <Text style={[styles.addButtonText, fmrdfInfo.isNA && styles.disabledText]}>
                Add More Entries
              </Text>
            </TouchableOpacity>

            {fmrdfAdditionalForms.map((form, index) => (
              <View key={index} style={styles.additionalForm}>
                <View style={styles.additionalFormHeader}>
                  <View style={styles.badgeContainer}>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>#{index + 2}</Text>
                    </View>
                    <Text style={styles.additionalFormTitle}>FMRDF Entry</Text>
                  </View>
                  <TouchableOpacity onPress={() => removeFmrdfAdditionalForm(index)}>
                    <Ionicons name="trash" size={20} color="#DC2626" />
                  </TouchableOpacity>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Name of Permit Holder</Text>
                  <View style={styles.inputWithButton}>
                    <TextInput
                      style={[styles.input, styles.flexInput]}
                      value={form.permitHolder}
                      onChangeText={(text) => updateFmrdfAdditionalForm(index, "permitHolder", text)}
                      placeholder="Enter name"
                      placeholderTextColor="#94A3B8"
                      editable={!fmrdfInfo.isNA}
                    />
                    <TouchableOpacity
                      style={[styles.submitButton, fmrdfInfo.isNA && styles.disabledButton]}
                      disabled={fmrdfInfo.isNA}
                    >
                      <Ionicons name="checkmark-circle" size={18} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Savings Account Number</Text>
                  <TextInput
                    style={styles.input}
                    value={form.savingsAccount}
                    onChangeText={(text) => updateFmrdfAdditionalForm(index, "savingsAccount", text)}
                    placeholder="Enter account number"
                    placeholderTextColor="#94A3B8"
                    editable={!fmrdfInfo.isNA}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Amount Deposited (₱)</Text>
                  <TextInput
                    style={styles.input}
                    value={form.amountDeposited}
                    onChangeText={(text) => updateFmrdfAdditionalForm(index, "amountDeposited", text)}
                    placeholder="0.00"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    editable={!fmrdfInfo.isNA}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Date Updated</Text>
                  <TextInput
                    style={styles.input}
                    value={form.dateUpdated}
                    onChangeText={(text) => updateFmrdfAdditionalForm(index, "dateUpdated", text)}
                    placeholder="MM/DD/YYYY"
                    placeholderTextColor="#94A3B8"
                    editable={!fmrdfInfo.isNA}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
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
  formContent: {
    padding: 20,
  },
  subsectionContainer: {
    marginBottom: 8,
  },
  subsectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  subsectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#475569",
    flex: 1,
  },
  naButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "white",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 4,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: '#02217C',
    borderColor: '#02217C',
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: "white",
    borderRadius: 2,
  },
  naLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  fundContent: {
    paddingLeft: 8,
  },
  disabledContent: {
    opacity: 0.5,
  },
  fieldGroup: {
    marginBottom: 16,
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
    paddingVertical: 12,
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
    fontSize: 15,
    fontWeight: "700",
    color: '#02217C',
  },
  divider: {
    height: 1.5,
    backgroundColor: "#E2E8F0",
    marginVertical: 24,
  },
});

export default RCFSection;