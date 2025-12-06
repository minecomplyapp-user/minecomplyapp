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
import { CMSHeader } from "../../../components/CustomHeader";
import { useCmvrStore } from "../../../store/cmvrStore";
import { StyleSheet } from "react-native";
import { theme } from "../../../theme/theme";

/**
 * Air Quality Assessment Detailed Screen
 * 
 * This new section comes after the Compliance Discussion in the CMVR flow.
 * It provides detailed air quality assessment beyond the existing air quality monitoring.
 */
export default function AirQualityAssessmentScreen({ navigation, route }: any) {
  const { currentReport, updateSection, saveDraft } = useCmvrStore();
  
  const [assessment, setAssessment] = useState({
    overallStatus: "",
    trendAnalysis: "",
    comparisonToPrevious: "",
    exceedances: [""],
    mitigationMeasures: [""],
    futureProjections: "",
  });

  // Load existing data on mount
  useEffect(() => {
    if (currentReport?.airQualityAssessmentDetailed) {
      setAssessment({
        overallStatus: currentReport.airQualityAssessmentDetailed.overallStatus || "",
        trendAnalysis: currentReport.airQualityAssessmentDetailed.trendAnalysis || "",
        comparisonToPrevious: currentReport.airQualityAssessmentDetailed.comparisonToPrevious || "",
        exceedances: currentReport.airQualityAssessmentDetailed.exceedances || [""],
        mitigationMeasures: currentReport.airQualityAssessmentDetailed.mitigationMeasures || [""],
        futureProjections: currentReport.airQualityAssessmentDetailed.futureProjections || "",
      });
    }
  }, []);

  const handleSave = () => {
    updateSection("airQualityAssessmentDetailed", assessment);
    saveDraft();
    Alert.alert("Saved", "Air Quality Assessment saved successfully");
  };

  const handleNext = () => {
    updateSection("airQualityAssessmentDetailed", assessment);
    saveDraft();
    // Navigate to the next section or complete the report
    navigation.navigate("CMVRDocumentExport", {
      cmvrReportId: currentReport?.id,
      fileName: currentReport?.generalInfo?.reportTitle || "CMVR Report",
    });
  };

  const addExceedance = () => {
    setAssessment((prev) => ({
      ...prev,
      exceedances: [...prev.exceedances, ""],
    }));
  };

  const removeExceedance = (index: number) => {
    if (assessment.exceedances.length > 1) {
      setAssessment((prev) => ({
        ...prev,
        exceedances: prev.exceedances.filter((_, i) => i !== index),
      }));
    }
  };

  const updateExceedance = (index: number, value: string) => {
    setAssessment((prev) => ({
      ...prev,
      exceedances: prev.exceedances.map((item, i) => (i === index ? value : item)),
    }));
  };

  const addMitigationMeasure = () => {
    setAssessment((prev) => ({
      ...prev,
      mitigationMeasures: [...prev.mitigationMeasures, ""],
    }));
  };

  const removeMitigationMeasure = (index: number) => {
    if (assessment.mitigationMeasures.length > 1) {
      setAssessment((prev) => ({
        ...prev,
        mitigationMeasures: prev.mitigationMeasures.filter((_, i) => i !== index),
      }));
    }
  };

  const updateMitigationMeasure = (index: number, value: string) => {
    setAssessment((prev) => ({
      ...prev,
      mitigationMeasures: prev.mitigationMeasures.map((item, i) => (i === index ? value : item)),
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <CMSHeader 
        showSave={true} 
        onSave={handleSave}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Air Quality Assessment (Detailed)</Text>
          <Text style={styles.subtitle}>
            Provide comprehensive air quality assessment and analysis
          </Text>
        </View>

        {/* Overall Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Overall Air Quality Status <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={assessment.overallStatus}
            onChangeText={(value) => setAssessment({ ...assessment, overallStatus: value })}
            placeholder="Describe the overall air quality status for this monitoring period..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Trend Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Trend Analysis <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={assessment.trendAnalysis}
            onChangeText={(value) => setAssessment({ ...assessment, trendAnalysis: value })}
            placeholder="Analyze trends in air quality parameters over time..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Comparison to Previous */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Comparison to Previous Period
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={assessment.comparisonToPrevious}
            onChangeText={(value) => setAssessment({ ...assessment, comparisonToPrevious: value })}
            placeholder="Compare current results with previous monitoring periods..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Exceedances Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Limit Exceedances (if any)
            </Text>
            <TouchableOpacity style={styles.addButton} onPress={addExceedance}>
              <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
              <Text style={styles.addButtonText}>Add Exceedance</Text>
            </TouchableOpacity>
          </View>

          {assessment.exceedances.map((exceedance, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.listItemHeader}>
                <Text style={styles.listItemLabel}>Exceedance {index + 1}</Text>
                {assessment.exceedances.length > 1 && (
                  <TouchableOpacity 
                    onPress={() => removeExceedance(index)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={exceedance}
                onChangeText={(value) => updateExceedance(index, value)}
                placeholder={`Describe exceedance ${index + 1}...`}
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
              />
            </View>
          ))}
        </View>

        {/* Mitigation Measures Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Mitigation Measures <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity style={styles.addButton} onPress={addMitigationMeasure}>
              <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
              <Text style={styles.addButtonText}>Add Measure</Text>
            </TouchableOpacity>
          </View>

          {assessment.mitigationMeasures.map((measure, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.listItemHeader}>
                <Text style={styles.listItemLabel}>Measure {index + 1}</Text>
                {assessment.mitigationMeasures.length > 1 && (
                  <TouchableOpacity 
                    onPress={() => removeMitigationMeasure(index)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={measure}
                onChangeText={(value) => updateMitigationMeasure(index, value)}
                placeholder={`Enter mitigation measure ${index + 1}...`}
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
              />
            </View>
          ))}
        </View>

        {/* Future Projections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Future Projections
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={assessment.futureProjections}
            onChangeText={(value) => setAssessment({ ...assessment, futureProjections: value })}
            placeholder="Provide projections for future monitoring periods..."
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
            <Text style={styles.nextButtonText}>Complete</Text>
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
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

