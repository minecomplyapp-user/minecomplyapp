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
            Remarks- Description of{'\\n'}Actual Implementation
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
                    placeholderTextColor="#999"
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
              placeholderTextColor="#999"
              value={specification}
              onChangeText={onSpecificationChange}
            />
          )}
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Type here..."
            placeholderTextColor="#999"
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
                <Upload size={14} color="#000" />
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
    backgroundColor: '#F5E7E7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8, // Increased gap between sections
    borderWidth: 1,
    borderColor: '#E5C7C7',
    borderRadius: 0, // Removed border radius for square corners
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
    backgroundColor: '#a5b4fc',
    borderRadius: 16,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  labelText: {
    color: '#1e1b4b',
    fontWeight: '700',
    fontSize: 11,
    textAlign: 'center',
  },
  remarksLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#000',
    lineHeight: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 0,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 11,
    marginBottom: 6,
  },
  textArea: {
    minHeight: 45,
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
    backgroundColor: '#9ca3af',
    marginRight: 6,
  },
  subFieldLabelText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#374151',
  },
  radioLabel: {
    fontSize: 11,
    color: '#000',
    marginBottom: 8,
    fontWeight: '500',
  },
  radioRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000',
  },
  radioText: {
    fontSize: 11,
    color: '#000',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 0,
  },
  uploadText: {
    marginLeft: 4,
    fontSize: 10,
    color: '#000',
    fontWeight: '500',
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
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  removeImageButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
