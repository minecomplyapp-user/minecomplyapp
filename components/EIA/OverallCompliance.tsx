import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface OverallComplianceProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const OverallCompliance: React.FC<OverallComplianceProps> = ({
  value,
  onChangeText,
}) => {
  const [inputHeight, setInputHeight] = useState(40);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Overall Compliance Assessment:</Text>
      <TextInput
        style={[
          styles.input,
          { height: Math.max(40, inputHeight) },
          isFocused && styles.inputFocused,
        ]}
        placeholder="Enter compliance assessment..."
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        multiline
        onContentSizeChange={(e) =>
          setInputHeight(e.nativeEvent.contentSize.height)
        }
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        accessible={true}
        accessibilityLabel="Overall Compliance Assessment Input"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ba3f48', 
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 13,
    minHeight: 40,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputFocused: {
    borderColor: '#9e1a1a',
  },
});
