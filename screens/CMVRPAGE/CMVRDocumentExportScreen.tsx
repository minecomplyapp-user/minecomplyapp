import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

type RootStackParamList = {
  CMVRDocumentExport: {
    generalInfo: {
      companyName: string;
      projectName: string;
      location: string;
      region: string;
      province: string;
      municipality: string;
    };
    eccInfo: {
      isNA: boolean;
      permitHolder: string;
      eccNumber: string;
      dateOfIssuance: string;
    };
    eccAdditionalForms?: Array<{
      permitHolder: string;
      eccNumber: string;
      dateOfIssuance: string;
    }>;
    isagInfo: {
      isNA: boolean;
      permitHolder: string;
      isagNumber: string;
      dateOfIssuance: string;
      currentName: string;
      nameInECC: string;
      projectStatus: string;
      gpsX: string;
      gpsY: string;
      proponentName: string;
      proponentContact: string;
      proponentAddress: string;
      proponentPhone: string;
      proponentEmail: string;
    };
    isagAdditionalForms?: Array<{
      permitHolder: string;
      isagNumber: string;
      dateOfIssuance: string;
    }>;
    epepInfo: {
      isNA: boolean;
      permitHolder: string;
      epepNumber: string;
      dateOfApproval: string;
    };
    epepAdditionalForms?: Array<{
      permitHolder: string;
      epepNumber: string;
      dateOfApproval: string;
    }>;
    rcfInfo: {
      isNA: boolean;
      permitHolder: string;
      savingsAccount: string;
      amountDeposited: string;
      dateUpdated: string;
    };
    rcfAdditionalForms?: Array<{
      permitHolder: string;
      savingsAccount: string;
      amountDeposited: string;
      dateUpdated: string;
    }>;
    mtfInfo: {
      isNA: boolean;
      permitHolder: string;
      savingsAccount: string;
      amountDeposited: string;
      dateUpdated: string;
    };
    mtfAdditionalForms?: Array<{
      permitHolder: string;
      savingsAccount: string;
      amountDeposited: string;
      dateUpdated: string;
    }>;
    fmrdfInfo: {
      isNA: boolean;
      permitHolder: string;
      savingsAccount: string;
      amountDeposited: string;
      dateUpdated: string;
    };
    fmrdfAdditionalForms?: Array<{
      permitHolder: string;
      savingsAccount: string;
      amountDeposited: string;
      dateUpdated: string;
    }>;
    mmtInfo?: {
      isNA: boolean;
      contactPerson: string;
      mailingAddress: string;
      phoneNumber: string;
      emailAddress: string;
    };
    fileName: string;
  };
};

type CMVRDocumentExportScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CMVRDocumentExport"
>;

type CMVRDocumentExportScreenRouteProp = RouteProp<
  RootStackParamList,
  "CMVRDocumentExport"
>;

const CMVRDocumentExportScreen = () => {
  const navigation = useNavigation<CMVRDocumentExportScreenNavigationProp>();
  const route = useRoute<CMVRDocumentExportScreenRouteProp>();

  const {
    generalInfo,
    eccInfo,
    eccAdditionalForms = [],
    isagInfo,
    isagAdditionalForms = [],
    epepInfo,
    epepAdditionalForms = [],
    rcfInfo,
    rcfAdditionalForms = [],
    mtfInfo,
    mtfAdditionalForms = [],
    fmrdfInfo,
    fmrdfAdditionalForms = [],
    mmtInfo = {
      isNA: false,
      contactPerson: "",
      mailingAddress: "",
      phoneNumber: "",
      emailAddress: "",
    },
    fileName,
  } = route.params;

  const [isGenerating, setIsGenerating] = useState(false);
  const [documentGenerated, setDocumentGenerated] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "docx">("pdf");

  const handleGenerateDocument = () => {
    setIsGenerating(true);
    const documentData = {
      generalInfo,
      ecc: {
        ...eccInfo,
        additionalForms: eccAdditionalForms,
      },
      isag: {
        ...isagInfo,
        additionalForms: isagAdditionalForms,
      },
      epep: {
        ...epepInfo,
        additionalForms: epepAdditionalForms,
      },
      rcf: {
        ...rcfInfo,
        additionalForms: rcfAdditionalForms,
      },
      mtf: {
        ...mtfInfo,
        additionalForms: mtfAdditionalForms,
      },
      fmrdf: {
        ...fmrdfInfo,
        additionalForms: fmrdfAdditionalForms,
      },
      mmt: mmtInfo,
    };
    console.log("Generating document with data:", JSON.stringify(documentData, null, 2));
    setTimeout(() => {
      setIsGenerating(false);
      setDocumentGenerated(true);
    }, 2000);
  };

  const handlePreview = () => {
    console.log(`Opening ${selectedFormat.toUpperCase()} preview...`);
  };

  const handleDownload = () => {
    console.log(`Downloading ${selectedFormat.toUpperCase()} file...`);
  };

  const getDisplayValue = (value: string | undefined | null, fallback = "Not provided") => {
    return value && value.trim() !== "" ? value : fallback;
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>CMVR Report Export</Text>
          <Text style={styles.headerSubtitle}>Generate and download your report</Text>
        </View>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.previewCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="document-text" size={32} color="white" />
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {fileName || "CMVR_Report"}.{selectedFormat}
              </Text>
              <Text style={styles.cardSubtitle} numberOfLines={1}>
                {getDisplayValue(generalInfo.projectName, "Project")} - Compliance Report
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.formatSection}>
          <Text style={styles.sectionLabel}>Select Document Format</Text>
          <View style={styles.formatButtons}>
            <TouchableOpacity
              style={[
                styles.formatButton,
                selectedFormat === "pdf" && styles.formatButtonActive,
              ]}
              onPress={() => setSelectedFormat("pdf")}
            >
              <View
                style={[
                  styles.formatIcon,
                  { backgroundColor: selectedFormat === "pdf" ? "#DC2626" : "#E2E8F0" },
                ]}
              >
                <Ionicons
                  name="document"
                  size={20}
                  color={selectedFormat === "pdf" ? "white" : "#64748B"}
                />
              </View>
              <View style={styles.formatTextContainer}>
                <Text style={styles.formatTitle}>PDF Document</Text>
                <Text style={styles.formatDescription}>Portable format</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.formatButton,
                selectedFormat === "docx" && styles.formatButtonActive,
              ]}
              onPress={() => setSelectedFormat("docx")}
            >
              <View
                style={[
                  styles.formatIcon,
                  { backgroundColor: selectedFormat === "docx" ? "#1E40AF" : "#E2E8F0" },
                ]}
              >
                <Ionicons
                  name="document-text"
                  size={20}
                  color={selectedFormat === "docx" ? "white" : "#64748B"}
                />
              </View>
              <View style={styles.formatTextContainer}>
                <Text style={styles.formatTitle}>DOCX Document</Text>
                <Text style={styles.formatDescription}>Editable format</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Document Contents Summary</Text>

          <SummaryItem
            icon="📋"
            title="General Information"
            value={`${getDisplayValue(generalInfo.companyName)} - ${getDisplayValue(generalInfo.projectName)}`}
          />

          <SummaryItem
            icon="🛡️"
            title="ECC Information"
            value={eccInfo.isNA ? "Not Applicable" : getDisplayValue(eccInfo.eccNumber)}
            additional={!eccInfo.isNA && eccAdditionalForms.length > 0 ? `+${eccAdditionalForms.length} additional` : undefined}
          />

          <SummaryItem
            icon="📄"
            title="ISAG/MPP Information"
            value={isagInfo.isNA ? "Not Applicable" : getDisplayValue(isagInfo.isagNumber)}
            additional={!isagInfo.isNA && isagAdditionalForms.length > 0 ? `+${isagAdditionalForms.length} additional` : undefined}
          />

          <SummaryItem
            icon="🌿"
            title="EPEP Information"
            value={epepInfo.isNA ? "Not Applicable" : getDisplayValue(epepInfo.epepNumber)}
            additional={!epepInfo.isNA && epepAdditionalForms.length > 0 ? `+${epepAdditionalForms.length} additional` : undefined}
          />

          <SummaryItem
            icon="💰"
            title="RCF Status"
            value={rcfInfo.isNA ? "Not Applicable" : `₱${getDisplayValue(rcfInfo.amountDeposited, "0.00")}`}
            additional={!rcfInfo.isNA && rcfAdditionalForms.length > 0 ? `+${rcfAdditionalForms.length} additional` : undefined}
          />

          <SummaryItem
            icon="🛡️"
            title="MTF Status"
            value={mtfInfo.isNA ? "Not Applicable" : `₱${getDisplayValue(mtfInfo.amountDeposited, "0.00")}`}
            additional={!mtfInfo.isNA && mtfAdditionalForms.length > 0 ? `+${mtfAdditionalForms.length} additional` : undefined}
          />

          <SummaryItem
            icon="🌱"
            title="FMRDF Status"
            value={fmrdfInfo.isNA ? "Not Applicable" : `₱${getDisplayValue(fmrdfInfo.amountDeposited, "0.00")}`}
            additional={!fmrdfInfo.isNA && fmrdfAdditionalForms.length > 0 ? `+${fmrdfAdditionalForms.length} additional` : undefined}
          />

          <SummaryItem
            icon="👥"
            title="Monitoring Team"
            value={mmtInfo.contactPerson ? getDisplayValue(mmtInfo.contactPerson) : "Not provided"}
          />
        </View>

        {documentGenerated && (
          <View style={styles.generatedSection}>
            <View style={styles.generatedCard}>
              <View style={styles.generatedIconContainer}>
                <Ionicons name="checkmark-circle" size={48} color="#10B981" />
              </View>
              <Text style={styles.generatedTitle} numberOfLines={1}>
                {fileName || "CMVR_Report"}.{selectedFormat}
              </Text>
              <Text style={styles.generatedSubtitle}>Document ready for download</Text>
              <Text style={styles.generatedDate}>
                Generated on {new Date().toLocaleDateString()}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.actionSection}>
          {!documentGenerated ? (
            <TouchableOpacity
              style={[styles.generateButton, isGenerating && styles.buttonDisabled]}
              onPress={handleGenerateDocument}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <ActivityIndicator size="small" color="white" />
                  <Text style={styles.generateButtonText}>Generating Document...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="document-text" size={20} color="white" />
                  <Text style={styles.generateButtonText}>
                    Generate {selectedFormat.toUpperCase()} Document
                  </Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.previewButton} onPress={handlePreview}>
                <Ionicons name="eye" size={20} color="white" />
                <Text style={styles.previewButtonText}>Preview</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
                <Ionicons name="download" size={20} color="white" />
                <Text style={styles.downloadButtonText}>Download</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.infoNote}>
          <Ionicons name="information-circle" size={20} color="#2563EB" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Document Information</Text>
            <Text style={styles.infoDescription}>
              Your CMVR report will include all sections with the information you've provided.{" "}
              {selectedFormat === "pdf"
                ? "PDF format is ideal for sharing and archiving."
                : "DOCX format allows you to make further edits if needed."}
            </Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

const SummaryItem = ({
  icon,
  title,
  value,
  additional,
}: {
  icon: string;
  title: string;
  value: string;
  additional?: string;
}) => (
  <View style={styles.summaryItem}>
    <Text style={styles.summaryIcon}>{icon}</Text>
    <View style={styles.summaryTextContainer}>
      <Text style={styles.summaryItemTitle}>{title}</Text>
      <Text style={styles.summaryItemValue} numberOfLines={1}>
        {value}
      </Text>
      {additional && <Text style={styles.summaryAdditional}>{additional}</Text>}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  previewCard: {
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
    overflow: "hidden",
  },
  cardHeader: {
    backgroundColor: '#02217C',
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
  },
  formatSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 12,
  },
  formatButtons: {
    gap: 12,
  },
  formatButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    backgroundColor: "white",
  },
  formatButtonActive: {
    borderColor: '#02217C',
    backgroundColor: "#EFF6FF",
  },
  formatIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  formatTextContainer: {
    flex: 1,
  },
  formatTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 2,
  },
  formatDescription: {
    fontSize: 13,
    color: "#64748B",
  },
  summarySection: {
    padding: 20,
    backgroundColor: "#F8FAFC",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  summaryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryItemTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 2,
  },
  summaryItemValue: {
    fontSize: 14,
    color: "#1E293B",
  },
  summaryAdditional: {
    fontSize: 11,
    color: '#02217C',
    marginTop: 4,
  },
  generatedSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  generatedCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
  },
  generatedIconContainer: {
    marginBottom: 12,
  },
  generatedTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  generatedSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 2,
  },
  generatedDate: {
    fontSize: 12,
    color: "#94A3B8",
  },
  actionSection: {
    marginBottom: 16,
  },
  generateButton: {
    backgroundColor: "#1E40AF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    shadowColor: "#1E40AF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  previewButton: {
    flex: 1,
    backgroundColor: "#475569",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  previewButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  downloadButton: {
    flex: 1,
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  downloadButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  infoNote: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E40AF",
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 13,
    color: "#1E40AF",
    lineHeight: 18,
  },
});

export default CMVRDocumentExportScreen;
