import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

type UploadedFile = DocumentPicker.DocumentPickerAsset;

type FileUploadSectionProps = {
  uploadedFiles: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
};

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  uploadedFiles,
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
      <View style={styles.labelRow}>
        <View style={styles.bullet} />
        <Text style={styles.label}>
          Attach internal noise level monitoring line graphs
        </Text>
      </View>

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
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#02217C',
    marginRight: 12,
  },
  label: {
    fontSize: 14,
    color: '#1E293B',
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