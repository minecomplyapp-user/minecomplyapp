import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/combinedECCISAG.styles";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import type {
  ECCInfo,
  ECCAdditionalForm,
  ISAGInfo,
  ISAGAdditionalForm,
  CombinedSectionProps,
} from "../types/combinedECCISAG.types";

const CombinedECCISAGSection: React.FC<CombinedSectionProps> = ({
  eccInfo,
  setEccInfo,
  eccAdditionalForms,
  setEccAdditionalForms,
  isagInfo,
  setIsagInfo,
  isagAdditionalForms,
  setIsagAdditionalForms,
  permitHolderList,
  setPermitHolderList,
}) => {
  const updateECCInfo = (field: keyof ECCInfo, value: string | boolean) => {
    setEccInfo((prev) => {
      // ✅ FIX: Add null/undefined safety check
      const safePrev = prev || { isNA: false, permitHolder: "", eccNumber: "", dateOfIssuance: "" };
      return { ...safePrev, [field]: value };
    });
  };
  const [newHolderName, setNewHolderName] = useState("");
  
  // ✅ NEW: Date picker states
  const [showEccDatePicker, setShowEccDatePicker] = useState(false);
  const [showIsagDatePicker, setShowIsagDatePicker] = useState(false);
  const [showEccAdditionalDatePicker, setShowEccAdditionalDatePicker] = useState<number | null>(null);
  const [showIsagAdditionalDatePicker, setShowIsagAdditionalDatePicker] = useState<number | null>(null);
  
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
  
  const handleEccDateConfirm = (selectedDate: Date) => {
    setShowEccDatePicker(false);
    updateECCInfo("dateOfIssuance", formatDateToString(selectedDate));
  };
  
  const handleIsagDateConfirm = (selectedDate: Date) => {
    setShowIsagDatePicker(false);
    updateISAGInfo("dateOfIssuance", formatDateToString(selectedDate));
  };
  
  const handleEccAdditionalDateConfirm = (selectedDate: Date, index: number) => {
    setShowEccAdditionalDatePicker(null);
    updateEccAdditionalForm(index, "dateOfIssuance", formatDateToString(selectedDate));
  };
  
  const handleIsagAdditionalDateConfirm = (selectedDate: Date, index: number) => {
    setShowIsagAdditionalDatePicker(null);
    updateIsagAdditionalForm(index, "dateOfIssuance", formatDateToString(selectedDate));
  };
  
  const updatePermitHolderList = (newHolder: string) => {
    setPermitHolderList((prevList) => {
      // ✅ FIX: Add defensive array check
      if (!Array.isArray(prevList)) {
        console.error("permitHolderList is not an array:", prevList);
        return [newHolder];
      }

      // If the new holder is NOT in the list, spread the previous list and add the new holder.
      if (prevList.includes(newHolder)) {
        console.log(`Permit holder "${newHolder}" already exists, skipping`);
        return prevList;
      }

      const newList = [...prevList, newHolder];
      console.log(`Added permit holder "${newHolder}". New length: ${newList.length}`, newList);
      return newList;
    });
  };
  const handleRemoveHolder = (index: number) => {
    if (typeof setPermitHolderList !== "function") return;

    // ✅ FIX: Defensive check for valid index
    if (index < 0) {
      console.warn("Invalid index for removeHolder:", index);
      return;
    }

    setPermitHolderList((prevList) => {
      // ✅ FIX: Ensure prevList is array
      if (!Array.isArray(prevList)) {
        console.error("permitHolderList is not an array:", prevList);
        return [];
      }

      // ✅ FIX: Ensure index exists
      if (index >= prevList.length) {
        console.warn(`Index ${index} out of bounds for list length ${prevList.length}`);
        return prevList;
      }

      const holderToRemove = prevList[index];
      const newList = prevList.filter((_, i) => i !== index);
      console.log(`Removed permit holder "${holderToRemove}" at index ${index}. New length: ${newList.length}`, newList);
      return newList;
    });
  };
  const updateISAGInfo = (field: keyof ISAGInfo, value: string | boolean) => {
    setIsagInfo((prev) => {
      // ✅ FIX: Add null/undefined safety check
      const safePrev = prev || {
        isNA: false,
        permitHolder: "",
        isagNumber: "",
        dateOfIssuance: "",
        currentName: "",
        nameInECC: "",
        projectStatus: "",
        gpsX: "",
        gpsY: "",
        proponentName: "",
        proponentContact: "",
        proponentAddress: "",
        proponentPhone: "",
        proponentEmail: "",
      };
      return { ...safePrev, [field]: value };
    });
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
    // ✅ FIX: Add null/undefined safety check
    const updated = [...(eccAdditionalForms || [])];
    if (updated[index]) {
      updated[index] = { ...updated[index], [field]: value };
    } else {
      // If form doesn't exist, create a new one with default values
      updated[index] = { permitHolder: "", eccNumber: "", dateOfIssuance: "" };
      updated[index][field] = value;
    }
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
    // ✅ FIX: Add null/undefined safety check
    const updatedForms = [...(isagAdditionalForms || [])];
    if (updatedForms[index]) {
      updatedForms[index] = { ...updatedForms[index], [field]: value };
    } else {
      // If form doesn't exist, create a new one with default values
      updatedForms[index] = { permitHolder: "", isagNumber: "", dateOfIssuance: "" };
      updatedForms[index][field] = value;
    }
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
            <Ionicons name="people-circle" size={24} color="#02217C" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.sectionTitle}>
              Permit Holder List Management
            </Text>
            <Text style={styles.sectionSubtitle}>
              Add and view available permit holders for forms below.
            </Text>
          </View>
        </View>

        {/* Input Field to Add New Holder */}
      </View>
      <View style={[styles.fieldGroup, { marginTop: 15 }]}>
        <Text style={styles.label}>Add New Holder</Text>
        <View style={styles.inputWithButton}>
          <TextInput
            style={[styles.input, styles.flexInput]}
            value={newHolderName}
            onChangeText={setNewHolderName}
            placeholder="Type new permit holder name"
            placeholderTextColor="#94A3B8"
          />
          <TouchableOpacity
            style={styles.submitButton} // Re-using submitButton style
            onPress={() => {
              // 1. Pass the current state value (newHolderName) to the update function

              if (newHolderName.trim() === "") return; // Prevent adding empty names
              updatePermitHolderList(newHolderName);

              setNewHolderName("");
            }}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.holderListContainer}>
        {permitHolderList.length === 0 ? (
          <Text style={styles.emptyListText}>
            No permit holders added yet. Use the field above to add one.
          </Text>
        ) : (
          <ScrollView
            horizontal={true}
            contentContainerStyle={styles.holderScrollView}
          >
            {permitHolderList.map((holder, index) => (
              <TouchableOpacity
                key={`permit-holder-${holder}-${index}`}
                style={styles.holderBadge}
                onPress={() => handleRemoveHolder(index)}
              >
                <Text style={styles.holderText}>{holder}</Text>
                <Ionicons
                  name="close-circle"
                  size={16}
                  color="#DC2626"
                  style={styles.holderRemoveIcon}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.headerSection}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark" size={24} color="#02217C" />
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
            eccInfo?.isNA && styles.togglerButtonOpen,
          ]}
          onPress={() => {
            // ✅ FIX: Add null/undefined check before accessing isNA
            if (!eccInfo) return;
            updateECCInfo("isNA", !eccInfo.isNA);
          }}
          activeOpacity={0.7}
        >
          <View style={styles.sectionBadge}>
            <Ionicons name="shield-checkmark" size={18} color="#02217C" />
            <Text style={styles.sectionBadgeText}>ECC Section</Text>
          </View>
          <View
            style={[styles.checkbox, eccInfo?.isNA && styles.checkboxCheckedECC]}
          >
            {eccInfo?.isNA && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </View>
        </TouchableOpacity>

        {/* ECC Form */}
        {eccInfo && eccInfo.isNA && (
          <View style={styles.formContainer}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Name of Permit Holder</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={eccInfo?.permitHolder || ""}
                  onValueChange={(value: string | number) => {
                    updateECCInfo("permitHolder", String(value));
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
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>ECC Number</Text>
              <TextInput
                style={styles.input}
                value={eccInfo?.eccNumber || ""}
                onChangeText={(text) => updateECCInfo("eccNumber", text)}
                placeholder="Enter ECC number"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Date of Issuance</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowEccDatePicker(true)}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ color: eccInfo?.dateOfIssuance ? "#1E293B" : "#94A3B8" }}>
                    {eccInfo?.dateOfIssuance || "MM/DD/YYYY"}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#94A3B8" />
                </View>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={showEccDatePicker}
                mode="date"
                date={parseDateString(eccInfo?.dateOfIssuance) || new Date()}
                onConfirm={handleEccDateConfirm}
                onCancel={() => setShowEccDatePicker(false)}
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

            <TouchableOpacity style={styles.addButton} onPress={addECCForm}>
              <Ionicons name="add-circle" size={20} color="#02217C" />
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
                    {/* <TextInput
                      style={[styles.input, styles.flexInput]}
                      value={form.permitHolder}
                      onChangeText={(text) =>
                        updateEccAdditionalForm(index, "permitHolder", text)
                      }
                      placeholder="Enter permit holder name"
                      placeholderTextColor="#94A3B8"
                    /> */}

                    <Picker
                      selectedValue={form?.permitHolder || ""}
                      onValueChange={(value: string | number) => {
                        updateEccAdditionalForm(
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
                    <TouchableOpacity style={styles.submitButton}>
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>ECC Number</Text>
                  <TextInput
                    style={styles.input}
                    value={form?.eccNumber || ""}
                    onChangeText={(text) =>
                      updateEccAdditionalForm(index, "eccNumber", text)
                    }
                    placeholder="Enter ECC number"
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Date of Issuance</Text>
                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowEccAdditionalDatePicker(index)}
                    activeOpacity={0.7}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <Text style={{ color: form?.dateOfIssuance ? "#1E293B" : "#94A3B8" }}>
                        {form?.dateOfIssuance || "MM/DD/YYYY"}
                      </Text>
                      <Ionicons name="calendar-outline" size={20} color="#94A3B8" />
                    </View>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={showEccAdditionalDatePicker === index}
                    mode="date"
                    date={parseDateString(form?.dateOfIssuance) || new Date()}
                    onConfirm={(selectedDate) => handleEccAdditionalDateConfirm(selectedDate, index)}
                    onCancel={() => setShowEccAdditionalDatePicker(null)}
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
        )}

        {/* ISAG Toggler */}
        <TouchableOpacity
          style={[
            styles.togglerButton,
            styles.isagToggler,
            isagInfo?.isNA && styles.togglerButtonOpen,
          ]}
          onPress={() => {
            // ✅ FIX: Add null/undefined check before accessing isNA
            if (!isagInfo) return;
            updateISAGInfo("isNA", !isagInfo.isNA);
          }}
          activeOpacity={0.7}
        >
          <View style={styles.sectionBadge}>
            <Ionicons name="document-text" size={18} color="#02217C" />
            <Text style={[styles.sectionBadgeText, styles.isagBadge]}>
              ISAG/MPP Section
            </Text>
          </View>
          <View
            style={[
              styles.checkbox,
              isagInfo?.isNA && styles.checkboxCheckedISAG,
            ]}
          >
            {isagInfo?.isNA && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </View>
        </TouchableOpacity>

        {/* ISAG Form */}
        {isagInfo && isagInfo.isNA && (
          <View style={styles.formContainerISAG}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Name of Permit Holder</Text>
              <View style={styles.inputWithButton}>
                {/* <TextInput
                  style={[styles.input, styles.flexInput]}
                  value={isagInfo.permitHolder}
                  onChangeText={(text) => updateISAGInfo("permitHolder", text)}
                  placeholder="Enter permit holder name"
                  placeholderTextColor="#9CA3AF"
                /> */}

                <Picker
                  selectedValue={isagInfo?.permitHolder || ""}
                  onValueChange={(value: string | number) => {
                    updateISAGInfo("permitHolder", String(value));
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
                <TouchableOpacity style={styles.submitButtonISAG}>
                  <Ionicons name="checkmark-circle" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>ISAG Permit Number</Text>
              <TextInput
                style={styles.input}
                value={isagInfo?.isagNumber || ""}
                onChangeText={(text) => updateISAGInfo("isagNumber", text)}
                placeholder="Enter permit number"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Date of Issuance</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowIsagDatePicker(true)}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ color: isagInfo?.dateOfIssuance ? "#1E293B" : "#9CA3AF" }}>
                    {isagInfo?.dateOfIssuance || "MM/DD/YYYY"}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={showIsagDatePicker}
                mode="date"
                date={parseDateString(isagInfo?.dateOfIssuance) || new Date()}
                onConfirm={handleIsagDateConfirm}
                onCancel={() => setShowIsagDatePicker(false)}
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
              style={styles.addButtonISAG}
              onPress={addISAGForm}
            >
              <Ionicons name="add-circle-outline" size={20} color="#02217C" />
              <Text style={styles.addButtonTextISAG}>
                Add More Permit Holders
              </Text>
            </TouchableOpacity>

            {isagAdditionalForms.map((form, index) => (
              <View key={index} style={styles.additionalFormISAG}>
                <View style={styles.additionalFormHeader}>
                  <View style={styles.badgeContainer}>
                    <View style={styles.badgeISAG}>
                      <Text style={styles.badgeText}>#{index + 2}</Text>
                    </View>
                    <Text
                      style={[styles.additionalFormTitle, styles.isagTitle]}
                    >
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
                    {/* <TextInput
                      style={[styles.input, styles.flexInput]}
                      value={form.permitHolder}
                      onChangeText={(text) =>
                        updateIsagAdditionalForm(index, "permitHolder", text)
                      }
                      placeholder="Enter permit holder name"
                      placeholderTextColor="#9CA3AF"
                    /> */}

                    <Picker
                      selectedValue={form?.permitHolder || ""}
                      onValueChange={(value: string | number) => {
                        updateIsagAdditionalForm(
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
                    <TouchableOpacity style={styles.submitButtonISAG}>
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>ISAG Permit Number</Text>
                  <TextInput
                    style={styles.input}
                    value={form?.isagNumber || ""}
                    onChangeText={(text) =>
                      updateIsagAdditionalForm(index, "isagNumber", text)
                    }
                    placeholder="Enter permit number"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Date of Issuance</Text>
                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowIsagAdditionalDatePicker(index)}
                    activeOpacity={0.7}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <Text style={{ color: form?.dateOfIssuance ? "#1E293B" : "#9CA3AF" }}>
                        {form?.dateOfIssuance || "MM/DD/YYYY"}
                      </Text>
                      <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
                    </View>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={showIsagAdditionalDatePicker === index}
                    mode="date"
                    date={parseDateString(form?.dateOfIssuance) || new Date()}
                    onConfirm={(selectedDate) => handleIsagAdditionalDateConfirm(selectedDate, index)}
                    onCancel={() => setShowIsagAdditionalDatePicker(null)}
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
        )}

        {/* Project Information Section - Always visible, independent of ISAG/MPP */}
        <View style={styles.formContainerISAG}>
          <View style={styles.divider} />

          <View style={styles.subsectionHeader}>
            <Ionicons name="business-outline" size={18} color="#6B7280" />
            <Text style={styles.subsectionTitle}>Project Information</Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Project Current Name</Text>
            <TextInput
              style={styles.input}
              value={isagInfo?.currentName || ""}
              onChangeText={(text) => updateISAGInfo("currentName", text)}
              placeholder="Enter current project name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Project Status</Text>
            <TextInput
              style={styles.input}
              value={isagInfo?.projectStatus || ""}
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
                  value={isagInfo?.gpsX || ""}
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
                  value={isagInfo?.gpsY || ""}
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
              value={isagInfo?.proponentName || ""}
              onChangeText={(text) => updateISAGInfo("proponentName", text)}
              placeholder="Enter proponent name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Contact Person & Position</Text>
            <TextInput
              style={styles.input}
              value={isagInfo?.proponentContact || ""}
              onChangeText={(text) =>
                updateISAGInfo("proponentContact", text)
              }
              placeholder="Enter contact person and position"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Mailing Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={isagInfo?.proponentAddress || ""}
              onChangeText={(text) =>
                updateISAGInfo("proponentAddress", text)
              }
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
              value={isagInfo?.proponentPhone || ""}
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
              value={isagInfo?.proponentEmail || ""}
              onChangeText={(text) => updateISAGInfo("proponentEmail", text)}
              placeholder="email@domain.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default CombinedECCISAGSection;
