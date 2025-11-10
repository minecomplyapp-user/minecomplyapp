import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { FileUploadSectionProps } from "../types";
import { fileUploadSectionStyles as styles } from "../styles";

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  uploadedFiles,
  uploadingFiles,
  onFilesChange,
}) => {
  const pickFile = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        multiple: true,
      });

      if (result.canceled === false) {
        const newFiles = result.assets.filter(
          (newFile) =>
            !uploadedFiles.some((prevFile) => prevFile.uri === newFile.uri)
        );
        onFilesChange([...uploadedFiles, ...newFiles]);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to pick file.");
      console.error(err);
    }
  };

  const removeFile = (uri: string) => {
    onFilesChange(uploadedFiles.filter((file) => file.uri !== uri));
  };

  const isAnyFileUploading = Object.values(uploadingFiles).some(Boolean);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <View style={styles.bullet} />
        <Text style={styles.label}>
          Attach internal noise level monitoring line graphs
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.uploadButton, isAnyFileUploading && { opacity: 0.6 }]}
        onPress={pickFile}
        disabled={isAnyFileUploading}
      >
        {isAnyFileUploading ? (
          <ActivityIndicator size="small" color="#02217C" />
        ) : (
          <Ionicons name="cloud-upload" size={20} color="#02217C" />
        )}
        <Text style={styles.uploadText}>
          {isAnyFileUploading ? "Uploading..." : "Upload File / Image"}
        </Text>
      </TouchableOpacity>

      {uploadedFiles.length > 0 && (
        <View style={styles.fileListContainer}>
          <Text style={styles.fileListHeader}>
            Selected Files ({uploadedFiles.length})
          </Text>
          {uploadedFiles.map((file) => (
            <View key={file.uri} style={styles.fileRow}>
              {uploadingFiles[file.uri] ? (
                <ActivityIndicator size="small" color="#02217C" />
              ) : (
                <Ionicons name="document-text" size={18} color="#02217C" />
              )}
              <Text style={styles.fileName} numberOfLines={1}>
                {file.name}
              </Text>
              <TouchableOpacity
                onPress={() => removeFile(file.uri)}
                style={styles.removeButton}
                disabled={uploadingFiles[file.uri]}
              >
                <Ionicons
                  name="close-circle"
                  size={22}
                  color={uploadingFiles[file.uri] ? "#94A3B8" : "#DC2626"}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default FileUploadSection;
