import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

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
  const [isCapturingLocation, setIsCapturingLocation] = useState(false);
  const [showQuarterPicker, setShowQuarterPicker] = useState(false);

  const quarters = ["1st Quarter", "2nd Quarter", "3rd Quarter", "4th Quarter"];

  const updateGeneralInfo = (field: keyof GeneralInfo, value: string) => {
    setGeneralInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuarterSelect = (quarter: string) => {
    updateGeneralInfo("quarter", quarter);
    setShowQuarterPicker(false);
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

      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses && addresses.length > 0) {
        const address = addresses[0];

        const addressComponents = [];

        if (address.name) addressComponents.push(address.name);
        if (address.street) addressComponents.push(address.street);
        if (address.streetNumber) addressComponents.push(address.streetNumber);
        if (address.district) addressComponents.push(address.district);
        if (address.subregion) addressComponents.push(address.subregion);
        if (address.city) addressComponents.push(address.city);
        if (address.region) addressComponents.push(address.region);
        if (address.postalCode) addressComponents.push(address.postalCode);
        if (address.country) addressComponents.push(address.country);

        const formattedAddress = addressComponents.join(", ");

        if (formattedAddress) {
          updateGeneralInfo("location", formattedAddress);
          setIsCapturingLocation(false);
          Alert.alert("Location Captured", formattedAddress);
        } else {
          const coordsString = `Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}`;
          updateGeneralInfo("location", coordsString);
          setIsCapturingLocation(false);
          Alert.alert(
            "Location Captured",
            `No address found for this location.\n${coordsString}`
          );
        }
      } else {
        const coordsString = `Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}`;
        updateGeneralInfo("location", coordsString);
        setIsCapturingLocation(false);
        Alert.alert(
          "Location Captured",
          `Could not determine address.\n${coordsString}`
        );
      }
    } catch (error) {
      setIsCapturingLocation(false);
      console.error("GPS capture error:", error);
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
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowQuarterPicker(true)}
          >
            <Text style={[styles.dropdownText, !generalInfo.quarter && styles.placeholderText]}>
              {generalInfo.quarter || "Select Quarter"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        <View style={styles.halfField}>
          <Text style={styles.label}>Year:</Text>
          <TextInput
            style={styles.input}
            value={generalInfo.year}
            onChangeText={(text) => updateGeneralInfo("year", text)}
            placeholder="Type here..."
            keyboardType="numeric"
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

      {/* Quarter Picker Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={showQuarterPicker}
        onRequestClose={() => setShowQuarterPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowQuarterPicker(false)}
        >
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Quarter</Text>
              <TouchableOpacity onPress={() => setShowQuarterPicker(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            {quarters.map((quarter, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.pickerOption,
                  generalInfo.quarter === quarter && styles.pickerOptionSelected,
                ]}
                onPress={() => handleQuarterSelect(quarter)}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    generalInfo.quarter === quarter && styles.pickerOptionTextSelected,
                  ]}
                >
                  {quarter}
                </Text>
                {generalInfo.quarter === quarter && (
                  <Ionicons name="checkmark" size={20} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: "white",
    marginTop: 0,
    padding: 16,
  },
  sectionHeader: {
    backgroundColor: "#D8D8FF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "#000",
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
  dropdownButton: {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    fontSize: 14,
    color: "#333",
  },
  placeholderText: {
    color: "#999",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    width: "80%",
    maxWidth: 400,
    overflow: "hidden",
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  pickerOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  pickerOptionSelected: {
    backgroundColor: "#F0F5FF",
  },
  pickerOptionText: {
    fontSize: 16,
    color: "#333",
  },
  pickerOptionTextSelected: {
    color: "#007AFF",
    fontWeight: "600",
  },
});

export default GeneralInfoSection;