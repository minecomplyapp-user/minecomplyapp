import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";

export type MMTInfo = {
  isNA: boolean;
  contactPerson: string;
  mailingAddress: string;
  phoneNumber: string;
  emailAddress: string;
};

type MMTSectionProps = {
  mmtInfo: MMTInfo;
  setMmtInfo: React.Dispatch<React.SetStateAction<MMTInfo>>;
};

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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#EFF6FF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#BFDBFE",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: '#02217C',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },
  autoPopulateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#BFDBFE",
  },
  autoPopulateText: {
    fontSize: 13,
    color:'#02217C',
    fontWeight: "600",
  },
  formContent: {
    padding: 20,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0F172A",
  },
  textArea: {
    minHeight: 90,
    paddingTop: 14,
  },
  saveButton: {
    backgroundColor: '#02217C',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 8,
    shadowColor:'#02217C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});

export default MMTSection;