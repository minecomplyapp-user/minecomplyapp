import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  StatusBar,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFileName } from "../contexts/FileNameContext";

interface CMSHeaderProps {
  onBack?: () => void;
  onSave?: () => void;
  onStay?: () => void; // New callback for staying on current page
  onSaveToDraft?: () => Promise<void>; // New callback for saving to draft
  onDiscard?: () => void; // New callback for discarding changes
  fileName?: string;
  onEditFileName?: () => void;
  allowEdit?: boolean; // New prop to control if editing is allowed
}

export const CMSHeader: React.FC<CMSHeaderProps> = ({
  onBack,
  onSave,
  onStay,
  onSaveToDraft,
  onDiscard,
  fileName: fileNameProp,
  onEditFileName,
  allowEdit = false, // Default to false (read-only)
}) => {
  const { fileName: contextFileName, setFileName, isLoaded } = useFileName();
  const [modalVisible, setModalVisible] = useState(false);
  const [saveOptionsVisible, setSaveOptionsVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const displayFileName = fileNameProp || contextFileName;
  const [editableFileName, setEditableFileName] = useState(displayFileName);

  useEffect(() => {
    console.log("CMSHeader displayFileName:", displayFileName);
  }, [displayFileName]);

  useEffect(() => {
    console.log("Updating editableFileName to:", displayFileName);
    setEditableFileName(displayFileName);
  }, [displayFileName]);

  const handleModalSave = async () => {
    console.log("Modal Save clicked, saving:", editableFileName);
    setIsSaving(true);

    try {
      await setFileName(editableFileName);
      console.log("File name saved successfully");
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving file name:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleHeaderSave = () => {
    console.log("Header Save clicked");
    // Show save options modal instead of directly calling onSave
    if (onSaveToDraft || onStay || onDiscard) {
      setSaveOptionsVisible(true);
    } else if (onSave) {
      // Fallback to old behavior if new callbacks not provided
      onSave();
    }
  };

  const handleStay = () => {
    console.log("Stay clicked");
    setSaveOptionsVisible(false);
    if (onStay) {
      onStay();
    }
  };

  const handleSaveToDraft = async () => {
    console.log("Save to Draft clicked");
    if (onSaveToDraft) {
      setIsSaving(true);
      try {
        await onSaveToDraft();
        setSaveOptionsVisible(false);
      } catch (error) {
        console.error("Error saving to draft:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDiscard = () => {
    console.log("Discard clicked");
    setSaveOptionsVisible(false);
    if (onDiscard) {
      onDiscard();
    }
  };

  const handleCancel = () => {
    console.log("Modal cancelled, resetting to:", displayFileName);
    setEditableFileName(displayFileName);
    setModalVisible(false);
  };

  const handleOpenModal = () => {
    // Only open modal if editing is allowed
    if (!allowEdit) return;

    console.log("Opening modal with fileName:", displayFileName);
    setEditableFileName(displayFileName);
    setModalVisible(true);
    if (typeof onEditFileName === "function") {
      onEditFileName();
    }
  };

  // Show loading indicator while loading from storage
  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <ActivityIndicator size="small" color="#000" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        {/* File Name - Only tappable if allowEdit is true */}
        {allowEdit ? (
          <TouchableOpacity
            onPress={handleOpenModal}
            style={styles.titleContainer}
          >
            <Text style={styles.headerTitleText}>{displayFileName}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitleText}>{displayFileName}</Text>
          </View>
        )}

        {/* Save Button */}
        <TouchableOpacity onPress={handleHeaderSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Editing - Only shown when allowEdit is true */}
      {allowEdit && (
        <Modal
          transparent
          animationType="fade"
          visible={modalVisible}
          onRequestClose={handleCancel}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Edit File Name</Text>
              <TextInput
                value={editableFileName}
                onChangeText={setEditableFileName}
                style={styles.modalInput}
                placeholder="Enter new file name"
                autoFocus
                editable={!isSaving}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={handleCancel}
                  disabled={isSaving}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveModalButton]}
                  onPress={handleModalSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={[styles.modalButtonText, { color: "white" }]}>
                      Save
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Save Options Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={saveOptionsVisible}
        onRequestClose={() => setSaveOptionsVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Save Options</Text>
            <Text style={styles.modalDescription}>
              What would you like to do with your changes?
            </Text>

            <TouchableOpacity
              style={[styles.optionButton, styles.stayButton]}
              onPress={handleStay}
              disabled={isSaving}
            >
              <Ionicons name="arrow-back" size={20} color="#02217C" />
              <Text style={[styles.optionButtonText, styles.stayButtonText]}>
                Stay
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, styles.saveDraftButton]}
              onPress={handleSaveToDraft}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={20} color="white" />
                  <Text
                    style={[
                      styles.optionButtonText,
                      styles.saveDraftButtonText,
                    ]}
                  >
                    Save to Draft
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, styles.discardButton]}
              onPress={handleDiscard}
              disabled={isSaving}
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <Text style={[styles.optionButtonText, styles.discardButtonText]}>
                Discard
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 44,
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
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitleText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  saveButton: {
    width: 90,
    alignItems: "flex-end",
  },
  saveButtonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
    minWidth: 70,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#e5e5e5",
  },
  saveModalButton: {
    backgroundColor: "#02217C",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  modalDescription: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 20,
    textAlign: "center",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 12,
    gap: 10,
  },
  stayButton: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  saveDraftButton: {
    backgroundColor: "#02217C",
  },
  discardButton: {
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  optionButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  stayButtonText: {
    color: "#02217C",
  },
  saveDraftButtonText: {
    color: "white",
  },
  discardButtonText: {
    color: "#EF4444",
  },
});
