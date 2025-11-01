// EIAComplianceScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { CMSHeader } from "../../../components/CMSHeader";
import { ProjectImpacts } from "./ProjectImpacts";
import { OperationSectionComponent } from "./OperationSection";
import { OverallCompliance } from "./OverallCompliance";
import {
  EIAComplianceScreenNavigationProp,
  YesNoNull,
  OperationSection,
  MitigatingMeasure,
} from "../types/EIAComplianceScreen.types";
import { styles } from "../styles/EIAComplianceScreen.styles";

const EIAComplianceScreen: React.FC<{ navigation: EIAComplianceScreenNavigationProp; route: any }> = ({
  navigation,
  route,
}) => {
  const [preConstruction, setPreConstruction] = useState<YesNoNull>(null);
  const [construction, setConstruction] = useState<YesNoNull>(null);

  const [quarryOperation, setQuarryOperation] = useState<OperationSection>({
    title: "Quarry Operation",
    isNA: false,
    measures: [
      {
        id: "1",
        planned: "",
        actualObservation: "",
        isEffective: null,
        recommendations: "",
      },
    ],
  });

  const [plantOperation, setPlantOperation] = useState<OperationSection>({
    title: "Plant Operation",
    isNA: false,
    measures: [
      {
        id: "1",
        planned: "",
        actualObservation: "",
        isEffective: null,
        recommendations: "",
      },
    ],
  });

  const [portOperation, setPortOperation] = useState<OperationSection>({
    title: "Port Operation",
    isNA: false,
    measures: [
      {
        id: "1",
        planned: "",
        actualObservation: "",
        isEffective: null,
        recommendations: "",
      },
    ],
  });

  const [overallCompliance, setOverallCompliance] = useState("");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleSave = () => {
    console.log("Saving EIA Compliance data...");
    const allData = {
      preConstruction,
      construction,
      quarryOperation,
      plantOperation,
      portOperation,
      overallCompliance,
    };
    console.log(JSON.stringify(allData, null, 2));
  };

  const handleSaveAndNext = () => {
    console.log("Saving and proceeding to next page...");
    handleSave();
    navigation.navigate("EnvironmentalCompliance");
  };

  const addMeasure = (section: "quarry" | "plant" | "port") => {
    const newMeasure: MitigatingMeasure = {
      id: Date.now().toString(),
      planned: "",
      actualObservation: "",
      isEffective: null,
      recommendations: "",
    };
    if (section === "quarry") {
      setQuarryOperation({
        ...quarryOperation,
        measures: [...quarryOperation.measures, newMeasure],
      });
    } else if (section === "plant") {
      setPlantOperation({
        ...plantOperation,
        measures: [...plantOperation.measures, newMeasure],
      });
    } else {
      setPortOperation({
        ...portOperation,
        measures: [...portOperation.measures, newMeasure],
      });
    }
  };

  const updateMeasure = (
  section: "quarry" | "plant" | "port",
  measureId: string,
  field: keyof MitigatingMeasure,
  value: any
) => {
  const updateSection = (current: OperationSection) => ({
    ...current,
    measures: current.measures.map((m) =>
      m.id === measureId ? { ...m, [field]: value } : m
    ),
  });
  if (section === "quarry") {
    setQuarryOperation(updateSection(quarryOperation));
  } else if (section === "plant") {
    setPlantOperation(updateSection(plantOperation));
  } else {
    setPortOperation(updateSection(portOperation));
  }
};


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <CMSHeader
          fileName="File_Name"
          onSave={handleSave}
          onBack={() => navigation.goBack()}
        />
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.titleContainer}>
          <View style={styles.titleAccent} />
          <Text style={styles.titleText}>
            2. Compliance to Impact Management Commitments in EIA report & EPEP
          </Text>
        </View>
        <ProjectImpacts
          preConstruction={preConstruction}
          construction={construction}
          onPreConstructionChange={setPreConstruction}
          onConstructionChange={setConstruction}
        />
        <View style={styles.divider} />
        <Text style={styles.mainTitle}>
          Implementation of Environmental Impact Control Strategies
        </Text>
        <OperationSectionComponent
          section={quarryOperation}
          onNAToggle={() =>
            setQuarryOperation({
              ...quarryOperation,
              isNA: !quarryOperation.isNA,
            })
          }
          onMeasureUpdate={(measureId, field, value) =>
            updateMeasure("quarry", measureId, field, value)
          }
          onAddMeasure={() => addMeasure("quarry")}
        />
        <View style={styles.dividerSmall} />
        <OperationSectionComponent
          section={plantOperation}
          onNAToggle={() =>
            setPlantOperation({
              ...plantOperation,
              isNA: !plantOperation.isNA,
            })
          }
          onMeasureUpdate={(measureId, field, value) =>
            updateMeasure("plant", measureId, field, value)
          }
          onAddMeasure={() => addMeasure("plant")}
        />
        <View style={styles.dividerSmall} />
        <OperationSectionComponent
          section={portOperation}
          onNAToggle={() =>
            setPortOperation({
              ...portOperation,
              isNA: !portOperation.isNA,
            })
          }
          onMeasureUpdate={(measureId, field, value) =>
            updateMeasure("port", measureId, field, value)
          }
          onAddMeasure={() => addMeasure("port")}
        />
        <View style={styles.divider} />
        <OverallCompliance
          value={overallCompliance}
          onChangeText={setOverallCompliance}
        />
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

export default EIAComplianceScreen;