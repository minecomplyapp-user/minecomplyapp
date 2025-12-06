import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "../../contexts/AuthContext";
import { apiPost } from "../../lib/api";
import { theme } from "../../theme/theme";

interface GuestRemarksFormProps {
  navigation: any;
  route?: {
    params?: {
      reportId?: string;
      reportType?: "CMVR" | "ECC";
    };
  };
}

/**
 * Guest Remarks Form Screen
 * 
 * Replaces Google Forms for member/guest remarks submission.
 * Allows internal submission of remarks linked to specific reports.
 */
export default function GuestRemarksForm({ navigation, route }: GuestRemarksFormProps) {
  const { user } = useAuth();
  const reportId = route?.params?.reportId || "";
  const reportType = route?.params?.reportType || "CMVR";

  const [formData, setFormData] = useState({
    reportId: reportId,
    reportType: reportType,
    guestName: user?.displayName || "",
    guestEmail: user?.email || "",
    guestRole: "Member" as "Member" | "Guest" | "Stakeholder",
    remarks: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!formData.reportId.trim()) {
      Alert.alert("Validation Error", "Please enter a Report ID");
      return;
    }

    if (!formData.guestName.trim()) {
      Alert.alert("Validation Error", "Please enter your name");
      return;
    }

    if (!formData.remarks.trim()) {
      Alert.alert("Validation Error", "Please enter your remarks");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        createdById: user?.id || null,
      };

      await apiPost("/guest-remarks", payload);

      Alert.alert(
        "Success",
        "Your remarks have been submitted successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              // Reset form
              setFormData({
                ...formData,
                remarks: "",
              });
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("Error submitting remarks:", error);
      Alert.alert(
        "Submission Failed",
        error?.message || "Failed to submit remarks. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Submit Remarks</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.introSection}>
          <Ionicons name="chatbox-ellipses" size={48} color={theme.colors.primary} />
          <Text style={styles.introTitle}>Share Your Feedback</Text>
          <Text style={styles.introText}>
            Your remarks and feedback help improve compliance monitoring.
            All submissions are recorded and reviewed by the monitoring team.
          </Text>
        </View>

        {/* Report ID */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Report ID <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={formData.reportId}
            onChangeText={(value) => setFormData({ ...formData, reportId: value })}
            placeholder="Enter Report ID"
            placeholderTextColor="#94A3B8"
            editable={!reportId} // Disable if passed from navigation
          />
        </View>

        {/* Report Type */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Report Type <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.reportType}
              onValueChange={(value) => setFormData({ ...formData, reportType: value })}
              style={styles.picker}
              enabled={!reportType || reportType === "CMVR"} // Disable if passed from navigation
            >
              <Picker.Item label="CMVR Report" value="CMVR" />
              <Picker.Item label="ECC Report" value="ECC" />
            </Picker>
          </View>
        </View>

        {/* Guest Name */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Your Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={formData.guestName}
            onChangeText={(value) => setFormData({ ...formData, guestName: value })}
            placeholder="Enter your full name"
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Guest Email */}
        <View style={styles.field}>
          <Text style={styles.label}>Email (Optional)</Text>
          <TextInput
            style={styles.input}
            value={formData.guestEmail}
            onChangeText={(value) => setFormData({ ...formData, guestEmail: value })}
            placeholder="your.email@example.com"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Guest Role */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Your Role <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.guestRole}
              onValueChange={(value) => setFormData({ ...formData, guestRole: value })}
              style={styles.picker}
            >
              <Picker.Item label="Member" value="Member" />
              <Picker.Item label="Guest" value="Guest" />
              <Picker.Item label="Stakeholder" value="Stakeholder" />
            </Picker>
          </View>
        </View>

        {/* Remarks */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Remarks/Comments <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.remarks}
            onChangeText={(value) => setFormData({ ...formData, remarks: value })}
            placeholder="Enter your remarks, feedback, or comments..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={8}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <Text style={styles.submitButtonText}>Submitting...</Text>
          ) : (
            <>
              <Ionicons name="send" size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Submit Remarks</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.primaryDark,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  introSection: {
    alignItems: "center",
    marginBottom: 32,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.primaryDark,
    marginTop: 12,
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1E293B",
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 48,
    color: "#1E293B",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 24,
    gap: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#94A3B8",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

