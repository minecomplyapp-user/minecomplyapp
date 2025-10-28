import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../theme/theme";
import { CustomHeader } from "../../components/CustomHeader";
import {
  scale,
  verticalScale,
  moderateScale,
  normalizeFont,
} from "../../utils/responsive";

export default function ECCMonitoringScreen({ navigation }: any) {
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [status, setStatus] = useState<"Active" | "Inactive" | null>(null);

  const onChangeDate = (_event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    if (Platform.OS === "android") setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleShowDatePicker = () => setShowDatePicker(true);
  const onDonePress = () => setShowDatePicker(false);

  const teamFields = [
    "Contact Person",
    "Position",
    "Mailing Address",
    "Telephone No.",
    "Fax No.",
    "Email Address",
  ];

  const handleSaveAndContinue = () => {
    // You can replace this with navigation.navigate("NextPage")
    alert("Proceeding to next page...");
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <CustomHeader showSave />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ECC Monitoring Report</Text>
          <Text style={styles.headerSubtitle}>Fill out details below</Text>
        </View>

        {/* File Information */}
        <View style={styles.fileInfoSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>File Name</Text>
            <TextInput
              placeholder="Enter file name"
              placeholderTextColor="#C0C0C0"
              style={styles.input}
            />
          </View>
        </View>

        {/* General Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General Information</Text>
          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Company Name</Text>
              <TextInput
                placeholder="Enter company name"
                placeholderTextColor="#C0C0C0"
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                placeholder="Enter location"
                placeholderTextColor="#C0C0C0"
                style={styles.input}
              />
            </View>

            <TouchableOpacity
              style={[styles.gpsButton, styles.inputContainer]}
              onPress={() => alert("Capture GPS Location")}
            >
              <Ionicons
                name="location-outline"
                size={moderateScale(18)}
                color="#fff"
              />
              <Text style={styles.gpsButtonText}>Capture GPS Location</Text>
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.radioGroup}>
                {(["Active", "Inactive"] as const).map((item) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => setStatus(item)}
                    style={styles.radioButtonContainer}
                  >
                    <View
                      style={[
                        styles.radioButton,
                        status === item && styles.radioButtonSelected,
                      ]}
                    >
                      {status === item && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                    <Text style={styles.radioButtonLabel}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Date Picker */}
            <View style={[styles.inputContainer, { marginBottom: 0 }]}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={handleShowDatePicker}
              >
                <Ionicons
                  name="calendar-outline"
                  size={moderateScale(20)}
                  color={theme.colors.primaryDark}
                />
                <Text style={styles.dateText}>
                  {date.toLocaleDateString()}
                </Text>
              </TouchableOpacity>

              {showDatePicker && Platform.OS === "ios" && (
                <View style={styles.datePickerWrapper}>
                  <View style={styles.datePickerContainer}>
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="inline"
                      onChange={onChangeDate}
                      style={styles.datePicker}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={onDonePress}
                    style={styles.datePickerDoneButton}
                  >
                    <Text style={styles.datePickerDoneText}>Done</Text>
                  </TouchableOpacity>
                </View>
              )}
              {showDatePicker && Platform.OS === "android" && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                />
              )}
            </View>
          </View>
        </View>

        {/* Multipartite Monitoring Team */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Multipartite Monitoring Team</Text>

          <View style={styles.card}>
            {teamFields.map((label, index) => (
              <View
                key={index}
                style={[
                  styles.inputContainer,
                  index === teamFields.length - 1 && { marginBottom: 0 },
                ]}
              >
                <Text style={styles.label}>{label}</Text>
                <TextInput
                  placeholder={`Enter ${label.toLowerCase()}`}
                  placeholderTextColor="#C0C0C0"
                  style={styles.input}
                />

                {/* 👇 Insert button only after the Email Address field */}
                {label === "Email Address" && (
                  <TouchableOpacity style={styles.autoPopulateButton}>
                    <Ionicons name="sync" size={16} color={theme.colors.primaryDark} />
                    <Text style={styles.autoPopulateText}>
                      Auto-populate with your saved info
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>


        {/* Save & Continue Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveAndContinue}
        >
          <Text style={styles.saveButtonText}>Save & Continue</Text>
          <Ionicons
            name="arrow-forward"
            size={moderateScale(18)}
            color="#fff"
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: theme.colors.background || "#F8F9FA",
  },
  scrollContent: {
    paddingBottom: verticalScale(50),
  },
  header: {
    paddingHorizontal: scale(22),
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(16),
  },
  headerTitle: {
    fontFamily: theme.typography.bold,
    fontSize: normalizeFont(26),
    color: theme.colors.primaryDark,
    marginBottom: verticalScale(4),
  },
  headerSubtitle: {
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(15),
    color: theme.colors.textLight,
  },
  fileInfoSection: {
    paddingHorizontal: scale(22),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(10),
  },
  section: {
    paddingHorizontal: scale(22),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(10),
  },
  sectionTitle: {
    fontFamily: theme.typography.bold,
    fontSize: normalizeFont(20),
    color: theme.colors.title,
    marginBottom: verticalScale(12),
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: moderateScale(12),
    padding: scale(18),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: verticalScale(18),
  },
  label: {
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(15),
    color: theme.colors.text,
    marginBottom: verticalScale(6),
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(14),
    fontSize: normalizeFont(16),
    color: theme.colors.text,
    fontFamily: theme.typography.regular,
    backgroundColor: "#FFFFFF",
  },
  gpsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(8),
    backgroundColor: theme.colors.primaryDark,
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(14),
  },
  gpsButtonText: {
    color: "#fff",
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(15),
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(30),
    marginTop: verticalScale(6),
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButton: {
    height: moderateScale(20),
    width: moderateScale(20),
    borderRadius: moderateScale(10),
    borderWidth: 2,
    borderColor: "#CCC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(8),
  },
  radioButtonSelected: {
    borderColor: theme.colors.primaryDark,
  },
  radioButtonInner: {
    height: moderateScale(10),
    width: moderateScale(10),
    borderRadius: moderateScale(5),
    backgroundColor: theme.colors.primaryDark,
  },
  radioButtonLabel: {
    fontFamily: theme.typography.medium,
    color: theme.colors.text,
    fontSize: normalizeFont(15),
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
    backgroundColor: "#F6F6F6",
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(14),
  },
  datePickerWrapper: {
    marginTop: verticalScale(10),
    alignSelf: "center",
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "visible",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  datePickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "visible",
    zIndex: 999,
  },
  datePicker: {
    width: "100%",
    backgroundColor: "#fff",
    transform: [{ scale: 1.02 }],
  },
  datePickerDoneButton: {
    alignItems: "flex-end",
    paddingTop: verticalScale(6),
  },
  datePickerDoneText: {
    color: theme.colors.primaryDark,
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(16),
  },
    dateText: {
    color: theme.colors.text,
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(16),
  },
autoPopulateButton: {
  flexDirection: "row",
  alignItems: "center",
  alignSelf: "flex-end", // ✅ aligns to the right
  marginTop: 10,
},
autoPopulateText: {
  color: theme.colors.primaryDark,
  fontWeight: "500",
  marginLeft: 6,
  fontSize: 13,
},
  saveButton: {
    marginHorizontal: scale(22),
    marginTop: verticalScale(30),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: scale(8),
    backgroundColor: theme.colors.primaryDark,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(14),
  },
  saveButtonText: {
    color: "#fff",
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(16),
  },
});
