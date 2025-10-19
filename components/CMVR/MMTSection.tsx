import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';

// Define types for your props and state
type MMTInfo = {
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
  const navigation = useNavigation<any>();  // Add this line
  
  const updateMMTInfo = (field: keyof MMTInfo, value: string) => {
    setMmtInfo((prev: MMTInfo) => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeaderWithLink}>
        <Text style={styles.sectionTitle}>Multipartite Monitoring Team</Text>
        <TouchableOpacity>
          <Text style={styles.autoPopulateLink}>Auto-populate with your saved info</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.labelLong}>MMT Contact Person & Position:</Text>
        <TextInput
          style={styles.input}
          value={mmtInfo.contactPerson}
          onChangeText={(text) => updateMMTInfo("contactPerson", text)}
          placeholder="Type here..."
        />
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.labelLong}>MMT Mailing Address:</Text>
        <TextInput
          style={styles.input}
          value={mmtInfo.mailingAddress}
          onChangeText={(text) => updateMMTInfo("mailingAddress", text)}
          placeholder="Type here..."
        />
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.labelLong}>MMT Telephone No./ Fax No.:</Text>
        <TextInput
          style={styles.input}
          value={mmtInfo.phoneNumber}
          onChangeText={(text) => updateMMTInfo("phoneNumber", text)}
          placeholder="Type here..."
        />
      </View>
      <View style={styles.fieldRow}>
        <TextInput style={styles.input} placeholder="Type here..." />
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.labelLong}>MMT Email Address:</Text>
        <TextInput
          style={styles.input}
          value={mmtInfo.emailAddress}
          onChangeText={(text) => updateMMTInfo("emailAddress", text)}
          placeholder="email@domain.com"
          keyboardType="email-address"
        />
      </View>
      <TouchableOpacity 
        style={styles.saveNextButton}
        onPress={() => navigation.navigate('CMVRPage2')}
      >
        <Text style={styles.saveNextButtonText}>Save & Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: "white",
    padding: 16,
  },
  sectionHeaderWithLink: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    backgroundColor: "#D8D8FF",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#000",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  autoPopulateLink: {
    fontSize: 12,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  fieldRow: {
    marginBottom: 12,
  },
  labelLong: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
  },
  saveNextButton: {
    backgroundColor: "#7C6FDB",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  saveNextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default MMTSection;