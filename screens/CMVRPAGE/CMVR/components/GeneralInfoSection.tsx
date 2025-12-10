import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
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
  
  // ✅ NEW: Date picker states
  const [showDateOfCompliancePicker, setShowDateOfCompliancePicker] = useState(false);
  const [showDateOfCMRSubmissionPicker, setShowDateOfCMRSubmissionPicker] = useState(false);
  
  // Helper function to parse date string (MM/DD/YYYY) to Date object
  const parseDateString = (dateString: string | undefined): Date | null => {
    if (!dateString || dateString.trim() === "") return null;
    // Try to parse MM/DD/YYYY format
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const month = parseInt(parts[0], 10) - 1; // Month is 0-indexed
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    // Try to parse as ISO string or default Date constructor
    const parsed = new Date(dateString);
    return isNaN(parsed.getTime()) ? null : parsed;
  };
  
  // Helper function to format Date to MM/DD/YYYY string
  const formatDateToString = (date: Date | null): string => {
    if (!date) return "";
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };
  
  const handleDateOfComplianceConfirm = (selectedDate: Date) => {
    setShowDateOfCompliancePicker(false);
    onChange("dateOfCompliance", formatDateToString(selectedDate));
  };
  
  const handleDateOfCMRSubmissionConfirm = (selectedDate: Date) => {
    setShowDateOfCMRSubmissionPicker(false);
    onChange("dateOfCMRSubmission", formatDateToString(selectedDate));
  };

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      // ✅ FIX: Add comprehensive error handling for location services
      console.log("=== Getting Current Location ===");
      
      // Check if location services are enabled
      const isEnabled = await Location.hasServicesEnabledAsync();
      if (!isEnabled) {
        console.warn("Location services disabled");
        Alert.alert(
          "Location Services Disabled",
          "Please enable location services in your device settings."
        );
        setIsLoadingLocation(false);
        return;
      }

      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log("Location permission status:", status);

      if (status !== "granted") {
        console.warn("Location permission denied");
        Alert.alert(
          "Permission Denied",
          "Location permission is required to use GPS."
        );
        setIsLoadingLocation(false);
        return;
      }

      // ✅ FIX: Reduce timeout and improve error handling
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Location request timed out")), 10000)
      );

      const locationPromise = Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
        distanceInterval: 0,
      });

      const currentLocation = (await Promise.race([
        locationPromise,
        timeoutPromise,
      ])) as Location.LocationObject;

      // ✅ FIX: Validate location data before using
      if (!currentLocation || !currentLocation.coords) {
        throw new Error("Invalid location data received");
      }

      const { latitude, longitude } = currentLocation.coords;
      console.log(`✅ Location obtained: ${latitude}, ${longitude}`);

      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setSelectedLocation({ latitude, longitude });
    } catch (error: any) {
      console.error("❌ Location error:", error);

      let errorMessage = "Failed to get current location.";

      // ✅ FIX: More comprehensive error handling
      if (error?.message?.includes?.("timeout")) {
        errorMessage =
          "Location request timed out. Please try again or select location manually on the map.";
      } else if (error?.code === "E_LOCATION_UNAVAILABLE") {
        errorMessage = "Location is currently unavailable. Please try again.";
      } else if (error?.code === "E_LOCATION_SETTINGS_UNSATISFIED") {
        errorMessage =
          "Location settings are not satisfied. Please check your device settings.";
      } else if (error?.message) {
        errorMessage = `Location error: ${error.message}`;
      }

      Alert.alert("Location Error", errorMessage, [
        {
          text: "Use Default Location",
          onPress: () => {
            // Use default Cebu location
            console.log("Using default Cebu location");
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
    try {
      // ✅ FIX: Wrap map opening in try-catch to prevent crashes
      console.log("Opening map picker");
      
      // ✅ FIX: Set default region before opening map to prevent MapView crash
      if (!mapRegion.latitude || !mapRegion.longitude) {
        setMapRegion({
          latitude: 10.3157, // Default to Cebu, Philippines
          longitude: 123.8854,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
      
      setShowMap(true);
      
      // ✅ FIX: Don't await getCurrentLocation - let it run in background
      // This prevents blocking if location fetch fails
      getCurrentLocation().catch((error) => {
        console.warn("Background location fetch failed, but map is still usable:", error);
      });
    } catch (error) {
      console.error("❌ Error opening map:", error);
      // ✅ FIX: Still show map with default region even if there's an error
      setMapRegion({
        latitude: 10.3157,
        longitude: 123.8854,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setShowMap(true);
    }
  };

  const handleMapPress = (event: any) => {
    try {
      // ✅ FIX: Add null/undefined checks to prevent crashes
      if (!event?.nativeEvent?.coordinate) {
        console.warn("Invalid map press event:", event);
        return;
      }
      
      const { latitude, longitude } = event.nativeEvent.coordinate;
      
      // ✅ FIX: Validate coordinates are valid numbers
      if (
        typeof latitude !== 'number' ||
        typeof longitude !== 'number' ||
        isNaN(latitude) ||
        isNaN(longitude) ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        console.warn("Invalid coordinates:", { latitude, longitude });
        Alert.alert("Invalid Location", "Please select a valid location on the map.");
        return;
      }
      
      setSelectedLocation({ latitude, longitude });
    } catch (error) {
      console.error("❌ Error handling map press:", error);
      Alert.alert("Error", "Failed to select location. Please try again.");
    }
  };

  const confirmLocation = async () => {
    // ✅ FIX: Enhanced validation before confirming location
    if (!selectedLocation) {
      Alert.alert("No Location Selected", "Please select a location on the map first.");
      return;
    }
    
    // ✅ FIX: Validate coordinates are valid numbers
    if (
      typeof selectedLocation.latitude !== 'number' ||
      typeof selectedLocation.longitude !== 'number' ||
      isNaN(selectedLocation.latitude) ||
      isNaN(selectedLocation.longitude) ||
      selectedLocation.latitude < -90 ||
      selectedLocation.latitude > 90 ||
      selectedLocation.longitude < -180 ||
      selectedLocation.longitude > 180
    ) {
      Alert.alert("Invalid Location", "The selected location is invalid. Please select a different location.");
      return;
    }
    
    try {
      // ✅ FIX: Add timeout for reverse geocoding to prevent hanging
      const geocodeTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Reverse geocoding timed out")), 5000)
      );
      
      const geocodePromise = Location.reverseGeocodeAsync({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      });
      
      const [address] = await Promise.race([geocodePromise, geocodeTimeout]) as any[];
      
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
    } catch (error: any) {
      console.error("Reverse geocode error:", error);
      // ✅ FIX: Fallback to coordinates even if geocoding fails
      const locationString = `${selectedLocation.latitude.toFixed(6)}, ${selectedLocation.longitude.toFixed(6)}`;
      onChange("location", locationString);
      
      // Show warning but don't block the user
      if (!error?.message?.includes("timed out")) {
        Alert.alert(
          "Location Saved",
          "Location saved as coordinates. Address lookup failed, but you can edit it manually.",
          [{ text: "OK" }]
        );
      }
    } finally {
      // ✅ FIX: Always close map modal, even if there's an error
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
            value={fileName || ""}
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
            value={companyName || ""}
            onChangeText={(text) => onChange("companyName", text)}
            placeholder="Enter company name"
            placeholderTextColor="#94A3B8"
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Project Name</Text>
          <TextInput
            style={styles.input}
            value={projectName || ""}
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
              <Text style={styles.locationText}>{location || ""}</Text>
            </View>
          )}
        </View>
        <View style={styles.rowContainer}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Quarter</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={quarter || ""}
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
                selectedValue={year || ""}
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
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDateOfCompliancePicker(true)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ color: dateOfCompliance ? "#1E293B" : "#94A3B8" }}>
                {dateOfCompliance || "Month/Date/Year"}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#94A3B8" />
            </View>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={showDateOfCompliancePicker}
            mode="date"
            date={parseDateString(dateOfCompliance) || new Date()}
            onConfirm={handleDateOfComplianceConfirm}
            onCancel={() => setShowDateOfCompliancePicker(false)}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            textColor={Platform.OS === "ios" ? "#000000" : undefined}
            pickerContainerStyleIOS={{
              backgroundColor: "#FFFFFF",
            }}
            modalStyleIOS={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Monitoring Period Covered</Text>
          <TextInput
            style={styles.input}
            value={monitoringPeriod || ""}
            onChangeText={(text) => onChange("monitoringPeriod", text)}
            placeholder="Enter monitoring period"
            placeholderTextColor="#94A3B8"
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Date of CMR Submission</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDateOfCMRSubmissionPicker(true)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ color: dateOfCMRSubmission ? "#1E293B" : "#94A3B8" }}>
                {dateOfCMRSubmission || "Month/Date/Year"}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#94A3B8" />
            </View>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={showDateOfCMRSubmissionPicker}
            mode="date"
            date={parseDateString(dateOfCMRSubmission) || new Date()}
            onConfirm={handleDateOfCMRSubmissionConfirm}
            onCancel={() => setShowDateOfCMRSubmissionPicker(false)}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            textColor={Platform.OS === "ios" ? "#000000" : undefined}
            pickerContainerStyleIOS={{
              backgroundColor: "#FFFFFF",
            }}
            modalStyleIOS={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
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
          {/* ✅ FIX: Wrap MapView in error boundary */}
          {(() => {
            try {
              return (
                <MapView
                  style={styles.map}
                  region={mapRegion}
                  onPress={handleMapPress}
                  showsUserLocation
                  showsMyLocationButton
                  onError={(error) => {
                    console.error("❌ MapView error:", error);
                    Alert.alert(
                      "Map Error",
                      "Failed to load map. Please try again or enter location manually."
                    );
                  }}
                >
                  {selectedLocation && <Marker coordinate={selectedLocation} />}
                </MapView>
              );
            } catch (error) {
              console.error("❌ MapView render error:", error);
              return (
                <View style={[styles.map, { justifyContent: "center", alignItems: "center", backgroundColor: "#F3F4F6" }]}>
                  <Ionicons name="map-outline" size={64} color="#9CA3AF" />
                  <Text style={{ marginTop: 16, color: "#6B7280", textAlign: "center", paddingHorizontal: 20 }}>
                    Map failed to load. Please enter location manually or try again later.
                  </Text>
                  <TouchableOpacity
                    style={{ marginTop: 16, padding: 12, backgroundColor: "#02217C", borderRadius: 8 }}
                    onPress={() => setShowMap(false)}
                  >
                    <Text style={{ color: "white" }}>Close</Text>
                  </TouchableOpacity>
                </View>
              );
            }
          })()}
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
