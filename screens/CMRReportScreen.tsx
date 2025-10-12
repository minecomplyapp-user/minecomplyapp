import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ReportInfoSection from "../components/CMR/ReportInfoSection";
import MonitoringActivitiesSection from "../components/CMR/MonitoringActivitiesSection";
import FindingsSection from "../components/CMR/FindingsSection";
import CorrectiveActionsSection from "../components/CMR/CorrectiveActionsSection";
import ConclusionSection from "../components/CMR/ConclusionSection";
import SupportingDocumentsSection from "../components/CMR/SupportingDocumentsSection";

interface MonitoringActivity {
  activityId: string;
  activityType: string;
  datePerformed: string;
  performedBy: string;
  observations: string;
}

interface Finding {
  findingId: string;
  category: "major" | "minor" | "observation" | "";
  description: string;
  location: string;
  evidence: string;
}

interface CorrectiveAction {
  actionId: string;
  relatedFinding: string;
  actionRequired: string;
  responsibleParty: string;
  targetDate: string;
  status: "pending" | "in-progress" | "completed" | "";
}

const CMRReportScreen = ({ route, navigation }: any) => {
  const { submissionId, projectName, projectId } = route?.params || {};
  const [reportInfo, setReportInfo] = useState({
    projectName: projectName || "",
    permitHolder: "",
    monitoringPeriod: "",
    reportDate: "",
    monitoredBy: "",
    location: "",
  });
  const [activities, setActivities] = useState<MonitoringActivity[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveAction[]>([]);
  const [conclusion, setConclusion] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const addActivity = () => {
    const newActivity: MonitoringActivity = {
      activityId: "",
      activityType: "",
      datePerformed: "",
      performedBy: "",
      observations: "",
    };
    setActivities((prev) => [...prev, newActivity]);
  };

  const deleteActivity = (index: number) => {
    Alert.alert(
      "Delete Activity",
      "Are you sure you want to delete this monitoring activity?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setActivities((prev) => prev.filter((_, i) => i !== index));
          },
        },
      ]
    );
  };

  const updateActivity = (
    index: number,
    field: keyof MonitoringActivity,
    value: any
  ) => {
    const updated = [...activities];
    updated[index] = { ...updated[index], [field]: value };
    setActivities(updated);
  };

  const addFinding = () => {
    const newFinding: Finding = {
      findingId: "",
      category: "",
      description: "",
      location: "",
      evidence: "",
    };
    setFindings((prev) => [...prev, newFinding]);
  };

  const deleteFinding = (index: number) => {
    Alert.alert(
      "Delete Finding",
      "Are you sure you want to delete this finding?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setFindings((prev) => prev.filter((_, i) => i !== index));
          },
        },
      ]
    );
  };

  const updateFinding = (
    index: number,
    field: keyof Finding,
    value: any
  ) => {
    const updated = [...findings];
    updated[index] = { ...updated[index], [field]: value };
    setFindings(updated);
  };

  const addCorrectiveAction = () => {
    const newAction: CorrectiveAction = {
      actionId: "",
      relatedFinding: "",
      actionRequired: "",
      responsibleParty: "",
      targetDate: "",
      status: "",
    };
    setCorrectiveActions((prev) => [...prev, newAction]);
  };

  const deleteCorrectiveAction = (index: number) => {
    Alert.alert(
      "Delete Corrective Action",
      "Are you sure you want to delete this corrective action?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setCorrectiveActions((prev) => prev.filter((_, i) => i !== index));
          },
        },
      ]
    );
  };

  const updateCorrectiveAction = (
    index: number,
    field: keyof CorrectiveAction,
    value: any
  ) => {
    const updated = [...correctiveActions];
    updated[index] = { ...updated[index], [field]: value };
    setCorrectiveActions(updated);
  };

  const updateReportInfo = (field: string, value: string) => {
    setReportInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = () => {
    Alert.alert("Draft Saved", "Your CMR report has been saved as draft.");
  };

  const handleSubmit = () => {
    if (
      !reportInfo.permitHolder ||
      !reportInfo.monitoringPeriod ||
      !reportInfo.reportDate
    ) {
      Alert.alert(
        "Missing Information",
        "Please fill in all required report information fields."
      );
      return;
    }
    Alert.alert(
      "Submit Report",
      "Are you sure you want to submit this CMR report?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Submit",
          onPress: () => {
            Alert.alert("Success", "CMR report submitted successfully!");
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <ReportInfoSection
          reportInfo={reportInfo}
          updateReportInfo={updateReportInfo}
        />
        <MonitoringActivitiesSection
          activities={activities}
          addActivity={addActivity}
          deleteActivity={deleteActivity}
          updateActivity={updateActivity}
        />
        <FindingsSection
          findings={findings}
          addFinding={addFinding}
          deleteFinding={deleteFinding}
          updateFinding={updateFinding}
        />
        <CorrectiveActionsSection
          correctiveActions={correctiveActions}
          addCorrectiveAction={addCorrectiveAction}
          deleteCorrectiveAction={deleteCorrectiveAction}
          updateCorrectiveAction={updateCorrectiveAction}
        />
        <ConclusionSection
          conclusion={conclusion}
          setConclusion={setConclusion}
        />
        <SupportingDocumentsSection
          uploadedImages={uploadedImages}
          setUploadedImages={setUploadedImages}
        />
        <View style={{ height: 100 }} />
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleSaveDraft}>
          <Ionicons name="save-outline" size={20} color="#007AFF" />
          <Text style={styles.secondaryButtonText}>Save Draft</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
          <Text style={styles.primaryButtonText}>Submit Report</Text>
          <Ionicons name="checkmark-circle" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
    gap: 5,
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 5,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CMRReportScreen;