// CMVRReportScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { CMSHeader } from "../../../components/CMSHeader";
import GeneralInfoSection from "./GeneralInfoSection";
import CombinedECCISAGSection from "./CombinedECCISAGSection";
import EPEPSection from "./EPEPSection";
import RCFSection from "./RCFSection";
import MMTSection, { MMTInfo } from "./MMTSection";
import { Ionicons } from "@expo/vector-icons";
import { useFileName } from "../../../contexts/FileNameContext";
import {
  CMVRReportScreenNavigationProp,
  CMVRReportScreenRouteProp,
  GeneralInfo,
  ECCInfo,
  ECCAdditionalForm,
  ISAGInfo,
  ISAGAdditionalForm,
  EPEPInfo,
  RCFInfo,
} from "../types/CMVRReportScreen.types";
import { styles } from "../styles/CMVRReportScreen.styles";

const CMVRReportScreen = () => {
  const navigation = useNavigation<CMVRReportScreenNavigationProp>();
  const route = useRoute<CMVRReportScreenRouteProp>();
  const { submissionId, projectName, projectId } = route.params;
  
  // Use context instead of local state
  const { fileName, setFileName } = useFileName();

  // Initialize fileName from route params if provided
  useEffect(() => {
    if (route.params.fileName && route.params.fileName !== fileName) {
      setFileName(route.params.fileName);
    }
  }, [route.params.fileName]);

  const [generalInfo, setGeneralInfo] = useState<GeneralInfo>({
    companyName: "",
    projectName: projectName || "",
    location: "",
    region: "",
    province: "",
    municipality: "",
    quarter: "",
    year: "",
    dateOfCompliance: "",
    monitoringPeriod: "",
    dateOfCMRSubmission: "",
  });

  const handleGeneralInfoChange = (field: string, value: string) => {
    setGeneralInfo((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const [eccInfo, setEccInfo] = useState<ECCInfo>({
    isNA: false,
    permitHolder: "",
    eccNumber: "",
    dateOfIssuance: "",
  });

  const [eccAdditionalForms, setEccAdditionalForms] = useState<ECCAdditionalForm[]>([]);

  const [isagInfo, setIsagInfo] = useState<ISAGInfo>({
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

  const [isagAdditionalForms, setIsagAdditionalForms] = useState<ISAGAdditionalForm[]>([]);

  const [epepInfo, setEpepInfo] = useState<EPEPInfo>({
    isNA: false,
    permitHolder: "",
    epepNumber: "",
    dateOfApproval: "",
  });

  const [epepAdditionalForms, setEpepAdditionalForms] = useState<
    Array<Omit<EPEPInfo, "isNA">>
  >([]);

  const [rcfInfo, setRcfInfo] = useState<RCFInfo>({
    isNA: false,
    permitHolder: "",
    savingsAccount: "",
    amountDeposited: "",
    dateUpdated: "",
  });

  const [rcfAdditionalForms, setRcfAdditionalForms] = useState<
    Array<Omit<RCFInfo, "isNA">>
  >([]);

  const [mtfInfo, setMtfInfo] = useState<RCFInfo>({
    isNA: false,
    permitHolder: "",
    savingsAccount: "",
    amountDeposited: "",
    dateUpdated: "",
  });

  const [mtfAdditionalForms, setMtfAdditionalForms] = useState<
    Array<Omit<RCFInfo, "isNA">>
  >([]);

  const [fmrdfInfo, setFmrdfInfo] = useState<RCFInfo>({
    isNA: false,
    permitHolder: "",
    savingsAccount: "",
    amountDeposited: "",
    dateUpdated: "",
  });

  const [fmrdfAdditionalForms, setFmrdfAdditionalForms] = useState<
    Array<Omit<RCFInfo, "isNA">>
  >([]);

  const [mmtInfo, setMmtInfo] = useState<MMTInfo>({
    isNA: false,
    contactPerson: "",
    mailingAddress: "",
    phoneNumber: "",
    emailAddress: "",
  });

  const handleSave = () => {
    const allData = {
      generalInfo,
      eccInfo,
      eccAdditionalForms,
      isagInfo,
      isagAdditionalForms,
      epepInfo,
      epepAdditionalForms,
      rcfInfo,
      rcfAdditionalForms,
      mtfInfo,
      mtfAdditionalForms,
      fmrdfInfo,
      fmrdfAdditionalForms,
      mmtInfo,
    };
    console.log("Saving data:", JSON.stringify(allData, null, 2));
  };

  const handleSaveAndContinue = () => {
    console.log("Saving data before continuing...");
    handleSave();
    navigation.navigate("CMVRPage2", {
      submissionId: submissionId,
      projectName: projectName,
      projectId: projectId,
      fileName: fileName,
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
          onBack={() => navigation.goBack()}
          onSave={handleSave}
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
        <MMTSection mmtInfo={mmtInfo} setMmtInfo={setMmtInfo} />
        <TouchableOpacity
          style={styles.saveNextButton}
          onPress={handleSaveAndContinue}
        >
          <Text style={styles.saveNextButtonText}>Save & Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

export default CMVRReportScreen;