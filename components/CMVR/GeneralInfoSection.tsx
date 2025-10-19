import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
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
  const [isCapturingLocation, setIsCapturingLocation] = React.useState(false);

  const updateGeneralInfo = (field: keyof GeneralInfo, value: string) => {
    setGeneralInfo((prev) => ({ ...prev, [field]: value }));
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
});

export default GeneralInfoSection;