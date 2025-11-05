import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
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
  const [selectedLocation, setSelectedLocation] =
    useState<LocationCoordinates | null>(null);
  const [mapRegion, setMapRegion] = useState<MapRegion>({
    latitude: 10.3157,
    longitude: 123.8854,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to use GPS."
        );
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = currentLocation.coords;
      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setSelectedLocation({ latitude, longitude });
    } catch (error) {
      Alert.alert("Error", "Failed to get current location.");
    }
  };

  const openMapPicker = async () => {
    await getCurrentLocation();
    setShowMap(true);
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
        Alert.alert("Error", "Failed to get address for this location.");
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
        <View style={styles.multiFieldContainer}>
          <View style={styles.multiField}>
            <Text style={styles.label}>Region</Text>
            <TextInput
              style={styles.input}
              value={region}
              onChangeText={(text) => onChange("region", text)}
              placeholder="Region"
              placeholderTextColor="#94A3B8"
            />
          </View>
          <View style={styles.multiField}>
            <Text style={styles.label}>Province</Text>
            <TextInput
              style={styles.input}
              value={province}
              onChangeText={(text) => onChange("province", text)}
              placeholder="Province"
              placeholderTextColor="#94A3B8"
            />
          </View>
          <View style={styles.multiField}>
            <Text style={styles.label}>Municipality / City</Text>
            <TextInput
              style={styles.input}
              value={municipality}
              onChangeText={(text) => onChange("municipality", text)}
              placeholder="Municipality"
              placeholderTextColor="#94A3B8"
            />
          </View>
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
            <TextInput
              style={styles.input}
              value={year}
              onChangeText={(text) => onChange("year", text)}
              placeholder="Enter year"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
            />
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
          <View style={styles.mapFooter}>
            <TouchableOpacity
              style={styles.myLocationButton}
              onPress={getCurrentLocation}
            >
              <Ionicons name="navigate" size={20} color="white" />
              <Text style={styles.myLocationButtonText}>My Location</Text>
            </TouchableOpacity>
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
