import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Picker } from "@react-native-picker/picker";
import { styles } from "../styles/generalInfo.styles";
import type {
  GeneralInfoProps,
  LocationCoordinates,
  MapRegion,
} from "../types/generalInfo.types";

export const GeneralInfoSection: React.FC<GeneralInfoProps> = ({
  fileName,
  companyName,
  projectName,
  location,
  region,
  province,
  municipality,
  quarter,
  year,
  dateOfCompliance,
  monitoringPeriod,
  dateOfCMRSubmission,
  onChange,
}) => {
  const [showMap, setShowMap] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationCoordinates | null>(null);
  const [mapRegion, setMapRegion] = useState<MapRegion>({
    latitude: 10.3157,
    longitude: 123.8854,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      // Check if location services are enabled
      const isEnabled = await Location.hasServicesEnabledAsync();
      if (!isEnabled) {
        Alert.alert(
          "Location Services Disabled",
          "Please enable location services in your device settings."
        );
        setIsLoadingLocation(false);
        return;
      }

      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to use GPS."
        );
        setIsLoadingLocation(false);
        return;
      }

      // Get current location with timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Location request timed out")), 15000)
      );

      const locationPromise = Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,
        distanceInterval: 0,
      });

      const currentLocation = (await Promise.race([
        locationPromise,
        timeoutPromise,
      ])) as Location.LocationObject;

      const { latitude, longitude } = currentLocation.coords;

      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setSelectedLocation({ latitude, longitude });
    } catch (error: any) {
      console.error("Location error:", error);

      let errorMessage = "Failed to get current location.";

      if (error.message.includes("timeout")) {
        errorMessage =
          "Location request timed out. Please try again or select location manually on the map.";
      } else if (error.code === "E_LOCATION_UNAVAILABLE") {
        errorMessage = "Location is currently unavailable. Please try again.";
      } else if (error.code === "E_LOCATION_SETTINGS_UNSATISFIED") {
        errorMessage =
          "Location settings are not satisfied. Please check your device settings.";
      }

      Alert.alert("Location Error", errorMessage, [
        {
          text: "Use Default Location",
          onPress: () => {
            // Use default Cebu location
            setMapRegion({
              latitude: 10.3157,
              longitude: 123.8854,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          },
        },
        { text: "OK" },
      ]);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const openMapPicker = async () => {
    setShowMap(true);
    // Automatically get current location when map opens
    await getCurrentLocation();
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const confirmLocation = async () => {
    if (selectedLocation) {
      try {
        const [address] = await Location.reverseGeocodeAsync({
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        });
        if (address) {
          const addressParts = [
            address.street,
            address.district,
            address.city || address.subregion,
          ].filter(Boolean);
          const fullAddress = addressParts.join(", ");
          onChange(
            "location",
            fullAddress ||
              `${selectedLocation.latitude.toFixed(6)}, ${selectedLocation.longitude.toFixed(6)}`
          );
          onChange("region", address.region || "");
          onChange("province", address.subregion || address.region || "");
          onChange("municipality", address.city || address.subregion || "");
        } else {
          const locationString = `${selectedLocation.latitude.toFixed(6)}, ${selectedLocation.longitude.toFixed(6)}`;
          onChange("location", locationString);
        }
      } catch (error) {
        console.error("Reverse geocode error:", error);
        const locationString = `${selectedLocation.latitude.toFixed(6)}, ${selectedLocation.longitude.toFixed(6)}`;
        onChange("location", locationString);
      }
      setShowMap(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name="information-circle" size={24} color="#02217C" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.sectionTitle}>General Information</Text>
            <Text style={styles.sectionSubtitle}>
              Project and company details
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.sectionContent}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            File Name <Text style={{ color: "#EF4444" }}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              (!fileName || fileName.trim() === "") && {
                borderColor: "#FCA5A5",
                backgroundColor: "#FEF2F2",
              },
            ]}
            value={fileName}
            onChangeText={(text) => onChange("fileName", text)}
            placeholder="Enter file name (required)"
            placeholderTextColor="#94A3B8"
          />
          {(!fileName || fileName.trim() === "") && (
            <Text style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>
              File name is required to continue
            </Text>
          )}
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Company Name</Text>
          <TextInput
            style={styles.input}
            value={companyName}
            onChangeText={(text) => onChange("companyName", text)}
            placeholder="Enter company name"
            placeholderTextColor="#94A3B8"
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Project Name</Text>
          <TextInput
            style={styles.input}
            value={projectName}
            onChangeText={(text) => onChange("projectName", text)}
            placeholder="Enter project name"
            placeholderTextColor="#94A3B8"
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Project Location</Text>
          <TouchableOpacity style={styles.mapButton} onPress={openMapPicker}>
            <Ionicons name="map" size={20} color="white" />
            <Text style={styles.mapButtonText}>
              {location ? "Change Location" : "Select Location on Map"}
            </Text>
          </TouchableOpacity>
          {location && (
            <View style={styles.locationDisplay}>
              <Ionicons name="location" size={16} color="#10B981" />
              <Text style={styles.locationText}>{location}</Text>
            </View>
          )}
        </View>
        <View style={styles.rowContainer}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Quarter</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={quarter}
                onValueChange={(value: string) => onChange("quarter", value)}
                style={styles.picker}
              >
                <Picker.Item label="Select Quarter" value="" />
                <Picker.Item label="1st Quarter" value="1st" />
                <Picker.Item label="2nd Quarter" value="2nd" />
                <Picker.Item label="3rd Quarter" value="3rd" />
                <Picker.Item label="4th Quarter" value="4th" />
              </Picker>
            </View>
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>Year</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={year}
                onValueChange={(value: string) => onChange("year", value)}
                style={styles.picker}
              >
                <Picker.Item label="Select Year" value="" />
                {Array.from({ length: 51 }, (_, i) => {
                  const yearValue = (
                    new Date().getFullYear() -
                    25 +
                    i
                  ).toString();
                  return (
                    <Picker.Item
                      key={yearValue}
                      label={yearValue}
                      value={yearValue}
                    />
                  );
                })}
              </Picker>
            </View>
          </View>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Date of Compliance Monitoring and Validation
          </Text>
          <TextInput
            style={styles.input}
            value={dateOfCompliance}
            onChangeText={(text) => onChange("dateOfCompliance", text)}
            placeholder="Month/Date/Year"
            placeholderTextColor="#94A3B8"
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Monitoring Period Covered</Text>
          <TextInput
            style={styles.input}
            value={monitoringPeriod}
            onChangeText={(text) => onChange("monitoringPeriod", text)}
            placeholder="Enter monitoring period"
            placeholderTextColor="#94A3B8"
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Date of CMR Submission</Text>
          <TextInput
            style={styles.input}
            value={dateOfCMRSubmission}
            onChangeText={(text) => onChange("dateOfCMRSubmission", text)}
            placeholder="Month/Date/Year"
            placeholderTextColor="#94A3B8"
          />
        </View>
      </View>
      <Modal
        visible={showMap}
        animationType="slide"
        onRequestClose={() => setShowMap(false)}
      >
        <View style={styles.mapContainer}>
          <View style={styles.mapHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setShowMap(false)}
            >
              <Ionicons name="arrow-back" size={24} color="#1E293B" />
            </TouchableOpacity>
            <Text style={styles.mapTitle}>Select Project Location</Text>
            <View style={{ width: 40 }} />
          </View>
          <MapView
            style={styles.map}
            region={mapRegion}
            onPress={handleMapPress}
            showsUserLocation
            showsMyLocationButton
          >
            {selectedLocation && <Marker coordinate={selectedLocation} />}
          </MapView>
          {isLoadingLocation && (
            <View
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginLeft: -25,
                marginTop: -25,
                backgroundColor: "white",
                padding: 15,
                borderRadius: 10,
                elevation: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              }}
            >
              <ActivityIndicator size="large" color="#02217C" />
              <Text style={{ marginTop: 10, color: "#02217C" }}>
                Getting location...
              </Text>
            </View>
          )}
          <View style={styles.mapFooter}>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                !selectedLocation && styles.confirmButtonDisabled,
              ]}
              onPress={confirmLocation}
              disabled={!selectedLocation}
            >
              <Ionicons name="checkmark" size={20} color="white" />
              <Text style={styles.confirmButtonText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GeneralInfoSection;
