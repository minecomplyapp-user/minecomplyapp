// EnvironmentalComplianceScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import { CMSHeader } from "../../../components/CMSHeader";
import { saveDraft } from "../../../lib/drafts";
import { LocationCheckboxRow } from "./components/LocationCheckboxRow";
import { ParameterForm } from "./components/ParameterForm";
import { SectionHeader } from "./components/SectionHeader";
import { FormInputField } from "./components/FormInputField";
import {
  ParameterData,
  LocationState,
  ComplianceData,
} from "../types/EnvironmentalComplianceScreen.types";
import { styles } from "../styles/EnvironmentalComplianceScreen.styles";

export default function EnvironmentalComplianceScreen({
  navigation,
  route,
}: any) {
  const [uploadedEccFile, setUploadedEccFile] = useState<any>(null);
  const [selectedLocations, setSelectedLocations] = useState<LocationState>({
    quarry: false,
    plant: false,
    port: false,
    quarryPlant: false,
  });
  const [naChecked, setNaChecked] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [data, setData] = useState<ComplianceData>({
    eccConditions: "",
    quarry: "",
    plant: "",
    port: "",
    quarryPlant: "",
    parameter: "",
    currentSMR: "",
    previousSMR: "",
    currentMMT: "",
    previousMMT: "",
    thirdPartyTesting: "",
    eqplRedFlag: "",
    action: "",
    limitPM25: "",
    remarks: "",
    parameters: [],
    dateTime: "",
    weatherWind: "",
    explanation: "",
    overallCompliance: "",
  });

  // Hydrate from route params when coming from a draft
  useEffect(() => {
    const params: any = route?.params || {};
    const saved = params.airQualityImpactAssessment;
    if (saved) {
      if (saved.selectedLocations)
        setSelectedLocations(saved.selectedLocations);
      if (saved.data) setData((prev) => ({ ...prev, ...saved.data }));
      if (saved.uploadedEccFile) setUploadedEccFile(saved.uploadedEccFile);
      if (saved.uploadedImage) setUploadedImage(saved.uploadedImage);
    }
  }, [route?.params]);

  const updateField = (field: keyof ComplianceData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const uploadEccFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "image/*",
        ],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets[0]) {
        setUploadedEccFile(result.assets[0]);
        Alert.alert(
          "File Uploaded",
          `File "${result.assets[0].name}" uploaded successfully!`
        );
        setData((prev) => ({
          ...prev,
          eccConditions: result.assets[0].name,
        }));
      }
    } catch (error) {
      Alert.alert("Upload Error", "Failed to upload file. Please try again.");
      console.error("Document picker error:", error);
    }
  };

  const removeEccFile = () => {
    Alert.alert("Remove File", "Are you sure you want to remove this file?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          setUploadedEccFile(null);
          setData((prev) => ({
            ...prev,
            eccConditions: "",
          }));
        },
      },
    ]);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Sorry, we need camera roll permissions to upload images."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setUploadedImage(result.assets[0].uri);
    }
  };

  const addParameter = () => {
    const newId = Date.now().toString();
    const newParameter: ParameterData = {
      id: newId,
      parameter: "",
      currentSMR: "",
      previousSMR: "",
      currentMMT: "",
      previousMMT: "",
      thirdPartyTesting: "",
      eqplRedFlag: "",
      action: "",
      limitPM25: "",
      remarks: "",
    };
    setData((prev) => ({
      ...prev,
      parameters: [...prev.parameters, newParameter],
    }));
  };

  const updateParameterField = (
    id: string,
    field: keyof Omit<ParameterData, "id">,
    value: string
  ) => {
    setData((prev) => ({
      ...prev,
      parameters: prev.parameters.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      ),
    }));
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
            setData((prev) => ({
              ...prev,
              parameters: prev.parameters.filter((param) => param.id !== id),
            }));
          },
        },
      ]
    );
  };

  const handleLocationToggle = (location: keyof LocationState) => {
    setSelectedLocations((prev) => ({
      ...prev,
      [location]: !prev[location],
    }));
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSave = async () => {
    try {
      const prevPageData: any = route.params || {};

      const airQualityImpactAssessment = {
        selectedLocations,
        data,
        uploadedEccFile,
        uploadedImage,
      };

      const draftData = {
        ...prevPageData.generalInfo,
        ...prevPageData.eccInfo,
        ...prevPageData.eccAdditionalForms,
        ...prevPageData.isagInfo,
        ...prevPageData.isagAdditionalForms,
        ...prevPageData.epepInfo,
        ...prevPageData.epepAdditionalForms,
        ...prevPageData.rcfInfo,
        ...prevPageData.rcfAdditionalForms,
        ...prevPageData.mtfInfo,
        ...prevPageData.mtfAdditionalForms,
        ...prevPageData.fmrdfInfo,
        ...prevPageData.fmrdfAdditionalForms,
        ...prevPageData.mmtInfo,
        fileName: prevPageData.fileName || "Untitled",
        executiveSummaryOfCompliance: prevPageData.executiveSummaryOfCompliance,
        processDocumentationOfActivitiesUndertaken:
          prevPageData.processDocumentationOfActivitiesUndertaken,
        complianceToProjectLocationAndCoverageLimits:
          prevPageData.complianceToProjectLocationAndCoverageLimits,
        complianceToImpactManagementCommitments:
          prevPageData.complianceToImpactManagementCommitments,
        airQualityImpactAssessment,
        savedAt: new Date().toISOString(),
      };

      const fileName = prevPageData.fileName || "Untitled";
      const success = await saveDraft(fileName, draftData);

      if (success) {
        Alert.alert("Success", "Draft saved successfully");
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Dashboard" }],
          })
        );
      } else {
        Alert.alert("Error", "Failed to save draft. Please try again.");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      Alert.alert("Error", "Failed to save draft. Please try again.");
    }
  };

  const fillTestData = () => {
    // Set location checkboxes
    setSelectedLocations({
      quarry: true,
      plant: true,
      port: false,
      quarryPlant: false,
    });

    // Fill main form fields
    setData({
      eccConditions: "ECC No. R10-2020-123 dated January 15, 2020",
      quarry: "Open pit mining with progressive rehabilitation",
      plant: "Crushing and screening plant with dust suppression",
      port: "",
      quarryPlant: "",
      parameter: "TSP (Total Suspended Particulates)",
      currentSMR: "85 µg/Nm³",
      previousSMR: "92 µg/Nm³",
      currentMMT: "88 µg/Nm³",
      previousMMT: "90 µg/Nm³",
      thirdPartyTesting: "87 µg/Nm³",
      eqplRedFlag: "No",
      action: "Continue monitoring, maintain dust suppression measures",
      limitPM25: "150 µg/Nm³",
      remarks: "Within acceptable limits",
      parameters: [
        {
          id: "1",
          parameter: "PM2.5 (Fine Particulate Matter)",
          currentSMR: "45 µg/Nm³",
          previousSMR: "48 µg/Nm³",
          currentMMT: "46 µg/Nm³",
          previousMMT: "49 µg/Nm³",
          thirdPartyTesting: "47 µg/Nm³",
          eqplRedFlag: "No",
          action: "Continue regular monitoring",
          limitPM25: "75 µg/Nm³",
          remarks: "Consistently below limits",
        },
        {
          id: "2",
          parameter: "SO2 (Sulfur Dioxide)",
          currentSMR: "120 µg/Nm³",
          previousSMR: "125 µg/Nm³",
          currentMMT: "118 µg/Nm³",
          previousMMT: "122 µg/Nm³",
          thirdPartyTesting: "121 µg/Nm³",
          eqplRedFlag: "No",
          action: "Maintain current emission controls",
          limitPM25: "180 µg/Nm³",
          remarks: "Well within standards",
        },
        {
          id: "3",
          parameter: "NO2 (Nitrogen Dioxide)",
          currentSMR: "95 µg/Nm³",
          previousSMR: "98 µg/Nm³",
          currentMMT: "93 µg/Nm³",
          previousMMT: "97 µg/Nm³",
          thirdPartyTesting: "96 µg/Nm³",
          eqplRedFlag: "No",
          action: "No action required",
          limitPM25: "150 µg/Nm³",
          remarks: "Compliant",
        },
      ],
      dateTime: "March 15, 2025, 10:00 AM",
      weatherWind: "Sunny, Wind speed 3-5 m/s from Northeast",
      explanation:
        "Air quality monitoring conducted at designated stations around quarry and plant areas. All parameters measured are within DENR standards.",
      overallCompliance:
        "Compliant - All air quality parameters are within acceptable limits as per ECC conditions and DAO 2016-08.",
    });

    setNaChecked(false);

    Alert.alert(
      "Test Data",
      "Environmental Compliance filled with test data (3 parameters)"
    );
  };

  const handleSaveNext = () => {
    console.log("Save & Next pressed", data);
    const airQualityImpactAssessment = {
      selectedLocations,
      data,
      uploadedEccFile,
      uploadedImage,
    };
    const nextParams = {
      ...(route?.params || {}),
      airQualityImpactAssessment,
    } as any;
    console.log(
      "Navigating with EnvironmentalCompliance params keys:",
      Object.keys(nextParams)
    );
    navigation.navigate("WaterQuality", nextParams);
  };

  const mainParameterData: ParameterData = {
    id: "main",
    parameter: data.parameter,
    currentSMR: data.currentSMR,
    previousSMR: data.previousSMR,
    currentMMT: data.currentMMT,
    previousMMT: data.previousMMT,
    thirdPartyTesting: data.thirdPartyTesting,
    eqplRedFlag: data.eqplRedFlag,
    action: data.action,
    limitPM25: data.limitPM25,
    remarks: data.remarks,
  };

  const updateMainParameter = (
    field: keyof Omit<ParameterData, "id">,
    value: string
  ) => {
    updateField(field, value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <CMSHeader onBack={handleBack} onSave={handleSave} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* B.2 Section */}
        <SectionHeader
          number="B.2."
          title="Compliance to Environmental Compliance Certificate Conditions"
        />

        {/* Upload ECC Conditions File */}
        <View style={styles.uploadSection}>
          <Text style={styles.uploadLabel}>Upload ECC Conditions Document</Text>
          {!uploadedEccFile ? (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={uploadEccFile}
            >
              <Ionicons name="cloud-upload-outline" size={24} color="#02217C" />
              <Text style={styles.uploadButtonText}>Choose File</Text>
              <Text style={styles.uploadHint}>PDF, DOC, or Image</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.uploadedFileContainer}>
              <View style={styles.fileInfo}>
                <Ionicons name="document-text" size={24} color="#10B981" />
                <View style={styles.fileDetails}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {uploadedEccFile.name}
                  </Text>
                  <Text style={styles.fileSize}>
                    {uploadedEccFile.size
                      ? `${(uploadedEccFile.size / 1024).toFixed(2)} KB`
                      : "Size unknown"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={removeEccFile}
                style={styles.removeButton}
              >
                <Ionicons name="close-circle" size={24} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* B.3 Section */}
        <SectionHeader number="B.3." title="Air Quality Impact Assessment" />

        {/* Location Checkboxes Section */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Location Selection</Text>
          <LocationCheckboxRow
            label="Quarry"
            value={data.quarry}
            onChangeText={(text) => updateField("quarry", text)}
            isSelected={selectedLocations.quarry}
            onCheckboxPress={() => handleLocationToggle("quarry")}
          />
          <LocationCheckboxRow
            label="Plant"
            value={data.plant}
            onChangeText={(text) => updateField("plant", text)}
            isSelected={selectedLocations.plant}
            onCheckboxPress={() => handleLocationToggle("plant")}
          />
          <LocationCheckboxRow
            label="Port"
            value={data.port}
            onChangeText={(text) => updateField("port", text)}
            isSelected={selectedLocations.port}
            onCheckboxPress={() => handleLocationToggle("port")}
          />
          <LocationCheckboxRow
            label={`Quarry/Plant\n(For Mobile Crusher)`}
            value={data.quarryPlant}
            onChangeText={(text) => updateField("quarryPlant", text)}
            isSelected={selectedLocations.quarryPlant}
            onCheckboxPress={() => handleLocationToggle("quarryPlant")}
          />
        </View>

        {/* Main Parameter Form */}
        <View style={styles.formSection}>
          <ParameterForm
            data={mainParameterData}
            onUpdate={updateMainParameter}
            showNA={true}
            naChecked={naChecked}
            onNAChange={() => setNaChecked(!naChecked)}
          />

          {/* Additional Parameters */}
          {data.parameters.map((param, index) => (
            <View key={param.id} style={styles.additionalParameterContainer}>
              <ParameterForm
                data={param}
                onUpdate={(field, value) =>
                  updateParameterField(param.id, field, value)
                }
                showDelete={true}
                onDelete={() => removeParameter(param.id)}
                index={index}
              />
            </View>
          ))}

          {/* Add New Parameter Button */}
          <TouchableOpacity style={styles.addButton} onPress={addParameter}>
            <Ionicons name="add-circle-outline" size={20} color="#02217C" />
            <Text style={styles.addButtonText}>Add More Parameter</Text>
          </TouchableOpacity>

          {/* Additional Fields - Outside Parameters */}
          <View style={styles.additionalFieldsSection}>
            <FormInputField
              label="Date/Time of Sampling:"
              value={data.dateTime}
              onChangeText={(text) => updateField("dateTime", text)}
            />

            <FormInputField
              label="Weather and Wind Direction:"
              value={data.weatherWind}
              onChangeText={(text) => updateField("weatherWind", text)}
            />

            <FormInputField
              label="Explanation of why confirmatory sampling was conducted for specific parameter in the sampling station:"
              value={data.explanation}
              onChangeText={(text) => updateField("explanation", text)}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Overall Compliance */}
        <View style={styles.overallSection}>
          <View style={styles.overallHeader}>
            <View style={styles.overallIconCircle}>
              <Text style={styles.overallIcon}>✓</Text>
            </View>
            <Text style={styles.overallLabel}>
              Overall Compliance Assessment
            </Text>
          </View>
          <FormInputField
            label=""
            value={data.overallCompliance}
            onChangeText={(text) => updateField("overallCompliance", text)}
          />
        </View>

        {/* Fill Test Data Button (Dev Only) */}
        {__DEV__ && (
          <TouchableOpacity
            style={[
              styles.saveNextButton,
              { backgroundColor: "#ff8c00", marginTop: 12 },
            ]}
            onPress={fillTestData}
          >
            <Text style={styles.saveNextText}>Fill Test Data</Text>
          </TouchableOpacity>
        )}

        {/* Save & Next Button */}
        <TouchableOpacity
          style={styles.saveNextButton}
          onPress={handleSaveNext}
        >
          <Text style={styles.saveNextText}>Save & Next</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
