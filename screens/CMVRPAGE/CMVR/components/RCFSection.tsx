import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/rcf.styles";
import type { FundInfo, FundAdditionalForm, RCFSectionProps } from "../types/rcf.types";

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
                value={rcfInfo.savingsAccount}
                onChangeText={(text) => updateRCFInfo("savingsAccount", text)}
                placeholder="Enter account number"
                placeholderTextColor="#94A3B8"
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
                editable={!rcfInfo.isNA}
              />
            </View>

            <TouchableOpacity
              style={[styles.addButton, rcfInfo.isNA && styles.disabledButton]}
              onPress={addRCFForm}
              disabled={rcfInfo.isNA}
            >
              <Ionicons name="add-circle" size={20} color={rcfInfo.isNA ? "#94A3B8" : "#1E40AF"} />
              <Text style={[styles.addButtonText, rcfInfo.isNA && styles.disabledText]}>
                Add More Entries
              </Text>
            </TouchableOpacity>

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

        {/* MTF Section */}
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

        {/* FMRDF Section */}
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

export default RCFSection;