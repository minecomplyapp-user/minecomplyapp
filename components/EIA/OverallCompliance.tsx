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
      <View style={styles.headerSection}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>✓</Text>
        </View>
        <Text style={styles.label}>Overall Compliance Assessment</Text>
      </View>
      <TextInput
        style={[
          styles.input,
          { height: Math.max(50, inputHeight) },
          isFocused && styles.inputFocused,
        ]}
        placeholder="Enter compliance assessment..."
        placeholderTextColor="#94A3B8"
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
    backgroundColor: '#02217C',
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#93C5FD',
  },
  iconText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#02217C',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    minHeight: 50,
    borderWidth: 2,
    borderColor: '#BFDBFE',
    color: '#1E293B',
  },
  inputFocused: {
    borderColor: '#02217C',
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
});
