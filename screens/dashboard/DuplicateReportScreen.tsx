import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Copy,
  Calendar,
  UserCheck,
  ClipboardList,
  Search,
} from "lucide-react-native";
import { CustomHeader } from "../../components/CustomHeader";
import { theme } from "../../theme/theme";
import { scale, verticalScale, normalizeFont, moderateScale } from "../../utils/responsive";
import { styles } from "./styles/DuplicateReportScreen.styles";

import { useEccStore } from "../../store/eccStore";
import { useCmvrStore } from "../../store/cmvrStore";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;

// Mock data for attendance records
const mockAttendanceRecords = [
  {
    id: 1,
    title: "Site A - Morning Shift",
    date: "Oct 28, 2025",
    attendees: 24,
    type: "attendance",
  },
  {
    id: 2,
    title: "Site B - Night Shift",
    date: "Oct 25, 2025",
    attendees: 18,
    type: "attendance",
  },
  {
    id: 3,
    title: "Engineering Team - Weekly",
    date: "Oct 20, 2025",
    attendees: 12,
    type: "attendance",
  },
];

type RecordType = "all" | "attendance" | "cmvr" | "ecc";

export default function DuplicateReportScreen({ navigation }: any) {
  const { getReportById: getEccReport, selectedReport: selectedEccReport, reports: eccReports } = useEccStore();
  const { 
    fetchReports: fetchCmvrReports, 
    getReportById: getCmvrReport, 
    selectedReport: selectedCmvrReport, 
    reports: cmvrReports,
    isLoading: cmvrLoading 
  } = useCmvrStore();
  
  const [selectedType, setSelectedType] = useState<RecordType>("all");
  const [selectedRecord, setSelectedRecord] = useState<string | number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch CMVR reports on component mount
  useEffect(() => {
    const loadReports = async () => {
      await fetchCmvrReports();
    };
    loadReports();
  }, []);

  const allRecords = [
    ...mockAttendanceRecords, 
    ...cmvrReports, 
    ...eccReports
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredRecords =
    selectedType === "all"
      ? allRecords
      : allRecords.filter((record) => record.type === selectedType);

  const handleDuplicate = (record: any) => {
    setSelectedRecord(record.id);
    
    Alert.alert(
      "Duplicate Record",
      `Create a new editable copy of "${record.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setSelectedRecord(null),
        },
        {
          text: "Create Copy",
          onPress: async () => {
            setIsLoading(true);
            
            try {
              if (record.type === "attendance") {
                setIsLoading(false);
                setSelectedRecord(null);
                navigation.navigate("CreateAttendance", {
                  duplicateFrom: record.id,
                  templateTitle: record.title,
                  templateDate: record.date,
                  templateAttendees: record.attendees,
                });
              }
              else if (record.type === "ecc") {
                await getEccReport(record.id);
                setIsLoading(false);
                setSelectedRecord(null);
                navigation.navigate("ECCMonitoring", selectedEccReport);
              }
              else if (record.type === "cmvr") {
                // Fetch the original report data
                const result = await getCmvrReport(record.id);
                
                if (result.success && result.report) {
                  // Create a duplicate with modified data
                  const duplicateData = {
                    ...result.report,
                    id: undefined, // Remove ID so a new one is created
                    projectName: `${result.report.projectName || result.report.title} (Copy)`,
                    title: `${result.report.title || result.report.projectName} (Copy)`,
                    status: 'Draft',
                    createdAt: new Date().toISOString(),
                  };
                  
                  setIsLoading(false);
                  setSelectedRecord(null);
                  navigation.navigate("CMVRReport", {
                    submissionId: null,
                    projectId: null,
                    projectName: duplicateData.projectName,
                    duplicateFrom: record.id,
                    reportData: duplicateData,
                    isDuplicate: true,
                  });
                } else {
                  throw new Error('Failed to fetch report data');
                }
              }
            } catch (error) {
              setIsLoading(false);
              setSelectedRecord(null);
              Alert.alert("Error", "Failed to duplicate report. Please try again.");
              console.error("Duplication error:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <CustomHeader showSave={false} />
      
      {(isLoading || cmvrLoading) && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <ActivityIndicator size="large" color={theme.colors.primaryDark} />
          <Text style={{
            marginTop: verticalScale(12),
            fontSize: normalizeFont(14),
            color: '#fff',
            fontWeight: '500',
          }}>Loading report...</Text>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          isTablet && styles.scrollContentTablet,
        ]}
      >
        <View style={[styles.contentWrapper, isTablet && styles.contentWrapperTablet]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Duplicate Report</Text>
              <Text style={styles.subtitle}>
                Select a record to create a copy
              </Text>
            </View>
          </View>

          {/* Filter Tabs */}
          <View style={[styles.filterContainer, isTablet && styles.filterContainerTablet]}>
            <FilterTab
              label="All"
              count={allRecords.length}
              isActive={selectedType === "all"}
              onPress={() => setSelectedType("all")}
              isTablet={isTablet}
            />
            <FilterTab
              label="Attendance"
              count={mockAttendanceRecords.length}
              isActive={selectedType === "attendance"}
              onPress={() => setSelectedType("attendance")}
              isTablet={isTablet}
            />
            <FilterTab
              label="CMVR"
              count={cmvrReports.length}
              isActive={selectedType === "cmvr"}
              onPress={() => setSelectedType("cmvr")}
              isTablet={isTablet}
            />
            <FilterTab
              label="ECC"
              count={eccReports.length}
              isActive={selectedType === "ecc"}
              onPress={() => setSelectedType("ecc")}
              isTablet={isTablet}
            />
          </View>

          {/* Records List */}
          <View style={styles.section}>
            {filteredRecords.length > 0 ? (
              <View style={[styles.recordsContainer, isTablet && styles.recordsContainerTablet]}>
                {filteredRecords.map((record, index) => (
                  <React.Fragment key={`${record.type}-${record.id}`}>
                    <RecordCard
                      record={record}
                      onPress={() => handleDuplicate(record)}
                      isSelected={selectedRecord === record.id}
                      isTablet={isTablet}
                    />
                    {index < filteredRecords.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </React.Fragment>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Search
                  color={theme.colors.textLight}
                  size={48}
                  strokeWidth={1.5}
                />
                <Text style={styles.emptyStateTitle}>No records found</Text>
                <Text style={styles.emptyStateText}>
                  No {selectedType === "all" ? "" : selectedType} records available
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FilterTab({ label, count, isActive, onPress, isTablet }: any) {
  return (
    <TouchableOpacity
      style={[styles.filterTab, isActive && styles.filterTabActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
        {label}
      </Text>
      <View style={[styles.filterBadge, isActive && styles.filterBadgeActive]}>
        <Text style={[styles.filterBadgeText, isActive && styles.filterBadgeTextActive]}>
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function RecordCard({ record, onPress, isSelected, isTablet }: any) {
  const isAttendance = record.type === "attendance";
  const isCmvr = record.type === "cmvr";
  const Icon = isAttendance ? UserCheck : ClipboardList;

  return (
    <TouchableOpacity
      style={[
        styles.recordCard,
        isSelected && styles.recordCardSelected,
        isTablet && styles.recordCardTablet,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.recordIconCircle}>
        <Icon color={theme.colors.primaryDark} size={20} />
      </View>
      <View style={styles.recordContent}>
        <Text style={styles.recordTitle} numberOfLines={1}>
          {record.title}
        </Text>
        <View style={styles.recordMeta}>
          <Calendar color={theme.colors.textLight} size={12} />
          <Text style={styles.recordMetaText}>{record.date}</Text>
          {isAttendance ? (
            <>
              <View style={styles.metaDot} />
              <Text style={styles.recordMetaText}>{record.attendees} attendees</Text>
            </>
          ) : (
            <>
              <View style={styles.metaDot} />
              <Text style={styles.recordMetaText}>{record.status || 'Draft'}</Text>
            </>
          )}
        </View>
      </View>
      <Copy color={theme.colors.primaryDark} size={20} />
    </TouchableOpacity>
  );
}