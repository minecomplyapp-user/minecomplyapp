import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ResultMonitoring } from "./ResultMonitoring";
import { DENRStandardSection } from "./DENRStandardSection";
import { MMTSection } from "./MMTSection";
import { Parameter } from "../../types/WaterQualityScreen.types";
import { ParameterFormProps } from "../types/ParameterForm.types";
import { styles } from "../styles/ParameterForm.styles";
import { Picker } from "@react-native-picker/picker";

export const ParameterForm: React.FC<ParameterFormProps> = ({
  parameter,
  index,
  isMain = false,
  onUpdate,
  onDelete,
  // MMT props (optional)
  mmtCurrent,
  mmtPrevious,
  isMMTNA,
  onMMTInputChange,
  onMMTNAToggle,
}) => {
  const handleTSSChange = (field: string, value: string) => {
    onUpdate(field as keyof Omit<Parameter, "id">, value);
  };

  return (
    <View style={!isMain && styles.additionalContainer}>
      {!isMain && onDelete && (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Ionicons name="trash-outline" size={16} color="#DC2626" />
        </TouchableOpacity>
      )}

      <View style={styles.parameterHeader}>
        <Text style={styles.parameterLabel}>
          {isMain ? "Parameter:" : `Parameter ${index! + 1}:`}
        </Text>
      </View>

        {/* Picker dropdown */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={parameter.parameter}
            onValueChange={(value) => {

            if (value.toLowerCase().includes("oil")) {
                onUpdate("parameter", "OG");
              } else if (value.toLowerCase().includes("tss")) {
                onUpdate("parameter", "TSS"); 
              } else {
                onUpdate("parameter", ""); 
              }

            }
    }
          
          style={styles.picker}
          dropdownIconColor="#0F172A"
        >
          <Picker.Item label="Select Parameter..." value="" />
          <Picker.Item label="TSS" value="TSS" />
          <Picker.Item label="Oil & Grease" value="Oil & Grease" />
        </Picker>
      </View>


      <ResultMonitoring
        parameter={parameter.parameter}
        resultType={parameter.resultType}
        tssCurrent={parameter.tssCurrent}
        tssPrevious={parameter.tssPrevious}
        onResultTypeChange={(value) => onUpdate("resultType", value)}
        onTSSChange={handleTSSChange}
      />

      {/* MMT Section - Show when MMT props are provided */}
      {onMMTInputChange && onMMTNAToggle && (
        <View style={styles.mmtSubSection}>
          <Text style={styles.mmtTitle}>MMT Confirmatory Sampling</Text>
          <MMTSection
            mmtCurrent={mmtCurrent || ""}
            mmtPrevious={mmtPrevious || ""}
            isMMTNA={isMMTNA || false}
            onInputChange={onMMTInputChange}
            onNAToggle={onMMTNAToggle}
          />
        </View>
      )}

      <DENRStandardSection
        redFlag={parameter.eqplRedFlag}
        action={parameter.action}
        limit={parameter.limit}
        onInputChange={(field, value) =>
          onUpdate(field as keyof Omit<Parameter, "id">, value)
        }
      />

      {/* Remarks field for ALL parameters */}
      <View>
        <Text style={styles.remarksLabel}>Remarks:</Text>
        <TextInput
          style={styles.remarksInput}
          value={parameter.remarks}
          onChangeText={(text) => onUpdate("remarks", text)}
          placeholder="Type here..."
          placeholderTextColor="#94A3B8"
          multiline
        />
      </View>
    </View>
  );
};
