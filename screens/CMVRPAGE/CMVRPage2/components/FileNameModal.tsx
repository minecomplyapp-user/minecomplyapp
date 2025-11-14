import React from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 

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
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPressOut={handleCancelEdit}
      >
        <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
        >
          <Text style={styles.modalTitle}>Edit File Name</Text>
          <TextInput
            style={styles.modalInput}
            value={tempFileName}
            onChangeText={setTempFileName}
            placeholder="Enter file name"
            placeholderTextColor="#9CA3AF" 
            autoFocus 
            selectionColor='#02217C'
          />
          <View style={styles.modalButtons}>
            {/* Cancel Button */}
            <TouchableOpacity
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={handleCancelEdit}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            {/* Save Button */}
            <TouchableOpacity
              style={[styles.modalButton, styles.modalSaveButton]}
              onPress={handleSaveFileName}
            >
              <Text style={styles.modalSaveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)", 
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20, 
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16, 
    padding: 24,
    width: "100%", 
    maxWidth: 400,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20, 
    fontWeight: "700",
    color: '#02217C', 
    marginBottom: 20, 
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: "#F8FAFC", 
    borderWidth: 1.5,
    borderColor: "#CBD5E1", 
    borderRadius: 12, 
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16, 
    color: "#0F172A", 
    marginBottom: 24, 
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12, 
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14, 
    borderRadius: 12, 
    alignItems: "center",
    justifyContent: 'center',
  },
  modalCancelButton: {
    backgroundColor: "#F1F5F9", 
    borderWidth: 1.5,
    borderColor: "#E2E8F0", 
  },
  modalSaveButton: {
    backgroundColor: '#02217C', 
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  modalCancelButtonText: {
    color: "#475569", 
    fontSize: 16,
    fontWeight: "600",
  },
  modalSaveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600", 
  },
});