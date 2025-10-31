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
type ISAGInfo = {
  isNA: boolean;
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
type CombinedSectionProps = {
  eccInfo: ECCInfo;
  setEccInfo: React.Dispatch<React.SetStateAction<ECCInfo>>;
  eccAdditionalForms: ECCAdditionalForm[];
  setEccAdditionalForms: React.Dispatch<React.SetStateAction<ECCAdditionalForm[]>>;
  isagInfo: ISAGInfo;
  setIsagInfo: React.Dispatch<React.SetStateAction<ISAGInfo>>;
  isagAdditionalForms: ISAGAdditionalForm[];
  setIsagAdditionalForms: React.Dispatch<React.SetStateAction<ISAGAdditionalForm[]>>;
};

const CombinedECCISAGSection: React.FC<CombinedSectionProps> = ({
  eccInfo,
  setEccInfo,
  eccAdditionalForms,
  setEccAdditionalForms,
  isagInfo,
  setIsagInfo,
  isagAdditionalForms,
  setIsagAdditionalForms,
}) => {
  const updateECCInfo = (field: keyof ECCInfo, value: string | boolean) => {
    setEccInfo((prev) => ({ ...prev, [field]: value }));
  };
  const updateISAGInfo = (field: keyof ISAGInfo, value: string | boolean) => {
    setIsagInfo((prev) => ({ ...prev, [field]: value }));
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
    setEccAdditionalForms(eccAdditionalForms.filter((_, i) => i !== index));
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
    setIsagAdditionalForms(isagAdditionalForms.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark" size={24} color="#1E40AF" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.sectionTitle}>ECC / ISAG-MPP</Text>
            <Text style={styles.sectionSubtitle}>
              Environmental Compliance & ISAG Permits
            </Text>
          </View>
        </View>
      </View>
      {/* ECC Toggler */}
      <View style={styles.sectionContent}>
        <TouchableOpacity
          style={[
            styles.togglerButton,
            eccInfo.isNA && styles.togglerButtonOpen,
          ]}
          onPress={() => updateECCInfo("isNA", !eccInfo.isNA)}
          activeOpacity={0.7}
        >
          <View style={styles.sectionBadge}>
            <Ionicons name="shield-checkmark" size={18} color="#1E40AF" />
            <Text style={styles.sectionBadgeText}>ECC Section</Text>
          </View>
          <View style={[styles.checkbox, eccInfo.isNA && styles.checkboxCheckedECC]}>
            {eccInfo.isNA && <Ionicons name="checkmark" size={16} color="white" />}
          </View>
        </TouchableOpacity>
        {/* ECC Form */}
        {eccInfo.isNA && (
          <View style={styles.formContainer}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Name of Permit Holder</Text>
              <View style={styles.inputWithButton}>
                <TextInput
                  style={[styles.input, styles.flexInput]}
                  value={eccInfo.permitHolder}
                  onChangeText={(text) => updateECCInfo("permitHolder", text)}
                  placeholder="Enter permit holder name"
                  placeholderTextColor="#94A3B8"
                />
                <TouchableOpacity style={styles.submitButton}>
                  <Ionicons name="checkmark-circle" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>ECC Number</Text>
              <TextInput
                style={styles.input}
                value={eccInfo.eccNumber}
                onChangeText={(text) => updateECCInfo("eccNumber", text)}
                placeholder="Enter ECC number"
                placeholderTextColor="#94A3B8"
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Date of Issuance</Text>
              <TextInput
                style={styles.input}
                value={eccInfo.dateOfIssuance}
                onChangeText={(text) => updateECCInfo("dateOfIssuance", text)}
                placeholder="MM/DD/YYYY"
                placeholderTextColor="#94A3B8"
              />
            </View>
            <TouchableOpacity style={styles.addButton} onPress={addECCForm}>
              <Ionicons name="add-circle" size={20} color="#1E40AF" />
              <Text style={styles.addButtonText}>Add More Permit Holders</Text>
            </TouchableOpacity>
            {eccAdditionalForms.map((form, index) => (
              <View key={index} style={styles.additionalForm}>
                <View style={styles.additionalFormHeader}>
                  <View style={styles.badgeContainer}>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>#{index + 2}</Text>
                    </View>
                    <Text style={styles.additionalFormTitle}>ECC Permit</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeEccAdditionalForm(index)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash" size={20} color="#DC2626" />
                  </TouchableOpacity>
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Name of Permit Holder</Text>
                  <View style={styles.inputWithButton}>
                    <TextInput
                      style={[styles.input, styles.flexInput]}
                      value={form.permitHolder}
                      onChangeText={(text) =>
                        updateEccAdditionalForm(index, "permitHolder", text)
                      }
                      placeholder="Enter permit holder name"
                      placeholderTextColor="#94A3B8"
                    />
                    <TouchableOpacity style={styles.submitButton}>
                      <Ionicons name="checkmark-circle" size={18} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>ECC Number</Text>
                  <TextInput
                    style={styles.input}
                    value={form.eccNumber}
                    onChangeText={(text) =>
                      updateEccAdditionalForm(index, "eccNumber", text)
                    }
                    placeholder="Enter ECC number"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Date of Issuance</Text>
                  <TextInput
                    style={styles.input}
                    value={form.dateOfIssuance}
                    onChangeText={(text) =>
                      updateEccAdditionalForm(index, "dateOfIssuance", text)
                    }
                    placeholder="MM/DD/YYYY"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>
            ))}
          </View>
        )}
        {/* ISAG Toggler */}
        <TouchableOpacity
          style={[
            styles.togglerButton,
            styles.isagToggler,
            isagInfo.isNA && styles.togglerButtonOpen,
          ]}
          onPress={() => updateISAGInfo("isNA", !isagInfo.isNA)}
          activeOpacity={0.7}
        >
          <View style={styles.sectionBadge}>
            <Ionicons name="document-text" size={18} color="#5B4FC7" />
            <Text style={[styles.sectionBadgeText, styles.isagBadge]}>
              ISAG/MPP Section
            </Text>
          </View>
          <View style={[styles.checkbox, isagInfo.isNA && styles.checkboxCheckedISAG]}>
            {isagInfo.isNA && <Ionicons name="checkmark" size={16} color="white" />}
          </View>
        </TouchableOpacity>
        {/* ISAG Form */}
        {isagInfo.isNA && (
          <View style={styles.formContainerISAG}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Name of Permit Holder</Text>
              <View style={styles.inputWithButton}>
                <TextInput
                  style={[styles.input, styles.flexInput]}
                  value={isagInfo.permitHolder}
                  onChangeText={(text) => updateISAGInfo("permitHolder", text)}
                  placeholder="Enter permit holder name"
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity style={styles.submitButtonISAG}>
                  <Ionicons name="checkmark-circle" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>ISAG Permit Number</Text>
              <TextInput
                style={styles.input}
                value={isagInfo.isagNumber}
                onChangeText={(text) => updateISAGInfo("isagNumber", text)}
                placeholder="Enter permit number"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Date of Issuance</Text>
              <TextInput
                style={styles.input}
                value={isagInfo.dateOfIssuance}
                onChangeText={(text) => updateISAGInfo("dateOfIssuance", text)}
                placeholder="MM/DD/YYYY"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <TouchableOpacity style={styles.addButtonISAG} onPress={addISAGForm}>
              <Ionicons name="add-circle-outline" size={20} color="#5B4FC7" />
              <Text style={styles.addButtonTextISAG}>Add More Permit Holders</Text>
            </TouchableOpacity>
            {isagAdditionalForms.map((form, index) => (
              <View key={index} style={styles.additionalFormISAG}>
                <View style={styles.additionalFormHeader}>
                  <View style={styles.badgeContainer}>
                    <View style={styles.badgeISAG}>
                      <Text style={styles.badgeText}>#{index + 2}</Text>
                    </View>
                    <Text style={[styles.additionalFormTitle, styles.isagTitle]}>
                      ISAG/MPP Permit
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeIsagAdditionalForm(index)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Name of Permit Holder</Text>
                  <View style={styles.inputWithButton}>
                    <TextInput
                      style={[styles.input, styles.flexInput]}
                      value={form.permitHolder}
                      onChangeText={(text) =>
                        updateIsagAdditionalForm(index, "permitHolder", text)
                      }
                      placeholder="Enter permit holder name"
                      placeholderTextColor="#9CA3AF"
                    />
                    <TouchableOpacity style={styles.submitButtonISAG}>
                      <Ionicons name="checkmark-circle" size={18} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>ISAG Permit Number</Text>
                  <TextInput
                    style={styles.input}
                    value={form.isagNumber}
                    onChangeText={(text) =>
                      updateIsagAdditionalForm(index, "isagNumber", text)
                    }
                    placeholder="Enter permit number"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Date of Issuance</Text>
                  <TextInput
                    style={styles.input}
                    value={form.dateOfIssuance}
                    onChangeText={(text) =>
                      updateIsagAdditionalForm(index, "dateOfIssuance", text)
                    }
                    placeholder="MM/DD/YYYY"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.subsectionHeader}>
              <Ionicons name="business-outline" size={18} color="#6B7280" />
              <Text style={styles.subsectionTitle}>Project Information</Text>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Project Current Name</Text>
              <TextInput
                style={styles.input}
                value={isagInfo.currentName}
                onChangeText={(text) => updateISAGInfo("currentName", text)}
                placeholder="Enter current project name"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Project Name in the ECC</Text>
              <TextInput
                style={styles.input}
                value={isagInfo.nameInECC}
                onChangeText={(text) => updateISAGInfo("nameInECC", text)}
                placeholder="Enter ECC project name"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Project Status</Text>
              <TextInput
                style={styles.input}
                value={isagInfo.projectStatus}
                onChangeText={(text) => updateISAGInfo("projectStatus", text)}
                placeholder="Enter project status"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Geographical Coordinates</Text>
              <View style={styles.coordinatesContainer}>
                <View style={styles.coordinateField}>
                  <Text style={styles.coordinateLabel}>Latitude (X)</Text>
                  <TextInput
                    style={styles.coordinateInput}
                    value={isagInfo.gpsX}
                    onChangeText={(text) => updateISAGInfo("gpsX", text)}
                    placeholder="0.000000"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={styles.coordinateField}>
                  <Text style={styles.coordinateLabel}>Longitude (Y)</Text>
                  <TextInput
                    style={styles.coordinateInput}
                    value={isagInfo.gpsY}
                    onChangeText={(text) => updateISAGInfo("gpsY", text)}
                    placeholder="0.000000"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.subsectionHeader}>
              <Ionicons name="person-outline" size={18} color="#6B7280" />
              <Text style={styles.subsectionTitle}>Proponent Information</Text>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Proponent Name</Text>
              <TextInput
                style={styles.input}
                value={isagInfo.proponentName}
                onChangeText={(text) => updateISAGInfo("proponentName", text)}
                placeholder="Enter proponent name"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Contact Person & Position</Text>
              <TextInput
                style={styles.input}
                value={isagInfo.proponentContact}
                onChangeText={(text) => updateISAGInfo("proponentContact", text)}
                placeholder="Enter contact person and position"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Mailing Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={isagInfo.proponentAddress}
                onChangeText={(text) => updateISAGInfo("proponentAddress", text)}
                placeholder="Enter mailing address"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Telephone / Fax Number</Text>
              <TextInput
                style={styles.input}
                value={isagInfo.proponentPhone}
                onChangeText={(text) => updateISAGInfo("proponentPhone", text)}
                placeholder="09xx-xxx-xxxx"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={isagInfo.proponentEmail}
                onChangeText={(text) => updateISAGInfo("proponentEmail", text)}
                placeholder="email@domain.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
        )}
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
    shadowColor: "#1E40AF",
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
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#EFF6FF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#BFDBFE",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1E40AF",
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
    color: "#1E40AF",
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    borderRadius: 6,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxCheckedECC: {
    backgroundColor: "#1E40AF",
    borderColor: "#1E40AF",
  },
  checkboxCheckedISAG: {
    backgroundColor: "#5B4FC7",
    borderColor: "#5B4FC7",
  },
  sectionContent: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  togglerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    shadowColor: "#94A3B8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  togglerButtonOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
    shadowOpacity: 0.05,
  },
  isagToggler: {
    marginTop: 16,
  },
  formContainer: {
    paddingTop: 20,
    paddingHorizontal: 4,
    backgroundColor: "#F8FAFC",
    borderColor: "#CBD5E1",
    borderWidth: 1.5,
    borderTopWidth: 0,
    padding: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  formContainerISAG: {
    paddingTop: 20,
    paddingHorizontal: 4,
    backgroundColor: "#F8F7FF",
    borderColor: "#C4B5FD",
    borderWidth: 1.5,
    borderTopWidth: 0,
    padding: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  sectionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionBadgeText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E40AF",
  },
  isagBadge: {
    color: "#5B4FC7",
  },
  fieldGroup: {
    marginBottom: 20,
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
    backgroundColor: "#1E40AF",
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1E40AF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonISAG: {
    backgroundColor: "#5B4FC7",
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#5B4FC7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButton: {
    backgroundColor: "#EFF6FF",
    borderWidth: 2,
    borderColor: "#BFDBFE",
    borderStyle: "dashed",
    paddingVertical: 14,
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
    color: "#1E40AF",
    fontWeight: "600",
  },
  addButtonISAG: {
    backgroundColor: "#EDE9FE",
    borderWidth: 2,
    borderColor: "#C4B5FD",
    borderStyle: "dashed",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  addButtonTextISAG: {
    fontSize: 14,
    color: "#5B4FC7",
    fontWeight: "600",
  },
  additionalForm: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
  },
  additionalFormISAG: {
    backgroundColor: "#F8F7FF",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1.5,
    borderColor: "#E9D5FF",
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
    backgroundColor: "#1E40AF",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeISAG: {
    backgroundColor: "#5B4FC7",
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
    fontSize: 16,
    fontWeight: "700",
    color: "#1E40AF",
  },
  isagTitle: {
    color: "#5B4FC7",
  },
  deleteButton: {
    padding: 6,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  coordinatesContainer: {
    flexDirection: "row",
    gap: 12,
  },
  coordinateField: {
    flex: 1,
  },
  coordinateLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  coordinateInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0F172A",
  },
  divider: {
    height: 1,
    backgroundColor: "#E8EAED",
    marginVertical: 24,
  },
  subsectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
});

export default CombinedECCISAGSection;
