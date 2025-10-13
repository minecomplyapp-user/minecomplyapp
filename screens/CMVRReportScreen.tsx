import React, { useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import GeneralInfoSection from "../components/CMVR/GeneralInfoSection";
import ECCSection from "../components/CMVR/ECCSection";
import ISAGSection from "../components/CMVR/ISAGSection";
import EPEPSection from "../components/CMVR/EPEPSection";
import RCFSection from "../components/CMVR/RCFSection";
import MMTSection from "../components/CMVR/MMTSection";

// Define the type for your route parameters
type RootStackParamList = {
  CMVRReport: {
    submissionId: string;
    projectName: string;
    projectId: string;
  };
};

// Define the type for the navigation and route
type CMVRReportScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CMVRReport'>;
type CMVRReportScreenRouteProp = RouteProp<RootStackParamList, 'CMVRReport'>;

const CMVRReportScreen = () => {
  const navigation = useNavigation<CMVRReportScreenNavigationProp>();
  const route = useRoute<CMVRReportScreenRouteProp>();
  const { submissionId, projectName, projectId } = route.params;

  // General Information State
  const [generalInfo, setGeneralInfo] = useState({
    companyName: "",
    location: "",
    quarter: "",
    year: "",
    dateOfCompliance: "",
    monitoringPeriod: "",
    dateOfSubmission: "",
  });

  // ECC State
  const [eccInfo, setEccInfo] = useState({
    permitHolder: "",
    eccNumber: "",
    dateOfIssuance: "",
  });
  const [eccAdditionalForms, setEccAdditionalForms] = useState<Array<{
    permitHolder: string;
    eccNumber: string;
    dateOfIssuance: string;
  }>>([]);

  // ISAG/MPP State
  const [isagInfo, setIsagInfo] = useState({
    permitHolder: "",
    isagNumber: "",
    dateOfIssuance: "",
    currentName: "",
    nameInECC: "",
    projectStatus: "",
    gpsX: "",
    gpsY: "",
    proponentName: "",
    proponentContact: "",
    proponentAddress: "",
    proponentPhone: "",
    proponentEmail: "",
  });
  const [isagAdditionalForms, setIsagAdditionalForms] = useState<Array<{
    permitHolder: string;
    isagNumber: string;
    dateOfIssuance: string;
  }>>([]);

  // EPEP/FMRDP State
  const [epepInfo, setEpepInfo] = useState({
    isNA: false,
    permitHolder: "",
    epepNumber: "",
    dateOfApproval: "",
  });
  const [epepAdditionalForms, setEpepAdditionalForms] = useState<Array<{
    permitHolder: string;
    epepNumber: string;
    dateOfApproval: string;
  }>>([]);

  // RCF/MTF/FMRDF State
  const [rcfInfo, setRcfInfo] = useState({
    permitHolder: "",
    savingsAccount: "",
    amountDeposited: "",
    dateUpdated: "",
  });
  const [rcfAdditionalForms, setRcfAdditionalForms] = useState<Array<{
    permitHolder: string;
    savingsAccount: string;
    amountDeposited: string;
    dateUpdated: string;
  }>>([]);

  const [mtfInfo, setMtfInfo] = useState({
    permitHolder: "",
    savingsAccount: "",
    amountDeposited: "",
    dateUpdated: "",
  });
  const [mtfAdditionalForms, setMtfAdditionalForms] = useState<Array<{
    permitHolder: string;
    savingsAccount: string;
    amountDeposited: string;
    dateUpdated: string;
  }>>([]);

  const [fmrdfInfo, setFmrdfInfo] = useState({
    permitHolder: "",
    savingsAccount: "",
    amountDeposited: "",
    dateUpdated: "",
  });
  const [fmrdfAdditionalForms, setFmrdfAdditionalForms] = useState<Array<{
    permitHolder: string;
    savingsAccount: string;
    amountDeposited: string;
    dateUpdated: string;
  }>>([]);

  // MMT State
  const [mmtInfo, setMmtInfo] = useState({
    contactPerson: "",
    mailingAddress: "",
    phoneNumber: "",
    emailAddress: "",
  });

  const handleSave = () => {
    Alert.alert("Saved", "Your report has been saved successfully.");
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "File_Name",
      headerRight: () => (
        <TouchableOpacity onPress={handleSave} style={{ marginRight: 10 }}>
          <Text style={{ fontSize: 16, color: "#007AFF", fontWeight: "500" }}>Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <GeneralInfoSection
          generalInfo={generalInfo}
          setGeneralInfo={setGeneralInfo}
        />
        <ECCSection
          eccInfo={eccInfo}
          setEccInfo={setEccInfo}
          eccAdditionalForms={eccAdditionalForms}
          setEccAdditionalForms={setEccAdditionalForms}
        />
        <ISAGSection
          isagInfo={isagInfo}
          setIsagInfo={setIsagInfo}
          isagAdditionalForms={isagAdditionalForms}
          setIsagAdditionalForms={setIsagAdditionalForms}
        />
        <EPEPSection
          epepInfo={epepInfo}
          setEpepInfo={setEpepInfo}
          epepAdditionalForms={epepAdditionalForms}
          setEpepAdditionalForms={setEpepAdditionalForms}
        />
        <RCFSection
          rcfInfo={rcfInfo}
          setRcfInfo={setRcfInfo}
          rcfAdditionalForms={rcfAdditionalForms}
          setRcfAdditionalForms={setRcfAdditionalForms}
          mtfInfo={mtfInfo}
          setMtfInfo={setMtfInfo}
          mtfAdditionalForms={mtfAdditionalForms}
          setMtfAdditionalForms={setMtfAdditionalForms}
          fmrdfInfo={fmrdfInfo}
          setFmrdfInfo={setFmrdfInfo}
          fmrdfAdditionalForms={fmrdfAdditionalForms}
          setFmrdfAdditionalForms={setFmrdfAdditionalForms}
        />
        <MMTSection
          mmtInfo={mmtInfo}
          setMmtInfo={setMmtInfo}
        />
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
  },
});

export default CMVRReportScreen;
