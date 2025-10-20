import React from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from "react-native";

interface FileNameModalProps {
  isEditingFileName: boolean;
  tempFileName: string;
  setTempFileName: (value: string) => void;
  handleCancelEdit: () => void;
  handleSaveFileName: () => void;
}

export const FileNameModal: React.FC<FileNameModalProps> = ({
  isEditingFileName,
  tempFileName,
  setTempFileName,
  handleCancelEdit,
  handleSaveFileName,
}) => {
  return (
    <Modal
      visible={isEditingFileName}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCancelEdit}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit File Name</Text>
          <TextInput
            style={styles.modalInput}
            value={tempFileName}
            onChangeText={setTempFileName}
            placeholder="Enter file name"
            autoFocus
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.modalButton, styles.modalCancelButton]} onPress={handleCancelEdit}>
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.modalSaveButton]} onPress={handleSaveFileName}>
              <Text style={styles.modalSaveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCancelButton: {
    backgroundColor: "#F0F0F0",
  },
  modalSaveButton: {
    backgroundColor: "#007AFF",
  },
  modalCancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
  modalSaveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
