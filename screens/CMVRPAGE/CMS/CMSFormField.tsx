import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Upload, X } from 'lucide-react-native';

interface SubField {
  label: string;
  specification: string;
}

interface CMSFormFieldProps {
  label: string;
  specification: string;
  remarks: string;
  withinSpecs: boolean | null;
  subFields?: SubField[];
  showUploadImage?: boolean;
  uploadedImage?: string;
  onSpecificationChange: (text: string) => void;
  onRemarksChange: (text: string) => void;
  onWithinSpecsChange: (value: boolean) => void;
  onSubFieldChange?: (index: number, value: string) => void;
  onUploadImage?: () => void;
  onRemoveImage?: () => void;
}

export const CMSFormField: React.FC<CMSFormFieldProps> = ({
  label,
  specification,
  remarks,
  withinSpecs,
  subFields,
  showUploadImage = false,
  uploadedImage,
  onSpecificationChange,
  onRemarksChange,
  onWithinSpecsChange,
  onSubFieldChange,
  onUploadImage,
  onRemoveImage,
}) => {
  return (
    <View style={styles.formField}>
      <View style={styles.fieldRow}>
        <View style={styles.leftSection}>
          <View style={styles.labelPill}>
            <Text style={styles.labelText}>{label}</Text>
          </View>
          <Text style={styles.remarksLabel}>
            Remarks - Description of{'\n'}Actual Implementation
          </Text>
        </View>
        <View style={styles.middleSection}>
          {subFields ? (
            <>
              {subFields.map((subField, index) => (
                <View key={index} style={styles.subFieldRow}>
                  <View style={styles.subFieldLabel}>
                    <View style={styles.bullet} />
                    <Text style={styles.subFieldLabelText}>{subField.label}</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Specification Type here..."
                    placeholderTextColor="#94A3B8"
                    value={subField.specification}
                    onChangeText={(text) => onSubFieldChange?.(index, text)}
                  />
                </View>
              ))}
            </>
          ) : (
            <TextInput
              style={styles.input}
              placeholder="Specification"
              placeholderTextColor="#94A3B8"
              value={specification}
              onChangeText={onSpecificationChange}
            />
          )}
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Type here..."
            placeholderTextColor="#94A3B8"
            value={remarks}
            onChangeText={onRemarksChange}
            multiline
            numberOfLines={2}
          />
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.radioLabel}>Within specs?</Text>
          <View style={styles.radioRow}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => onWithinSpecsChange(true)}
            >
              <View style={styles.radioOuter}>
                {withinSpecs === true && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => onWithinSpecsChange(false)}
            >
              <View style={styles.radioOuter}>
                {withinSpecs === false && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioText}>No</Text>
            </TouchableOpacity>
          </View>
          {showUploadImage && (
            <>
              <TouchableOpacity style={styles.uploadButton} onPress={onUploadImage}>
                <Upload size={14} color='#02217C' />
                <Text style={styles.uploadText}>Upload Image</Text>
              </TouchableOpacity>
              {uploadedImage && (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: uploadedImage }} style={styles.imagePreview} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={onRemoveImage}
                  >
                    <X size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formField: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
  },
  leftSection: {
    width: 130,
  },
  middleSection: {
    flex: 1,
  },
  rightSection: {
    width: 110,
    alignItems: 'flex-end',
  },
  labelPill: {
    backgroundColor: '#DBEAFE',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#93C5FD',
  },
  labelText: {
    color: '#02217C',
    fontWeight: '700',
    fontSize: 11,
    textAlign: 'center',
  },
  remarksLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#475569',
    lineHeight: 12,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 11,
    marginBottom: 6,
    color: '#1E293B',
  },
  textArea: {
    minHeight: 50,
    textAlignVertical: 'top',
  },
  subFieldRow: {
    marginBottom: 6,
  },
  subFieldLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#02217C',
    marginRight: 6,
  },
  subFieldLabelText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#475569',
  },
  radioLabel: {
    fontSize: 11,
    color: '#1E293B',
    marginBottom: 8,
    fontWeight: '600',
  },
  radioRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor:'#02217C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#02217C',
  },
  radioText: {
    fontSize: 11,
    color: '#1E293B',
    fontWeight: '500',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#02217C',
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginTop: 10,
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
  },
  uploadText: {
    marginLeft: 4,
    fontSize: 10,
    color: '#02217C',
    fontWeight: '600',
  },
  imagePreviewContainer: {
    marginTop: 8,
    position: 'relative',
    width: 100,
    height: 75,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  removeImageButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#DC2626',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
});