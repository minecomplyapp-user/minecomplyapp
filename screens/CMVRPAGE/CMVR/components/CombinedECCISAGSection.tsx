import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/combinedECCISAG.styles";
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
            <Ionicons name="shield-checkmark" size={24} color='#02217C' />
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
            <Ionicons name="shield-checkmark" size={18} color='#02217C' />
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
              <Ionicons name="add-circle" size={20} color='#02217C' />
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
            <Ionicons name="document-text" size={18} color='#02217C' />
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
              <Ionicons name="add-circle-outline" size={20} color='#02217C' />
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

export default CombinedECCISAGSection;