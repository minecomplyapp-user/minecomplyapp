import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SectionData, SectionKey } from "../types/RecommendationsScreen.types";
import { RecommendationItemComponent } from "./RecommendationItemComponent";
import { styles } from "../styles/RecommendationsScreen.styles";

interface RecommendationSectionProps {
  title: string;
  data: SectionData;
  onChange: (data: SectionData) => void;
  onAdd: () => void;
  showStatus: boolean;
}

export const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  title,
  data,
  onChange,
  onAdd,
  showStatus,
}) => {
  const hasNA = data.isNA || false;
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionTitleBar}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.naContainer}>
          <Text style={styles.naLabel}>N/A</Text>
          <TouchableOpacity
            style={[styles.checkbox, hasNA && styles.checkboxChecked]}
            onPress={() => onChange({ ...data, isNA: !hasNA })}
          >
            {hasNA && <Ionicons name="checkmark" size={14} color="white" />}
          </TouchableOpacity>
        </View>
      </View>
      {!hasNA && (
        <View style={styles.sectionContent}>
          {data.items.map((item, index) => (
            <RecommendationItemComponent
              key={index}
              index={index + 1}
              data={item}
              onChange={(updated) => {
                const newItems = [...data.items];
                newItems[index] = updated;
                onChange({ ...data, items: newItems });
              }}
              onRemove={
                data.items.length > 1
                  ? () => {
                      const newItems = data.items.filter((_, i) => i !== index);
                      onChange({ ...data, items: newItems });
                    }
                  : null
              }
              showStatus={showStatus}
            />
          ))}
          <TouchableOpacity style={styles.addButton} onPress={onAdd}>
            <Ionicons name="add" size={18} color="#1E40AF" />
            <Text style={styles.addButtonText}>Add More Recommendation</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
