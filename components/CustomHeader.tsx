import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../theme/theme";

interface CustomHeaderProps {
  onSave?: () => void;
  saveDisabled?: boolean;
  showSave?: boolean;
  showFileName?: boolean; // new
  fileName?: string; // current filename
  onChangeFileName?: (name: string) => void; // callback when changed
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({
  onSave,
  saveDisabled = false,
  showSave = true,
  showFileName = false,
  fileName = "File_Name",
  onChangeFileName,
}) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [tempFileName, setTempFileName] = useState(fileName);

  const handleBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  const handleSaveFileName = () => {
    onChangeFileName?.(tempFileName);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />

      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.primaryDark} />
        </TouchableOpacity>

        {/* Center File Name */}
        {showFileName && (
          <TouchableOpacity
            style={styles.fileNameContainer}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.fileNameText}>{fileName || "File_Name"}</Text>
          </TouchableOpacity>
        )}

        {/* Save Button */}
        {showSave && (
          <TouchableOpacity
            onPress={onSave}
            style={styles.saveButton}
            disabled={saveDisabled}
          >
            <Text
              style={[
                styles.saveButtonText,
                { color: theme.colors.primaryDark },
                saveDisabled && { opacity: 0.5 },
              ]}
            >
              Save
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* File Name Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit File Name</Text>
            <TextInput
              placeholder="Enter file name"
              value={tempFileName}
              onChangeText={setTempFileName}
              style={styles.modalInput}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalSave]}
                onPress={handleSaveFileName}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 56,
  },
  backButton: {
    padding: 4,
    width: 60,
    alignItems: "flex-start",
  },
  saveButton: {
    width: 60,
    alignItems: "flex-end",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  fileNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  fileNameText: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.primaryDark,
  },
  /* Modal styles reused from your ECC styles */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    maxWidth: 420,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 14,
  },
  modalBtn: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
    marginLeft: 10,
  },
  modalCancel: { backgroundColor: "#f0f0f0" },
  modalCancelText: { color: theme.colors.primaryDark, fontWeight: "600" },
  modalSave: { backgroundColor: theme.colors.primaryDark },
  modalSaveText: { color: "#fff", fontWeight: "600" },
});
