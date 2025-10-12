import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Finding {
  findingId: string;
  category: "major" | "minor" | "observation" | "";
  description: string;
  location: string;
  evidence: string;
}

interface FindingsSectionProps {
  findings: Finding[];
  addFinding: () => void;
  deleteFinding: (index: number) => void;
  updateFinding: (
    index: number,
    field: keyof Finding,
    value: any
  ) => void;
}

const FindingsSection: React.FC<FindingsSectionProps> = ({
  findings,
  addFinding,
  deleteFinding,
  updateFinding,
}) => {
  const getCategoryColor = (category: Finding["category"]) => {
    switch (category) {
      case "major":
        return "#FF3B30";
      case "minor":
        return "#FF9500";
      case "observation":
        return "#007AFF";
      default:
        return "#E5E5EA";
    }
  };

  const getCategoryIcon = (category: Finding["category"]) => {
    switch (category) {
      case "major":
        return "alert-circle";
      case "minor":
        return "warning";
      case "observation":
        return "information-circle";
      default:
        return "help-circle";
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Findings</Text>
          <Text style={styles.sectionSubtitle}>
            Document issues, non-conformances, and observations
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={addFinding}>
          <Ionicons name="add-circle" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      {findings.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={48} color="#ccc" />
          <Text style={styles.emptyStateText}>No findings recorded</Text>
          <Text style={styles.emptyStateSubtext}>
            Tap the + button above to add findings from your monitoring
          </Text>
        </View>
      ) : (
        findings.map((finding, index) => (
          <View key={index} style={styles.findingCard}>
            <View style={styles.cardHeader}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <TextInput
                  style={styles.findingIdInput}
                  value={finding.findingId}
                  onChangeText={(text) => updateFinding(index, "findingId", text)}
                  placeholder="ID"
                />
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: getCategoryColor(finding.category) },
                  ]}
                >
                  <Ionicons
                    name={getCategoryIcon(finding.category) as any}
                    size={14}
                    color="white"
                  />
                  <Text style={styles.categoryText}>
                    {finding.category ? finding.category.toUpperCase() : "NOT SET"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => deleteFinding(index)}>
                <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
            <View style={styles.categoryButtons}>
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  finding.category === "major" && styles.categoryButtonActive,
                ]}
                onPress={() => updateFinding(index, "category", "major")}
              >
                <Ionicons
                  name="alert-circle"
                  size={18}
                  color={finding.category === "major" ? "#FF3B30" : "#8E8E93"}
                />
                <Text
                  style={[
                    styles.categoryButtonText,
                    finding.category === "major" && styles.categoryButtonTextActive,
                  ]}
                >
                  Major
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  finding.category === "minor" && styles.categoryButtonActive,
                ]}
                onPress={() => updateFinding(index, "category", "minor")}
              >
                <Ionicons
                  name="warning"
                  size={18}
                  color={finding.category === "minor" ? "#FF9500" : "#8E8E93"}
                />
                <Text
                  style={[
                    styles.categoryButtonText,
                    finding.category === "minor" && styles.categoryButtonTextActive,
                  ]}
                >
                  Minor
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  finding.category === "observation" && styles.categoryButtonActive,
                ]}
                onPress={() => updateFinding(index, "category", "observation")}
              >
                <Ionicons
                  name="information-circle"
                  size={18}
                  color={finding.category === "observation" ? "#007AFF" : "#8E8E93"}
                />
                <Text
                  style={[
                    styles.categoryButtonText,
                    finding.category === "observation" && styles.categoryButtonTextActive,
                  ]}
                >
                  Observation
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Description</Text>
              <TextInput
                style={styles.textArea}
                value={finding.description}
                onChangeText={(text) => updateFinding(index, "description", text)}
                placeholder="Describe the finding in detail..."
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Location</Text>
              <TextInput
                style={styles.input}
                value={finding.location}
                onChangeText={(text) => updateFinding(index, "location", text)}
                placeholder="Where was this finding observed?"
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Evidence / References</Text>
              <TextInput
                style={styles.textArea}
                value={finding.evidence}
                onChangeText={(text) => updateFinding(index, "evidence", text)}
                placeholder="Evidence, photos, measurements, or references..."
                multiline
                numberOfLines={2}
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
  findingCard: {
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
  findingIdInput: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007AFF",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 8,
    minWidth: 70,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "white",
  },
  categoryButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  categoryButton: {
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
  categoryButtonActive: {
    backgroundColor: "#E8F5FF",
    borderColor: "#007AFF",
  },
  categoryButtonText: {
    fontSize: 12,
    color: "#666",
  },
  categoryButtonTextActive: {
    color: "#007AFF",
    fontWeight: "600",
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
});

export default FindingsSection;