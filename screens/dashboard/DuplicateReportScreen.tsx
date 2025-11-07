import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Copy,
  Calendar,
  ChevronRight,
  UserCheck,
  ClipboardList,
  Search,
  CheckCircle,
} from "lucide-react-native";
import { CustomHeader } from "../../components/CustomHeader";
import { theme } from "../../theme/theme";
import { scale, verticalScale, normalizeFont, moderateScale } from "../../utils/responsive";
import { styles } from "./styles/DuplicateReportScreen.styles";

import {useEccStore} from "../../store/eccStore"
const { width } = Dimensions.get("window");
const isTablet = width >= 768;
import { useAuth } from "../../contexts/AuthContext";

// Mock data for attendance records


const mockECCReports = [
  {
    id: "3a42ec7b-01ef-4a11-ac95-c1a8ec07902f",
    title: "tester",
    date: "Oct 28, 2025",
    attendees: 24,
    type: "ecc",
  },
  {
    id: 8,
    title: "Site B - Night Shift",
    date: "Oct 25, 2025",
    attendees: 18,
    type: "ecc",
  },
  {
    id: 90,
    title: "Engineering Team - Weekly",
    date: "Oct 20, 2025",
    attendees: 12,
    type: "ecc",
  },
];

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

// Mock data for CMVR reports
const mockCMVRReports = [
  {
    id: 4,
    title: "Q3 Compliance Monitoring Report",
    date: "Oct 15, 2025",
    status: "Approved",
    type: "cmvr",
  },
  {
    id: 5,
    title: "Environmental Assessment - Site A",
    date: "Oct 10, 2025",
    status: "Under Review",
    type: "cmvr",
  },
  {
    id: 6,
    title: "Safety Inspection Report",
    date: "Oct 5, 2025",
    status: "Approved",
    type: "cmvr",
  },
];

type RecordType = "all" | "attendance" | "cmvr"|"ecc";

export default function DuplicateReportScreen({ navigation }: any) {
    const { user,session  } = useAuth();
    const token = session?.access_token;
  
  const {getReportById, selectedReport,reports} = useEccStore();
  const [selectedType, setSelectedType] = useState<RecordType>("all");
  const [selectedRecord, setSelectedRecord] = useState<number | null>(null);

  const allRecords = [...mockAttendanceRecords, ...mockCMVRReports,...reports].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
          onPress: async () =>  {
            setSelectedRecord(null);
            // Navigate directly to edit the duplicated record
            if (record.type === "attendance") {
              navigation.navigate("CreateAttendance", {
                duplicateFrom: record.id,
                templateTitle: record.title,
                templateDate: record.date,
                templateAttendees: record.attendees,
              });
            }
            else if (record.type === "ecc") {
               await getReportById(record.id,token);
                navigation.navigate("ECCMonitoring",selectedReport); // ECCMonitoring will read selectedReport from store
            }else {
                navigation.navigate("CMVRReport", {
                submissionId: null,
                projectId: null,
                projectName: `${record.title} (Copy)`,
                duplicateFrom: record.id,
                templateData: {
                  title: record.title,
                  date: record.date,
                  status: record.status,
                },
              });
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <CustomHeader showSave={false} />
      
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
              count={mockCMVRReports.length}
              isActive={selectedType === "cmvr"}
              onPress={() => setSelectedType("cmvr")}
              isTablet={isTablet}
            />
              <FilterTab
              label="ECC"
              count={mockECCReports.length}
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
                  <React.Fragment key={record.id}>
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
              <Text style={styles.recordMetaText}>{record.status}</Text>
            </>
          )}
        </View>
      </View>
      <Copy color={theme.colors.primaryDark} size={20} />
    </TouchableOpacity>
  );
}