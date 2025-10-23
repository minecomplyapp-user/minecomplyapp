import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';

interface OtherComponent {
  specification: string;
  remarks: string;
  withinSpecs: boolean | null;
}

interface CMSOtherComponentsProps {
  components: OtherComponent[];
  onComponentChange: (index: number, field: 'specification' | 'remarks', value: string) => void;
  onWithinSpecsChange: (index: number, value: boolean) => void;
  onAddComponent: () => void;
  onDeleteComponent: (index: number) => void;
}

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
          <View style={styles.fieldRow}>
            <View style={styles.leftSection}>
              <View style={styles.labelPill}>
                <Text style={styles.labelText}>Other Component {index + 1}</Text>
              </View>
              <Text style={styles.remarksLabel}>
                Remarks- Description of{'\n'}Actual Implementation
              </Text>
            </View>
            <View style={styles.middleSection}>
              <TextInput
                style={styles.input}
                placeholder="Specification"
                placeholderTextColor="#999"
                value={component.specification}
                onChangeText={(text) => onComponentChange(index, 'specification', text)}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Type here..."
                placeholderTextColor="#999"
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
              <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={() => onDeleteComponent(index)}
              >
                <X size={14} color="#fff" />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={onAddComponent}>
        <Text style={styles.addButtonText}>+ Add More Components</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  formField: {
    backgroundColor: '#F5E7E7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 1,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
  },
  leftSection: {
    width: 130,
  },
  middleSection: {
    flex: 1,
  },
  rightSection: {
    width: 110,
    alignItems: 'flex-end',
  },
  labelPill: {
    backgroundColor: '#a5b4fc',
    borderRadius: 16,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  labelText: {
    color: '#1e1b4b',
    fontWeight: '700',
    fontSize: 11,
    textAlign: 'center',
  },
  remarksLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#000',
    lineHeight: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 0,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 11,
    marginBottom: 6,
  },
  textArea: {
    minHeight: 45,
    textAlignVertical: 'top',
  },
  radioLabel: {
    fontSize: 11,
    color: '#000',
    marginBottom: 8,
    fontWeight: '500',
  },
  radioRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000',
  },
  radioText: {
    fontSize: 11,
    color: '#000',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    borderWidth: 1,
    borderColor: '#dc2626',
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginTop: 12,
    borderRadius: 0,
    gap: 4,
  },
  deleteButtonText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginVertical: 8,
    borderRadius: 0,
  },
  addButtonText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
});