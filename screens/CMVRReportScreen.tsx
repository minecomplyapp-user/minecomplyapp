import React, { useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Alert, TextInput, Modal } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import GeneralInfoSection from "../components/CMVR/GeneralInfoSection";
import ECCSection from "../components/CMVR/ECCSection";
import ISAGSection from "../components/CMVR/ISAGSection";
import EPEPSection from "../components/CMVR/EPEPSection";
import RCFSection from "../components/CMVR/RCFSection";
import MMTSection from "../components/CMVR/MMTSection";

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

type CMVRReportScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CMVRReport'>;
type CMVRReportScreenRouteProp = RouteProp<RootStackParamList, 'CMVRReport'>;

const CMVRReportScreen = () => {
  const navigation = useNavigation<CMVRReportScreenNavigationProp>();
  const route = useRoute<CMVRReportScreenRouteProp>();
  const { submissionId, projectName, projectId } = route.params;
  const [fileName, setFileName] = useState(route.params.fileName || "File_Name");
  const [isEditingFileName, setIsEditingFileName] = useState(false);
  const [tempFileName, setTempFileName] = useState(route.params.fileName || "File_Name");

  const [generalInfo, setGeneralInfo] = useState({
    companyName: "",
    location: "",
    quarter: "",
    year: "",
    dateOfCompliance: "",
    monitoringPeriod: "",
    dateOfSubmission: "",
  });

  const [eccInfo, setEccInfo] = useState({
    isNA: false,
    permitHolder: "",
    eccNumber: "",
    dateOfIssuance: "",
  });

  const [eccAdditionalForms, setEccAdditionalForms] = useState<Array<{
    permitHolder: string;
    eccNumber: string;
    dateOfIssuance: string;
  }>>([]);

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

  const [mmtInfo, setMmtInfo] = useState({
    contactPerson: "",
    mailingAddress: "",
    phoneNumber: "",
    emailAddress: "",
  });

  const handleSave = () => {
    Alert.alert("Saved", "Your report has been saved successfully.");
  };

  const handleNextPage = () => {
    navigation.navigate('CMVRPage2', {
      submissionId,
      projectName,
      projectId,
      fileName,
    });
  };

  const handleEditFileName = () => {
    setTempFileName(fileName);
    setIsEditingFileName(true);
  };

  const handleSaveFileName = () => {
    if (tempFileName.trim()) {
      setFileName(tempFileName.trim());
      setIsEditingFileName(false);
    } else {
      Alert.alert("Error", "File name cannot be empty.");
    }
  };

  const handleCancelEdit = () => {
    setTempFileName(fileName);
    setIsEditingFileName(false);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: 'white',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTintColor: 'black',
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontWeight: '600',
        fontSize: 17,
      },
      headerTitle: () => (
        <TouchableOpacity onPress={handleEditFileName}>
          <Text style={styles.headerTitleText}>{fileName}</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={handleSave} style={styles.headerSaveButton}>
          <Text style={styles.headerSaveButtonText}>Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, fileName]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
      <Modal
        visible={isEditingFileName}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit File Name</Text>
            <TextInput
              style={styles.modalInput}
              value={tempFileName}
              onChangeText={setTempFileName}
              placeholder="Enter file name"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={handleCancelEdit}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSaveButton]}
                onPress={handleSaveFileName}
              >
                <Text style={styles.modalSaveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    paddingTop: 0,
  },
  headerTitleText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  headerSaveButton: {
    marginRight: 10,
  },
  headerSaveButtonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCancelButton: {
    backgroundColor: "#F0F0F0",
  },
  modalSaveButton: {
    backgroundColor: "#007AFF",
  },
  modalCancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
  modalSaveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default CMVRReportScreen;
