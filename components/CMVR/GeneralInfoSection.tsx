import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

// Define types for your props and state
type GeneralInfo = {
  companyName: string;
  location: string;
  quarter: string;
  year: string;
  dateOfCompliance: string;
  monitoringPeriod: string;
  dateOfSubmission: string;
};

type GeneralInfoSectionProps = {
  generalInfo: GeneralInfo;
  setGeneralInfo: React.Dispatch<React.SetStateAction<GeneralInfo>>;
};

const GeneralInfoSection: React.FC<GeneralInfoSectionProps> = ({
  generalInfo,
  setGeneralInfo,
}) => {
  const [isCapturingLocation, setIsCapturingLocation] = React.useState(false);

  const updateGeneralInfo = (field: keyof GeneralInfo, value: string) => {
    setGeneralInfo((prev: GeneralInfo) => ({ ...prev, [field]: value }));
  };

  const handleCaptureGPS = async () => {
    try {
      setIsCapturingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Please enable location services to capture GPS coordinates."
        );
        setIsCapturingLocation(false);
        return;
      }
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;
      updateGeneralInfo(
        "location",
        `Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}`
      );
      setIsCapturingLocation(false);
      Alert.alert(
        "Location Captured",
        `Latitude: ${latitude.toFixed(6)}\nLongitude: ${longitude.toFixed(6)}`
      );
    } catch (error) {
      setIsCapturingLocation(false);
      Alert.alert(
        "Error",
        "Failed to capture GPS location. Please make sure location services are enabled."
      );
    }
  };

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>General Information</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Company Name:</Text>
        <TextInput
          style={styles.input}
          value={generalInfo.companyName}
          onChangeText={(text) => updateGeneralInfo("companyName", text)}
          placeholder="Type here..."
        />
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Location:</Text>
        <View style={styles.locationContainer}>
          <TextInput
            style={[styles.input, styles.locationInput]}
            value={generalInfo.location}
            onChangeText={(text) => updateGeneralInfo("location", text)}
            placeholder="Type here..."
            editable={!isCapturingLocation}
          />
          <TouchableOpacity
            style={[
              styles.gpsButton,
              isCapturingLocation && styles.gpsButtonDisabled,
            ]}
            onPress={handleCaptureGPS}
            disabled={isCapturingLocation}
          >
            {isCapturingLocation ? (
              <Text style={styles.gpsButtonText}>Capturing...</Text>
            ) : (
              <>
                <Ionicons name="location" size={16} color="#007AFF" />
                <Text style={styles.gpsButtonText}>Capture GPS Location</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.rowContainer}>
        <View style={styles.halfField}>
          <Text style={styles.label}>Quarter:</Text>
          <TextInput
            style={styles.input}
            value={generalInfo.quarter}
            onChangeText={(text) => updateGeneralInfo("quarter", text)}
            placeholder="Drop down (1st, 2nd, 3rd, 4th)"
          />
        </View>
        <View style={styles.halfField}>
          <Text style={styles.label}>Year:</Text>
          <TextInput
            style={styles.input}
            value={generalInfo.year}
            onChangeText={(text) => updateGeneralInfo("year", text)}
            placeholder="Type here..."
          />
        </View>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.labelLong}>Date of Compliance Monitoring and Validation:</Text>
        <TextInput
          style={styles.input}
          value={generalInfo.dateOfCompliance}
          onChangeText={(text) => updateGeneralInfo("dateOfCompliance", text)}
          placeholder="Month/Date/Year"
        />
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.labelLong}>Monitoring Period Covered:</Text>
        <TextInput
          style={styles.input}
          value={generalInfo.monitoringPeriod}
          onChangeText={(text) => updateGeneralInfo("monitoringPeriod", text)}
          placeholder="Type here..."
        />
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.labelLong}>Date of CMB Submission:</Text>
        <TextInput
          style={styles.input}
          value={generalInfo.dateOfSubmission}
          onChangeText={(text) => updateGeneralInfo("dateOfSubmission", text)}
          placeholder="Month/Date/Year"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: "white",
    marginTop: 10,
    padding: 16,
  },
  sectionHeader: {
    backgroundColor: "#E8E3FF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  fieldRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  labelLong: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
  },
  locationContainer: {
    gap: 8,
  },
  locationInput: {
    marginBottom: 0,
  },
  gpsButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  gpsButtonDisabled: {
    opacity: 0.6,
  },
  gpsButtonText: {
    fontSize: 13,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  rowContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  halfField: {
    flex: 1,
  },
});

export default GeneralInfoSection;
