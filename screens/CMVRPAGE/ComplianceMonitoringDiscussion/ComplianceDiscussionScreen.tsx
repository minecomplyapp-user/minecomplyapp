import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CMSHeader } from "../../../components/CMSHeader";
import { useCmvrStore } from "../../../store/cmvrStore";
import { StyleSheet } from "react-native";
import { theme } from "../../../theme/theme";

/**
 * Compliance Monitoring Report Discussion Screen
 * 
 * This new section comes after the Executive Summary in the CMVR flow.
 * It provides space for detailed discussion of compliance findings.
 */
export default function ComplianceDiscussionScreen({ navigation, route }: any) {
  const { currentReport, updateSection, saveDraft } = useCmvrStore();
  
  const [discussion, setDiscussion] = useState({
    summary: "",
    keyFindings: [""],
    recommendations: [""],
    nextSteps: "",
  });

  // Load existing data on mount
  useEffect(() => {
    if (currentReport?.complianceMonitoringReportDiscussion) {
      setDiscussion({
        summary: currentReport.complianceMonitoringReportDiscussion.summary || "",
        keyFindings: currentReport.complianceMonitoringReportDiscussion.keyFindings || [""],
        recommendations: currentReport.complianceMonitoringReportDiscussion.recommendations || [""],
        nextSteps: currentReport.complianceMonitoringReportDiscussion.nextSteps || "",
      });
    }
  }, []);

  const handleSave = () => {
    updateSection("complianceMonitoringReportDiscussion", discussion);
    saveDraft();
    Alert.alert("Saved", "Compliance Discussion saved successfully");
  };

  const handleSaveToDraft = async () => {
    updateSection("complianceMonitoringReportDiscussion", discussion);
    await saveDraft();
    Alert.alert("Saved", "Compliance Discussion saved to draft successfully");
  };

  const handleStay = () => {
    // User chose to stay on the page
    console.log("User chose to stay on Compliance Discussion screen");
  };

  const handleDiscard = () => {
    Alert.alert(
      "Discard Changes",
      "Are you sure you want to discard your changes?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            // Reload original data from store
            if (currentReport?.complianceMonitoringReportDiscussion) {
              setDiscussion({
                summary: currentReport.complianceMonitoringReportDiscussion.summary || "",
                keyFindings: currentReport.complianceMonitoringReportDiscussion.keyFindings || [""],
                recommendations: currentReport.complianceMonitoringReportDiscussion.recommendations || [""],
                nextSteps: currentReport.complianceMonitoringReportDiscussion.nextSteps || "",
              });
            } else {
              setDiscussion({
                summary: "",
                keyFindings: [""],
                recommendations: [""],
                nextSteps: "",
              });
            }
          },
        },
      ]
    );
  };

  const handleExit = () => {
    // Save and navigate back
    updateSection("complianceMonitoringReportDiscussion", discussion);
    saveDraft();
    navigation.goBack();
  };

  const handleNext = () => {
    updateSection("complianceMonitoringReportDiscussion", discussion);
    saveDraft();
    // Navigate to the next section (Air Quality Assessment)
    navigation.navigate("AirQualityAssessmentScreen");
  };

  const addKeyFinding = () => {
    setDiscussion((prev) => ({
      ...prev,
      keyFindings: [...prev.keyFindings, ""],
    }));
  };

  const removeKeyFinding = (index: number) => {
    if (discussion.keyFindings.length > 1) {
      setDiscussion((prev) => ({
        ...prev,
        keyFindings: prev.keyFindings.filter((_, i) => i !== index),
      }));
    }
  };

  const updateKeyFinding = (index: number, value: string) => {
    setDiscussion((prev) => ({
      ...prev,
      keyFindings: prev.keyFindings.map((item, i) => (i === index ? value : item)),
    }));
  };

  const addRecommendation = () => {
    setDiscussion((prev) => ({
      ...prev,
      recommendations: [...prev.recommendations, ""],
    }));
  };

  const removeRecommendation = (index: number) => {
    if (discussion.recommendations.length > 1) {
      setDiscussion((prev) => ({
        ...prev,
        recommendations: prev.recommendations.filter((_, i) => i !== index),
      }));
    }
  };

  const updateRecommendation = (index: number, value: string) => {
    setDiscussion((prev) => ({
      ...prev,
      recommendations: prev.recommendations.map((item, i) => (i === index ? value : item)),
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <CMSHeader 
        onBack={() => navigation.goBack()}
        onSave={handleSave}
        onStay={handleStay}
        onSaveToDraft={handleSaveToDraft}
        onDiscard={handleDiscard}
        allowEdit={false}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Compliance Monitoring Report Discussion</Text>
          <Text style={styles.subtitle}>
            Provide detailed discussion of compliance findings and recommendations
          </Text>
        </View>

        {/* Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Executive Summary <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={discussion.summary}
            onChangeText={(value) => setDiscussion({ ...discussion, summary: value })}
            placeholder="Provide an executive summary of the compliance monitoring report..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={6}
          />
        </View>

        {/* Key Findings Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Key Findings <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity style={styles.addButton} onPress={addKeyFinding}>
              <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
              <Text style={styles.addButtonText}>Add Finding</Text>
            </TouchableOpacity>
          </View>

          {discussion.keyFindings.map((finding, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.listItemHeader}>
                <Text style={styles.listItemLabel}>Finding {index + 1}</Text>
                {discussion.keyFindings.length > 1 && (
                  <TouchableOpacity 
                    onPress={() => removeKeyFinding(index)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={finding}
                onChangeText={(value) => updateKeyFinding(index, value)}
                placeholder={`Enter key finding ${index + 1}...`}
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
              />
            </View>
          ))}
        </View>

        {/* Recommendations Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Recommendations <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity style={styles.addButton} onPress={addRecommendation}>
              <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
              <Text style={styles.addButtonText}>Add Recommendation</Text>
            </TouchableOpacity>
          </View>

          {discussion.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.listItemHeader}>
                <Text style={styles.listItemLabel}>Recommendation {index + 1}</Text>
                {discussion.recommendations.length > 1 && (
                  <TouchableOpacity 
                    onPress={() => removeRecommendation(index)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={recommendation}
                onChangeText={(value) => updateRecommendation(index, value)}
                placeholder={`Enter recommendation ${index + 1}...`}
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
              />
            </View>
          ))}
        </View>

        {/* Next Steps Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Steps</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={discussion.nextSteps}
            onChangeText={(value) => setDiscussion({ ...discussion, nextSteps: value })}
            placeholder="Describe the next steps and action items..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.backButton]} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color={theme.colors.primary} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.nextButton]} 
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.primaryDark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.primaryDark,
  },
  required: {
    color: "#EF4444",
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1E293B",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  listItem: {
    marginBottom: 16,
  },
  listItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  listItemLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
  deleteButton: {
    padding: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  backButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

