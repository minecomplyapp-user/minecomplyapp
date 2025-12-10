import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type PermitHolderType = "single" | "multiple";

interface PermitHolderTypeSelectionProps {
  visible: boolean;
  currentType?: PermitHolderType;
  onSelect: (type: PermitHolderType) => void;
  onCancel?: () => void;
}

export const PermitHolderTypeSelection: React.FC<
  PermitHolderTypeSelectionProps
> = ({ visible, currentType, onSelect, onCancel }) => {
  const [selectedType, setSelectedType] = useState<PermitHolderType | null>(
    currentType || null
  );

  const handleSelect = (type: PermitHolderType) => {
    setSelectedType(type);
    onSelect(type);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Permit Holder Type</Text>
            <Text style={styles.subtitle}>
              Choose whether this report is for a single permit holder or
              multiple permit holders
            </Text>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionCard,
                selectedType === "single" && styles.optionCardSelected,
              ]}
              onPress={() => handleSelect("single")}
            >
              <View style={styles.optionIcon}>
                <Ionicons
                  name="person"
                  size={32}
                  color={selectedType === "single" ? "#02217C" : "#64748B"}
                />
              </View>
              <Text
                style={[
                  styles.optionTitle,
                  selectedType === "single" && styles.optionTitleSelected,
                ]}
              >
                Single Permit Holder
              </Text>
              <Text style={styles.optionDescription}>
                Report for one permit holder with standard format
              </Text>
              {selectedType === "single" && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark-circle" size={24} color="#02217C" />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionCard,
                selectedType === "multiple" && styles.optionCardSelected,
              ]}
              onPress={() => handleSelect("multiple")}
            >
              <View style={styles.optionIcon}>
                <Ionicons
                  name="people"
                  size={32}
                  color={selectedType === "multiple" ? "#02217C" : "#64748B"}
                />
              </View>
              <Text
                style={[
                  styles.optionTitle,
                  selectedType === "multiple" && styles.optionTitleSelected,
                ]}
              >
                Multiple Permit Holders
              </Text>
              <Text style={styles.optionDescription}>
                Report for multiple permit holders with extended format
              </Text>
              {selectedType === "multiple" && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark-circle" size={24} color="#02217C" />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {onCancel && (
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 500,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#02217C",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  optionCard: {
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 20,
    position: "relative",
    backgroundColor: "#F8FAFC",
  },
  optionCardSelected: {
    borderColor: "#02217C",
    backgroundColor: "#EFF6FF",
  },
  optionIcon: {
    alignItems: "center",
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 8,
  },
  optionTitleSelected: {
    color: "#02217C",
  },
  optionDescription: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
  checkmark: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748B",
  },
});

