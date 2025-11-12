import React from "react";
import { View, Text, TextInput } from "react-native";
import { styles } from "./AirQualitySamplingSection.styles";

export type AirQualitySamplingSectionProps = {
  dateTime: string;
  weatherWind: string;
  explanation: string;
  overallCompliance: string;
  onInputChange: (field: string, value: string) => void;
};

export const AirQualitySamplingSection: React.FC<
  AirQualitySamplingSectionProps
> = ({
  dateTime,
  weatherWind,
  explanation,
  overallCompliance,
  onInputChange,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Sampling Details</Text>

      <View style={styles.field}>
        <Text style={styles.label}>
          Date/Time of Sampling <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={dateTime}
          onChangeText={(value) => onInputChange("dateTime", value)}
          placeholder="e.g., November 18-19, 2024 (1800H-1800H)"
          placeholderTextColor="#94A3B8"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>
          Weather and Wind Direction <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={weatherWind}
          onChangeText={(value) => onInputChange("weatherWind", value)}
          placeholder="e.g., Sunny, prevailing wind from North-Northwest"
          placeholderTextColor="#94A3B8"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>
          Explanation for Confirmatory Sampling{" "}
          <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={explanation}
          onChangeText={(value) => onInputChange("explanation", value)}
          placeholder="Explain why confirmatory sampling was conducted..."
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>
          Overall Assessment <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={overallCompliance}
          onChangeText={(value) => onInputChange("overallCompliance", value)}
          placeholder="e.g., All air quality parameters within DENR standards"
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={3}
        />
      </View>
    </View>
  );
};
