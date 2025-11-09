// EnvironmentalComplianceScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import { CMSHeader } from "../../../components/CMSHeader";
import { saveDraft } from "../../../lib/drafts";
import { supabase } from "../../../lib/supabase";
import { LocationCheckboxRow } from "./components/LocationCheckboxRow";
import { ParameterForm } from "./components/ParameterForm";
import { SectionHeader } from "./components/SectionHeader";
import { FormInputField } from "./components/FormInputField";
import { AirQualityLocationSection } from "./components/AirQualityLocationSection";
import {
  ParameterData,
  LocationState,
  ComplianceData,
  LocationData,
  createEmptyLocationData,
} from "../types/EnvironmentalComplianceScreen.types";
import { styles } from "../styles/EnvironmentalComplianceScreen.styles";

export default function EnvironmentalComplianceScreen({
  navigation,
  route,
}: any) {
  const [uploadedEccFile, setUploadedEccFile] = useState<any>(null);
  const [isUploadingEcc, setIsUploadingEcc] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<LocationState>({
    quarry: false,
    plant: false,
    port: false,
    quarryPlant: false,
  });
  const [naChecked, setNaChecked] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Separate state for each location
  const [quarryData, setQuarryData] = useState<LocationData>(
    createEmptyLocationData()
  );
  const [plantData, setPlantData] = useState<LocationData>(
    createEmptyLocationData()
  );
  const [portData, setPortData] = useState<LocationData>(
    createEmptyLocationData()
  );
  const [quarryPlantData, setQuarryPlantData] = useState<LocationData>(
    createEmptyLocationData()
  );

  // Legacy data state (kept for backward compatibility)
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
      if (saved.quarryData) setQuarryData(saved.quarryData);
      if (saved.plantData) setPlantData(saved.plantData);
      if (saved.portData) setPortData(saved.portData);
      if (saved.quarryPlantData) setQuarryPlantData(saved.quarryPlantData);
      // Legacy support
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
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];

        setIsUploadingEcc(true);

        try {
          // Create unique filename
          const timestamp = Date.now();
          const fileExt = file.name.split(".").pop() || "docx";
          const fileName = `cmvr-ecc/ecc-${timestamp}.${fileExt}`;

          // Read file as ArrayBuffer (React Native Blob polyfill may not support creating from ArrayBuffer)
          const response = await fetch(file.uri);
          const arrayBuffer = await response.arrayBuffer();

          // Try direct ArrayBuffer upload first
          let uploadError;
          let uploadData;
          ({ data: uploadData, error: uploadError } = await supabase.storage
            .from("minecomplyapp-bucket")
            .upload(fileName, arrayBuffer, {
              contentType:
                file.mimeType ||
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              upsert: false,
            }));

          // Fallback: convert to Uint8Array if ArrayBuffer not accepted
          if (uploadError) {
            try {
              const uint8 = new Uint8Array(arrayBuffer);
              ({ data: uploadData, error: uploadError } = await supabase.storage
                .from("minecomplyapp-bucket")
                .upload(fileName, uint8, {
                  contentType:
                    file.mimeType ||
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  upsert: false,
                }));
            } catch (fallbackErr) {
              console.warn("Uint8Array fallback failed", fallbackErr);
            }
          }

          // Final fallback: base64 via Expo FileSystem (if available)
          if (uploadError) {
            try {
              // Dynamically import to avoid bundling if not needed
              const FileSystem = await import("expo-file-system");
              const base64 = await FileSystem.readAsStringAsync(file.uri, {
                encoding: FileSystem.EncodingType.Base64,
              });
              // Supabase JS storage client in RN accepts a base64 string with contentType
              ({ data: uploadData, error: uploadError } = await supabase.storage
                .from("minecomplyapp-bucket")
                .upload(fileName, base64, {
                  contentType:
                    file.mimeType ||
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  upsert: false,
                }));
            } catch (base64Err) {
              console.warn("Base64 fallback failed", base64Err);
            }
          }

          if (uploadError) {
            throw uploadError;
          }

          // Get public URL
          const {
            data: { publicUrl },
          } = supabase.storage
            .from("minecomplyapp-bucket")
            .getPublicUrl(fileName);

          // Store file info with storage path and public URL
          const fileInfo = {
            name: file.name,
            uri: file.uri,
            mimeType: file.mimeType,
            size: file.size,
            storagePath: fileName, // Store the storage path for deletion
            publicUrl: publicUrl,
          };

          setUploadedEccFile(fileInfo);

          Alert.alert(
            "File Uploaded",
            `File "${file.name}" uploaded successfully to storage!`
          );

          setData((prev) => ({
            ...prev,
            eccConditions: file.name,
          }));
        } catch (uploadError) {
          console.error("Supabase upload error:", uploadError);
          Alert.alert(
            "Upload Failed",
            "Failed to upload file to storage. Please try again."
          );
        } finally {
          setIsUploadingEcc(false);
        }
      }
    } catch (error) {
      Alert.alert("Upload Error", "Failed to select file. Please try again.");
      console.error("Document picker error:", error);
      setIsUploadingEcc(false);
    }
  };

  const removeEccFile = async () => {
    Alert.alert("Remove File", "Are you sure you want to remove this file?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          // Delete from Supabase storage if storagePath exists
          if (uploadedEccFile?.storagePath) {
            try {
              const { error } = await supabase.storage
                .from("minecomplyapp-bucket")
                .remove([uploadedEccFile.storagePath]);

              if (error) {
                console.error("Failed to delete file from storage:", error);
              }
            } catch (error) {
              console.error("Error deleting file from storage:", error);
            }
          }

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
        quarryData,
        plantData,
        portData,
        quarryPlantData,
        // Legacy support
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

  const handleStay = () => {
    console.log("User chose to stay");
  };

  const handleSaveToDraft = async () => {
    try {
      const prevPageData: any = route.params || {};

      const airQualityImpactAssessment = {
        selectedLocations,
        quarryData,
        plantData,
        portData,
        quarryPlantData,
        // Legacy support
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

  const handleDiscard = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Dashboard" }],
      })
    );
  };

  const handleGoToSummary = async () => {
    try {
      console.log("Navigating to summary with current air quality data");

      const prevPageData: any = route.params || {};

      // Prepare current page data
      const airQualityImpactAssessment = {
        selectedLocations,
        quarryData,
        plantData,
        portData,
        quarryPlantData,
        data,
        uploadedEccFile,
        uploadedImage,
      };

      // Prepare complete snapshot with all sections
      const completeData = {
        generalInfo: prevPageData.generalInfo,
        eccInfo: prevPageData.eccInfo,
        eccAdditionalForms: prevPageData.eccAdditionalForms,
        isagInfo: prevPageData.isagInfo,
        isagAdditionalForms: prevPageData.isagAdditionalForms,
        epepInfo: prevPageData.epepInfo,
        epepAdditionalForms: prevPageData.epepAdditionalForms,
        rcfInfo: prevPageData.rcfInfo,
        rcfAdditionalForms: prevPageData.rcfAdditionalForms,
        mtfInfo: prevPageData.mtfInfo,
        mtfAdditionalForms: prevPageData.mtfAdditionalForms,
        fmrdfInfo: prevPageData.fmrdfInfo,
        fmrdfAdditionalForms: prevPageData.fmrdfAdditionalForms,
        mmtInfo: prevPageData.mmtInfo,
        executiveSummaryOfCompliance: prevPageData.executiveSummaryOfCompliance,
        processDocumentationOfActivitiesUndertaken:
          prevPageData.processDocumentationOfActivitiesUndertaken,
        complianceToProjectLocationAndCoverageLimits:
          prevPageData.complianceToProjectLocationAndCoverageLimits,
        complianceToImpactManagementCommitments:
          prevPageData.complianceToImpactManagementCommitments,
        airQualityImpactAssessment, // Current page data
        waterQualityImpactAssessment: prevPageData.waterQualityImpactAssessment,
        noiseQualityImpactAssessment: prevPageData.noiseQualityImpactAssessment,
        complianceWithGoodPracticeInSolidAndHazardousWasteManagement:
          prevPageData.complianceWithGoodPracticeInSolidAndHazardousWasteManagement,
        complianceWithGoodPracticeInChemicalSafetyManagement:
          prevPageData.complianceWithGoodPracticeInChemicalSafetyManagement,
        complaintsVerificationAndManagement:
          prevPageData.complaintsVerificationAndManagement,
        recommendationsData: prevPageData.recommendationsData,
        attendanceUrl: prevPageData.attendanceUrl,
        savedAt: new Date().toISOString(),
      };

      const resolvedFileName = prevPageData.fileName || "Untitled";

      // Save to draft before navigating
      await saveDraft(resolvedFileName, completeData);

      // Navigate to summary screen with all data
      navigation.navigate("CMVRDocumentExport", {
        ...prevPageData,
        fileName: resolvedFileName,
        airQualityImpactAssessment,
        draftData: completeData,
      });
    } catch (error) {
      console.error("Error navigating to summary:", error);
      Alert.alert("Error", "Failed to navigate to summary. Please try again.");
    }
  };

  // ============ QUARRY HANDLERS ============
  const addQuarryParameter = () => {
    const newId = Date.now().toString();
    setQuarryData((prev) => ({
      ...prev,
      parameters: [
        ...prev.parameters,
        {
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
        },
      ],
    }));
  };

  const updateQuarryParameter = (
    id: string,
    field: keyof Omit<ParameterData, "id">,
    value: string
  ) => {
    setQuarryData((prev) => ({
      ...prev,
      parameters: prev.parameters.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      ),
    }));
  };

  const deleteQuarryParameter = (id: string) => {
    Alert.alert(
      "Remove Parameter",
      "Are you sure you want to remove this parameter?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setQuarryData((prev) => ({
              ...prev,
              parameters: prev.parameters.filter((param) => param.id !== id),
            }));
          },
        },
      ]
    );
  };

  // ============ PLANT HANDLERS ============
  const addPlantParameter = () => {
    const newId = Date.now().toString();
    setPlantData((prev) => ({
      ...prev,
      parameters: [
        ...prev.parameters,
        {
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
        },
      ],
    }));
  };

  const updatePlantParameter = (
    id: string,
    field: keyof Omit<ParameterData, "id">,
    value: string
  ) => {
    setPlantData((prev) => ({
      ...prev,
      parameters: prev.parameters.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      ),
    }));
  };

  const deletePlantParameter = (id: string) => {
    Alert.alert(
      "Remove Parameter",
      "Are you sure you want to remove this parameter?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setPlantData((prev) => ({
              ...prev,
              parameters: prev.parameters.filter((param) => param.id !== id),
            }));
          },
        },
      ]
    );
  };

  // ============ PORT HANDLERS ============
  const addPortParameter = () => {
    const newId = Date.now().toString();
    setPortData((prev) => ({
      ...prev,
      parameters: [
        ...prev.parameters,
        {
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
        },
      ],
    }));
  };

  const updatePortParameter = (
    id: string,
    field: keyof Omit<ParameterData, "id">,
    value: string
  ) => {
    setPortData((prev) => ({
      ...prev,
      parameters: prev.parameters.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      ),
    }));
  };

  const deletePortParameter = (id: string) => {
    Alert.alert(
      "Remove Parameter",
      "Are you sure you want to remove this parameter?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setPortData((prev) => ({
              ...prev,
              parameters: prev.parameters.filter((param) => param.id !== id),
            }));
          },
        },
      ]
    );
  };

  // ============ QUARRY/PLANT HANDLERS ============
  const addQuarryPlantParameter = () => {
    const newId = Date.now().toString();
    setQuarryPlantData((prev) => ({
      ...prev,
      parameters: [
        ...prev.parameters,
        {
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
        },
      ],
    }));
  };

  const updateQuarryPlantParameter = (
    id: string,
    field: keyof Omit<ParameterData, "id">,
    value: string
  ) => {
    setQuarryPlantData((prev) => ({
      ...prev,
      parameters: prev.parameters.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      ),
    }));
  };

  const deleteQuarryPlantParameter = (id: string) => {
    Alert.alert(
      "Remove Parameter",
      "Are you sure you want to remove this parameter?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setQuarryPlantData((prev) => ({
              ...prev,
              parameters: prev.parameters.filter((param) => param.id !== id),
            }));
          },
        },
      ]
    );
  };

  const fillTestData = () => {
    // Set location checkboxes
    setSelectedLocations({
      quarry: true,
      plant: true,
      port: false,
      quarryPlant: false,
    });

    // Fill Quarry location data
    setQuarryData({
      locationInput: "Open pit mining with progressive rehabilitation",
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
      ],
      dateTime: "March 15, 2025, 10:00 AM",
      weatherWind: "Sunny, Wind speed 3-5 m/s from Northeast",
      explanation:
        "Air quality monitoring conducted at designated stations around quarry area. All parameters measured are within DENR standards.",
      overallCompliance:
        "Compliant - All air quality parameters are within acceptable limits as per ECC conditions and DAO 2016-08.",
    });

    // Fill Plant location data
    setPlantData({
      locationInput: "Crushing and screening plant with dust suppression",
      parameter: "TSP (Total Suspended Particulates)",
      currentSMR: "78 µg/Nm³",
      previousSMR: "82 µg/Nm³",
      currentMMT: "80 µg/Nm³",
      previousMMT: "85 µg/Nm³",
      thirdPartyTesting: "79 µg/Nm³",
      eqplRedFlag: "No",
      action: "Maintain dust suppression systems",
      limitPM25: "150 µg/Nm³",
      remarks: "Within limits",
      parameters: [
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
      dateTime: "March 15, 2025, 11:30 AM",
      weatherWind: "Clear, Wind speed 2-4 m/s from East",
      explanation:
        "Air quality monitoring conducted at plant processing areas. Dust suppression systems working effectively.",
      overallCompliance: "Compliant - All parameters within ECC limits.",
    });

    // Keep legacy data for backward compatibility
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
      parameters: [],
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
      "Environmental Compliance filled with test data for Quarry and Plant locations"
    );
  };

  const handleSaveNext = () => {
    console.log("Save & Next pressed", data);
    const airQualityImpactAssessment = {
      selectedLocations,
      quarryData,
      plantData,
      portData,
      quarryPlantData,
      // Legacy support
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
      <CMSHeader
        onBack={handleBack}
        onSave={handleSave}
        onStay={handleStay}
        onSaveToDraft={handleSaveToDraft}
        onDiscard={handleDiscard}
        onGoToSummary={handleGoToSummary}
        allowEdit={true}
      />
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
              disabled={isUploadingEcc}
            >
              {isUploadingEcc ? (
                <>
                  <ActivityIndicator color="#02217C" />
                  <Text style={styles.uploadButtonText}>Uploading...</Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={24}
                    color="#02217C"
                  />
                  <Text style={styles.uploadButtonText}>Choose File</Text>
                  <Text style={styles.uploadHint}>DOC or DOCX</Text>
                </>
              )}
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
                  {uploadedEccFile.storagePath && (
                    <Text style={styles.fileUploaded}>
                      ✓ Uploaded to storage
                    </Text>
                  )}
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

        {/* Location-Specific Sections */}
        {selectedLocations.quarry && (
          <AirQualityLocationSection
            locationName="Quarry"
            locationInput={quarryData.locationInput}
            onLocationInputChange={(text) =>
              setQuarryData((prev) => ({ ...prev, locationInput: text }))
            }
            mainParameter={{
              id: "main",
              parameter: quarryData.parameter,
              currentSMR: quarryData.currentSMR,
              previousSMR: quarryData.previousSMR,
              currentMMT: quarryData.currentMMT,
              previousMMT: quarryData.previousMMT,
              thirdPartyTesting: quarryData.thirdPartyTesting,
              eqplRedFlag: quarryData.eqplRedFlag,
              action: quarryData.action,
              limitPM25: quarryData.limitPM25,
              remarks: quarryData.remarks,
            }}
            onMainParameterUpdate={(field, value) =>
              setQuarryData((prev) => ({ ...prev, [field]: value }))
            }
            parameters={quarryData.parameters}
            onUpdateParameter={updateQuarryParameter}
            onDeleteParameter={deleteQuarryParameter}
            onAddParameter={addQuarryParameter}
            naChecked={naChecked}
            onNAChange={() => setNaChecked(!naChecked)}
            dateTime={quarryData.dateTime}
            onDateTimeChange={(text) =>
              setQuarryData((prev) => ({ ...prev, dateTime: text }))
            }
            weatherWind={quarryData.weatherWind}
            onWeatherWindChange={(text) =>
              setQuarryData((prev) => ({ ...prev, weatherWind: text }))
            }
            explanation={quarryData.explanation}
            onExplanationChange={(text) =>
              setQuarryData((prev) => ({ ...prev, explanation: text }))
            }
            overallCompliance={quarryData.overallCompliance}
            onOverallComplianceChange={(text) =>
              setQuarryData((prev) => ({ ...prev, overallCompliance: text }))
            }
          />
        )}

        {selectedLocations.plant && (
          <AirQualityLocationSection
            locationName="Plant"
            locationInput={plantData.locationInput}
            onLocationInputChange={(text) =>
              setPlantData((prev) => ({ ...prev, locationInput: text }))
            }
            mainParameter={{
              id: "main",
              parameter: plantData.parameter,
              currentSMR: plantData.currentSMR,
              previousSMR: plantData.previousSMR,
              currentMMT: plantData.currentMMT,
              previousMMT: plantData.previousMMT,
              thirdPartyTesting: plantData.thirdPartyTesting,
              eqplRedFlag: plantData.eqplRedFlag,
              action: plantData.action,
              limitPM25: plantData.limitPM25,
              remarks: plantData.remarks,
            }}
            onMainParameterUpdate={(field, value) =>
              setPlantData((prev) => ({ ...prev, [field]: value }))
            }
            parameters={plantData.parameters}
            onUpdateParameter={updatePlantParameter}
            onDeleteParameter={deletePlantParameter}
            onAddParameter={addPlantParameter}
            naChecked={naChecked}
            onNAChange={() => setNaChecked(!naChecked)}
            dateTime={plantData.dateTime}
            onDateTimeChange={(text) =>
              setPlantData((prev) => ({ ...prev, dateTime: text }))
            }
            weatherWind={plantData.weatherWind}
            onWeatherWindChange={(text) =>
              setPlantData((prev) => ({ ...prev, weatherWind: text }))
            }
            explanation={plantData.explanation}
            onExplanationChange={(text) =>
              setPlantData((prev) => ({ ...prev, explanation: text }))
            }
            overallCompliance={plantData.overallCompliance}
            onOverallComplianceChange={(text) =>
              setPlantData((prev) => ({ ...prev, overallCompliance: text }))
            }
          />
        )}

        {selectedLocations.port && (
          <AirQualityLocationSection
            locationName="Port"
            locationInput={portData.locationInput}
            onLocationInputChange={(text) =>
              setPortData((prev) => ({ ...prev, locationInput: text }))
            }
            mainParameter={{
              id: "main",
              parameter: portData.parameter,
              currentSMR: portData.currentSMR,
              previousSMR: portData.previousSMR,
              currentMMT: portData.currentMMT,
              previousMMT: portData.previousMMT,
              thirdPartyTesting: portData.thirdPartyTesting,
              eqplRedFlag: portData.eqplRedFlag,
              action: portData.action,
              limitPM25: portData.limitPM25,
              remarks: portData.remarks,
            }}
            onMainParameterUpdate={(field, value) =>
              setPortData((prev) => ({ ...prev, [field]: value }))
            }
            parameters={portData.parameters}
            onUpdateParameter={updatePortParameter}
            onDeleteParameter={deletePortParameter}
            onAddParameter={addPortParameter}
            naChecked={naChecked}
            onNAChange={() => setNaChecked(!naChecked)}
            dateTime={portData.dateTime}
            onDateTimeChange={(text) =>
              setPortData((prev) => ({ ...prev, dateTime: text }))
            }
            weatherWind={portData.weatherWind}
            onWeatherWindChange={(text) =>
              setPortData((prev) => ({ ...prev, weatherWind: text }))
            }
            explanation={portData.explanation}
            onExplanationChange={(text) =>
              setPortData((prev) => ({ ...prev, explanation: text }))
            }
            overallCompliance={portData.overallCompliance}
            onOverallComplianceChange={(text) =>
              setPortData((prev) => ({ ...prev, overallCompliance: text }))
            }
          />
        )}

        {selectedLocations.quarryPlant && (
          <AirQualityLocationSection
            locationName="Quarry/Plant (Mobile Crusher)"
            locationInput={quarryPlantData.locationInput}
            onLocationInputChange={(text) =>
              setQuarryPlantData((prev) => ({ ...prev, locationInput: text }))
            }
            mainParameter={{
              id: "main",
              parameter: quarryPlantData.parameter,
              currentSMR: quarryPlantData.currentSMR,
              previousSMR: quarryPlantData.previousSMR,
              currentMMT: quarryPlantData.currentMMT,
              previousMMT: quarryPlantData.previousMMT,
              thirdPartyTesting: quarryPlantData.thirdPartyTesting,
              eqplRedFlag: quarryPlantData.eqplRedFlag,
              action: quarryPlantData.action,
              limitPM25: quarryPlantData.limitPM25,
              remarks: quarryPlantData.remarks,
            }}
            onMainParameterUpdate={(field, value) =>
              setQuarryPlantData((prev) => ({ ...prev, [field]: value }))
            }
            parameters={quarryPlantData.parameters}
            onUpdateParameter={updateQuarryPlantParameter}
            onDeleteParameter={deleteQuarryPlantParameter}
            onAddParameter={addQuarryPlantParameter}
            naChecked={naChecked}
            onNAChange={() => setNaChecked(!naChecked)}
            dateTime={quarryPlantData.dateTime}
            onDateTimeChange={(text) =>
              setQuarryPlantData((prev) => ({ ...prev, dateTime: text }))
            }
            weatherWind={quarryPlantData.weatherWind}
            onWeatherWindChange={(text) =>
              setQuarryPlantData((prev) => ({ ...prev, weatherWind: text }))
            }
            explanation={quarryPlantData.explanation}
            onExplanationChange={(text) =>
              setQuarryPlantData((prev) => ({ ...prev, explanation: text }))
            }
            overallCompliance={quarryPlantData.overallCompliance}
            onOverallComplianceChange={(text) =>
              setQuarryPlantData((prev) => ({
                ...prev,
                overallCompliance: text,
              }))
            }
          />
        )}

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
