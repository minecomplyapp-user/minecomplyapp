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
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import { CMSHeader } from "../../../components/CMSHeader";
import { saveDraft } from "../../../lib/drafts";
import { supabase } from "../../../lib/supabase";
import { SectionHeader } from "./components/SectionHeader";
import { FormInputField } from "./components/FormInputField";
import {
  ParameterData,
  ComplianceData,
  createEmptyLocationData,
} from "../types/EnvironmentalComplianceScreen.types";
import { styles } from "../styles/EnvironmentalComplianceScreen.styles";

export default function EnvironmentalComplianceScreen({
  navigation,
  route,
}: any) {
  const [uploadedEccFile, setUploadedEccFile] = useState<any>(null);
  const [isUploadingEcc, setIsUploadingEcc] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Simple location description strings
  const [quarry, setQuarry] = useState("");
  const [plant, setPlant] = useState("");
  const [port, setPort] = useState("");
  const [quarryPlant, setQuarryPlant] = useState("");

  // Checkbox states to enable/disable location inputs
  const [quarryEnabled, setQuarryEnabled] = useState(false);
  const [plantEnabled, setPlantEnabled] = useState(false);
  const [portEnabled, setPortEnabled] = useState(false);
  const [quarryPlantEnabled, setQuarryPlantEnabled] = useState(false);

  // Simple air quality table data (matches backend controller)
  const [tableData, setTableData] = useState({
    parameters: [
      {
        id: `param-${Date.now()}`,
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
    ] as ParameterData[],
    dateTime: "",
    weatherWind: "",
    explanation: "",
    overallCompliance: "",
  });

  // Hydrate from route params when coming from a draft or summary
  useEffect(() => {
    const params: any = route?.params || {};

    // Check for data from draftData first (coming from summary), then from direct params
    const draftData = params.draftData;
    const saved =
      draftData?.airQualityImpactAssessment ||
      params.airQualityImpactAssessment;

    if (saved) {
      console.log("Hydrating EnvironmentalCompliance with saved data:", saved);

      // Load location strings
      if (saved.quarry && typeof saved.quarry === "string") {
        setQuarry(saved.quarry);
        setQuarryEnabled(true);
      }
      if (saved.plant && typeof saved.plant === "string") {
        setPlant(saved.plant);
        setPlantEnabled(true);
      }
      if (saved.port && typeof saved.port === "string") {
        setPort(saved.port);
        setPortEnabled(true);
      }
      if (saved.quarryPlant && typeof saved.quarryPlant === "string") {
        setQuarryPlant(saved.quarryPlant);
        setQuarryPlantEnabled(true);
      }

      // Load table data
      if (saved.table) {
        setTableData({
          parameters:
            saved.table.parameters && saved.table.parameters.length > 0
              ? saved.table.parameters
              : [
                  {
                    id: `param-${Date.now()}`,
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
          dateTime: saved.table.dateTime || "",
          weatherWind: saved.table.weatherWind || "",
          explanation: saved.table.explanation || "",
          overallCompliance: saved.table.overallCompliance || "",
        });
      }

      if (saved.uploadedEccFile) setUploadedEccFile(saved.uploadedEccFile);
      if (saved.uploadedImage) setUploadedImage(saved.uploadedImage);
    }
  }, [route?.params]);

  const updateTableField = (field: string, value: string) => {
    setTableData((prev) => ({ ...prev, [field]: value }));
  };

  // Additional parameter management functions
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
    setTableData((prev) => ({
      ...prev,
      parameters: [...prev.parameters, newParameter],
    }));
  };

  const updateParameter = (
    id: string,
    field: keyof Omit<ParameterData, "id">,
    value: string
  ) => {
    setTableData((prev) => ({
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
            setTableData((prev) => ({
              ...prev,
              parameters: prev.parameters.filter((param) => param.id !== id),
            }));
          },
        },
      ]
    );
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
              const FileSystemImport = await import("expo-file-system");
              const FileSystem = FileSystemImport.default || FileSystemImport;
              const base64 = await FileSystem.readAsStringAsync(file.uri, {
                encoding: "base64" as any,
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

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSave = async () => {
    try {
      const prevPageData: any = route.params || {};

      const airQualityImpactAssessment = {
        quarry,
        plant,
        port,
        quarryPlant,
        table: tableData,
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
        quarry,
        plant,
        port,
        quarryPlant,
        table: tableData,
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
        quarry,
        plant,
        port,
        quarryPlant,
        table: tableData,
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

  const fillTestData = () => {
    // Fill simple location descriptions
    setQuarry(
      "Water Sprinkling and imposition of speed limits are the mitigating measures imposed to minimize emissions of fugitive dusts. Furthermore, an environmental protection and enhancement programs were instituted to further enhance the environmental conditions of the company."
    );
    setQuarryEnabled(true);

    setPlant(
      "Water Sprinkling is regularly conducted particularly in areas where there is build-up of dusts and speed limits are imposed to minimize dust generation. Tree planting programs, environmental protection and enhancement programs were instituted to further enhance the environmental conditions of the company."
    );
    setPlantEnabled(true);

    setQuarryPlant(
      "Combined quarry and plant operations with comprehensive dust control measures and environmental enhancement programs implemented."
    );
    setQuarryPlantEnabled(true);

    // Fill table data with parameters array (matching backend format)
    setTableData({
      parameters: [
        {
          id: "1",
          parameter: "TSP",
          currentSMR: "3.54 µg/Ncm",
          previousSMR: "10.51 µg/Ncm",
          currentMMT: "-",
          previousMMT: "-",
          thirdPartyTesting: "",
          eqplRedFlag: "-",
          action: "-",
          limitPM25: "35 µg/Ncm",
          remarks: "ONRI - Sarrat Plant",
        },
        {
          id: "2",
          parameter: "PM10",
          currentSMR: "28.3 µg/Ncm",
          previousSMR: "32.1 µg/Ncm",
          currentMMT: "27.8 µg/Ncm",
          previousMMT: "31.9 µg/Ncm",
          thirdPartyTesting: "",
          eqplRedFlag: "None",
          action: "Continue monitoring",
          limitPM25: "60 µg/Ncm",
          remarks: "Port area - Good air quality",
        },
      ],
      dateTime: "November 18-21, 2024",
      weatherWind: "Sunny, prevailing wind from North-Northwest (N-NW)",
      explanation:
        "Confirmatory sampling conducted for validation across all monitored locations",
      overallCompliance: "All parameters within DENR standards",
    });

    Alert.alert(
      "Test Data",
      "Air Quality Impact Assessment filled with sample data"
    );
  };

  const handleSaveNext = () => {
    const airQualityImpactAssessment = {
      quarry,
      plant,
      port,
      quarryPlant,
      table: tableData,
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

        {/* Simple Location Description Inputs - Always Visible */}
        <View style={styles.locationInputContainer}>
          <View style={styles.locationHeaderRow}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => {
                setQuarryEnabled(!quarryEnabled);
                if (quarryEnabled) setQuarry(""); // Clear text when disabled
              }}
            >
              <View
                style={[
                  styles.checkbox,
                  quarryEnabled && styles.checkboxChecked,
                ]}
              >
                {quarryEnabled && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.locationLabel}>
                Quarry Location Description
              </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[
              styles.locationInput,
              !quarryEnabled && styles.locationInputDisabled,
            ]}
            value={quarry}
            onChangeText={setQuarry}
            placeholder="Enter quarry location description..."
            multiline
            numberOfLines={3}
            editable={quarryEnabled}
          />
        </View>

        <View style={styles.locationInputContainer}>
          <View style={styles.locationHeaderRow}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => {
                setPlantEnabled(!plantEnabled);
                if (plantEnabled) setPlant(""); // Clear text when disabled
              }}
            >
              <View
                style={[
                  styles.checkbox,
                  plantEnabled && styles.checkboxChecked,
                ]}
              >
                {plantEnabled && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.locationLabel}>
                Plant Location Description
              </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[
              styles.locationInput,
              !plantEnabled && styles.locationInputDisabled,
            ]}
            value={plant}
            onChangeText={setPlant}
            placeholder="Enter plant location description..."
            multiline
            numberOfLines={3}
            editable={plantEnabled}
          />
        </View>

        <View style={styles.locationInputContainer}>
          <View style={styles.locationHeaderRow}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => {
                setQuarryPlantEnabled(!quarryPlantEnabled);
                if (quarryPlantEnabled) setQuarryPlant(""); // Clear text when disabled
              }}
            >
              <View
                style={[
                  styles.checkbox,
                  quarryPlantEnabled && styles.checkboxChecked,
                ]}
              >
                {quarryPlantEnabled && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.locationLabel}>
                Quarry & Plant Location Description
              </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[
              styles.locationInput,
              !quarryPlantEnabled && styles.locationInputDisabled,
            ]}
            value={quarryPlant}
            onChangeText={setQuarryPlant}
            placeholder="Enter quarry & plant location description..."
            multiline
            numberOfLines={3}
            editable={quarryPlantEnabled}
          />
        </View>

        <View style={styles.locationInputContainer}>
          <View style={styles.locationHeaderRow}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => {
                setPortEnabled(!portEnabled);
                if (portEnabled) setPort(""); // Clear text when disabled
              }}
            >
              <View
                style={[styles.checkbox, portEnabled && styles.checkboxChecked]}
              >
                {portEnabled && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.locationLabel}>
                Port Location Description
              </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[
              styles.locationInput,
              !portEnabled && styles.locationInputDisabled,
            ]}
            value={port}
            onChangeText={setPort}
            placeholder="Enter port location description..."
            multiline
            numberOfLines={3}
            editable={portEnabled}
          />
        </View>

        {/* Simple Air Quality Parameters Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>
            Air Quality Monitoring Parameters
          </Text>

          {/* Parameters List */}
          {tableData.parameters.map((param, index) => (
            <View key={param.id} style={styles.parameterCard}>
              <View style={styles.parameterCardHeader}>
                <Text style={styles.parameterCardTitle}>
                  Parameter {index + 1}
                </Text>
                <TouchableOpacity
                  onPress={() => removeParameter(param.id)}
                  style={styles.removeParameterButton}
                >
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Parameter Name</Text>
                <TextInput
                  style={styles.input}
                  value={param.parameter}
                  onChangeText={(value) =>
                    updateParameter(param.id, "parameter", value)
                  }
                  placeholder="e.g., TSP, PM10, PM2.5"
                />
              </View>

              <View style={styles.fieldRow}>
                <View style={styles.halfField}>
                  <Text style={styles.fieldLabel}>Current SMR</Text>
                  <TextInput
                    style={styles.input}
                    value={param.currentSMR}
                    onChangeText={(value) =>
                      updateParameter(param.id, "currentSMR", value)
                    }
                    placeholder="Value"
                  />
                </View>
                <View style={styles.halfField}>
                  <Text style={styles.fieldLabel}>Previous SMR</Text>
                  <TextInput
                    style={styles.input}
                    value={param.previousSMR}
                    onChangeText={(value) =>
                      updateParameter(param.id, "previousSMR", value)
                    }
                    placeholder="Value"
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <View style={styles.halfField}>
                  <Text style={styles.fieldLabel}>Current MMT</Text>
                  <TextInput
                    style={styles.input}
                    value={param.currentMMT}
                    onChangeText={(value) =>
                      updateParameter(param.id, "currentMMT", value)
                    }
                    placeholder="Value"
                  />
                </View>
                <View style={styles.halfField}>
                  <Text style={styles.fieldLabel}>Previous MMT</Text>
                  <TextInput
                    style={styles.input}
                    value={param.previousMMT}
                    onChangeText={(value) =>
                      updateParameter(param.id, "previousMMT", value)
                    }
                    placeholder="Value"
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>EQPL Red Flag</Text>
                <TextInput
                  style={styles.input}
                  value={param.eqplRedFlag}
                  onChangeText={(value) =>
                    updateParameter(param.id, "eqplRedFlag", value)
                  }
                  placeholder="e.g., - or Yes/No"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Action</Text>
                <TextInput
                  style={styles.input}
                  value={param.action}
                  onChangeText={(value) =>
                    updateParameter(param.id, "action", value)
                  }
                  placeholder="Action to be taken"
                  multiline
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Limit</Text>
                <TextInput
                  style={styles.input}
                  value={param.limitPM25}
                  onChangeText={(value) =>
                    updateParameter(param.id, "limitPM25", value)
                  }
                  placeholder="e.g., 35 µg/Ncm"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Remarks</Text>
                <TextInput
                  style={styles.input}
                  value={param.remarks}
                  onChangeText={(value) =>
                    updateParameter(param.id, "remarks", value)
                  }
                  placeholder="Enter remarks..."
                  multiline
                  numberOfLines={2}
                />
              </View>
            </View>
          ))}

          {/* Add Parameter Button */}
          <TouchableOpacity style={styles.addButton} onPress={addParameter}>
            <Ionicons name="add-circle-outline" size={20} color="#2563EB" />
            <Text style={styles.addButtonText}>Add Parameter</Text>
          </TouchableOpacity>

          {/* Sampling Details */}
          <View style={styles.samplingSection}>
            <Text style={styles.sectionSubtitle}>Sampling Details</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Date/Time of Sampling</Text>
              <TextInput
                style={styles.input}
                value={tableData.dateTime}
                onChangeText={(value) => updateTableField("dateTime", value)}
                placeholder="e.g., November 18-21, 2024"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Weather and Wind Direction</Text>
              <TextInput
                style={styles.input}
                value={tableData.weatherWind}
                onChangeText={(value) => updateTableField("weatherWind", value)}
                placeholder="e.g., Sunny, prevailing wind from North-Northwest"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Explanation for Confirmatory Sampling
              </Text>
              <TextInput
                style={styles.input}
                value={tableData.explanation}
                onChangeText={(value) => updateTableField("explanation", value)}
                placeholder="Explain why confirmatory sampling was conducted..."
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Overall Assessment</Text>
              <TextInput
                style={styles.input}
                value={tableData.overallCompliance}
                onChangeText={(value) =>
                  updateTableField("overallCompliance", value)
                }
                placeholder="e.g., All parameters within DENR standards"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
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
