// RecommendationsScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { CMSHeader } from "../../components/CMSHeader";
import {
  RecommendationItem,
  SectionData,
  SectionKey,
  PickerItem,
  RecommendationsScreenNavigationProp,
  RecommendationsScreenRouteProp,
} from "./types/RecommendationsScreen.types";
import { styles } from "./styles/RecommendationsScreen.styles";

// --- Components ---
const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <View style={styles.sectionHeaderContainer}>
    <Text style={styles.sectionHeaderTitle}>{title}</Text>
  </View>
);

const CustomPicker: React.FC<{
  selectedValue: string;
  onValueChange: (value: string) => void;
  items: PickerItem[];
}> = ({ selectedValue, onValueChange, items }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedLabel = items.find((item) => item.value === selectedValue)?.label || "Select...";

  const handleSelect = (value: string) => {
    onValueChange(value);
    setModalVisible(false);
  };

  return (
    <View style={styles.pickerContainer}>
      <TouchableOpacity style={styles.pickerButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.pickerButtonText}>{selectedLabel}</Text>
        <Ionicons name="chevron-down" size={20} color="#64748B" />
      </TouchableOpacity>
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.modalItem,
                  item.value === selectedValue && styles.modalItemSelected,
                ]}
                onPress={() => handleSelect(item.value)}
              >
                <Text
                  style={[
                    styles.modalItemText,
                    item.value === selectedValue && styles.modalItemTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
                {item.value === selectedValue && (
                  <Ionicons name="checkmark-circle" size={20} color="#1E40AF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const quarterItems = [
  { label: "1st", value: "1st" },
  { label: "2nd", value: "2nd" },
  { label: "3rd", value: "3rd" },
  { label: "4th", value: "4th" },
];

const QuarterSelector: React.FC<{
  selectedQuarter: string;
  onQuarterChange: (quarter: string) => void;
  year: string;
  onYearChange: (year: string) => void;
}> = ({ selectedQuarter, onQuarterChange, year, onYearChange }) => (
  <View style={styles.quarterSelectorCard}>
    <View style={styles.quarterRow}>
      <Text style={styles.fieldLabel}>Prev Quarter:</Text>
      <CustomPicker
        selectedValue={selectedQuarter}
        onValueChange={onQuarterChange}
        items={quarterItems}
      />
    </View>
    <View style={styles.quarterRow}>
      <Text style={styles.fieldLabel}>Year:</Text>
      <TextInput
        style={[styles.input, styles.yearInput]}
        placeholder="YYYY"
        placeholderTextColor="#94A3B8"
        value={year}
        onChangeText={onYearChange}
        keyboardType="numeric"
        maxLength={4}
      />
    </View>
  </View>
);

const RecommendationItemComponent: React.FC<{
  index: number;
  data: RecommendationItem;
  onChange: (data: RecommendationItem) => void;
  onRemove: (() => void) | null;
  showStatus: boolean;
}> = ({ index, data, onChange, onRemove, showStatus }) => (
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

const RecommendationSection: React.FC<{
  title: string;
  data: SectionData;
  onChange: (data: SectionData) => void;
  onAdd: () => void;
  showStatus: boolean;
}> = ({ title, data, onChange, onAdd, showStatus }) => {
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
              onChange={(updated: RecommendationItem) => {
                const newItems = [...data.items];
                newItems[index] = updated;
                onChange({ ...data, items: newItems });
              }}
              onRemove={
                data.items.length > 1
                  ? () => {
                      const newItems = data.items.filter(
                        (_: RecommendationItem, i: number) => i !== index
                      );
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

// --- Main Screen Component ---
const RecommendationsScreen: React.FC = () => {
  const navigation = useNavigation<RecommendationsScreenNavigationProp>();
  const route = useRoute<RecommendationsScreenRouteProp>();
  const allPreviousParams = route.params || {};
  const [prevYear, setPrevYear] = useState("");
  const [prevQuarter, setPrevQuarter] = useState("1st");
  const [currentSections, setCurrentSections] = useState<Record<SectionKey, SectionData>>({
    plant: { isNA: false, items: [{ recommendation: "", commitment: "", status: "" }] },
    quarry: { isNA: false, items: [{ recommendation: "", commitment: "", status: "" }] },
    port: { isNA: false, items: [{ recommendation: "", commitment: "", status: "" }] },
  });
  const [previousSections, setPreviousSections] = useState<Record<SectionKey, SectionData>>({
    plant: { isNA: false, items: [{ recommendation: "", commitment: "", status: "" }] },
    quarry: { isNA: false, items: [{ recommendation: "", commitment: "", status: "" }] },
    port: { isNA: false, items: [{ recommendation: "", commitment: "", status: "" }] },
  });

  const updateCurrentSection = (sectionKey: SectionKey, data: SectionData) =>
    setCurrentSections({ ...currentSections, [sectionKey]: data });

  const addCurrentRecommendation = (sectionKey: SectionKey) => {
    const newItems = [...currentSections[sectionKey].items, { recommendation: "", commitment: "", status: "" }];
    updateCurrentSection(sectionKey, { ...currentSections[sectionKey], items: newItems });
  };

  const updatePreviousSection = (sectionKey: SectionKey, data: SectionData) =>
    setPreviousSections({ ...previousSections, [sectionKey]: data });

  const addPreviousRecommendation = (sectionKey: SectionKey) => {
    const newItems = [...previousSections[sectionKey].items, { recommendation: "", commitment: "", status: "" }];
    updatePreviousSection(sectionKey, { ...previousSections[sectionKey], items: newItems });
  };

  const handleSave = () => {
    const recommendationsData = {
      currentRecommendations: currentSections,
      previousRecommendations: previousSections,
    };
    // Create a sample record object for AttendanceDetail
    const record = {
      id: Date.now(),
      title: allPreviousParams.fileName || "Compliance Report",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
    // Navigate to AttendanceDetail with the record
    navigation.navigate("AttendanceDetail", { record });
  };

  const handleBack = () => navigation.goBack();

  let nextQuarterStr = "2nd";
  let nextYearStr = prevYear;
  if (prevQuarter === "1st") {
    nextQuarterStr = "2nd";
  } else if (prevQuarter === "2nd") {
    nextQuarterStr = "3rd";
  } else if (prevQuarter === "3rd") {
    nextQuarterStr = "4th";
  } else if (prevQuarter === "4th") {
    nextQuarterStr = "1st";
    const yearNum = parseInt(prevYear, 10);
    if (!isNaN(yearNum)) {
      nextYearStr = (yearNum + 1).toString();
    } else {
      nextYearStr = "";
    }
  }
  const yearForTitle = nextYearStr || "[YEAR]";
  const currentTitle = `RECOMMENDATIONS FOR THE ${nextQuarterStr} QUARTER ${yearForTitle}`;

  return (
    <SafeAreaView style={styles.container}>
      <CMSHeader fileName="File_Name" onBack={handleBack} onSave={handleSave} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="PREVIOUS RECOMMENDATIONS" />
        <QuarterSelector
          selectedQuarter={prevQuarter}
          onQuarterChange={setPrevQuarter}
          year={prevYear}
          onYearChange={setPrevYear}
        />
        <RecommendationSection
          title="PLANT"
          data={previousSections.plant}
          onChange={(data: SectionData) => updatePreviousSection("plant", data)}
          onAdd={() => addPreviousRecommendation("plant")}
          showStatus={true}
        />
        <RecommendationSection
          title="QUARRY"
          data={previousSections.quarry}
          onChange={(data: SectionData) => updatePreviousSection("quarry", data)}
          onAdd={() => addPreviousRecommendation("quarry")}
          showStatus={true}
        />
        <RecommendationSection
          title="PORT"
          data={previousSections.port}
          onChange={(data: SectionData) => updatePreviousSection("port", data)}
          onAdd={() => addPreviousRecommendation("port")}
          showStatus={true}
        />
        <SectionHeader title={currentTitle} />
        <RecommendationSection
          title="PLANT"
          data={currentSections.plant}
          onChange={(data: SectionData) => updateCurrentSection("plant", data)}
          onAdd={() => addCurrentRecommendation("plant")}
          showStatus={false}
        />
        <RecommendationSection
          title="QUARRY"
          data={currentSections.quarry}
          onChange={(data: SectionData) => updateCurrentSection("quarry", data)}
          onAdd={() => addCurrentRecommendation("quarry")}
          showStatus={false}
        />
        <RecommendationSection
          title="PORT"
          data={currentSections.port}
          onChange={(data: SectionData) => updateCurrentSection("port", data)}
          onAdd={() => addCurrentRecommendation("port")}
          showStatus={false}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save & Next</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RecommendationsScreen;
