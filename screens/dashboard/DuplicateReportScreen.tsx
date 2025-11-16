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
  ChevronRight,
  UserCheck,
  ClipboardList,
  Search,
  CheckCircle,
} from "lucide-react-native";
import { CustomHeader } from "../../components/CustomHeader";
import { theme } from "../../theme/theme";
import {
  scale,
  verticalScale,
  normalizeFont,
  moderateScale,
} from "../../utils/responsive";
import { styles } from "./styles/DuplicateReportScreen.styles";
import { apiGet, apiPost } from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";
import { useEccStore } from "../../store/eccStore";
import { useCmvrStore } from "../../store/cmvrStore";
const { width } = Dimensions.get("window");
const isTablet = width >= 768;

type RecordType = "all" | "attendance" | "cmvr" | "ecc";

interface Record {
  id: string;
  title: string;
  date: string;
  attendees?: number;
  status?: string;
  type: "attendance" | "cmvr" | "ecc";
}

export default function DuplicateReportScreen({ navigation }: any) {
  const { user } = useAuth();
  const { reports: eccReports, getAllReports: fetchEccReports } = useEccStore();
  const { submittedReports: cmvrReports, fetchUserReports } = useCmvrStore();
  const [selectedType, setSelectedType] = useState<RecordType>("all");
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDuplicating, setIsDuplicating] = useState(false);

  // Fetch all records on mount
  useEffect(() => {
    fetchAllRecords();
  }, [user?.id]);

  const fetchAllRecords = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      
      // Fetch attendance records (will be filtered by createdById)
      const attendanceData = await apiGet<any[]>(`/attendance`);
      setAttendanceRecords(attendanceData || []);

      // Fetch ECC reports for the current user
      await fetchEccReports(user.id, "");

      // Fetch CMVR reports for the current user
      await fetchUserReports(user.id, "");
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Transform records to consistent format - Filter by createdById
  const transformedAttendance: Record[] = attendanceRecords
    .filter((record) => record.createdById === user?.id)
    .map((record) => ({
      id: record.id,
      title: record.title || record.fileName || "Untitled",
      date: record.meetingDate
        ? new Date(record.meetingDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "No date",
      attendees: Array.isArray(record.attendees) ? record.attendees.length : 0,
      type: "attendance" as const,
    }));

  const transformedCMVR: Record[] = (cmvrReports || [])
    .filter((report: any) => report.createdById === user?.id)
    .map((report: any) => ({
      id: report.id,
      title: report.fileName || "Untitled",
      date: new Date(report.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: "Submitted",
      type: "cmvr" as const,
    }));

  const transformedECC: Record[] = (eccReports || [])
    .filter((report: any) => {
      // ECC reports might have createdById in the report object
      return report.createdById === user?.id;
    })
    .map((report: any) => ({
      id: report.id,
      title: report.title || "Untitled",
      date: report.date || "No date",
      status: "Submitted",
      type: "ecc" as const,
    }));

  const allRecords = [
    ...transformedAttendance,
    ...transformedCMVR,
    ...transformedECC,
  ].sort((a, b) => {
    try {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    } catch {
      return 0;
    }
  });

  const filteredRecords =
    selectedType === "all"
      ? allRecords
      : allRecords.filter((record) => record.type === selectedType);

  const handleDuplicate = async (record: Record) => {
    setSelectedRecord(record.id);

    Alert.alert("Duplicate Record", `Create a copy of "${record.title}"?`, [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => setSelectedRecord(null),
      },
      {
        text: "Create Copy",
        onPress: async () => {
          try {
            setIsDuplicating(true);

            if (record.type === "attendance") {
              await apiPost(`/attendance/${record.id}/duplicate`, {});
              Alert.alert("Success", "Attendance record duplicated");
              await fetchAllRecords();
            } else if (record.type === "ecc") {
              await apiPost(`/ecc/${record.id}/duplicate`, {});
              Alert.alert("Success", "ECC report duplicated");
              await fetchAllRecords();
            } else if (record.type === "cmvr") {
              await apiPost(`/cmvr/${record.id}/duplicate`, {});
              Alert.alert("Success", "CMVR report duplicated");
              await fetchAllRecords();
            }
          } catch (error: any) {
            console.error("Error duplicating:", error);
            Alert.alert("Error", error.message || "Failed to duplicate");
          } finally {
            setIsDuplicating(false);
            setSelectedRecord(null);
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeContainer} edges={["top"]}>
        <CustomHeader showSave={false} />
        <View
          style={[
            styles.contentWrapper,
            { justifyContent: "center", alignItems: "center", flex: 1 },
          ]}
        >
          <ActivityIndicator size="large" color={theme.colors.primaryDark} />
          <Text style={[styles.subtitle, { marginTop: 16 }]}>
            Loading records...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer} edges={["top"]}>
      <CustomHeader showSave={false} />

      {isDuplicating && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <ActivityIndicator size="large" color={theme.colors.primaryDark} />
          <Text style={{ color: "white", marginTop: 16, fontSize: 16 }}>
            Duplicating...
          </Text>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          isTablet && styles.scrollContentTablet,
        ]}
      >
        <View
          style={[
            styles.contentWrapper,
            isTablet && styles.contentWrapperTablet,
          ]}
        >
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
          <View
            style={[
              styles.filterContainer,
              isTablet && styles.filterContainerTablet,
            ]}
          >
            <FilterTab
              label="All"
              count={allRecords.length}
              isActive={selectedType === "all"}
              onPress={() => setSelectedType("all")}
              isTablet={isTablet}
            />
            <FilterTab
              label="Attendance"
              count={transformedAttendance.length}
              isActive={selectedType === "attendance"}
              onPress={() => setSelectedType("attendance")}
              isTablet={isTablet}
            />
            <FilterTab
              label="CMVR"
              count={transformedCMVR.length}
              isActive={selectedType === "cmvr"}
              onPress={() => setSelectedType("cmvr")}
              isTablet={isTablet}
            />
            <FilterTab
              label="ECC"
              count={transformedECC.length}
              isActive={selectedType === "ecc"}
              onPress={() => setSelectedType("ecc")}
              isTablet={isTablet}
            />
          </View>

          {/* Records List */}
          <View style={styles.section}>
            {filteredRecords.length > 0 ? (
              <View
                style={[
                  styles.recordsContainer,
                  isTablet && styles.recordsContainerTablet,
                ]}
              >
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
                  No {selectedType === "all" ? "" : selectedType} records
                  available
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
      <Text
        style={[styles.filterTabText, isActive && styles.filterTabTextActive]}
      >
        {label}
      </Text>
      <View style={[styles.filterBadge, isActive && styles.filterBadgeActive]}>
        <Text
          style={[
            styles.filterBadgeText,
            isActive && styles.filterBadgeTextActive,
          ]}
        >
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
              <Text style={styles.recordMetaText}>
                {record.attendees} attendees
              </Text>
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
