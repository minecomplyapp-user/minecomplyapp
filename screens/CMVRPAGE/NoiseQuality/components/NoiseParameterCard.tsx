import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NoiseParameterCardProps } from '../types';
import { noiseParameterCardStyles as styles } from '../styles';

export const NoiseParameterCard: React.FC<NoiseParameterCardProps> = ({
  parameter,
  index,
  canDelete,
  onUpdate,
  onDelete,
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>#{index + 1}</Text>
          </View>
          <Text style={styles.title}>Parameter</Text>
        </View>
        {canDelete && (
          <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(parameter.id)}>
            <Ionicons name="trash" size={20} color="#DC2626" />
          </TouchableOpacity>
        )}
      </View>

      {/* Parameter Name with N/A */}
      <View style={styles.fieldGroup}>
        <View style={styles.labelWithAction}>
          <Text style={styles.label}>Parameter Name</Text>
          <TouchableOpacity
            style={styles.naButton}
            onPress={() => onUpdate(parameter.id, 'isParameterNA', !parameter.isParameterNA)}
          >
            <View style={[styles.checkbox, parameter.isParameterNA && styles.checkboxChecked]}>
              {parameter.isParameterNA && <Ionicons name="checkmark" size={14} color="white" />}
            </View>
            <Text style={styles.naText}>N/A</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={[styles.input, parameter.isParameterNA && styles.disabledInput]}
          value={parameter.parameter}
          onChangeText={(text) => onUpdate(parameter.id, 'parameter', text)}
          placeholder="Enter parameter name"
          placeholderTextColor="#94A3B8"
          editable={!parameter.isParameterNA}
        />
      </View>

      {/* Results Section */}
      <View style={styles.subsectionHeader}>
        <Text style={styles.subsectionTitle}>Results</Text>
      </View>

      <View style={styles.resultsRow}>
        <View style={styles.resultColumn}>
          <Text style={styles.columnLabel}>IN SABR</Text>
          <View style={styles.resultField}>
            <Text style={styles.resultLabel}>Current</Text>
            <TextInput
              style={[styles.smallInput, parameter.isParameterNA && styles.disabledInput]}
              value={parameter.currentInSMR}
              onChangeText={(text) => onUpdate(parameter.id, 'currentInSMR', text)}
              placeholder="Value"
              placeholderTextColor="#94A3B8"
              editable={!parameter.isParameterNA}
            />
          </View>
          <View style={styles.resultField}>
            <Text style={styles.resultLabel}>Previous</Text>
            <TextInput
              style={[styles.smallInput, parameter.isParameterNA && styles.disabledInput]}
              value={parameter.previousInSMR}
              onChangeText={(text) => onUpdate(parameter.id, 'previousInSMR', text)}
              placeholder="Value"
              placeholderTextColor="#94A3B8"
              editable={!parameter.isParameterNA}
            />
          </View>
        </View>

        <View style={styles.resultColumn}>
          <Text style={styles.columnLabel}>MMT SAMPLING</Text>
          <View style={styles.resultField}>
            <Text style={styles.resultLabel}>Current</Text>
            <TextInput
              style={[styles.smallInput, parameter.isParameterNA && styles.disabledInput]}
              value={parameter.mmtCurrent}
              onChangeText={(text) => onUpdate(parameter.id, 'mmtCurrent', text)}
              placeholder="Value"
              placeholderTextColor="#94A3B8"
              editable={!parameter.isParameterNA}
            />
          </View>
          <View style={styles.resultField}>
            <Text style={styles.resultLabel}>Previous</Text>
            <TextInput
              style={[styles.smallInput, parameter.isParameterNA && styles.disabledInput]}
              value={parameter.mmtPrevious}
              onChangeText={(text) => onUpdate(parameter.id, 'mmtPrevious', text)}
              placeholder="Value"
              placeholderTextColor="#94A3B8"
              editable={!parameter.isParameterNA}
            />
          </View>
        </View>
      </View>

      {/* EQPL Section - Changed from checkboxes to bullets */}
      <View style={styles.subsectionHeader}>
        <Text style={styles.subsectionTitle}>EQPL (Environmental Quality Performance Level)</Text>
      </View>

      {/* Red Flag - Bullet instead of checkbox */}
      <View style={styles.eqplField}>
        <View style={styles.eqplRow}>
          <View style={styles.bulletRow}>
            <View style={styles.bullet} />
            <Text style={styles.eqplLabel}>Red Flag</Text>
          </View>
          <TextInput
            style={[
              styles.input,
              styles.flexInput,
              parameter.isParameterNA && styles.disabledInput,
            ]}
            value={parameter.redFlag}
            onChangeText={(text) => onUpdate(parameter.id, 'redFlag', text)}
            placeholder="Enter value"
            placeholderTextColor="#94A3B8"
            editable={!parameter.isParameterNA}
          />
        </View>
      </View>

      {/* Action - Bullet instead of checkbox */}
      <View style={styles.eqplField}>
        <View style={styles.eqplRow}>
          <View style={styles.bulletRow}>
            <View style={styles.bullet} />
            <Text style={styles.eqplLabel}>Action</Text>
          </View>
          <TextInput
            style={[
              styles.input,
              styles.flexInput,
              parameter.isParameterNA && styles.disabledInput,
            ]}
            value={parameter.action}
            onChangeText={(text) => onUpdate(parameter.id, 'action', text)}
            placeholder="Enter value"
            placeholderTextColor="#94A3B8"
            editable={!parameter.isParameterNA}
          />
        </View>
      </View>

      {/* Limit - Bullet instead of checkbox */}
      <View style={styles.eqplField}>
        <View style={styles.eqplRow}>
          <View style={styles.bulletRow}>
            <View style={styles.bullet} />
            <Text style={styles.eqplLabel}>Limit (DENR std.)</Text>
          </View>
          <TextInput
            style={[
              styles.input,
              styles.flexInput,
              parameter.isParameterNA && styles.disabledInput,
            ]}
            value={parameter.limit}
            onChangeText={(text) => onUpdate(parameter.id, 'limit', text)}
            placeholder="Enter value"
            placeholderTextColor="#94A3B8"
            editable={!parameter.isParameterNA}
          />
        </View>
      </View>
    </View>
  );
};

export default NoiseParameterCard;