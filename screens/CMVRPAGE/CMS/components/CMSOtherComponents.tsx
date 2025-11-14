import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import { CMSOtherComponentsProps } from '../types/CMSOtherComponents.types';
import { styles } from '../styles/CMSOtherComponents.styles';
import { Ionicons } from "@expo/vector-icons";


export const CMSOtherComponents: React.FC<CMSOtherComponentsProps> = ({
  components,
  onComponentChange,
  onWithinSpecsChange,
  onAddComponent,
  onDeleteComponent,
}) => {
  return (
    <>
      {components.map((component, index) => (
        <View key={index} style={styles.formField}>
          {/* Move delete button here - outside of fieldRow */}
          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={() => onDeleteComponent(index)}
          >
            <Ionicons name="trash-outline" size={18} color="#DC2626" />
          </TouchableOpacity>
          
          <View style={styles.fieldRow}>
            <View style={styles.leftSection}>
              <View style={styles.labelPill}>
                <Text style={styles.labelText}>Other Component {index + 1}</Text>
              </View>
              <Text style={styles.remarksLabel}>
                Remarks - Description of Actual Implementation
              </Text>
            </View>
            <View style={styles.middleSection}>
              <TextInput
                style={styles.input}
                placeholder="Specification"
                placeholderTextColor="#94A3B8"
                value={component.specification}
                onChangeText={(text) => onComponentChange(index, 'specification', text)}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Type here..."
                placeholderTextColor="#94A3B8"
                value={component.remarks}
                onChangeText={(text) => onComponentChange(index, 'remarks', text)}
                multiline
                numberOfLines={2}
              />
            </View>
            <View style={styles.rightSection}>
              <Text style={styles.radioLabel}>Within specs?</Text>
              <View style={styles.radioRow}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => onWithinSpecsChange(index, true)}
                >
                  <View style={styles.radioOuter}>
                    {component.withinSpecs === true && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => onWithinSpecsChange(index, false)}
                >
                  <View style={styles.radioOuter}>
                    {component.withinSpecs === false && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={onAddComponent}>
        <Plus size={16} color='#02217C' />
        <Text style={styles.addButtonText}>Add More Components</Text>
      </TouchableOpacity>
    </>
  );
};