import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { DEFAULT_CONDITIONS, COMPLIANCE_CONDITIONS } from '../../utils/eccDefaultConditions';
import { styles } from '../../styles/eccMonitoringScreen';
import { CustomHeader } from '../../components/CustomHeader';
import { Condition, PermitHolder, ECCFormData, ShowDatePickerState, EditingCondition } from '../../types/eccTypes';

export default function ECCMonitoringReport() {
  const [fileName, setFileName] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, any>>({});

  const handleSetFileName = (text: string) => {
    setFileName(text);
    if ((errors as any).fileName) {
      setErrors((prev: any) => ({ ...prev, fileName: false }));
    }
  };

  const handleSave = () => {
    // Default save action for header Save button: save as draft
    saveAsDraft();
  };
  const [formData, setFormData] = useState<ECCFormData>({
    companyName: '',
    location: '',
    gpsLocation: null,
    status: 'Active',
    date: new Date(),
    permitType: 'ECC',
    eccPermitHolder: '',
    eccNumber: '',
    eccIssuanceDate: new Date(),
    isagPermitHolder: '',
    isagNumber: '',
    isagIssuanceDate: new Date(),
    contactPerson: '',
    position: '',
    mailingAddress: '',
    telephoneNo: '',
    faxNo: '',
    emailAddress: ''
  });

  const [showDatePicker, setShowDatePicker] = useState<ShowDatePickerState>({ show: false, field: null });
  const [monitoringDataExpanded, setMonitoringDataExpanded] = useState(true);
  const [complianceExpanded, setComplianceExpanded] = useState(true);
  const [editingCondition, setEditingCondition] = useState<EditingCondition>(null);

  const [monitoringConditions, setMonitoringConditions] = useState<Condition[]>(
    DEFAULT_CONDITIONS.map((c: Condition) => ({ ...c, selected: null })) as Condition[]
  );

  const [complianceConditions, setComplianceConditions] = useState<Condition[]>(
    COMPLIANCE_CONDITIONS.map((c: Condition) => ({ ...c, selected: null })) as Condition[]
  );

  const [customConditions, setCustomConditions] = useState<Condition[]>([]);
  const [generalRemarks, setGeneralRemarks] = useState<string[]>(['']);
  const [additionalPermitHolders, setAdditionalPermitHolders] = useState<PermitHolder[]>([]);
  const [holderExpandedStates, setHolderExpandedStates] = useState<Record<string, boolean>>({});
  const [recommendations, setRecommendations] = useState<string[]>(['']);

  const updateFormData = (field: keyof ECCFormData | string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value } as ECCFormData));
  };

  const captureGPS = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to capture GPS coordinates.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const gps = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };
      updateFormData('gpsLocation', gps);
      Alert.alert('GPS Captured', `Lat: ${gps.latitude.toFixed(6)}, Lon: ${gps.longitude.toFixed(6)}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to capture GPS location');
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date | undefined) => {
    setShowDatePicker({ show: false, field: null });
    if (selectedDate) {
      updateFormData(showDatePicker.field as string, selectedDate);
    }
  };

  const updateConditionSelection = (section: string, id: string | number, value: string) => {
    if (section === 'monitoring') {
      setMonitoringConditions(prev =>
        prev.map((c: Condition) => c.id === id ? { ...c, selected: value } : c)
      );
    } else if (section === 'compliance') {
      setComplianceConditions(prev =>
        prev.map((c: Condition) => c.id === id ? { ...c, selected: value } : c)
      );
    } else if (section === 'custom') {
      setCustomConditions(prev =>
        prev.map((c: Condition) => c.id === id ? { ...c, selected: value } : c)
      );
    } else if (section === 'holderMonitoring' || section === 'holderCompliance' || section === 'holderCustom') {
      // Handled in updatePermitHolderCondition
      return;
    }
  };

  const updateConditionField = (section: string, conditionId: string | number, field: string, value: any) => {
    if (section === 'monitoring') {
      setMonitoringConditions(prev =>
        prev.map((c: Condition) => c.id === conditionId ? { ...c, [field]: value } : c)
      );
    } else if (section === 'compliance') {
      setComplianceConditions(prev =>
        prev.map((c: Condition) => c.id === conditionId ? { ...c, [field]: value } : c)
      );
    } else if (section === 'custom') {
      setCustomConditions(prev =>
        prev.map((c: Condition) => c.id === conditionId ? { ...c, [field]: value } : c)
      );
    } else if (section === 'holderMonitoring' || section === 'holderCompliance' || section === 'holderCustom') {
      // Handled in updatePermitHolderConditionField
      return;
    }
  };

  const updateConditionOption = (section: string, conditionId: string | number, optionValue: string, field: string, value: any) => {
    if (section === 'monitoring') {
      setMonitoringConditions(prev =>
        prev.map((c: Condition) => c.id === conditionId ? {
          ...c,
          options: c.options.map(opt => opt.value === optionValue ? { ...opt, [field]: value } : opt)
        } : c)
      );
    } else if (section === 'compliance') {
      setComplianceConditions(prev =>
        prev.map((c: Condition) => c.id === conditionId ? {
          ...c,
          options: c.options.map(opt => opt.value === optionValue ? { ...opt, [field]: value } : opt)
        } : c)
      );
    } else if (section === 'custom') {
      setCustomConditions(prev =>
        prev.map((c: Condition) => c.id === conditionId ? {
          ...c,
          options: c.options.map(opt => opt.value === optionValue ? { ...opt, [field]: value } : opt)
        } : c)
      );
    } else if (section === 'holderMonitoring' || section === 'holderCompliance' || section === 'holderCustom') {
      // Handled in updatePermitHolderConditionOption
      return;
    }
  };

  const addCustomCondition = (): void => {
    const newId = `custom_${Date.now()}`;
    setCustomConditions(prev => [...prev, {
      id: newId,
      title: '',
      options: [
        { value: 'complied', label: 'Complied', remark: '', color: '#10b981' },
        { value: 'partial', label: 'Partially Complied', remark: '', color: '#f59e0b' },
        { value: 'not', label: 'Not Complied', remark: '', color: '#ef4444' }
      ],
      selected: null
    }]);
    setEditingCondition({ section: 'custom', id: newId });
  };

  const deleteCustomCondition = (id: string | number): void => {
    setCustomConditions(prev => prev.filter(c => c.id !== id));
    if (editingCondition?.id === id) {
      setEditingCondition(null);
    }
  };

  const addRemark = (): void => {
    setGeneralRemarks(prev => [...prev, '']);
  };

  const updateRemark = (index: number, value: string): void => {
    setGeneralRemarks(prev => prev.map((r, i) => i === index ? value : r));
  };

  const deleteRemark = (index: number): void => {
    if (generalRemarks.length > 1) {
      setGeneralRemarks(prev => prev.filter((_, i) => i !== index));
    }
  };

  const addPermitHolder = (type: string): void => {
    const monitoringConds = JSON.parse(JSON.stringify(monitoringConditions));
    const complianceConds = JSON.parse(JSON.stringify(complianceConditions));
    
    const newId = `holder_${Date.now()}`;
    setAdditionalPermitHolders(prev => [...prev, {
      id: newId,
      type,
      name: '',
      monitoringConditions: monitoringConds.map((c: Condition) => ({ ...c, selected: null })),
      complianceConditions: complianceConds.map((c: Condition) => ({ ...c, selected: null })),
      customConditions: []
    }]);
    
    // Set the new holder as expanded by default
    setHolderExpandedStates(prev => ({ ...prev, [newId]: true }));
  };

  const deletePermitHolder = (id: string): void => {
    setAdditionalPermitHolders(prev => prev.filter(h => h.id !== id));
    setHolderExpandedStates(prev => {
      const newStates = { ...prev };
      delete newStates[id];
      return newStates;
    });
  };

  const updatePermitHolderName = (id: string, name: string): void => {
    setAdditionalPermitHolders(prev =>
      prev.map(h => h.id === id ? { ...h, name } : h)
    );
  };

  const updatePermitHolderCondition = (holderId: string, section: string, conditionId: string | number, value: string): void => {
    setAdditionalPermitHolders(prev =>
      prev.map(h => h.id === holderId ? {
        ...h,
        [section]: (h as any)[section].map((c: Condition) => c.id === conditionId ? { ...c, selected: value } : c)
      } : h)
    );
  };

  const updatePermitHolderConditionField = (holderId: string, section: string, conditionId: string | number, field: string, value: any): void => {
    setAdditionalPermitHolders(prev =>
      prev.map(h => h.id === holderId ? {
        ...h,
        [section]: (h as any)[section].map((c: Condition) => c.id === conditionId ? { ...c, [field]: value } : c)
      } : h)
    );
  };

  const updatePermitHolderConditionOption = (holderId: string, section: string, conditionId: string | number, optionValue: string, field: string, value: any): void => {
    setAdditionalPermitHolders(prev =>
      prev.map(h => h.id === holderId ? {
        ...h,
        [section]: (h as any)[section].map((c: Condition) => c.id === conditionId ? {
          ...c,
          options: c.options.map(opt => opt.value === optionValue ? { ...opt, [field]: value } : opt)
        } : c)
      } : h)
    );
  };

  const addPermitHolderCustomCondition = (holderId: string): void => {
    const newId = `custom_${Date.now()}`;
    setAdditionalPermitHolders(prev =>
      prev.map(h => h.id === holderId ? {
        ...h,
        customConditions: [...h.customConditions, {
          id: newId,
          title: '',
          options: [
            { value: 'complied', label: 'Complied', remark: '', color: '#10b981' },
            { value: 'partial', label: 'Partially Complied', remark: '', color: '#f59e0b' },
            { value: 'not', label: 'Not Complied', remark: '', color: '#ef4444' }
          ],
          selected: null
        }]
      } : h)
    );
    setEditingCondition({ section: 'holderCustom', id: newId, holderId });
  };

  const deletePermitHolderCustomCondition = (holderId: string | null, conditionId: string | number): void => {
    setAdditionalPermitHolders(prev =>
      prev.map(h => h.id === holderId ? {
        ...h,
        customConditions: h.customConditions.filter((c: Condition) => c.id !== conditionId)
      } : h)
    );
  };

  const addRecommendation = (): void => {
    setRecommendations(prev => [...prev, '']);
  };

  const updateRecommendation = (index: number, value: string): void => {
    setRecommendations(prev => prev.map((r, i) => i === index ? value : r));
  };

  const deleteRecommendation = (index: number): void => {
    if (recommendations.length > 1) {
      setRecommendations(prev => prev.filter((_, i) => i !== index));
    }
  };

  const saveAsDraft = () => {
    Alert.alert('Draft Saved', 'Your report has been saved as draft');
  };

  const generateReport = () => {
    Alert.alert('Report Generated', 'ECC Compliance Monitoring Report has been generated');
  };

  const renderEditableCondition = (
    condition: Condition,
    section: string,
    holderId: string | null = null,
    sectionName: string | null = null
  ): React.ReactElement => {
    const isEditing = editingCondition?.section === section && 
                     editingCondition?.id === condition.id &&
                     editingCondition?.holderId === holderId;
    
    return (
      <View key={condition.id} style={styles.conditionContainer}>
        <View style={styles.conditionHeader}>
          <View style={{ flex: 1 }}>
            {isEditing ? (
                <TextInput
                style={[styles.input, styles.conditionTitleInput]}
                value={condition.title}
                onChangeText={(value) => {
                  if (holderId && sectionName) {
                    updatePermitHolderConditionField(holderId, sectionName, condition.id, 'title', value);
                  } else {
                    updateConditionField(section, condition.id, 'title', value);
                  }
                }}
                placeholder="Condition Title"
              />
            ) : (
              <Text style={styles.conditionTitle}>
                Condition {condition.id}: {condition.title}
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={() => {
              if (isEditing) {
                setEditingCondition(null);
              } else {
                setEditingCondition({ section, id: condition.id, holderId });
              }
            }}
            style={styles.editButton}
          >
            <Ionicons name={isEditing ? "checkmark-circle" : "create-outline"} size={24} color="#3b82f6" />
          </TouchableOpacity>
          {(section === 'custom' || section === 'holderCustom') && (
            <TouchableOpacity onPress={() => {
              if (section === 'custom') {
                deleteCustomCondition(condition.id);
              } else if (section === 'holderCustom') {
                deletePermitHolderCustomCondition(holderId, condition.id);
              }
            }} style={{ marginLeft: 8 }}>
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          )}
        </View>

        {condition.options.map((option) => (
          <View key={option.value}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                condition.selected === option.value && { backgroundColor: option.color + '20', borderColor: option.color }
              ]}
              onPress={() => {
                if (holderId && sectionName) {
                  updatePermitHolderCondition(holderId, sectionName, condition.id, option.value);
                } else {
                  updateConditionSelection(section, condition.id, option.value);
                }
              }}
            >
              <View style={[
                styles.radioCircle,
                condition.selected === option.value && { backgroundColor: option.color, borderColor: option.color }
              ]}>
                {condition.selected === option.value && <View style={styles.radioInner} />}
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionLabel, condition.selected === option.value && { color: option.color, fontWeight: '600' }]}>
                  {option.label}
                </Text>
                {!isEditing && <Text style={styles.optionRemark}>{option.remark}</Text>}
              </View>
            </TouchableOpacity>
            
            {isEditing && (
              <View style={styles.editableRemarkContainer}>
                <TextInput
                  style={[styles.input, styles.remarkEditInput]}
                  value={option.remark}
                  onChangeText={(value) => {
                    if (holderId && sectionName) {
                      updatePermitHolderConditionOption(holderId, sectionName, condition.id, option.value, 'remark', value);
                    } else {
                      updateConditionOption(section, condition.id, option.value, 'remark', value);
                    }
                  }}
                  placeholder={`${option.label} description`}
                  multiline
                />
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <CustomHeader onSave={handleSave} showSave />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ECC Monitoring Report</Text>
        <Text style={styles.headerSubtitle}>Fill out details below.</Text>
      </View>

      {/* File Name */}
      <View style={styles.topInputsContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>File Name</Text>
          <TextInput
            placeholder="Enter file name"
            value={fileName}
            onChangeText={handleSetFileName}
            style={[
              styles.input,
              fileName && styles.inputFilled,
              (errors as any).fileName && styles.inputError,
            ]}
            placeholderTextColor="#C0C0C0"
          />
          {(errors as any).fileName && <Text style={styles.errorText}>File Name is required</Text>}
        </View>
      </View>

      {/* General Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General Information</Text>
        
        <Text style={styles.label}>Company Name:</Text>
        <TextInput
          style={styles.input}
          value={formData.companyName}
          onChangeText={(value) => updateFormData('companyName', value)}
          placeholder="Enter company name"
        />

        <Text style={styles.label}>Location:</Text>
        <TextInput
          style={styles.input}
          value={formData.location}
          onChangeText={(value) => updateFormData('location', value)}
          placeholder="Enter location"
        />

        <TouchableOpacity style={styles.gpsButton} onPress={captureGPS}>
          <Ionicons name="location" size={20} color="#fff" />
          <Text style={styles.gpsButtonText}>Capture GPS Location</Text>
        </TouchableOpacity>
        {formData.gpsLocation && (
          <Text style={styles.gpsText}>
            GPS: {formData.gpsLocation.latitude.toFixed(6)}, {formData.gpsLocation.longitude.toFixed(6)}
          </Text>
        )}

        <Text style={styles.label}>Status:</Text>
        <View style={styles.radioGroup}>
          {['Active', 'Inactive', 'Other'].map((status) => (
            <TouchableOpacity
              key={status}
              style={styles.radioButtonContainer}
              onPress={() => updateFormData('status', status)}
            >
              <View style={[
                styles.radioButton,
                formData.status === status && styles.radioButtonSelected
              ]}>
                {formData.status === status && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={styles.radioButtonLabel}>{status}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Date:</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker({ show: true, field: 'date' })}
        >
          <Text>{formData.date.toLocaleDateString()}</Text>
          <Ionicons name="calendar-outline" size={20} color="#666" />
        </TouchableOpacity>

        <View style={styles.permitSection}>
          <View style={styles.checkboxRow}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => updateFormData('permitType', 'ECC')}
            >
              <View style={[styles.checkboxBox, formData.permitType === 'ECC' && styles.checkboxBoxChecked]}>
                {formData.permitType === 'ECC' && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
              <Text style={styles.checkboxLabel}>ECC</Text>
            </TouchableOpacity>
          </View>

          {formData.permitType === 'ECC' && (
            <View style={styles.permitDetails}>
              <Text style={styles.label}>Name of Permit Holder:</Text>
              <TextInput
                style={styles.input}
                value={formData.eccPermitHolder}
                onChangeText={(value) => updateFormData('eccPermitHolder', value)}
                placeholder="Enter permit holder name"
              />

              <Text style={styles.label}>ECC Number:</Text>
              <TextInput
                style={styles.input}
                value={formData.eccNumber}
                onChangeText={(value) => updateFormData('eccNumber', value)}
                placeholder="Enter ECC number"
              />

              <Text style={styles.label}>Date of Issuance:</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker({ show: true, field: 'eccIssuanceDate' })}
              >
                <Text>{formData.eccIssuanceDate.toLocaleDateString()}</Text>
                <Ionicons name="calendar-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.checkboxRow}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => updateFormData('permitType', 'ISAG')}
            >
              <View style={[styles.checkboxBox, formData.permitType === 'ISAG' && styles.checkboxBoxChecked]}>
                {formData.permitType === 'ISAG' && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
              <Text style={styles.checkboxLabel}>ISAG</Text>
            </TouchableOpacity>
          </View>

          {formData.permitType === 'ISAG' && (
            <View style={styles.permitDetails}>
              <Text style={styles.label}>Name of Permit Holder:</Text>
              <TextInput
                style={styles.input}
                value={formData.isagPermitHolder}
                onChangeText={(value) => updateFormData('isagPermitHolder', value)}
                placeholder="Enter permit holder name"
              />

              <Text style={styles.label}>ISAG Permit Number:</Text>
              <TextInput
                style={styles.input}
                value={formData.isagNumber}
                onChangeText={(value) => updateFormData('isagNumber', value)}
                placeholder="Enter ISAG number"
              />

              <Text style={styles.label}>Date of Issuance:</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker({ show: true, field: 'isagIssuanceDate' })}
              >
                <Text>{formData.isagIssuanceDate.toLocaleDateString()}</Text>
                <Ionicons name="calendar-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Multipartite Monitoring Team */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Multipartite Monitoring Team</Text>
        
        <Text style={styles.label}>Contact Person:</Text>
        <TextInput
          style={styles.input}
          value={formData.contactPerson}
          onChangeText={(value) => updateFormData('contactPerson', value)}
          placeholder="Enter contact person"
        />

        <Text style={styles.label}>Position:</Text>
        <TextInput
          style={styles.input}
          value={formData.position}
          onChangeText={(value) => updateFormData('position', value)}
          placeholder="Enter position"
        />

        <Text style={styles.label}>Mailing Address:</Text>
        <TextInput
          style={styles.input}
          value={formData.mailingAddress}
          onChangeText={(value) => updateFormData('mailingAddress', value)}
          placeholder="Enter mailing address"
          multiline
        />

        <Text style={styles.label}>Telephone No.:</Text>
        <TextInput
          style={styles.input}
          value={formData.telephoneNo}
          onChangeText={(value) => updateFormData('telephoneNo', value)}
          placeholder="Enter telephone number"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Fax No.:</Text>
        <TextInput
          style={styles.input}
          value={formData.faxNo}
          onChangeText={(value) => updateFormData('faxNo', value)}
          placeholder="Enter fax number"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Email Address:</Text>
        <TextInput
          style={styles.input}
          value={formData.emailAddress}
          onChangeText={(value) => updateFormData('emailAddress', value)}
          placeholder="Enter email address"
          keyboardType="email-address"
        />
      </View>

      {/* Monitoring Data */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setMonitoringDataExpanded(!monitoringDataExpanded)}
        >
          <Text style={styles.sectionTitle}>Monitoring Data</Text>
          <Ionicons
            name={monitoringDataExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color="#333"
          />
        </TouchableOpacity>

        {monitoringDataExpanded && (
          <>
            <Text style={styles.instruction}>
              Choose only one (1) of the following statements that best applies to the project status
            </Text>
            {monitoringConditions.map((condition: Condition) => renderEditableCondition(condition, 'monitoring'))}
          </>
        )}
      </View>

      {/* Compliance Section */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setComplianceExpanded(!complianceExpanded)}
        >
          <Text style={styles.sectionTitle}>
            Compliance with the provisions of RA 8749, RA 9275, RA 9003 and RA 6969
          </Text>
          <Ionicons
            name={complianceExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color="#333"
          />
        </TouchableOpacity>

        {complianceExpanded && (
          <>
            <Text style={styles.instruction}>
              Choose only one (1) of the following statements that best applies to the project status
            </Text>
            {complianceConditions.map((condition: Condition) => renderEditableCondition(condition, 'compliance'))}
            
            {customConditions.map((condition: Condition) => 
              renderEditableCondition(condition, 'custom')
            )}

            <TouchableOpacity style={styles.addButton} onPress={addCustomCondition}>
              <Ionicons name="add-circle-outline" size={20} color="#3b82f6" />
              <Text style={styles.addButtonText}>Add Condition</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Additional Permit Holders */}
      {additionalPermitHolders.map((holder: PermitHolder) => {
        const isExpanded = holderExpandedStates[holder.id] !== false;
        
        return (
          <View key={holder.id} style={styles.section}>
            <TouchableOpacity 
              style={styles.permitHolderHeader}
              onPress={() => setHolderExpandedStates(prev => ({ 
                ...prev, 
                [holder.id]: !isExpanded 
              }))}
            >
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.sectionTitle}>
                  {holder.type} Permit Holder: {holder.name || 'Unnamed'}
                </Text>
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={24}
                  color="#333"
                  style={{ marginLeft: 8 }}
                />
              </View>
              <TouchableOpacity 
                onPress={(e) => {
                  e.stopPropagation();
                  deletePermitHolder(holder.id);
                }}
              >
                <Ionicons name="trash-outline" size={24} color="#ef4444" />
              </TouchableOpacity>
            </TouchableOpacity>

            {isExpanded && (
              <>
                <Text style={styles.label}>Name of Permit Holder:</Text>
                <TextInput
                  style={styles.input}
                  value={holder.name}
                  onChangeText={(value) => updatePermitHolderName(holder.id, value)}
                  placeholder="Enter permit holder name"
                />

                {/* Monitoring Data Section for this holder */}
                <View style={styles.subSection}>
                  <Text style={styles.subSectionTitle}>Monitoring Data</Text>
                  <Text style={styles.instruction}>
                    Choose only one (1) of the following statements that best applies to the project status
                  </Text>
                  {holder.monitoringConditions.map((condition: Condition) => 
                    renderEditableCondition(condition, 'holderMonitoring', holder.id, 'monitoringConditions')
                  )}
                </View>

                {/* Compliance Section for this holder */}
                <View style={styles.subSection}>
                  <Text style={styles.subSectionTitle}>
                    Compliance with the provisions of RA 8749, RA 9275, RA 9003 and RA 6969
                  </Text>
                  <Text style={styles.instruction}>
                    Choose only one (1) of the following statements that best applies to the project status
                  </Text>
                  {holder.complianceConditions.map((condition: Condition) => 
                    renderEditableCondition(condition, 'holderCompliance', holder.id, 'complianceConditions')
                  )}
                  
                  {(holder.customConditions || []).map((condition: Condition) => 
                    renderEditableCondition(condition, 'holderCustom', holder.id, 'customConditions')
                  )}

                  <TouchableOpacity 
                    style={styles.addButton} 
                    onPress={() => addPermitHolderCustomCondition(holder.id)}
                  >
                    <Ionicons name="add-circle-outline" size={20} color="#3b82f6" />
                    <Text style={styles.addButtonText}>Add Condition</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        );
      })}

      {/* Add Permit Holder Buttons - Before Remarks */}
      <View style={styles.section}>
        <View style={styles.permitHolderButtons}>
          <TouchableOpacity
            style={[styles.addButton, styles.permitHolderButton]}
            onPress={() => addPermitHolder('ISAG')}
          >
            <Ionicons name="add-circle-outline" size={20} color="#3b82f6" />
            <Text style={styles.addButtonText}>Add New ISAG Permit Holder</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.addButton, styles.permitHolderButton]}
            onPress={() => addPermitHolder('ECC')}
          >
            <Ionicons name="add-circle-outline" size={20} color="#3b82f6" />
            <Text style={styles.addButtonText}>Add New ECC Permit Holder</Text>
          </TouchableOpacity>
        </View>
      </View>


      {/* General Remarks Section - Separate from conditions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Remarks</Text>
        {generalRemarks.map((remark, index) => (
          <View key={index} style={styles.remarkRow}>
            <TextInput
              style={[styles.input, styles.remarkInput]}
              value={remark}
              onChangeText={(value) => updateRemark(index, value)}
              placeholder={`Remark ${index + 1}`}
              multiline
            />
            {generalRemarks.length > 1 && (
              <TouchableOpacity onPress={() => deleteRemark(index)} style={styles.deleteIcon}>
                <Ionicons name="close-circle" size={24} color="#ef4444" />
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={addRemark}>
          <Ionicons name="add-circle-outline" size={20} color="#3b82f6" />
          <Text style={styles.addButtonText}>Add More</Text>
        </TouchableOpacity>
      </View>

      {/* Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        {recommendations.map((recommendation, index) => (
          <View key={index} style={styles.remarkRow}>
            <TextInput
              style={[styles.input, styles.remarkInput]}
              value={recommendation}
              onChangeText={(value) => updateRecommendation(index, value)}
              placeholder={`Recommendation ${index + 1}`}
              multiline
            />
            {recommendations.length > 1 && (
              <TouchableOpacity onPress={() => deleteRecommendation(index)} style={styles.deleteIcon}>
                <Ionicons name="close-circle" size={24} color="#ef4444" />
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={addRecommendation}>
          <Ionicons name="add-circle-outline" size={20} color="#3b82f6" />
          <Text style={styles.addButtonText}>Add New Recommendation</Text>
        </TouchableOpacity>
      </View>


      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.draftButton} onPress={saveAsDraft}>
          <Ionicons name="save-outline" size={20} color="#666" />
          <Text style={styles.draftButtonText}>Save as Draft</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.generateButton} onPress={generateReport}>
          <Ionicons name="document-text-outline" size={20} color="#fff" />
          <Text style={styles.generateButtonText}>Generate ECC Compliance Monitoring Report</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker.show && (
        <DateTimePicker
          value={
            showDatePicker.field && (formData as any)[showDatePicker.field]
              ? (formData as any)[showDatePicker.field]
              : new Date()
          }
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}
