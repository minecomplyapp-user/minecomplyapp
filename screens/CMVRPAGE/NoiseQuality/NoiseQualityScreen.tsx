// NoiseQualityScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CMSHeader } from "../../../components/CMSHeader";
import * as DocumentPicker from "expo-document-picker";
import { NoiseParameterCard } from "./NoiseParameterCard";
import { FileUploadSection } from "./FileUploadSection";
import {
  UploadedFile,
  QuarterData,
  NoiseParameter,
} from "../types/NoiseQualityScreen.types";
import { styles } from "../styles/NoiseQualityScreen.styles";

export default function NoiseQualityScreen({ navigation }: any) {
  const [hasInternalNoise, setHasInternalNoise] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [parameters, setParameters] = useState<NoiseParameter[]>([
    {
      id: `param-${Date.now()}`,
      parameter: "",
      isParameterNA: false,
      currentInSABR: "",
      previousInSABR: "",
      mmtCurrent: "",
      mmtPrevious: "",
      redFlag: "",
      isRedFlagChecked: false,
      action: "",
      isActionChecked: false,
      limit: "",
      isLimitChecked: false,
    },
  ]);
  const [remarks, setRemarks] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [weatherWind, setWeatherWind] = useState("");
  const [explanation, setExplanation] = useState("");
  const [explanationNA, setExplanationNA] = useState(false);
  const [quarters, setQuarters] = useState<QuarterData>({
    first: "",
    isFirstChecked: false,
    second: "",
    isSecondChecked: false,
    third: "",
    isThirdChecked: false,
    fourth: "",
    isFourthChecked: false,
  });

  const addParameter = () => {
    const newId = `param-${Date.now()}`;
    setParameters([
      ...parameters,
      {
        id: newId,
        parameter: "",
        isParameterNA: false,
        currentInSABR: "",
        previousInSABR: "",
        mmtCurrent: "",
        mmtPrevious: "",
        redFlag: "",
        isRedFlagChecked: false,
        action: "",
        isActionChecked: false,
        limit: "",
        isLimitChecked: false,
      },
    ]);
  };

  const updateParameter = (
    id: string,
    field: keyof Omit<NoiseParameter, "id">,
    value: string | boolean
  ) => {
    setParameters(
      parameters.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      )
    );
  };

  const removeParameter = (id: string) => {
    Alert.alert(
      "Remove Parameter",
      "Are you sure you want to remove this parameter?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            if (parameters.length > 1) {
              setParameters(parameters.filter((param) => param.id !== id));
            } else {
              Alert.alert("Cannot Remove", "At least one parameter is required.");
            }
          },
        },
      ]
    );
  };

  const updateQuarter = (field: keyof QuarterData, value: string | boolean) => {
    setQuarters((prevQuarters) => ({
      ...prevQuarters,
      [field]: value,
    }));
  };

  const handleSaveAndNext = () => {
    console.log("Saving Noise Quality data...");
    navigation.navigate("WasteManagement");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <CMSHeader
          fileName="Noise Quality Assessment"
          onBack={() => navigation.goBack()}
          onSave={() => Alert.alert("Saved", "Data saved successfully")}
        />
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeaderContainer}>
          <View style={styles.sectionHeaderContent}>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>B.4</Text>
            </View>
            <Text style={styles.sectionTitle}>Noise Quality Impact Assessment</Text>
          </View>
        </View>
       <FileUploadSection
          uploadedFiles={uploadedFiles}
          onFilesChange={setUploadedFiles}
        />
        <View style={styles.parametersSection}>
          {parameters.map((param, index) => (
            <NoiseParameterCard
              key={param.id}
              parameter={param}
              index={index}
              canDelete={parameters.length > 1}
              onUpdate={updateParameter}
              onDelete={removeParameter}
            />
          ))}
          <TouchableOpacity style={styles.addButton} onPress={addParameter}>
            <Ionicons name="add-circle" size={20} color="#02217C" />
            <Text style={styles.addButtonText}>Add More Parameter</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.additionalFieldsContainer}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Remarks</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={remarks}
              onChangeText={setRemarks}
              placeholder="Enter remarks..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Date/Time of Sampling</Text>
            <TextInput
              style={styles.input}
              value={dateTime}
              onChangeText={setDateTime}
              placeholder="MM/DD/YYYY HH:MM"
              placeholderTextColor="#94A3B8"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Weather and Wind Direction</Text>
            <TextInput
              style={styles.input}
              value={weatherWind}
              onChangeText={setWeatherWind}
              placeholder="Enter weather conditions..."
              placeholderTextColor="#94A3B8"
            />
          </View>
          <View style={styles.fieldGroup}>
            <View style={styles.labelWithAction}>
              <Text style={styles.label}>Explanation of Confirmatory Sampling</Text>
              <TouchableOpacity
                style={styles.naButton}
                onPress={() => setExplanationNA(!explanationNA)}
              >
                <View style={[styles.checkbox, explanationNA && styles.checkboxChecked]}>
                  {explanationNA && <Ionicons name="checkmark" size={14} color="white" />}
                </View>
                <Text style={styles.naText}>N/A</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.input, styles.textArea, explanationNA && styles.disabledInput]}
              value={explanation}
              onChangeText={setExplanation}
              placeholder="Explain why confirmatory sampling was conducted..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              editable={!explanationNA}
            />
          </View>
        </View>
        <View style={styles.overallAssessmentContainer}>
          <View style={styles.overallHeader}>
            <Ionicons name="analytics" size={20} color="#02217C" />
            <Text style={styles.overallTitle}>Overall Noise Quality Impact Assessment</Text>
          </View>
        </View>
        <View style={styles.quartersContainer}>
          {[
            { key: "first", label: "1st Quarter", checked: "isFirstChecked" },
            { key: "second", label: "2nd Quarter", checked: "isSecondChecked" },
            { key: "third", label: "3rd Quarter", checked: "isThirdChecked" },
            { key: "fourth", label: "4th Quarter", checked: "isFourthChecked" },
          ].map((quarter) => (
            <View key={quarter.key} style={styles.quarterRow}>
              <TouchableOpacity
                style={styles.quarterCheckbox}
                onPress={() =>
                  updateQuarter(
                    quarter.checked as keyof QuarterData,
                    !quarters[quarter.checked as keyof QuarterData]
                  )
                }
              >
                <View
                  style={[
                    styles.checkbox,
                    quarters[quarter.checked as keyof QuarterData] && styles.checkboxChecked,
                  ]}
                >
                  {quarters[quarter.checked as keyof QuarterData] && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text style={styles.quarterLabel}>{quarter.label}</Text>
              </TouchableOpacity>
              <TextInput
                style={[
                  styles.quarterInput,
                  !quarters[quarter.checked as keyof QuarterData] && styles.disabledInput,
                ]}
                value={quarters[quarter.key as keyof QuarterData] as string}
                onChangeText={(text) => updateQuarter(quarter.key as keyof QuarterData, text)}
                placeholder="Enter assessment"
                placeholderTextColor="#94A3B8"
                editable={quarters[quarter.checked as keyof QuarterData] as boolean}
              />
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.saveNextButton} onPress={handleSaveAndNext}>
          <Text style={styles.saveNextButtonText}>Save & Next</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}
