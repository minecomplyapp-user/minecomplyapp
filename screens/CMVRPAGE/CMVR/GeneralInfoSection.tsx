import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';

interface GeneralInfoProps {
  companyName: string;
  projectName: string;
  location: string;
  region: string;
  province: string;
  municipality: string;
  quarter: string;
  year: string;
  dateOfCompliance: string;
  monitoringPeriod: string;
  dateOfCMRSubmission: string;
  onChange: (field: string, value: string) => void;
}

export const GeneralInfoSection: React.FC<GeneralInfoProps> = ({
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
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 10.3157,
    longitude: 123.8854,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to use GPS.'
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
      Alert.alert('Error', 'Failed to get current location.');
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
          const fullAddress = addressParts.join(', ');
          
          onChange("location", fullAddress || `${selectedLocation.latitude.toFixed(6)}, ${selectedLocation.longitude.toFixed(6)}`);
          onChange("region", address.region || '');
          onChange("province", address.subregion || address.region || '');
          onChange("municipality", address.city || address.subregion || '');
        } else {
          const locationString = `${selectedLocation.latitude.toFixed(6)}, ${selectedLocation.longitude.toFixed(6)}`;
          onChange("location", locationString);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to get address for this location.');
        const locationString = `${selectedLocation.latitude.toFixed(6)}, ${selectedLocation.longitude.toFixed(6)}`;
        onChange("location", locationString);
      }
      setShowMap(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name="information-circle" size={24} color='#02217C' />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.sectionTitle}>General Information</Text>
            <Text style={styles.sectionSubtitle}>
              Project and company details
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.sectionContent}>
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
          <TouchableOpacity 
            style={styles.mapButton}
            onPress={openMapPicker}
          >
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

        {/* Quarter and Year Row */}
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
          <Text style={styles.label}>Date of Compliance Monitoring and Validation</Text>
          
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

        <TouchableOpacity style={styles.saveButton}>
          <Ionicons name="save" size={18} color="white" />
          <Text style={styles.saveButtonText}>Save General Info</Text>
        </TouchableOpacity>
      </View>

      {/* Map Modal */}
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
            {selectedLocation && (
              <Marker coordinate={selectedLocation} />
            )}
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
              style={[styles.confirmButton, !selectedLocation && styles.confirmButtonDisabled]}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#EFF6FF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#BFDBFE",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: '#02217C',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },
  sectionContent: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0F172A",
  },
  mapButton: {
    backgroundColor: '#02217C',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  mapButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  locationDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#F0FDF4",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  locationText: {
    fontSize: 13,
    color: "#166534",
    flex: 1,
    fontWeight: "500",
  },
  multiFieldContainer: {
    flexDirection: "column",
    gap: 16,
    marginBottom: 20,
  },
  multiField: {
    flex: 1,
  },
  rowContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  halfField: {
    flex: 1,
  },
  pickerContainer: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    overflow: "hidden",
  },
  picker: {
    color: "#0F172A",
  },
  saveButton: {
    backgroundColor: '#02217C',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  mapContainer: {
    flex: 1,
  },
  mapHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: {
    padding: 8,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
  },
  map: {
    flex: 1,
  },
  mapFooter: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  myLocationButton: {
    flex: 1,
    backgroundColor: "#64748B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  myLocationButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#02217C',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  confirmButtonDisabled: {
    backgroundColor: "#94A3B8",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default GeneralInfoSection;