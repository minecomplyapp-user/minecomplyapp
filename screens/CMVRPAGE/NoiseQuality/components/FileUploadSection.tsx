import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { FileUploadSectionProps } from "../types";
import { fileUploadSectionStyles as styles } from "../styles";

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  uploadedFiles,
  uploadingFiles,
  onFilesChange,
}) => {
  const [showUploadOptions, setShowUploadOptions] = useState(false);

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

  const pickImageFromGallery = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Sorry, we need camera roll permissions to upload images."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        const imageFile = {
          uri: asset.uri,
          name: asset.fileName || `image_${Date.now()}.jpg`,
          mimeType: asset.mimeType || "image/jpeg",
          size: asset.fileSize,
          lastModified: Date.now(),
        };

        const isDuplicate = uploadedFiles.some(
          (file) => file.uri === imageFile.uri
        );
        if (!isDuplicate) {
          onFilesChange([...uploadedFiles, imageFile]);
        }
      }
    } catch (err) {
      Alert.alert("Error", "Failed to pick image from gallery.");
      console.error(err);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Sorry, we need camera permissions to take photos."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        const imageFile = {
          uri: asset.uri,
          name: asset.fileName || `photo_${Date.now()}.jpg`,
          mimeType: asset.mimeType || "image/jpeg",
          size: asset.fileSize,
          lastModified: Date.now(),
        };

        onFilesChange([...uploadedFiles, imageFile]);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to take photo.");
      console.error(err);
    }
  };

  const handleUploadOption = async (option: "file" | "gallery" | "camera") => {
    setShowUploadOptions(false);
    switch (option) {
      case "file":
        await pickFile();
        break;
      case "gallery":
        await pickImageFromGallery();
        break;
      case "camera":
        await takePhoto();
        break;
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
        onPress={() => setShowUploadOptions(true)}
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

      {/* Upload Options Modal */}
      <Modal
        visible={showUploadOptions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUploadOptions(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowUploadOptions(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Upload Source</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleUploadOption("camera")}
            >
              <Ionicons name="camera" size={20} color="#02217C" />
              <Text style={styles.modalOptionText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleUploadOption("gallery")}
            >
              <Ionicons name="image" size={20} color="#02217C" />
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleUploadOption("file")}
            >
              <Ionicons name="document" size={20} color="#02217C" />
              <Text style={styles.modalOptionText}>Choose File</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowUploadOptions(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

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
