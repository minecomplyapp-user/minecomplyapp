import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFileName } from '../contexts/FileNameContext';

interface CMSHeaderProps {
  onBack?: () => void;
  onSave?: () => void;
  fileName?: string;
  onEditFileName?: () => void;
}

export const CMSHeader: React.FC<CMSHeaderProps> = ({ onBack, onSave, fileName: fileNameProp, onEditFileName }) => {
  const { fileName: contextFileName, setFileName, isLoaded } = useFileName();
  const [modalVisible, setModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
 
  const displayFileName = fileNameProp || contextFileName;
  const [editableFileName, setEditableFileName] = useState(displayFileName);

  useEffect(() => {
    console.log('CMSHeader displayFileName:', displayFileName);
  }, [displayFileName]);

  useEffect(() => {
    console.log('Updating editableFileName to:', displayFileName);
    setEditableFileName(displayFileName);
  }, [displayFileName]);

  const handleModalSave = async () => {
    console.log('Modal Save clicked, saving:', editableFileName);
    setIsSaving(true);
    
    try {
      await setFileName(editableFileName);
      console.log('File name saved successfully');
      setModalVisible(false);
    } catch (error) {
      console.error('Error saving file name:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleHeaderSave = () => {
    console.log('Header Save clicked');
    if (onSave) {
      onSave();
    }
  };

  const handleCancel = () => {
    console.log('Modal cancelled, resetting to:', displayFileName);
    setEditableFileName(displayFileName);
    setModalVisible(false);
  };

  const handleOpenModal = () => {
    console.log('Opening modal with fileName:', displayFileName);
    setEditableFileName(displayFileName);
    setModalVisible(true);
    if (typeof onEditFileName === 'function') {
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

        {/* File Name */}
        <TouchableOpacity onPress={handleOpenModal} style={styles.titleContainer}>
          <Text style={styles.headerTitleText}>{displayFileName}</Text>
        </TouchableOpacity>

        {/* Save Button */}
        <TouchableOpacity onPress={handleHeaderSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Editing */}
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
                  <Text style={[styles.modalButtonText, { color: 'white' }]}>Save</Text>
                )}
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
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 44,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 56,
  },
  backButton: {
    padding: 4,
    width: 60,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  saveButton: {
    width: 60,
    alignItems: 'flex-end',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e5e5e5',
  },
  saveModalButton: {
    backgroundColor: '#02217C',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});