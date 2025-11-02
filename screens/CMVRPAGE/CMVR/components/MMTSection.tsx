import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/mmt.styles";
import type { MMTInfo, MMTSectionProps } from "../types/mmt.types";

const MMTSection: React.FC<MMTSectionProps> = ({ mmtInfo, setMmtInfo }) => {
  const navigation = useNavigation<any>();
  
  const updateMMTInfo = (field: keyof MMTInfo, value: string) => {
    setMmtInfo((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.iconContainer}>
          <Ionicons name="people" size={24} color="#1E40AF" />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.sectionTitle}>Monitoring Team</Text>
          <Text style={styles.sectionSubtitle}>Multipartite Monitoring Team</Text>
        </View>
        <TouchableOpacity style={styles.autoPopulateButton}>
          <Ionicons name="cloud-download" size={16} color="#1E40AF" />
          <Text style={styles.autoPopulateText}>Auto</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContent}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>MMT Contact Person & Position</Text>
          <TextInput
            style={styles.input}
            value={mmtInfo.contactPerson}
            onChangeText={(text) => updateMMTInfo("contactPerson", text)}
            placeholder="Enter contact person and position"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>MMT Mailing Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={mmtInfo.mailingAddress}
            onChangeText={(text) => updateMMTInfo("mailingAddress", text)}
            placeholder="Enter mailing address"
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>MMT Telephone No. / Fax No.</Text>
          <TextInput
            style={styles.input}
            value={mmtInfo.phoneNumber}
            onChangeText={(text) => updateMMTInfo("phoneNumber", text)}
            placeholder="09XX-XXX-XXXX"
            placeholderTextColor="#94A3B8"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>MMT Email Address</Text>
          <TextInput
            style={styles.input}
            value={mmtInfo.emailAddress}
            onChangeText={(text) => updateMMTInfo("emailAddress", text)}
            placeholder="email@domain.com"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>
    </View>
  );
};

export default MMTSection;