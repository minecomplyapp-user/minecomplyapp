import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

type UploadedFile = DocumentPicker.DocumentPickerAsset;

type FileUploadSectionProps = {
  hasInternalNoise: boolean;
  uploadedFiles: UploadedFile[];
  onToggleInternalNoise: () => void;
  onFilesChange: (files: UploadedFile[]) => void;
};

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  hasInternalNoise,
  uploadedFiles,
  onToggleInternalNoise,
  onFilesChange,
}) => {
  const pickFile = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: true,
      });

      if (result.canceled === false) {
        const newFiles = result.assets.filter(
          (newFile) => !uploadedFiles.some((prevFile) => prevFile.uri === newFile.uri)
        );
        onFilesChange([...uploadedFiles, ...newFiles]);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick file.');
      console.error(err);
    }
  };

  const removeFile = (uri: string) => {
    onFilesChange(uploadedFiles.filter((file) => file.uri !== uri));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.checkboxRow} onPress={onToggleInternalNoise}>
        <View style={[styles.checkbox, hasInternalNoise && styles.checkboxChecked]}>
          {hasInternalNoise && <Ionicons name="checkmark" size={16} color="white" />}
        </View>
        <Text style={styles.checkboxLabel}>
          Attach internal noise level monitoring line graphs
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.uploadButton} onPress={pickFile}>
        <Ionicons name="cloud-upload" size={20} color='#02217C' />
        <Text style={styles.uploadText}>Upload File / Image</Text>
      </TouchableOpacity>

      {uploadedFiles.length > 0 && (
        <View style={styles.fileListContainer}>
          <Text style={styles.fileListHeader}>Selected Files ({uploadedFiles.length})</Text>
          {uploadedFiles.map((file) => (
            <View key={file.uri} style={styles.fileRow}>
              <Ionicons name="document-text" size={18} color='#02217C'/>
              <Text style={styles.fileName} numberOfLines={1}>
                {file.name}
              </Text>
              <TouchableOpacity onPress={() => removeFile(file.uri)} style={styles.removeButton}>
                <Ionicons name="close-circle" size={22} color="#DC2626" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#02217C',
    borderColor: '#02217C',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#1E293B',
    marginLeft: 12,
    flex: 1,
    fontWeight: '500',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#BFDBFE',
    borderStyle: 'dashed',
    borderRadius: 12,
    marginBottom: 16,
    gap: 10,
  },
  uploadText: {
    fontSize: 14,
    color: '#02217C',
    fontWeight: '600',
  },
  fileListContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  fileListHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  fileName: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    marginLeft: 12,
    marginRight: 12,
    fontWeight: '500',
  },
  removeButton: {
    padding: 2,
  },
});

export default FileUploadSection;