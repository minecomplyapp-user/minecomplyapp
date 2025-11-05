import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { Upload, X } from "lucide-react-native";
import { CMSFormFieldProps } from "../types/CMSFormField.types";
import { styles } from "../styles/CMSFormField.styles";

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
          <View style={styles.labelRow}>
            <View style={styles.labelPill}>
              <Text style={styles.labelText}>{label}</Text>
            </View>
            {showUploadImage && (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={onUploadImage}
              >
                <Upload size={16} color="#1E3A8A" />
                <Text style={styles.uploadText}>Upload Image</Text>
              </TouchableOpacity>
            )}
          </View>
          {showUploadImage && uploadedImage && (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: uploadedImage }}
                style={styles.imagePreview}
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={onRemoveImage}
              >
                <X size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.middleSection}>
          {subFields ? (
            <>
              {subFields.map((subField, index) => (
                <View key={index} style={styles.subFieldRow}>
                  <View style={styles.subFieldLabel}>
                    <View style={styles.bullet} />
                    <Text style={styles.subFieldLabelText}>
                      {subField.label}
                    </Text>
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
          <View style={styles.remarksContainer}>
            <View style={styles.remarksLabelWrapper}>
              <Text style={styles.remarksLabel}>
                Remarks - Description of{"\n"}Actual Implementation
              </Text>
            </View>
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
        </View>
      </View>
    </View>
  );
};
