import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Platform, // Import Platform
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { CMSHeader } from "../../components/CMSHeader";
import GeneralInfoSection from "../../components/CMVR/GeneralInfoSection";
import CombinedECCISAGSection from "../../components/CMVR/CombinedECCISAGSection";
import EPEPSection from "../../components/CMVR/EPEPSection";
import RCFSection from "../../components/CMVR/RCFSection";
import MMTSection, { MMTInfo } from "../../components/CMVR/MMTSection";
import { Ionicons } from "@expo/vector-icons";

type RootStackParamList = {
  CMVRReport: {
    submissionId: string;
    projectName: string;
    projectId: string;
    fileName?: string;
  };
  CMVRPage2: {
    submissionId: string;
    projectName: string;
    projectId: string;
    fileName: string;
  };
};

type CMVRReportScreenNavigationProp = StackNavigationProp<RootStackParamList, "CMVRReport">;
type CMVRReportScreenRouteProp = RouteProp<RootStackParamList, "CMVRReport">;

const CMVRReportScreen = () => {
  const navigation = useNavigation<CMVRReportScreenNavigationProp>();
  const route = useRoute<CMVRReportScreenRouteProp>();
  const { submissionId, projectName, projectId } = route.params;
  const [fileName, setFileName] = useState(route.params.fileName || "File_Name");

  const [generalInfo, setGeneralInfo] = useState({
    companyName: "",
    projectName: projectName || "",
    location: "",
    region: "",
    province: "",
    municipality: "",
  });

const handleGeneralInfoChange = (field: string, value: string) => { 
    setGeneralInfo(prevState => ({
      ...prevState,
      [field]: value, 
    }));
  };

  const [eccInfo, setEccInfo] = useState({
    isNA: false,
    permitHolder: "",
    eccNumber: "",
    dateOfIssuance: "",
  });

  const [eccAdditionalForms, setEccAdditionalForms] = useState<
    Array<{ permitHolder: string; eccNumber: string; dateOfIssuance: string }>
  >([]);

  const [isagInfo, setIsagInfo] = useState({
    isNA: false,
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

  const [isagAdditionalForms, setIsagAdditionalForms] = useState<
    Array<{ permitHolder: string; isagNumber: string; dateOfIssuance: string }>
  >([]);

  const [epepInfo, setEpepInfo] = useState({
    isNA: false,
    permitHolder: "",
    epepNumber: "",
    dateOfApproval: "",
  });

  const [epepAdditionalForms, setEpepAdditionalForms] = useState<
    Array<{ permitHolder: string; epepNumber: string; dateOfApproval: string }>
  >([]);

  const [rcfInfo, setRcfInfo] = useState({
    isNA: false,
    permitHolder: "",
    savingsAccount: "",
    amountDeposited: "",
    dateUpdated: "",
  });

  const [rcfAdditionalForms, setRcfAdditionalForms] = useState<
    Array<{
      permitHolder: string;
      savingsAccount: string;
      amountDeposited: string;
      dateUpdated: string;
    }>
  >([]);

  const [mtfInfo, setMtfInfo] = useState({
    isNA: false,
    permitHolder: "",
    savingsAccount: "",
    amountDeposited: "",
    dateUpdated: "",
  });

  const [mtfAdditionalForms, setMtfAdditionalForms] = useState<
    Array<{
      permitHolder: string;
      savingsAccount: string;
      amountDeposited: string;
      dateUpdated: string;
    }>
  >([]);

  const [fmrdfInfo, setFmrdfInfo] = useState({
    isNA: false,
    permitHolder: "",
    savingsAccount: "",
    amountDeposited: "",
    dateUpdated: "",
  });

  const [fmrdfAdditionalForms, setFmrdfAdditionalForms] = useState<
    Array<{
      permitHolder: string;
      savingsAccount: string;
      amountDeposited: string;
      dateUpdated: string;
    }>
  >([]);

  const [mmtInfo, setMmtInfo] = useState<MMTInfo>({
    isNA: false,
    contactPerson: "",
    mailingAddress: "",
    phoneNumber: "",
    emailAddress: "",
  });

  const handleSave = () => {
     // Gather data before saving
     const allData = {
         generalInfo,
         eccInfo, eccAdditionalForms,
         isagInfo, isagAdditionalForms,
         epepInfo, epepAdditionalForms,
         rcfInfo, rcfAdditionalForms,
         mtfInfo, mtfAdditionalForms,
         fmrdfInfo, fmrdfAdditionalForms,
         mmtInfo,
     };
     console.log("Saving data:", JSON.stringify(allData, null, 2)); 
  };

   const handleSaveAndContinue = () => {
    console.log("Saving data before continuing...");
    handleSave(); // Perform the save action

    // Navigate to the next screen, passing necessary parameters
    navigation.navigate('CMVRPage2', {
      submissionId: submissionId,
      projectName: projectName,
      projectId: projectId,
      fileName: fileName,
      // Pass any other required data from this screen's state if needed
    });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <CMSHeader
          fileName={fileName}
          onBack={() => navigation.goBack()}
          onSave={handleSave}
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled" // Keep keyboard interactions smooth in ScrollView
      >
        <GeneralInfoSection {...generalInfo} onChange={handleGeneralInfoChange} />
        <View style={styles.divider} />
        <CombinedECCISAGSection
          eccInfo={eccInfo}
          setEccInfo={setEccInfo}
          eccAdditionalForms={eccAdditionalForms}
          setEccAdditionalForms={setEccAdditionalForms}
          isagInfo={isagInfo}
          setIsagInfo={setIsagInfo}
          isagAdditionalForms={isagAdditionalForms}
          setIsagAdditionalForms={setIsagAdditionalForms}
        />
        <View style={styles.divider} />
        <EPEPSection
          epepInfo={epepInfo}
          setEpepInfo={setEpepInfo}
          epepAdditionalForms={epepAdditionalForms}
          setEpepAdditionalForms={setEpepAdditionalForms}
        />
        <View style={styles.divider} />
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
        <View style={styles.divider} />
        <MMTSection
          mmtInfo={mmtInfo}
          setMmtInfo={setMmtInfo}
        />

        {/* Save & Continue Button */}
        <TouchableOpacity
          style={styles.saveNextButton}
          onPress={handleSaveAndContinue} // Use specific handler
        >
          <Text style={styles.saveNextButtonText}>Save & Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>

        {/* Spacer at the bottom inside ScrollView */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 12 : 12, 
    paddingBottom: 12,
    backgroundColor: "white",

  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 20, 
  },
  divider: {
    height: 8,
    backgroundColor: "#F8F9FA",
  },
  saveNextButton: {
     backgroundColor: '#02217C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 16, 
    marginTop: 24,       // Add margin top
    marginBottom: 16,      // Add margin bottom
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveNextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default CMVRReportScreen;