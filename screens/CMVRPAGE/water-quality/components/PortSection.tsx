import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ParameterForm } from "./ParameterForm";
import { Parameter } from "../../types/WaterQualityScreen.types";
import { PortSectionProps } from "../types/PortSection.types";
import { styles } from "../styles/PortSection.styles";

export const PortSection: React.FC<PortSectionProps> = ({
  port,
  index,
  onUpdate,
  onDelete,
  onAddParameter,
  onUpdateParameter,
  onDeleteParameter,
}) => {
  const mainParameter: Parameter = {
    id: "main",
    parameter: port.parameter,
    resultType: port.resultType,
    tssCurrent: port.tssCurrent,
    tssPrevious: port.tssPrevious,
    eqplRedFlag: port.eqplRedFlag,
    action: port.action,
    limit: port.limit,
    remarks: port.remarks,
    mmtCurrent: port.mmtCurrent,
    mmtPrevious: port.mmtPrevious,
    isMMTNA: port.isMMTNA,
  };

  const handleMainParameterUpdate = (
    field: keyof Omit<Parameter, "id">,
    value: string | boolean
  ) => {
    onUpdate(port.id, field, value);
  };

  const handleMMTInputChange = (field: string, value: string) => {
    onUpdate(port.id, field, value);
  };

  return (
    <View style={styles.container}>
      {/* Port Header */}
      <View style={styles.portHeaderContainer}>
        <View style={styles.portLabelContainer}>
          <Ionicons
            name="location"
            size={16}
            color="#02217C"
            style={styles.icon}
          />
          <Text style={styles.portLabel}>Port</Text>
        </View>
        <TextInput
          style={styles.portInput}
          value={port.portName}
          onChangeText={(text) => onUpdate(port.id, "portName", text)}
          placeholder="Type here..."
          placeholderTextColor="#94A3B8"
        />
        <TouchableOpacity
          style={styles.deletePortButton}
          onPress={() => onDelete(port.id)}
        >
          <Ionicons name="trash-outline" size={16} color="#DC2626" />
        </TouchableOpacity>
      </View>

      {/* Internal Monitoring Section */}
      <View style={styles.internalMonitoringContainer}>
        <Text style={styles.internalMonitoringTitle}>Internal Monitoring</Text>

        <ParameterForm
          parameter={mainParameter}
          isMain={true}
          onUpdate={handleMainParameterUpdate}
          mmtCurrent={port.mmtCurrent}
          mmtPrevious={port.mmtPrevious}
          isMMTNA={port.isMMTNA}
          onMMTInputChange={handleMMTInputChange}
          onMMTNAToggle={() => onUpdate(port.id, "isMMTNA", !port.isMMTNA)}
          samplingDetails={{
            dateTime: port.dateTime,
            weatherWind: port.weatherWind,
            explanation: port.explanation,
            isExplanationNA: port.isExplanationNA,
          }}
          onSamplingDetailsChange={(field, value) =>
            onUpdate(port.id, field, value)
          }
          onExplanationNAToggle={() =>
            onUpdate(port.id, "isExplanationNA", !port.isExplanationNA)
          }
        />
      </View>

      {/* Additional Parameters */}
      {port.additionalParameters.map((param, idx) => (
        <ParameterForm
          key={param.id}
          parameter={param}
          index={idx}
          isMain={false}
          onUpdate={(field, value) =>
            onUpdateParameter(port.id, param.id, field, value)
          }
          onDelete={() => onDeleteParameter(port.id, idx)}
        />
      ))}

      {/* Add More Parameter Button */}
      <TouchableOpacity
        style={styles.addParameterButton}
        onPress={() => onAddParameter(port.id)}
      >
        <Ionicons name="add-circle-outline" size={18} color="#02217C" />
        <Text style={styles.addParameterText}>Add More Parameter</Text>
      </TouchableOpacity>
    </View>
  );
};
