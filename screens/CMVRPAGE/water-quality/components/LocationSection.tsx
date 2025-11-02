import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Checkbox } from '../components/Checkbox';
import { LocationSectionProps } from '../types/LocationSection.types';
import { styles } from '../styles/LocationSection.styles';

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