import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LocationState } from "../../types/AirQualityScreen.types";
import { styles } from "./LocationSection.styles";

type LocationSectionProps = {
  selectedLocations: LocationState;
  onLocationToggle: (location: keyof LocationState) => void;
};

export const LocationSection: React.FC<LocationSectionProps> = ({
  selectedLocations,
  onLocationToggle,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Select Locations:</Text>

      <TouchableOpacity
        style={[
          styles.checkboxContainer,
          selectedLocations.quarry && styles.checkboxContainerActive,
        ]}
        onPress={() => onLocationToggle("quarry")}
      >
        <View
          style={[
            styles.checkbox,
            selectedLocations.quarry && styles.checkboxChecked,
          ]}
        >
          {selectedLocations.quarry && (
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          )}
        </View>
        <Text
          style={[
            styles.checkboxLabel,
            selectedLocations.quarry && styles.checkboxLabelActive,
          ]}
        >
          Quarry
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.checkboxContainer,
          selectedLocations.plant && styles.checkboxContainerActive,
        ]}
        onPress={() => onLocationToggle("plant")}
      >
        <View
          style={[
            styles.checkbox,
            selectedLocations.plant && styles.checkboxChecked,
          ]}
        >
          {selectedLocations.plant && (
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          )}
        </View>
        <Text
          style={[
            styles.checkboxLabel,
            selectedLocations.plant && styles.checkboxLabelActive,
          ]}
        >
          Plant
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.checkboxContainer,
          selectedLocations.quarryPlant && styles.checkboxContainerActive,
        ]}
        onPress={() => onLocationToggle("quarryPlant")}
      >
        <View
          style={[
            styles.checkbox,
            selectedLocations.quarryPlant && styles.checkboxChecked,
          ]}
        >
          {selectedLocations.quarryPlant && (
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          )}
        </View>
        <Text
          style={[
            styles.checkboxLabel,
            selectedLocations.quarryPlant && styles.checkboxLabelActive,
          ]}
        >
          Quarry / Plant
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.checkboxContainer,
          selectedLocations.port && styles.checkboxContainerActive,
        ]}
        onPress={() => onLocationToggle("port")}
      >
        <View
          style={[
            styles.checkbox,
            selectedLocations.port && styles.checkboxChecked,
          ]}
        >
          {selectedLocations.port && (
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          )}
        </View>
        <Text
          style={[
            styles.checkboxLabel,
            selectedLocations.port && styles.checkboxLabelActive,
          ]}
        >
          Port
        </Text>
      </TouchableOpacity>
    </View>
  );
};
