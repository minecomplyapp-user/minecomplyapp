// components/water-quality/LocationSection.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Checkbox } from '../water-quality/Checkbox';
import { LocationState } from '../../types/waterQuality.types';

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
          placeholderTextColor="#999"
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
          placeholderTextColor="#999"
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
          placeholderTextColor="#999"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E6F8FF',
    padding: 14,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'gray',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000',
    width: 90,
    marginLeft: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CDEFF7',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    borderRadius: 6,
  },
}); 