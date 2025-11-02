import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RecommendationItem } from "../types/RecommendationsScreen.types";
import { styles } from "../styles/RecommendationsScreen.styles";

interface RecommendationItemComponentProps {
  index: number;
  data: RecommendationItem;
  onChange: (data: RecommendationItem) => void;
  onRemove: (() => void) | null;
  showStatus: boolean;
}

export const RecommendationItemComponent: React.FC<RecommendationItemComponentProps> = ({
  index,
  data,
  onChange,
  onRemove,
  showStatus,
}) => (
  <View style={styles.itemCard}>
    <View style={styles.itemHeader}>
      <View style={styles.itemNumber}>
        <Text style={styles.itemNumberText}>{index}</Text>
      </View>
      {onRemove && (
        <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      )}
    </View>
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>Recommendation</Text>
      <TextInput
        style={styles.input}
        placeholder="Type here..."
        placeholderTextColor="#94A3B8"
        value={data.recommendation}
        onChangeText={(text) => onChange({ ...data, recommendation: text })}
        multiline
      />
    </View>
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>Commitment</Text>
      <TextInput
        style={styles.input}
        placeholder="Type here..."
        placeholderTextColor="#94A3B8"
        value={data.commitment}
        onChangeText={(text) => onChange({ ...data, commitment: text })}
        multiline
      />
    </View>
    {showStatus && (
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Status</Text>
        <TextInput
          style={styles.input}
          placeholder="Type here..."
          placeholderTextColor="#94A3B8"
          value={data.status}
          onChangeText={(text) => onChange({ ...data, status: text })}
        />
      </View>
    )}
  </View>
);
