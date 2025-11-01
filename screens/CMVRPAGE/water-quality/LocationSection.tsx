import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Checkbox } from '../water-quality/Checkbox';
import {
  LocationState
} from "../types/WaterQualityScreen.types";

type LocationSectionProps = {
  selectedLocations: LocationState;
  quarryInput: string;
  plantInput: string;
  quarryPlantInput: string;
  onLocationToggle: (location: keyof LocationState) => void;
  onInputChange: (field: string, value: string) => void;
};

export const LocationSection: React.FC<LocationSectionProps> = ({
  selectedLocations,
  quarryInput,
  plantInput,
  quarryPlantInput,
  onLocationToggle,
  onInputChange,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Location Selection</Text>
      <View style={styles.row}>
        <Checkbox
          checked={selectedLocations.quarry}
          onPress={() => onLocationToggle('quarry')}
        />
        <Text style={styles.label}>Quarry</Text>
        <TextInput
          style={styles.input}
          value={quarryInput}
          onChangeText={(text) => onInputChange('quarryInput', text)}
          placeholder="Type here..."
          placeholderTextColor="#94A3B8"
        />
      </View>

      <View style={styles.row}>
        <Checkbox
          checked={selectedLocations.plant}
          onPress={() => onLocationToggle('plant')}
        />
        <Text style={styles.label}>Plant</Text>
        <TextInput
          style={styles.input}
          value={plantInput}
          onChangeText={(text) => onInputChange('plantInput', text)}
          placeholder="Type here..."
          placeholderTextColor="#94A3B8"
        />
      </View>

      <View style={styles.row}>
        <Checkbox
          checked={selectedLocations.quarryPlant}
          onPress={() => onLocationToggle('quarryPlant')}
        />
        <Text style={styles.label}>Quarry/Plant</Text>
        <TextInput
          style={styles.input}
          value={quarryPlantInput}
          onChangeText={(text) => onInputChange('quarryPlantInput', text)}
          placeholder="Type here..."
          placeholderTextColor="#94A3B8"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color:'#02217C',
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1E293B',
    width: 90,
    marginLeft: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    borderRadius: 6,
    color: '#1E293B',
  },
});
