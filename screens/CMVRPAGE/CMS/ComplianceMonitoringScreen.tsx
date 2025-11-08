// ComplianceMonitoringScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { CMSHeader } from "../../../components/CMSHeader";
import { saveDraft } from "../../../lib/drafts";
import { CMSTitlePill } from "./components/CMSTitlePill";
import { CMSSectionHeader } from "./components/CMSSectionHeader";
import { CMSFormField } from "./components//CMSFormField";
import { CMSOtherComponents } from "./components/CMSOtherComponents";
import { useFileName } from "../../../contexts/FileNameContext";
import {
  FormData,
  OtherComponent,
  UploadedImages,
} from "../types/ComplianceMonitoringScreen.types";
import { styles } from "../styles/ComplianceMonitoringScreen.styles";

const ComplianceMonitoringScreen = ({ navigation, route }: any) => {
  // Use the fileName context
  const { fileName, setFileName } = useFileName();

  // Initialize fileName from route params if provided
  useEffect(() => {
    if (route?.params?.fileName && route.params.fileName !== fileName) {
      setFileName(route.params.fileName);
    }
  }, [route?.params?.fileName]);

  const [formData, setFormData] = useState<FormData>({
    projectLocation: {
      label: "Project Location",
      specification: "",
      remarks: "",
      withinSpecs: null,
    },
    projectArea: {
      label: "Project Area (ha)",
      specification: "",
      remarks: "",
      withinSpecs: null,
    },
    capitalCost: {
      label: "Capital Cost (Php)",
      specification: "",
      remarks: "",
      withinSpecs: null,
    },
    typeOfMinerals: {
      label: "Type of Minerals",
      specification: "",
      remarks: "",
      withinSpecs: null,
    },
    miningMethod: {
      label: "Mining Method",
      specification: "",
      remarks: "",
      withinSpecs: null,
    },
    production: {
      label: "Production",
      specification: "",
      remarks: "",
      withinSpecs: null,
    },
    mineLife: {
      label: "Mine Life",
      specification: "",
      remarks: "",
      withinSpecs: null,
    },
    mineralReserves: {
      label: "Mineral Reserves/ Resources",
      specification: "",
      remarks: "",
      withinSpecs: null,
    },
    accessTransportation: {
      label: "Access/ Transportation",
      specification: "",
      remarks: "",
      withinSpecs: null,
    },
    powerSupply: {
      label: "Power Supply",
      specification: "",
      remarks: "",
      withinSpecs: null,
      subFields: [
        { label: "Plant:", specification: "" },
        { label: "Port:", specification: "" },
      ],
    },
    miningEquipment: {
      label: "Mining Equipment",
      specification: "",
      remarks: "",
      withinSpecs: null,
      subFields: [
        { label: "Quarry/Plant:", specification: "" },
        { label: "Port:", specification: "" },
      ],
    },
    workForce: {
      label: "Work Force",
      specification: "",
      remarks: "",
      withinSpecs: null,
      subFields: [{ label: "Employees:", specification: "" }],
    },
    developmentSchedule: {
      label: "Development/ Utilization Schedule",
      specification: "",
      remarks: "",
      withinSpecs: null,
    },
  });

  const [otherComponents, setOtherComponents] = useState<OtherComponent[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImages>({});

  const pickImage = async (fieldKey: string) => {
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
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setUploadedImages((prev) => ({
        ...prev,
        [fieldKey]: result.assets[0].uri,
      }));
    }
  };

  const removeImage = (fieldKey: string) => {
    setUploadedImages((prev) => {
      const updated = { ...prev };
      delete updated[fieldKey];
      return updated;
    });
  };

  const updateField = (
    key: keyof FormData,
    field: "specification" | "remarks" | "withinSpecs",
    value: string | boolean | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const updateSubField = (
    key: keyof FormData,
    index: number,
    value: string
  ) => {
    setFormData((prev) => {
      const currentField = prev[key];
      const updatedSubFields = currentField?.subFields?.map((field, i) =>
        i === index ? { ...field, specification: value } : field
      );
      return {
        ...prev,
        [key]: {
          ...currentField,
          subFields: updatedSubFields,
        },
      };
    });
  };

  const addOtherComponent = () => {
    setOtherComponents([
      ...otherComponents,
      { specification: "", remarks: "", withinSpecs: null },
    ]);
  };

  const updateOtherComponent = (
    index: number,
    field: "specification" | "remarks",
    value: string
  ) => {
    setOtherComponents((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  const handleWithinSpecsChange = (index: number, value: boolean) => {
    setOtherComponents((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index].withinSpecs = value;
      }
      return updated;
    });
  };

const handleDeleteComponent = (index: number) => {
  Alert.alert(
    'Delete Parameter',
    'Are you sure you want to delete this parameter?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setOtherComponents((prev) => prev.filter((_, i) => i !== index));
        },
      },
    ]
  );
};
  const handleSave = async () => {
    console.log("Form data:", JSON.stringify(formData, null, 2));
    console.log("Other components:", JSON.stringify(otherComponents, null, 2));
    console.log("Uploaded images:", uploadedImages);

    // Collect all previous page data from route.params
    const prevPageData: any = route.params || {};

    // Prepare compliance monitoring data
    const complianceToProjectLocationAndCoverageLimits = {
      formData,
      otherComponents,
      uploadedImages,
    };

    // Combine all data from previous pages + current page
    const draftData = {
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
      executiveSummary: prevPageData.executiveSummary,
      processDocumentation: prevPageData.processDocumentation,
      complianceToProjectLocationAndCoverageLimits,
      savedAt: new Date().toISOString(),
    };

    // Resolve fileName from params
    const resolvedFileName = prevPageData.fileName || "Untitled";

    // Save draft to AsyncStorage
    const success = await saveDraft(resolvedFileName, draftData);

    if (success) {
      Alert.alert("Success", "Draft saved successfully");
      // Navigate to Dashboard using CommonActions.reset
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Dashboard" }],
        })
      );
    } else {
      Alert.alert("Error", "Failed to save draft");
    }
  };

  const fillTestData = () => {
    // Populate main form fields with sample values
    setFormData({
      projectLocation: {
        label: "Project Location",
        specification: "Sitio Sta. Rosa, Brgy. San Miguel",
        remarks: "Within permitted boundaries",
        withinSpecs: true,
      },
      projectArea: {
        label: "Project Area (ha)",
        specification: "125.4",
        remarks: "As per approved ECC",
        withinSpecs: true,
      },
      capitalCost: {
        label: "Capital Cost (Php)",
        specification: "150000000",
        remarks: "Updated estimate",
        withinSpecs: true,
      },
      typeOfMinerals: {
        label: "Type of Minerals",
        specification: "Nickel",
        remarks: "Primary commodity",
        withinSpecs: null,
      },
      miningMethod: {
        label: "Mining Method",
        specification: "Open pit with staged rehabilitation",
        remarks: "Conforms to EPEP",
        withinSpecs: true,
      },
      production: {
        label: "Production",
        specification: "120000 tons/month",
        remarks: "Stable production",
        withinSpecs: null,
      },
      mineLife: {
        label: "Mine Life",
        specification: "15 years",
        remarks: "Estimated remaining life",
        withinSpecs: null,
      },
      mineralReserves: {
        label: "Mineral Reserves/ Resources",
        specification: "Measured: 2.5M tons",
        remarks: "Geological update 2024",
        withinSpecs: null,
      },
      accessTransportation: {
        label: "Access/ Transportation",
        specification: "Existing access road maintained",
        remarks: "No encroachment",
        withinSpecs: true,
      },
      powerSupply: {
        label: "Power Supply",
        specification: "On-grid with backup genset",
        remarks: "Verified via plant inspection",
        withinSpecs: true,
        subFields: [
          { label: "Plant:", specification: "2x 1MW genset" },
          { label: "Port:", specification: "Shared power line" },
        ],
      },
      miningEquipment: {
        label: "Mining Equipment",
        specification: "2x excavator, 3x haul trucks",
        remarks: "Maintained per SOP",
        withinSpecs: true,
        subFields: [
          { label: "Quarry/Plant:", specification: "1 crusher" },
          { label: "Port:", specification: "Conveyor system" },
        ],
      },
      workForce: {
        label: "Work Force",
        specification: "450 employees",
        remarks: "Includes contractors",
        withinSpecs: null,
        subFields: [{ label: "Employees:", specification: "450" }],
      },
      developmentSchedule: {
        label: "Development/ Utilization Schedule",
        specification: "Phase 2 development Q3 2025",
        remarks: "On schedule",
        withinSpecs: null,
      },
    });

    // Add 3 other components for testing
    setOtherComponents([
      {
        specification: "Waste Management Facility - Cell A",
        remarks: "Operational",
        withinSpecs: true,
      },
      {
        specification: "Sediment Pond - SP1",
        remarks: "Maintenance required",
        withinSpecs: false,
      },
      {
        specification: "Rehabilitation Plot - R1",
        remarks: "Planted with native species",
        withinSpecs: true,
      },
    ]);

    Alert.alert(
      "Test Data",
      "Compliance Monitoring section filled with test data (3 other components)"
    );
  };

  const handleSaveAndNext = () => {
    console.log("Proceeding to next page (no draft save)");
    const complianceToProjectLocationAndCoverageLimits = {
      formData,
      otherComponents,
      uploadedImages,
    };
    const nextParams = {
      ...(route?.params || {}),
      fileName: (route?.params as any)?.fileName || fileName,
      complianceToProjectLocationAndCoverageLimits,
    } as any;
    console.log(
      "Navigating with ComplianceMonitoring params keys:",
      Object.keys(nextParams)
    );
    navigation.navigate("EIACompliance", nextParams);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Hydrate from route params when coming from a draft
  useEffect(() => {
    const params: any = route?.params || {};
    const saved = params.complianceToProjectLocationAndCoverageLimits;
    if (saved) {
      if (saved.formData)
        setFormData((prev) => ({ ...prev, ...saved.formData }));
      if (Array.isArray(saved.otherComponents))
        setOtherComponents(saved.otherComponents);
      if (saved.uploadedImages) setUploadedImages(saved.uploadedImages);
    }
  }, [route?.params]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <CMSHeader onBack={() => navigation.goBack()} onSave={handleSave} />
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <CMSTitlePill title="COMPLIANCE MONITORING REPORT AND DISCUSSIONS" />
        <CMSSectionHeader
          sectionNumber="1."
          title="Compliance to Project Location and Coverage Limits (As specified in ECC and/ or EPEP)"
        />
        <View style={styles.parametersHeader}>
          <Text style={styles.parametersText}>PARAMETERS:</Text>
        </View>
        {Object.entries(formData).map(([key, field]) => (
          <CMSFormField
            key={key}
            label={field.label}
            specification={field.specification}
            remarks={field.remarks}
            withinSpecs={field.withinSpecs}
            subFields={field.subFields}
            showUploadImage={key === "projectLocation"}
            uploadedImage={uploadedImages[key]}
            onSpecificationChange={(text) =>
              updateField(key as keyof FormData, "specification", text)
            }
            onRemarksChange={(text) =>
              updateField(key as keyof FormData, "remarks", text)
            }
            onWithinSpecsChange={(value) =>
              updateField(key as keyof FormData, "withinSpecs", value)
            }
            onSubFieldChange={(index, value) =>
              updateSubField(key as keyof FormData, index, value)
            }
            onUploadImage={() => pickImage(key)}
            onRemoveImage={() => removeImage(key)}
          />
        ))}
        <CMSOtherComponents
          components={otherComponents}
          onComponentChange={updateOtherComponent}
          onWithinSpecsChange={handleWithinSpecsChange}
          onAddComponent={addOtherComponent}
          onDeleteComponent={handleDeleteComponent}
        />
        {__DEV__ && (
          <TouchableOpacity
            style={[
              styles.saveNextButton,
              { backgroundColor: "#ff8c00", marginTop: 12 },
            ]}
            onPress={fillTestData}
          >
            <Text style={styles.saveNextButtonText}>Fill Test Data</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.saveNextButton}
          onPress={handleSaveAndNext}
        >
          <Text style={styles.saveNextButtonText}>Save & Next</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ComplianceMonitoringScreen;
