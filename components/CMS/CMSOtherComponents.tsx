import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { X, Plus } from 'lucide-react-native';

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
                Remarks - Description of{'\n'}Actual Implementation
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
        <Plus size={16} color="#2563EB" />
        <Text style={styles.addButtonText}>Add More Components</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  formField: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
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
    backgroundColor: '#DBEAFE',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#93C5FD',
  },
  labelText: {
    color: '#1E40AF',
    fontWeight: '700',
    fontSize: 11,
    textAlign: 'center',
  },
  remarksLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#475569',
    lineHeight: 12,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 11,
    marginBottom: 6,
    color: '#1E293B',
  },
  textArea: {
    minHeight: 50,
    textAlignVertical: 'top',
  },
  radioLabel: {
    fontSize: 11,
    color: '#1E293B',
    marginBottom: 8,
    fontWeight: '600',
  },
  radioRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
  radioText: {
    fontSize: 11,
    color: '#1E293B',
    fontWeight: '500',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    borderWidth: 1,
    borderColor: '#B91C1C',
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginTop: 12,
    borderRadius: 6,
    gap: 4,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  deleteButtonText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '700',
  },
  addButton: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    flexDirection: 'row',
    gap: 6,
  },
  addButtonText: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '700',
  },
});
