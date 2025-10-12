import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CorrectiveAction {
  actionId: string;
  relatedFinding: string;
  actionRequired: string;
  responsibleParty: string;
  targetDate: string;
  status: "pending" | "in-progress" | "completed" | "";
}

interface CorrectiveActionsSectionProps {
  correctiveActions: CorrectiveAction[];
  addCorrectiveAction: () => void;
  deleteCorrectiveAction: (index: number) => void;
  updateCorrectiveAction: (
    index: number,
    field: keyof CorrectiveAction,
    value: any
  ) => void;
}

const CorrectiveActionsSection: React.FC<CorrectiveActionsSectionProps> = ({
  correctiveActions,
  addCorrectiveAction,
  deleteCorrectiveAction,
  updateCorrectiveAction,
}) => {
  const getStatusColor = (status: CorrectiveAction["status"]) => {
    switch (status) {
      case "completed":
        return "#34C759";
      case "in-progress":
        return "#FF9500";
      case "pending":
        return "#8E8E93";
      default:
        return "#E5E5EA";
    }
  };

  const getStatusIcon = (status: CorrectiveAction["status"]) => {
    switch (status) {
      case "completed":
        return "checkmark-circle";
      case "in-progress":
        return "sync";
      case "pending":
        return "time";
      default:
        return "ellipse-outline";
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Corrective Actions</Text>
          <Text style={styles.sectionSubtitle}>
            Track required actions and their implementation status
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={addCorrectiveAction}>
          <Ionicons name="add-circle" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      {correctiveActions.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="construct-outline" size={48} color="#ccc" />
          <Text style={styles.emptyStateText}>No corrective actions yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Tap the + button above to add corrective actions
          </Text>
        </View>
      ) : (
        correctiveActions.map((action, index) => (
          <View key={index} style={styles.actionCard}>
            <View style={styles.cardHeader}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <TextInput
                  style={styles.actionIdInput}
                  value={action.actionId}
                  onChangeText={(text) => updateCorrectiveAction(index, "actionId", text)}
                  placeholder="CA-001"
                />
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(action.status) },
                  ]}
                >
                  <Ionicons
                    name={getStatusIcon(action.status) as any}
                    size={14}
                    color="white"
                  />
                  <Text style={styles.statusText}>
                    {action.status ? action.status.toUpperCase().replace("-", " ") : "NOT SET"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => deleteCorrectiveAction(index)}>
                <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Related Finding ID</Text>
              <TextInput
                style={styles.input}
                value={action.relatedFinding}
                onChangeText={(text) => updateCorrectiveAction(index, "relatedFinding", text)}
                placeholder="e.g., F-001"
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Action Required</Text>
              <TextInput
                style={styles.textArea}
                value={action.actionRequired}
                onChangeText={(text) => updateCorrectiveAction(index, "actionRequired", text)}
                placeholder="Describe the corrective action needed..."
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
            <View style={styles.row}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Responsible Party</Text>
                <TextInput
                  style={styles.input}
                  value={action.responsibleParty}
                  onChangeText={(text) => updateCorrectiveAction(index, "responsibleParty", text)}
                  placeholder="Name/Department"
                />
              </View>
              <View style={[styles.fieldGroup, { flex: 1, marginLeft: 10 }]}>
                <Text style={styles.fieldLabel}>Target Date</Text>
                <TextInput
                  style={styles.input}
                  value={action.targetDate}
                  onChangeText={(text) => updateCorrectiveAction(index, "targetDate", text)}
                  placeholder="MM/DD/YYYY"
                />
              </View>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Status</Text>
              <View style={styles.statusButtons}>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    action.status === "pending" && styles.statusButtonActive,
                  ]}
                  onPress={() => updateCorrectiveAction(index, "status", "pending")}
                >
                  <Ionicons
                    name="time"
                    size={18}
                    color={action.status === "pending" ? "#8E8E93" : "#8E8E93"}
                  />
                  <Text
                    style={[
                      styles.statusButtonText,
                      action.status === "pending" && styles.statusButtonTextActive,
                    ]}
                  >
                    Pending
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    action.status === "in-progress" && styles.statusButtonActive,
                  ]}
                  onPress={() => updateCorrectiveAction(index, "status", "in-progress")}
                >
                  <Ionicons
                    name="sync"
                    size={18}
                    color={action.status === "in-progress" ? "#FF9500" : "#8E8E93"}
                  />
                  <Text
                    style={[
                      styles.statusButtonText,
                      action.status === "in-progress" && styles.statusButtonTextActive,
                    ]}
                  >
                    In Progress
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    action.status === "completed" && styles.statusButtonActive,
                  ]}
                  onPress={() => updateCorrectiveAction(index, "status", "completed")}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={action.status === "completed" ? "#34C759" : "#8E8E93"}
                  />
                  <Text
                    style={[
                      styles.statusButtonText,
                      action.status === "completed" && styles.statusButtonTextActive,
                    ]}
                  >
                    Completed
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: "white",
    marginTop: 10,
    padding: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  addButton: {
    padding: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    fontWeight: "600",
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
    textAlign: "center",
  },
  actionCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  actionIdInput: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007AFF",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 8,
    minWidth: 80,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "white",
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: "#333",
  },
  row: {
    flexDirection: "row",
  },
  textArea: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: "#333",
    minHeight: 70,
  },
  statusButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statusButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    gap: 4,
  },
  statusButtonActive: {
    backgroundColor: "#E8F5FF",
    borderColor: "#007AFF",
  },
  statusButtonText: {
    fontSize: 12,
    color: "#666",
  },
  statusButtonTextActive: {
    color: "#007AFF",
    fontWeight: "600",
  },
});

export default CorrectiveActionsSection;