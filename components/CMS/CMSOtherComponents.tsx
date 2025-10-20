import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface OtherComponent {
  specification: string;
  remarks: string;
  withinSpecs: boolean | null;
}

interface CMSOtherComponentsProps {
  components: OtherComponent[];
  onComponentChange: (index: number, field: 'specification' | 'remarks', value: string) => void;
  onAddComponent: () => void;
}

export const CMSOtherComponents: React.FC<CMSOtherComponentsProps> = ({
  components,
  onComponentChange,
  onAddComponent,
}) => {
  return (
    <View style={styles.formField}>
      <View style={styles.fieldRow}>
        <View style={styles.leftSection}>
          <View style={styles.labelPill}>
            <Text style={styles.labelText}>Other Components:</Text>
          </View>
          <Text style={styles.remarksLabel}>
            Remarks- Description of{'\n'}Actual Implementation
          </Text>
        </View>
        <View style={styles.middleSection}>
          {components.map((component, index) => (
            <View key={index} style={styles.otherComponentItem}>
              <View style={styles.subFieldRow}>
                <View style={styles.subFieldLabel}>
                  <View style={styles.bullet} />
                  <TextInput
                    style={[styles.input, styles.flexInput]}
                    placeholder="Specification Type here..."
                    placeholderTextColor="#999"
                    value={component.specification}
                    onChangeText={(text) => onComponentChange(index, 'specification', text)}
                  />
                </View>
              </View>
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
          ))}
          <TouchableOpacity style={styles.addButton} onPress={onAddComponent}>
            <Text style={styles.addButtonText}>+ Add More Components</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rightSection}>
          <View style={styles.radioGroup}>
            <Text style={styles.radioLabel}>Within specs?</Text>
            <TouchableOpacity style={styles.radioOption}>
              <View style={styles.radioOuter}></View>
              <Text style={styles.radioText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.radioOption}>
              <View style={styles.radioOuter}></View>
              <Text style={styles.radioText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
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
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 11,
    marginBottom: 6,
  },
  textArea: {
    minHeight: 45,
    textAlignVertical: 'top',
  },
  subFieldRow: {
    marginBottom: 6,
  },
  subFieldLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9ca3af',
    marginRight: 6,
  },
  otherComponentItem: {
    marginBottom: 8,
  },
  flexInput: {
    flex: 1,
    marginBottom: 0,
  },
  addButton: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  addButtonText: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '500',
  },
  radioGroup: {
    alignItems: 'flex-end',
  },
  radioLabel: {
    fontSize: 11,
    color: '#000',
    marginBottom: 8,
    fontWeight: '500',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  radioText: {
    fontSize: 11,
    color: '#000',
  },
});