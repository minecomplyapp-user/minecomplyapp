import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/epep.styles";
import type {
  EPEPInfo,
  EPEPAdditionalForm,
  EPEPSectionProps,
} from "../types/epep.types";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const EPEPSection: React.FC<EPEPSectionProps> = ({
  epepInfo,
  setEpepInfo,
  epepAdditionalForms,
  setEpepAdditionalForms,
  permitHolderList,
  setPermitHolderList,
}) => {
  const updateEPEPInfo = (field: keyof EPEPInfo, value: string | boolean) => {
    setEpepInfo((prev) => {
      // ✅ FIX: Add null/undefined safety check
      const safePrev = prev || { isNA: false, permitHolder: "", epepNumber: "", dateOfApproval: "" };
      return { ...safePrev, [field]: value };
    });
  };

  const [newHolderName, setNewHolderName] = useState("");
  
  // ✅ NEW: Date picker states
  const [showEpepDatePicker, setShowEpepDatePicker] = useState(false);
  const [showEpepAdditionalDatePicker, setShowEpepAdditionalDatePicker] = useState<number | null>(null);
  
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
  
  const handleEpepDateConfirm = (selectedDate: Date) => {
    setShowEpepDatePicker(false);
    updateEPEPInfo("dateOfApproval", formatDateToString(selectedDate));
  };
  
  const handleEpepAdditionalDateConfirm = (selectedDate: Date, index: number) => {
    setShowEpepAdditionalDatePicker(null);
    updateEpepAdditionalForm(index, "dateOfApproval", formatDateToString(selectedDate));
  };

  const addEPEPForm = () => {
    setEpepAdditionalForms([
      ...epepAdditionalForms,
      { permitHolder: "", epepNumber: "", dateOfApproval: "" },
    ]);
  };

  const updateEpepAdditionalForm = (
    index: number,
    field: keyof EPEPAdditionalForm,
    value: string
  ) => {
    const updatedForms = [...epepAdditionalForms];
    updatedForms[index] = { ...updatedForms[index], [field]: value };
    setEpepAdditionalForms(updatedForms);
  };

  const removeEpepAdditionalForm = (index: number) => {
    setEpepAdditionalForms(epepAdditionalForms.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.iconContainer}>
          <Ionicons name="leaf" size={24} color="#1E40AF" />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.sectionTitle}>EPEP / FMRDP</Text>
          <Text style={styles.sectionSubtitle}>
            Environmental Protection Plan
          </Text>
        </View>
        <TouchableOpacity
          style={styles.naButton}
          onPress={() => {
            // ✅ FIX: Add null/undefined check before accessing isNA
            if (!epepInfo) return;
            updateEPEPInfo("isNA", !epepInfo.isNA);
          }}
          activeOpacity={0.7}
        >
          <View
            style={[styles.checkbox, epepInfo?.isNA && styles.checkboxChecked]}
          >
            {epepInfo?.isNA && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </View>
          <Text style={styles.naLabel}>N/A</Text>
        </TouchableOpacity>
      </View>

      <View
        style={[styles.formContent, epepInfo?.isNA && styles.disabledContent]}
      >
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Name of Permit Holder</Text>
          <View style={styles.inputWithButton}>
            {/* <TextInput
              style={[styles.input, styles.flexInput]}
              value={epepInfo.permitHolder}
              onChangeText={(text) => updateEPEPInfo("permitHolder", text)}
              placeholder="Enter permit holder name"
              placeholderTextColor="#94A3B8"
              editable={!epepInfo.isNA}
            /> */}

            <Picker
              selectedValue={epepInfo?.permitHolder || ""}
              onValueChange={(value: string | number) => {
                updateEPEPInfo("permitHolder", String(value));
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
                epepInfo?.isNA && styles.disabledButton,
              ]}
              disabled={epepInfo?.isNA}
            >
              <Ionicons name="checkmark-circle" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>EPEP Number</Text>
          <TextInput
            style={styles.input}
            value={epepInfo?.epepNumber || ""}
            onChangeText={(text) => updateEPEPInfo("epepNumber", text)}
            placeholder="Enter EPEP number"
            placeholderTextColor="#94A3B8"
            editable={!epepInfo?.isNA}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Date of Approval</Text>
          <TouchableOpacity
            style={[styles.input, epepInfo?.isNA && { opacity: 0.5 }]}
            onPress={() => !epepInfo?.isNA && setShowEpepDatePicker(true)}
            activeOpacity={0.7}
            disabled={epepInfo?.isNA}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ color: epepInfo?.dateOfApproval ? "#1E293B" : "#94A3B8" }}>
                {epepInfo?.dateOfApproval || "MM/DD/YYYY"}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#94A3B8" />
            </View>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={showEpepDatePicker}
            mode="date"
            date={parseDateString(epepInfo?.dateOfApproval) || new Date()}
            onConfirm={handleEpepDateConfirm}
            onCancel={() => setShowEpepDatePicker(false)}
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
          style={[styles.addButton, epepInfo?.isNA && styles.disabledButton]}
          onPress={addEPEPForm}
          disabled={epepInfo?.isNA}
        >
          <Ionicons
            name="add-circle"
            size={20}
            color={epepInfo?.isNA ? "#94A3B8" : "#1E40AF"}
          />
          <Text
            style={[styles.addButtonText, epepInfo?.isNA && styles.disabledText]}
          >
            Add More Permit Holders
          </Text>
        </TouchableOpacity>

        {epepAdditionalForms.map((form, index) => (
          <View key={index} style={styles.additionalForm}>
            <View style={styles.additionalFormHeader}>
              <View style={styles.badgeContainer}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>#{index + 2}</Text>
                </View>
                <Text style={styles.additionalFormTitle}>
                  EPEP/FMRDP Permit
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => removeEpepAdditionalForm(index)}
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
                    updateEpepAdditionalForm(index, "permitHolder", text)
                  }
                  placeholder="Enter permit holder name"
                  placeholderTextColor="#94A3B8"
                /> */}

                <Picker
                  selectedValue={form?.permitHolder || ""}
                  onValueChange={(value: string | number) => {
                    updateEpepAdditionalForm(
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
                    <Picker.Item key={index} label={holder} value={holder} />
                  ))}
                </Picker>

                <TouchableOpacity style={styles.submitButton}>
                  <Ionicons name="checkmark-circle" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>EPEP Number</Text>
              <TextInput
                style={styles.input}
                value={form?.epepNumber || ""}
                onChangeText={(text) =>
                  updateEpepAdditionalForm(index, "epepNumber", text)
                }
                placeholder="Enter EPEP number"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Date of Approval</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowEpepAdditionalDatePicker(index)}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ color: form?.dateOfApproval ? "#1E293B" : "#94A3B8" }}>
                    {form?.dateOfApproval || "MM/DD/YYYY"}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#94A3B8" />
                </View>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={showEpepAdditionalDatePicker === index}
                mode="date"
                date={parseDateString(form?.dateOfApproval) || new Date()}
                onConfirm={(selectedDate) => handleEpepAdditionalDateConfirm(selectedDate, index)}
                onCancel={() => setShowEpepAdditionalDatePicker(null)}
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
  );
};

export default EPEPSection;
