import React, {useState} from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/epep.styles";
import type {
  EPEPInfo,
  EPEPAdditionalForm,
  EPEPSectionProps,
} from "../types/epep.types";
import { Picker } from "@react-native-picker/picker";

const EPEPSection: React.FC<EPEPSectionProps> = ({
  epepInfo,
  setEpepInfo,
  epepAdditionalForms,
  setEpepAdditionalForms,
  permitHolderList,
  setPermitHolderList
}) => {
  const updateEPEPInfo = (field: keyof EPEPInfo, value: string | boolean) => {
    setEpepInfo((prev) => ({ ...prev, [field]: value }));
  };

    const [newHolderName, setNewHolderName] = useState('');
  

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
          <Text style={styles.sectionSubtitle}>Environmental Protection Plan</Text>
        </View>
        <TouchableOpacity
          style={styles.naButton}
          onPress={() => updateEPEPInfo("isNA", !epepInfo.isNA)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, epepInfo.isNA && styles.checkboxChecked]}>
            {epepInfo.isNA && <Ionicons name="checkmark" size={16} color="white" />}
          </View>
          <Text style={styles.naLabel}>N/A</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.formContent, epepInfo.isNA && styles.disabledContent]}>
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
                selectedValue={epepInfo.permitHolder}
                onValueChange={(value) => {
                  updateEPEPInfo("permitHolder", value);
                }}
                
                // 🟢 Apply explicit input styles here for size/font
                style={styles.pickerInput} 
                dropdownIconColor="#0F172A"
              >
                <Picker.Item label="Select Permit Holder..." value="" enabled={false} />
                {permitHolderList.map((holder, index) => (
                  <Picker.Item 
                    key={index} 
                    label={holder} 
                    value={holder} 
                  />
                ))}
              </Picker>
            
            <TouchableOpacity
              style={[styles.submitButton, epepInfo.isNA && styles.disabledButton]}
              disabled={epepInfo.isNA}
            >
              <Ionicons name="checkmark-circle" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>EPEP Number</Text>
          <TextInput
            style={styles.input}
            value={epepInfo.epepNumber}
            onChangeText={(text) => updateEPEPInfo("epepNumber", text)}
            placeholder="Enter EPEP number"
            placeholderTextColor="#94A3B8"
            editable={!epepInfo.isNA}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Date of Approval</Text>
          <TextInput
            style={styles.input}
            value={epepInfo.dateOfApproval}
            onChangeText={(text) => updateEPEPInfo("dateOfApproval", text)}
            placeholder="MM/DD/YYYY"
            placeholderTextColor="#94A3B8"
            editable={!epepInfo.isNA}
          />
        </View>

        <TouchableOpacity
          style={[styles.addButton, epepInfo.isNA && styles.disabledButton]}
          onPress={addEPEPForm}
          disabled={epepInfo.isNA}
        >
          <Ionicons name="add-circle" size={20} color={epepInfo.isNA ? "#94A3B8" : "#1E40AF"} />
          <Text style={[styles.addButtonText, epepInfo.isNA && styles.disabledText]}>
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
                <Text style={styles.additionalFormTitle}>EPEP/FMRDP Permit</Text>
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
                selectedValue={form.permitHolder}
                onValueChange={(value) => {
                  updateEpepAdditionalForm(index,"permitHolder", value);
                }}
                
                // 🟢 Apply explicit input styles here for size/font
                style={styles.pickerInput} 
                dropdownIconColor="#0F172A"
              >
                <Picker.Item label="Select Permit Holder..." value="" enabled={false} />
                {permitHolderList.map((holder, index) => (
                  <Picker.Item 
                    key={index} 
                    label={holder} 
                    value={holder} 
                  />
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
                value={form.epepNumber}
                onChangeText={(text) =>
                  updateEpepAdditionalForm(index, "epepNumber", text)
                }
                placeholder="Enter EPEP number"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Date of Approval</Text>
              <TextInput
                style={styles.input}
                value={form.dateOfApproval}
                onChangeText={(text) =>
                  updateEpepAdditionalForm(index, "dateOfApproval", text)
                }
                placeholder="MM/DD/YYYY"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default EPEPSection;