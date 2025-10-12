import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

interface ConclusionSectionProps {
  conclusion: string;
  setConclusion: (text: string) => void;
}

const ConclusionSection: React.FC<ConclusionSectionProps> = ({
  conclusion,
  setConclusion,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Conclusion</Text>
      <Text style={styles.sectionSubtitle}>
        Summarize the overall monitoring results and compliance status
      </Text>
      <TextInput
        style={styles.textarea}
        value={conclusion}
        onChangeText={setConclusion}
        placeholder="Enter conclusion and overall assessment of the monitoring period..."
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: "white",
    marginTop: 10,
    padding: 15,
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
    marginBottom: 15,
  },
  textarea: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    minHeight: 120,
  },
});

export default ConclusionSection;