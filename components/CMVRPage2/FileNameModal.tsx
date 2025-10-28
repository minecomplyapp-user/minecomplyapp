import React from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Assuming you might want icons later

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
      onRequestClose={handleCancelEdit} // Handles Android back button press
    >
      <TouchableOpacity // Use TouchableOpacity for the overlay to allow dismissing by tapping outside
        style={styles.modalOverlay}
        activeOpacity={1}
        onPressOut={handleCancelEdit} // Dismiss when tapping the overlay
      >
        <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true} // Prevent taps inside the modal from closing it
        >
          <Text style={styles.modalTitle}>Edit File Name</Text>
          <TextInput
            style={styles.modalInput}
            value={tempFileName}
            onChangeText={setTempFileName}
            placeholder="Enter file name"
            placeholderTextColor="#9CA3AF" // Consistent placeholder color
            autoFocus // Keep autofocus
            selectionColor="#5B4FC7" // Set cursor/selection color
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

// --- Updated Styles ---
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Slightly darker overlay
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20, // Add padding to overlay
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16, // More rounded corners
    padding: 24, // Increased padding
    width: "100%", // Take full width within overlay padding
    maxWidth: 400,
    shadowColor: "#000", // Add shadow for depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20, // Larger title
    fontWeight: "700", // Bolder
    color: "#5B4FC7", // Theme color
    marginBottom: 20, // More space below title
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: "#F8FAFC", // Match input background
    borderWidth: 1.5,
    borderColor: "#CBD5E1", // Match input border
    borderRadius: 12, // Match input border radius
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16, // Slightly larger font
    color: "#0F172A", // Match input text color
    marginBottom: 24, // More space below input
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12, // Keep gap
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14, // Increased padding
    borderRadius: 12, // Match input border radius
    alignItems: "center",
    justifyContent: 'center',
  },
  modalCancelButton: {
    backgroundColor: "#F1F5F9", // Lighter grey background
    borderWidth: 1.5,
    borderColor: "#E2E8F0", // Subtle border
  },
  modalSaveButton: {
    backgroundColor: "#5B4FC7", // Theme color
    shadowColor: "#5B4FC7", // Add shadow to primary button
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  modalCancelButtonText: {
    color: "#475569", // Darker grey text
    fontSize: 16,
    fontWeight: "600", // Semi-bold
  },
  modalSaveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600", // Semi-bold
  },
});