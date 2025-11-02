import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { OverallComplianceProps } from '../types/OverallCompliance.types';
import { styles } from '../styles/OverallCompliance.styles';

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