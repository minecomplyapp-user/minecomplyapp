// WasteManagementScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CMSHeader } from "../../../components/CMSHeader";
import { QuarrySection } from "./QuarrySection";
import { PlantSection } from "./PlantSection";
import { PlantPortSection } from "./PlantPortSection";
import { PortSection } from "./PortSection";
import {
  WasteEntry,
  PlantPortSectionData,
  QuarrySectionData,
  PortSectionData,
} from "../types/WasteManagementScreen.types";
import { styles } from "../styles/WasteManagementScreen.styles";

export default function WasteManagementScreen({ navigation }: any) {
  const [quarryData, setQuarryData] = useState<QuarrySectionData>({
    noSignificantImpact: false,
    generateTable: false,
  });

  const [plantSimpleData, setPlantSimpleData] = useState<QuarrySectionData>({
    noSignificantImpact: false,
    generateTable: false,
  });

  const [plantData, setPlantData] = useState<PlantPortSectionData>({
    typeOfWaste: "",
    eccEpepCommitments: [
      { id: `waste-${Date.now()}-1`, handling: "", storage: "", disposal: "" },
    ],
    isAdequate: null,
    previousRecord: "",
    q22025GeneratedHazardWastes: "",
  });

  const [portData, setPortData] = useState<PortSectionData>({
    noSignificantImpact: false,
    generateTable: false,
    N_A: false,
  });

  const [portPlantData, setPortPlantData] = useState<PlantPortSectionData>({
    typeOfWaste: "",
    eccEpepCommitments: [
      { id: `waste-${Date.now()}-2`, handling: "", storage: "", disposal: "" },
    ],
    isAdequate: null,
    previousRecord: "",
    q22025GeneratedHazardWastes: "",
  });

  const updateQuarryData = (field: keyof QuarrySectionData, value: boolean) => {
    setQuarryData((prev) => {
      if (field === "noSignificantImpact") {
        return {
          ...prev,
          noSignificantImpact: value,
          generateTable: value ? false : prev.generateTable,
        };
      } else if (field === "generateTable") {
        return {
          ...prev,
          generateTable: value,
          noSignificantImpact: value ? false : prev.noSignificantImpact,
        };
      }
      return prev;
    });
  };

  const updatePlantSimpleData = (field: keyof QuarrySectionData, value: boolean) => {
    setPlantSimpleData((prev) => {
      if (field === "noSignificantImpact") {
        return {
          ...prev,
          noSignificantImpact: value,
          generateTable: value ? false : prev.generateTable,
        };
      } else if (field === "generateTable") {
        return {
          ...prev,
          generateTable: value,
          noSignificantImpact: value ? false : prev.noSignificantImpact,
        };
      }
      return prev;
    });
  };

  const updatePortData = (field: keyof PortSectionData, value: boolean) => {
    setPortData((prev) => {
      if (field === "noSignificantImpact") {
        return {
          ...prev,
          noSignificantImpact: value,
          generateTable: value ? false : prev.generateTable,
          N_A: value ? false : prev.N_A,
        };
      } else if (field === "generateTable") {
        return {
          ...prev,
          generateTable: value,
          noSignificantImpact: value ? false : prev.noSignificantImpact,
          N_A: value ? false : prev.N_A,
        };
      } else if (field === "N_A") {
        return {
          ...prev,
          N_A: value,
          noSignificantImpact: value ? false : prev.noSignificantImpact,
          generateTable: value ? false : prev.generateTable,
        };
      }
      return prev;
    });
  };

  const addWasteEntry = (section: "plant" | "port") => {
    const newEntry = {
      id: `waste-${Date.now()}-${section}`,
      handling: "",
      storage: "",
      disposal: "",
    };
    if (section === "plant") {
      setPlantData((prev) => ({
        ...prev,
        eccEpepCommitments: [...prev.eccEpepCommitments, newEntry],
      }));
    } else {
      setPortPlantData((prev) => ({
        ...prev,
        eccEpepCommitments: [...prev.eccEpepCommitments, newEntry],
      }));
    }
  };

  const updateWasteEntry = (
    section: "plant" | "port",
    id: string,
    field: keyof Omit<WasteEntry, "id">,
    value: string
  ) => {
    if (section === "plant") {
      setPlantData((prev) => ({
        ...prev,
        eccEpepCommitments: prev.eccEpepCommitments.map((entry) =>
          entry.id === id ? { ...entry, [field]: value } : entry
        ),
      }));
    } else {
      setPortPlantData((prev) => ({
        ...prev,
        eccEpepCommitments: prev.eccEpepCommitments.map((entry) =>
          entry.id === id ? { ...entry, [field]: value } : entry
        ),
      }));
    }
  };

  const removeWasteEntry = (section: "plant" | "port", id: string) => {
    if (section === "plant") {
      if (plantData.eccEpepCommitments.length > 1) {
        setPlantData((prev) => ({
          ...prev,
          eccEpepCommitments: prev.eccEpepCommitments.filter((entry) => entry.id !== id),
        }));
      } else {
        Alert.alert("Cannot Remove", "At least one waste entry is required.");
      }
    } else {
      if (portPlantData.eccEpepCommitments.length > 1) {
        setPortPlantData((prev) => ({
          ...prev,
          eccEpepCommitments: prev.eccEpepCommitments.filter((entry) => entry.id !== id),
        }));
      } else {
        Alert.alert("Cannot Remove", "At least one waste entry is required.");
      }
    }
  };

  const updatePlantData = (field: keyof PlantPortSectionData, value: any) => {
    setPlantData((prev) => ({ ...prev, [field]: value }));
  };

  const updatePortPlantData = (field: keyof PlantPortSectionData, value: any) => {
    setPortPlantData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAndNext = () => {
    console.log("Saving Waste Management data...");
    navigation.navigate("ChemicalSafety");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <CMSHeader
          fileName="Waste Management"
          onBack={() => navigation.goBack()}
          onSave={() => Alert.alert("Saved", "Data saved successfully")}
        />
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeaderContainer}>
          <View style={styles.sectionHeaderContent}>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>3</Text>
            </View>
            <Text style={styles.sectionTitle}>
              Compliance with Good Practice in Solid and Hazardous Waste Management
            </Text>
          </View>
        </View>
        <QuarrySection data={quarryData} onUpdate={updateQuarryData} />
        <PlantSection data={plantSimpleData} onUpdate={updatePlantSimpleData} />
        <PlantPortSection
          title="PLANT"
          icon="business"
          data={plantData}
          onUpdateData={updatePlantData}
          onAddWaste={() => addWasteEntry("plant")}
          onUpdateWaste={(id, field, value) => updateWasteEntry("plant", id, field, value)}
          onRemoveWaste={(id) => removeWasteEntry("plant", id)}
        />
        <PortSection data={portData} onUpdate={updatePortData} />
        {!portData.N_A && (
          <PlantPortSection
            title="PORT DETAILS"
            icon="boat"
            data={portPlantData}
            onUpdateData={updatePortPlantData}
            onAddWaste={() => addWasteEntry("port")}
            onUpdateWaste={(id, field, value) => updateWasteEntry("port", id, field, value)}
            onRemoveWaste={(id) => removeWasteEntry("port", id)}
          />
        )}
        <TouchableOpacity style={styles.saveNextButton} onPress={handleSaveAndNext}>
          <Text style={styles.saveNextButtonText}>Save & Next</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}
