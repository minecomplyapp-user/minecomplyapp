import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MonitoringActivity {
  activityId: string;
  activityType: string;
  datePerformed: string;
  performedBy: string;
  observations: string;
}

interface MonitoringActivitiesSectionProps {
  activities: MonitoringActivity[];
  addActivity: () => void;
  deleteActivity: (index: number) => void;
  updateActivity: (
    index: number,
    field: keyof MonitoringActivity,
    value: any
  ) => void;
}

const MonitoringActivitiesSection: React.FC<MonitoringActivitiesSectionProps> = ({
  activities,
  addActivity,
  deleteActivity,
  updateActivity,
}) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Monitoring Activities</Text>
          <Text style={styles.sectionSubtitle}>
            Record all monitoring activities performed during the period
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={addActivity}>
          <Ionicons name="add-circle" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      {activities.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={48} color="#ccc" />
          <Text style={styles.emptyStateText}>No activities added yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Tap the + button above to add your first monitoring activity
          </Text>
        </View>
      ) : (
        activities.map((activity, index) => (
          <View key={index} style={styles.activityCard}>
            <View style={styles.cardHeader}>
              <View style={styles.activityNumber}>
                <Text style={styles.activityNumberText}>Activity {index + 1}</Text>
              </View>
              <TouchableOpacity onPress={() => deleteActivity(index)}>
                <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Activity ID</Text>
              <TextInput
                style={styles.input}
                value={activity.activityId}
                onChangeText={(text) => updateActivity(index, "activityId", text)}
                placeholder="e.g., ACT-001"
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Activity Type</Text>
              <TextInput
                style={styles.input}
                value={activity.activityType}
                onChangeText={(text) => updateActivity(index, "activityType", text)}
                placeholder="e.g., Site Inspection, Water Sampling"
              />
            </View>
            <View style={styles.row}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Date Performed</Text>
                <TextInput
                  style={styles.input}
                  value={activity.datePerformed}
                  onChangeText={(text) => updateActivity(index, "datePerformed", text)}
                  placeholder="MM/DD/YYYY"
                />
              </View>
              <View style={[styles.fieldGroup, { flex: 1, marginLeft: 10 }]}>
                <Text style={styles.fieldLabel}>Performed By</Text>
                <TextInput
                  style={styles.input}
                  value={activity.performedBy}
                  onChangeText={(text) => updateActivity(index, "performedBy", text)}
                  placeholder="Name"
                />
              </View>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Observations</Text>
              <TextInput
                style={styles.textArea}
                value={activity.observations}
                onChangeText={(text) => updateActivity(index, "observations", text)}
                placeholder="Enter detailed observations from this activity..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
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
  activityCard: {
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
  activityNumber: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activityNumberText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
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
    minHeight: 80,
  },
});

export default MonitoringActivitiesSection;