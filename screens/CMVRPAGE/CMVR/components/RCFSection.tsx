import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/rcf.styles";
import type {
  FundInfo,
  FundAdditionalForm,
  RCFSectionProps,
} from "../types/rcf.types";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

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
  permitHolderList,
}) => {
  const updateRCFInfo = (field: keyof FundInfo, value: string | boolean) => {
    setRcfInfo((prev) => {
      // ✅ FIX: Add null/undefined safety check
      const safePrev = prev || { isNA: false, permitHolder: "", savingsAccount: "", amountDeposited: "", dateUpdated: "" };
      return { ...safePrev, [field]: value };
    });
  };

  const updateMTFInfo = (field: keyof FundInfo, value: string | boolean) => {
    setMtfInfo((prev) => {
      // ✅ FIX: Add null/undefined safety check
      const safePrev = prev || { isNA: false, permitHolder: "", savingsAccount: "", amountDeposited: "", dateUpdated: "" };
      return { ...safePrev, [field]: value };
    });
  };

  const updateFMRDFInfo = (field: keyof FundInfo, value: string | boolean) => {
    setFmrdfInfo((prev) => {
      // ✅ FIX: Add null/undefined safety check
      const safePrev = prev || { isNA: false, permitHolder: "", savingsAccount: "", amountDeposited: "", dateUpdated: "" };
      return { ...safePrev, [field]: value };
    });
  };
  
  // ✅ NEW: Date picker states
  const [showRcfDatePicker, setShowRcfDatePicker] = useState(false);
  const [showMtfDatePicker, setShowMtfDatePicker] = useState(false);
  const [showFmrdfDatePicker, setShowFmrdfDatePicker] = useState(false);
  const [showRcfAdditionalDatePicker, setShowRcfAdditionalDatePicker] = useState<number | null>(null);
  const [showMtfAdditionalDatePicker, setShowMtfAdditionalDatePicker] = useState<number | null>(null);
  const [showFmrdfAdditionalDatePicker, setShowFmrdfAdditionalDatePicker] = useState<number | null>(null);
  
  // Helper function to parse date string (MM/DD/YYYY) to Date object
  const parseDateString = (dateString: string | undefined): Date | null => {
    if (!dateString || dateString.trim() === "") return null;
    // Try to parse MM/DD/YYYY format
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const month = parseInt(parts[0], 10) - 1; // Month is 0-indexed
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    // Try to parse as ISO string or default Date constructor
    const parsed = new Date(dateString);
    return isNaN(parsed.getTime()) ? null : parsed;
  };
  
  // Helper function to format Date to MM/DD/YYYY string
  const formatDateToString = (date: Date | null): string => {
    if (!date) return "";
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };
  
  const handleRcfDateConfirm = (selectedDate: Date) => {
    setShowRcfDatePicker(false);
    updateRCFInfo("dateUpdated", formatDateToString(selectedDate));
  };
  
  const handleMtfDateConfirm = (selectedDate: Date) => {
    setShowMtfDatePicker(false);
    updateMTFInfo("dateUpdated", formatDateToString(selectedDate));
  };
  
  const handleFmrdfDateConfirm = (selectedDate: Date) => {
    setShowFmrdfDatePicker(false);
    updateFMRDFInfo("dateUpdated", formatDateToString(selectedDate));
  };
  
  const handleRcfAdditionalDateConfirm = (selectedDate: Date, index: number) => {
    setShowRcfAdditionalDatePicker(null);
    updateRcfAdditionalForm(index, "dateUpdated", formatDateToString(selectedDate));
  };
  
  const handleMtfAdditionalDateConfirm = (selectedDate: Date, index: number) => {
    setShowMtfAdditionalDatePicker(null);
    updateMtfAdditionalForm(index, "dateUpdated", formatDateToString(selectedDate));
  };
  
  const handleFmrdfAdditionalDateConfirm = (selectedDate: Date, index: number) => {
    setShowFmrdfAdditionalDatePicker(null);
    updateFmrdfAdditionalForm(index, "dateUpdated", formatDateToString(selectedDate));
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
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to remove this RCF entry?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            setRcfAdditionalForms(
              rcfAdditionalForms.filter((_, i) => i !== index)
            );
          },
          style: "destructive",
        },
      ]
    );
  };

  const removeMtfAdditionalForm = (index: number) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to remove this MTF entry?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            setMtfAdditionalForms(
              mtfAdditionalForms.filter((_, i) => i !== index)
            );
          },
          style: "destructive",
        },
      ]
    );
  };

  const removeFmrdfAdditionalForm = (index: number) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to remove this FMRDF entry?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            setFmrdfAdditionalForms(
              fmrdfAdditionalForms.filter((_, i) => i !== index)
            );
          },
          style: "destructive",
        },
      ]
    );
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
            <Text style={styles.subsectionTitle}>
              Rehabilitation Cash Funds
            </Text>
            <TouchableOpacity
              style={styles.naButton}
              onPress={() => {
                // ✅ FIX: Add null/undefined check before accessing isNA
                if (!rcfInfo) return;
                updateRCFInfo("isNA", !rcfInfo.isNA);
              }}
            >
              <View
                style={[
                  styles.checkbox,
                  rcfInfo?.isNA && styles.checkboxChecked,
                ]}
              >
                {rcfInfo?.isNA && <View style={styles.checkboxInner} />}
              </View>
              <Text style={styles.naLabel}>N/A</Text>
            </TouchableOpacity>
          </View>
          <View
            style={[styles.fundContent, rcfInfo?.isNA && styles.disabledContent]}
          >
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Name of Permit Holder</Text>
              <View style={styles.inputWithButton}>
                {/* <TextInput
                  style={[styles.input, styles.flexInput]}
                  value={rcfInfo.permitHolder}
                  onChangeText={(text) => updateRCFInfo("permitHolder", text)}
                  placeholder="Enter name"
                  placeholderTextColor="#94A3B8"
                  editable={!rcfInfo.isNA}
                /> */}

                <Picker
                  selectedValue={rcfInfo.permitHolder}
                  onValueChange={(value: string | number) => {
                    updateRCFInfo("permitHolder", String(value));
                  }}
                  // 🟢 Apply explicit input styles here for size/font
                  style={styles.pickerInput}
                  dropdownIconColor="#0F172A"
                >
                  <Picker.Item
                    label="Select Permit Holder..."
                    value=""
                    enabled={false}
                  />
                  {permitHolderList.map((holder, index) => (
                    <Picker.Item key={index} label={holder} value={holder} />
                  ))}
                </Picker>
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    rcfInfo.isNA && styles.disabledButton,
                  ]}
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
              <TouchableOpacity
                style={[styles.input, rcfInfo?.isNA && { opacity: 0.5 }]}
                onPress={() => !rcfInfo?.isNA && setShowRcfDatePicker(true)}
                activeOpacity={0.7}
                disabled={rcfInfo?.isNA}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ color: rcfInfo?.dateUpdated ? "#1E293B" : "#94A3B8" }}>
                    {rcfInfo?.dateUpdated || "MM/DD/YYYY"}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#94A3B8" />
                </View>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={showRcfDatePicker}
                mode="date"
                date={parseDateString(rcfInfo?.dateUpdated) || new Date()}
                onConfirm={handleRcfDateConfirm}
                onCancel={() => setShowRcfDatePicker(false)}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                textColor={Platform.OS === "ios" ? "#000000" : undefined}
                pickerContainerStyleIOS={{
                  backgroundColor: "#FFFFFF",
                }}
                modalStyleIOS={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              />
            </View>
            <TouchableOpacity
              style={[styles.addButton, rcfInfo.isNA && styles.disabledButton]}
              onPress={addRCFForm}
              disabled={rcfInfo.isNA}
            >
              <Ionicons
                name="add-circle"
                size={20}
                color={rcfInfo.isNA ? "#94A3B8" : "#1E40AF"}
              />
              <Text
                style={[
                  styles.addButtonText,
                  rcfInfo.isNA && styles.disabledText,
                ]}
              >
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
                  <TouchableOpacity
                    onPress={() => removeRcfAdditionalForm(index)}
                  >
                    <Ionicons name="trash" size={20} color="#DC2626" />
                  </TouchableOpacity>
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Name of Permit Holder</Text>
                  <View style={styles.inputWithButton}>
                    {/* <TextInput
                      style={[styles.input, styles.flexInput]}
                      value={form.permitHolder}
                      onChangeText={(text) => updateRcfAdditionalForm(index, "permitHolder", text)}
                      placeholder="Enter name"
                      placeholderTextColor="#94A3B8"
                      editable={!rcfInfo.isNA}
                    /> */}

                    <Picker
                      selectedValue={form?.permitHolder || ""}
                      onValueChange={(value: string | number) => {
                        updateRcfAdditionalForm(
                          index,
                          "permitHolder",
                          String(value)
                        );
                      }}
                      // 🟢 Apply explicit input styles here for size/font
                      style={styles.pickerInput}
                      dropdownIconColor="#0F172A"
                    >
                      <Picker.Item
                        label="Select Permit Holder..."
                        value=""
                        enabled={false}
                      />
                      {permitHolderList.map((holder, index) => (
                        <Picker.Item
                          key={index}
                          label={holder}
                          value={holder}
                        />
                      ))}
                    </Picker>
                    <TouchableOpacity
                      style={[
                        styles.submitButton,
                        rcfInfo?.isNA && styles.disabledButton,
                      ]}
                      disabled={rcfInfo?.isNA}
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Savings Account Number</Text>
                  <TextInput
                    style={styles.input}
                    value={form?.savingsAccount || ""}
                    onChangeText={(text) =>
                      updateRcfAdditionalForm(index, "savingsAccount", text)
                    }
                    placeholder="Enter account number"
                    placeholderTextColor="#94A3B8"
                    editable={!rcfInfo?.isNA}
                  />
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Amount Deposited (₱)</Text>
                  <TextInput
                    style={styles.input}
                    value={form?.amountDeposited || ""}
                    onChangeText={(text) =>
                      updateRcfAdditionalForm(index, "amountDeposited", text)
                    }
                    placeholder="0.00"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    editable={!rcfInfo?.isNA}
                  />
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Date Updated</Text>
                  <TouchableOpacity
                    style={[styles.input, rcfInfo?.isNA && { opacity: 0.5 }]}
                    onPress={() => !rcfInfo?.isNA && setShowRcfAdditionalDatePicker(index)}
                    activeOpacity={0.7}
                    disabled={rcfInfo?.isNA}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <Text style={{ color: form?.dateUpdated ? "#1E293B" : "#94A3B8" }}>
                        {form?.dateUpdated || "MM/DD/YYYY"}
                      </Text>
                      <Ionicons name="calendar-outline" size={20} color="#94A3B8" />
                    </View>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={showRcfAdditionalDatePicker === index}
                    mode="date"
                    date={parseDateString(form?.dateUpdated) || new Date()}
                    onConfirm={(selectedDate) => handleRcfAdditionalDateConfirm(selectedDate, index)}
                    onCancel={() => setShowRcfAdditionalDatePicker(null)}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    textColor={Platform.OS === "ios" ? "#000000" : undefined}
                    pickerContainerStyleIOS={{
                      backgroundColor: "#FFFFFF",
                    }}
                    modalStyleIOS={{
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
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
              onPress={() => {
                // ✅ FIX: Add null/undefined check before accessing isNA
                if (!mtfInfo) return;
                updateMTFInfo("isNA", !mtfInfo.isNA);
              }}
            >
              <View
                style={[
                  styles.checkbox,
                  mtfInfo?.isNA && styles.checkboxChecked,
                ]}
              >
                {mtfInfo?.isNA && <View style={styles.checkboxInner} />}
              </View>
              <Text style={styles.naLabel}>N/A</Text>
            </TouchableOpacity>
          </View>
          <View
            style={[styles.fundContent, mtfInfo?.isNA && styles.disabledContent]}
          >
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Name of Permit Holder</Text>
              <View style={styles.inputWithButton}>
                {/* <TextInput
                  style={[styles.input, styles.flexInput]}
                  value={mtfInfo.permitHolder}
                  onChangeText={(text) => updateMTFInfo("permitHolder", text)}
                  placeholder="Enter name"
                  placeholderTextColor="#94A3B8"
                  editable={!mtfInfo.isNA}
                /> */}

                <Picker
                  selectedValue={mtfInfo.permitHolder}
                  onValueChange={(value: string | number) => {
                    updateMTFInfo("permitHolder", String(value));
                  }}
                  // 🟢 Apply explicit input styles here for size/font
                  style={styles.pickerInput}
                  dropdownIconColor="#0F172A"
                >
                  <Picker.Item
                    label="Select Permit Holder..."
                    value=""
                    enabled={false}
                  />
                  {permitHolderList.map((holder, index) => (
                    <Picker.Item key={index} label={holder} value={holder} />
                  ))}
                </Picker>
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    mtfInfo.isNA && styles.disabledButton,
                  ]}
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
              <TouchableOpacity
                style={[styles.input, mtfInfo?.isNA && { opacity: 0.5 }]}
                onPress={() => !mtfInfo?.isNA && setShowMtfDatePicker(true)}
                activeOpacity={0.7}
                disabled={mtfInfo?.isNA}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ color: mtfInfo?.dateUpdated ? "#1E293B" : "#94A3B8" }}>
                    {mtfInfo?.dateUpdated || "MM/DD/YYYY"}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#94A3B8" />
                </View>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={showMtfDatePicker}
                mode="date"
                date={parseDateString(mtfInfo?.dateUpdated) || new Date()}
                onConfirm={handleMtfDateConfirm}
                onCancel={() => setShowMtfDatePicker(false)}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                textColor={Platform.OS === "ios" ? "#000000" : undefined}
                pickerContainerStyleIOS={{
                  backgroundColor: "#FFFFFF",
                }}
                modalStyleIOS={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              />
            </View>
            <TouchableOpacity
              style={[styles.addButton, mtfInfo.isNA && styles.disabledButton]}
              onPress={addMTFForm}
              disabled={mtfInfo.isNA}
            >
              <Ionicons
                name="add-circle"
                size={20}
                color={mtfInfo.isNA ? "#94A3B8" : "#1E40AF"}
              />
              <Text
                style={[
                  styles.addButtonText,
                  mtfInfo.isNA && styles.disabledText,
                ]}
              >
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
                  <TouchableOpacity
                    onPress={() => removeMtfAdditionalForm(index)}
                  >
                    <Ionicons name="trash" size={20} color="#DC2626" />
                  </TouchableOpacity>
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Name of Permit Holder</Text>
                  <View style={styles.inputWithButton}>
                    {/* <TextInput
                      style={[styles.input, styles.flexInput]}
                      value={form.permitHolder}
                      onChangeText={(text) => updateMtfAdditionalForm(index, "permitHolder", text)}
                      placeholder="Enter name"
                      placeholderTextColor="#94A3B8"
                      editable={!mtfInfo.isNA}
                    /> */}

                    <Picker
                      selectedValue={form?.permitHolder || ""}
                      onValueChange={(value: string | number) => {
                        updateMtfAdditionalForm(
                          index,
                          "permitHolder",
                          String(value)
                        );
                      }}
                      // 🟢 Apply explicit input styles here for size/font
                      style={styles.pickerInput}
                      dropdownIconColor="#0F172A"
                    >
                      <Picker.Item
                        label="Select Permit Holder..."
                        value=""
                        enabled={false}
                      />
                      {permitHolderList.map((holder, index) => (
                        <Picker.Item
                          key={index}
                          label={holder}
                          value={holder}
                        />
                      ))}
                    </Picker>
                    <TouchableOpacity
                      style={[
                        styles.submitButton,
                        mtfInfo?.isNA && styles.disabledButton,
                      ]}
                      disabled={mtfInfo?.isNA}
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Savings Account Number</Text>
                  <TextInput
                    style={styles.input}
                    value={form?.savingsAccount || ""}
                    onChangeText={(text) =>
                      updateMtfAdditionalForm(index, "savingsAccount", text)
                    }
                    placeholder="Enter account number"
                    placeholderTextColor="#94A3B8"
                    editable={!mtfInfo?.isNA}
                  />
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Amount Deposited (₱)</Text>
                  <TextInput
                    style={styles.input}
                    value={form?.amountDeposited || ""}
                    onChangeText={(text) =>
                      updateMtfAdditionalForm(index, "amountDeposited", text)
                    }
                    placeholder="0.00"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    editable={!mtfInfo?.isNA}
                  />
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Date Updated</Text>
                  <TouchableOpacity
                    style={[styles.input, mtfInfo?.isNA && { opacity: 0.5 }]}
                    onPress={() => !mtfInfo?.isNA && setShowMtfAdditionalDatePicker(index)}
                    activeOpacity={0.7}
                    disabled={mtfInfo?.isNA}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <Text style={{ color: form?.dateUpdated ? "#1E293B" : "#94A3B8" }}>
                        {form?.dateUpdated || "MM/DD/YYYY"}
                      </Text>
                      <Ionicons name="calendar-outline" size={20} color="#94A3B8" />
                    </View>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={showMtfAdditionalDatePicker === index}
                    mode="date"
                    date={parseDateString(form?.dateUpdated) || new Date()}
                    onConfirm={(selectedDate) => handleMtfAdditionalDateConfirm(selectedDate, index)}
                    onCancel={() => setShowMtfAdditionalDatePicker(null)}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    textColor={Platform.OS === "ios" ? "#000000" : undefined}
                    pickerContainerStyleIOS={{
                      backgroundColor: "#FFFFFF",
                    }}
                    modalStyleIOS={{
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
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
            <Text style={styles.subsectionTitle}>
              Final Mine Rehabilitation Fund
            </Text>
            <TouchableOpacity
              style={styles.naButton}
              onPress={() => {
                // ✅ FIX: Add null/undefined check before accessing isNA
                if (!fmrdfInfo) return;
                updateFMRDFInfo("isNA", !fmrdfInfo.isNA);
              }}
            >
              <View
                style={[
                  styles.checkbox,
                  fmrdfInfo?.isNA && styles.checkboxChecked,
                ]}
              >
                {fmrdfInfo?.isNA && <View style={styles.checkboxInner} />}
              </View>
              <Text style={styles.naLabel}>N/A</Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.fundContent,
              fmrdfInfo?.isNA && styles.disabledContent,
            ]}
          >
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Name of Permit Holder</Text>
              <View style={styles.inputWithButton}>
                {/* <TextInput
                  style={[styles.input, styles.flexInput]}
                  value={fmrdfInfo.permitHolder}
                  onChangeText={(text) => updateFMRDFInfo("permitHolder", text)}
                  placeholder="Enter name"
                  placeholderTextColor="#94A3B8"
                  editable={!fmrdfInfo.isNA}
                /> */}

                <Picker
                  selectedValue={fmrdfInfo.permitHolder}
                  onValueChange={(value: string | number) => {
                    updateFMRDFInfo("permitHolder", String(value));
                  }}
                  // 🟢 Apply explicit input styles here for size/font
                  style={styles.pickerInput}
                  dropdownIconColor="#0F172A"
                >
                  <Picker.Item
                    label="Select Permit Holder..."
                    value=""
                    enabled={false}
                  />
                  {permitHolderList.map((holder, index) => (
                    <Picker.Item key={index} label={holder} value={holder} />
                  ))}
                </Picker>
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    fmrdfInfo.isNA && styles.disabledButton,
                  ]}
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
                onChangeText={(text) =>
                  updateFMRDFInfo("amountDeposited", text)
                }
                placeholder="0.00"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                editable={!fmrdfInfo.isNA}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Date Updated</Text>
              <TouchableOpacity
                style={[styles.input, fmrdfInfo?.isNA && { opacity: 0.5 }]}
                onPress={() => !fmrdfInfo?.isNA && setShowFmrdfDatePicker(true)}
                activeOpacity={0.7}
                disabled={fmrdfInfo?.isNA}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ color: fmrdfInfo?.dateUpdated ? "#1E293B" : "#94A3B8" }}>
                    {fmrdfInfo?.dateUpdated || "MM/DD/YYYY"}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#94A3B8" />
                </View>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={showFmrdfDatePicker}
                mode="date"
                date={parseDateString(fmrdfInfo?.dateUpdated) || new Date()}
                onConfirm={handleFmrdfDateConfirm}
                onCancel={() => setShowFmrdfDatePicker(false)}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                textColor={Platform.OS === "ios" ? "#000000" : undefined}
                pickerContainerStyleIOS={{
                  backgroundColor: "#FFFFFF",
                }}
                modalStyleIOS={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.addButton,
                fmrdfInfo.isNA && styles.disabledButton,
              ]}
              onPress={addFMRDFForm}
              disabled={fmrdfInfo.isNA}
            >
              <Ionicons
                name="add-circle"
                size={20}
                color={fmrdfInfo.isNA ? "#94A3B8" : "#1E40AF"}
              />
              <Text
                style={[
                  styles.addButtonText,
                  fmrdfInfo.isNA && styles.disabledText,
                ]}
              >
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
                  <TouchableOpacity
                    onPress={() => removeFmrdfAdditionalForm(index)}
                  >
                    <Ionicons name="trash" size={20} color="#DC2626" />
                  </TouchableOpacity>
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Name of Permit Holder</Text>
                  <View style={styles.inputWithButton}>
                    {/* <TextInput
                      style={[styles.input, styles.flexInput]}
                      value={form.permitHolder}
                      onChangeText={(text) => updateFmrdfAdditionalForm(index, "permitHolder", text)}
                      placeholder="Enter name"
                      placeholderTextColor="#94A3B8"
                      editable={!fmrdfInfo.isNA}
                    /> */}

                    <Picker
                      selectedValue={form?.permitHolder || ""}
                      onValueChange={(value: string | number) => {
                        updateFmrdfAdditionalForm(
                          index,
                          "permitHolder",
                          String(value)
                        );
                      }}
                      // 🟢 Apply explicit input styles here for size/font
                      style={styles.pickerInput}
                      dropdownIconColor="#0F172A"
                    >
                      <Picker.Item
                        label="Select Permit Holder..."
                        value=""
                        enabled={false}
                      />
                      {permitHolderList.map((holder, index) => (
                        <Picker.Item
                          key={index}
                          label={holder}
                          value={holder}
                        />
                      ))}
                    </Picker>
                    <TouchableOpacity
                      style={[
                        styles.submitButton,
                        fmrdfInfo?.isNA && styles.disabledButton,
                      ]}
                      disabled={fmrdfInfo?.isNA}
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Savings Account Number</Text>
                  <TextInput
                    style={styles.input}
                    value={form?.savingsAccount || ""}
                    onChangeText={(text) =>
                      updateFmrdfAdditionalForm(index, "savingsAccount", text)
                    }
                    placeholder="Enter account number"
                    placeholderTextColor="#94A3B8"
                    editable={!fmrdfInfo?.isNA}
                  />
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Amount Deposited (₱)</Text>
                  <TextInput
                    style={styles.input}
                    value={form?.amountDeposited || ""}
                    onChangeText={(text) =>
                      updateFmrdfAdditionalForm(index, "amountDeposited", text)
                    }
                    placeholder="0.00"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    editable={!fmrdfInfo?.isNA}
                  />
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Date Updated</Text>
                  <TouchableOpacity
                    style={[styles.input, fmrdfInfo?.isNA && { opacity: 0.5 }]}
                    onPress={() => !fmrdfInfo?.isNA && setShowFmrdfAdditionalDatePicker(index)}
                    activeOpacity={0.7}
                    disabled={fmrdfInfo?.isNA}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <Text style={{ color: form?.dateUpdated ? "#1E293B" : "#94A3B8" }}>
                        {form?.dateUpdated || "MM/DD/YYYY"}
                      </Text>
                      <Ionicons name="calendar-outline" size={20} color="#94A3B8" />
                    </View>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={showFmrdfAdditionalDatePicker === index}
                    mode="date"
                    date={parseDateString(form?.dateUpdated) || new Date()}
                    onConfirm={(selectedDate) => handleFmrdfAdditionalDateConfirm(selectedDate, index)}
                    onCancel={() => setShowFmrdfAdditionalDatePicker(null)}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    textColor={Platform.OS === "ios" ? "#000000" : undefined}
                    pickerContainerStyleIOS={{
                      backgroundColor: "#FFFFFF",
                    }}
                    modalStyleIOS={{
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
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
