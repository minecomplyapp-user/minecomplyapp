import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FileText,
  Copy,
  UserCheck,
  Plus,
  Calendar,
  ChevronRight,
  ShieldCheck,
  ClipboardList,
  AlertTriangle,
  X,
  Edit3,
  CheckCircle2,
  Users,
} from "lucide-react-native";
import { theme } from "../../theme/theme";
import { styles } from "./styles/dashboardScreen";
import { useAuth } from "../../contexts/AuthContext";
import { useFileName } from "../../contexts/FileNameContext";
import { getAllDraftMetadata, getDraft } from "../../lib/drafts";
import { apiGet } from "../../lib/api";
import { Ionicons } from "@expo/vector-icons";
import { CustomHeader } from "../../components/CustomHeader";
import {useEccStore} from "../../store/eccStore"
import {useEccDraftStore} from "../../store/eccDraftStore"
interface Report {
  id: string;
  title: string;
  projectName?: string;
  type: string;
  status: "draft" | "submitted";
  date: string;
  updatedAt: string;
  isLocalDraft?: boolean;
}

interface AttendanceRecord {
  id: string;
  fileName: string;
  date: string;
  presentCount: number;
  totalCount: number;
}

export default function DashboardScreen({ navigation }: any) {
    const { user,session  } = useAuth();
    const token = session?.access_token;
    const {getAllReports} = useEccStore();
    const {getDraftList, loadDraftById} =useEccDraftStore()

  const [reports, setReports] = useState<Report[]>([]);
  const [drafts, setDrafts] = useState<Report[]>([]);


  const [eccdrafts, setEccDrafts] = useState<Report[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }

      // Fetch local drafts first
    
     // Fetch local drafts first
      try {
        const draftMetadata = await getAllDraftMetadata();
        console.log("Found drafts:", draftMetadata.length);
        const localDrafts = draftMetadata.slice(0, 3).map((draft) => ({
          id: draft.key,
          title: draft.projectName || draft.fileName,
          projectName: draft.projectName || draft.fileName,
          type: "CMVR",
          status: "draft" as const,
          date: new Date(draft.lastSaved).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          updatedAt: draft.lastSaved,
          isLocalDraft: true,
        }));
        console.log("Loaded local drafts:", localDrafts);
        setDrafts(localDrafts);
      } catch (err) {
        console.log("Error loading local drafts:", err);
        setDrafts([]);
      }

      // Fetch CMVR reports for current user
      try {
        if (!user?.id) {
          console.log("No user ID available");
          // Don't clear drafts here - they're already loaded above
          setReports([]);
        } else {
          const submissionsData = await apiGet<any>(`/cmvr/user/${user.id}`);
          const allReports = (submissionsData || []).map((sub: any) => {
            // Use only fileName, with "Untitled" as fallback
            const projectName = sub.fileName || "Untitled";

            return {
              id: sub.id,
              title: projectName,
              projectName: projectName,
              type: "CMVR",
              status: "submitted",
              date: new Date(sub.updatedAt || sub.createdAt).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }
              ),
              updatedAt: sub.updatedAt,
            };
          });

          // For now, treat all as submitted (you can add draft logic later)
          setReports(allReports.slice(0, 3));
        }
      } catch (err) {
        console.log("No CMVR reports found:", err);
        setReports([]);
      }



      // ECC LOCAL
      try {
        const draftMetadata = await getDraftList();
        console.log("Found drafts:", draftMetadata.length);
        const localDrafts = draftMetadata.slice(0, 3).map((draft) => ({
          id: draft.id,
          title: draft.fileName,
          projectName: "",
          type: "ECC",
          status: "draft" as const,
          date: new Date(draft.saveAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          updatedAt: draft.saveAt,
          isLocalDraft: true,
        }));
        console.log("Loaded local ECC drafts:", localDrafts);
        setEccDrafts(localDrafts);
      } catch (err) {
        console.log("Error loading local drafts:", err);
        setEccDrafts([]);
      }











      // Fetch attendance records
      try {
        const attendanceData = await apiGet<any>("/attendance");
        const recentAttendance = (attendanceData || [])
          .slice(0, 3)
          .map((record: any) => {
            // Parse attendees JSON to get counts
            let presentCount = 0;
            let totalCount = 0;

            try {
              const attendees = Array.isArray(record.attendees)
                ? record.attendees
                : JSON.parse(record.attendees || "[]");

              totalCount = attendees.length;
              presentCount = attendees.filter((a: any) => a.present).length;
            } catch (err) {
              console.log("Error parsing attendees:", err);
            }

            return {
              id: record.id,
              fileName: record.fileName || record.title || "Untitled",
              date: new Date(
                record.meetingDate || record.createdAt
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              presentCount,
              totalCount,
            };
          });
        setAttendanceRecords(recentAttendance);
      } catch (err) {
        console.log("No attendance records found:", err);
        setAttendanceRecords([]);
      }


    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      if (!isRefreshing) {
        setLoading(false);
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData(true);
    setRefreshing(false);
  };

  const hasReports = reports.length > 0;
  const hasDrafts = drafts.length > 0;
  const haseccDrafts = eccdrafts.length > 0;
  const hasAttendance = attendanceRecords.length > 0;

  console.log("Dashboard state:", {
    loading,
    hasDrafts,
    draftsCount: drafts.length,
    hasReports,
    reportsCount: reports.length,
  });

  const userName =
    (user as any)?.user_metadata?.full_name ||
    (user as any)?.user_metadata?.name ||
    (user as any)?.email?.split("@")[0] ||
    "User";

 
  return (
    <SafeAreaView style={styles.safeContainer}>
      <CustomHeader goBackTo="RoleSelection" showSave={false} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primaryDark]}
            tintColor={theme.colors.primaryDark}
          />
        }
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.subGreeting}>Welcome back,</Text>
            <Text style={styles.greeting}>{userName}</Text>
          </View>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.avatarText}>
              {userName
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <ActionButton
              icon={UserCheck}
              title="Record Attendance"
              subtitle="Mark your team's presence"
              onPress={() => navigation.navigate("AttendanceRecords")}
            />
            <ActionButton
              icon={Plus}
              title="Create Report"
              subtitle="Start a new compliance report"
              onPress={() => setIsModalVisible(true)}
            />
            <ActionButton
              icon={Copy}
              title="Duplicate Report"
              subtitle="Use a previous template"
             onPress={async () => { // <--- Make the callback function ASYNC
                  // 1. Await the report fetch to ensure the store is updated
                  await getAllReports(token); // <--- Use AWAIT
                  
                  // 2. Navigate after data is guaranteed to be in the store
                  navigation.navigate("DuplicateReport");
              }}
            />

            
          </View>
        </View>

        {/* DRAFTS - Show drafts section right after Quick Actions */}
        {!loading && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Edit3 size={18} color={theme.colors.warning} />
                <Text style={styles.sectionTitle}>CMVR Draft Reports</Text>
              </View>
              {hasDrafts && (
                <TouchableOpacity 
                  onPress={() => navigation.navigate("CMVRDrafts")}
                  style={styles.viewAllButton}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.summaryContainer}>
              {hasDrafts ? (
                <View style={styles.reportsContainer}>
                  {drafts.map((draft, index) => (
                    <React.Fragment key={draft.id}>
                      <DraftCard draft={draft} navigation={navigation} />
                      {index < drafts.length - 1 && (
                        <View style={styles.divider} />
                      )}
                    </React.Fragment>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Edit3
                    color={theme.colors.textLight}
                    size={48}
                    strokeWidth={1.5}
                  />
                  <Text style={styles.emptyStateTitle}>No drafts saved</Text>
                  <Text style={styles.emptyStateText}>
                    Start a CMVR report and save as draft to continue later
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}



            {!loading && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Edit3 size={18} color={theme.colors.warning} />
                <Text style={styles.sectionTitle}>ECC Draft Reports</Text>
              </View>
              {haseccDrafts && (
                <TouchableOpacity
                  onPress={() => navigation.navigate("ECCDraftScreen")}
                  style={styles.viewAllButton}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.summaryContainer}>
              {haseccDrafts ? (
                <View style={styles.reportsContainer}>


                   {eccdrafts.map((draft, index) => (
                  <React.Fragment key={draft.id}>
                      <EccDraftCard draft={draft} navigation={navigation} />
                    {index < eccdrafts.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </React.Fragment>
                ))}
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Edit3
                    color={theme.colors.textLight}
                    size={48}
                    strokeWidth={1.5}
                  />
                  <Text style={styles.emptyStateTitle}>No drafts saved</Text>
                  <Text style={styles.emptyStateText}>
                    Start a ECC report and save as draft to continue later
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* LOADING STATE */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primaryDark} />
            <Text style={styles.loadingText}>Loading your dashboard...</Text>
          </View>
        ) : (
          <>
            {/* SUBMITTED REPORTS - Separate section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <CheckCircle2 size={18} color={theme.colors.success} />
                  <Text style={styles.sectionTitle}>Recent Submissions</Text>
                </View>
                {hasReports && (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Reports")}
                    style={styles.viewAllButton}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Text style={styles.viewAllText}>View All</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.summaryContainer}>
                {hasReports ? (
                  <View style={styles.reportsContainer}>
                    {reports.map((report, index) => (
                      <React.Fragment key={report.id}>
                        <ReportCard report={report} navigation={navigation} />
                        {index < reports.length - 1 && (
                          <View style={styles.divider} />
                        )}
                      </React.Fragment>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyState}>
                    <FileText
                      color={theme.colors.textLight}
                      size={48}
                      strokeWidth={1.5}
                    />
                    <Text style={styles.emptyStateTitle}>
                      No submissions yet
                    </Text>
                    <Text style={styles.emptyStateText}>
                      Submit your first compliance report
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* RECENT ATTENDANCE */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Users size={18} color={theme.colors.primaryDark} />
                  <Text style={styles.sectionTitle}>Recent Attendance</Text>
                </View>
                {hasAttendance && (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("AttendanceRecords")}
                    style={styles.viewAllButton}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Text style={styles.viewAllText}>View All</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.summaryContainer}>
                {hasAttendance ? (
                  <View style={styles.reportsContainer}>
                    {attendanceRecords.map((record, index) => (
                      <React.Fragment key={record.id}>
                        <AttendanceCard
                          record={record}
                          navigation={navigation}
                        />
                        {index < attendanceRecords.length - 1 && (
                          <View style={styles.divider} />
                        )}
                      </React.Fragment>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyState}>
                    <UserCheck
                      color={theme.colors.textLight}
                      size={48}
                      strokeWidth={1.5}
                    />
                    <Text style={styles.emptyStateTitle}>
                      No attendance records
                    </Text>
                    <Text style={styles.emptyStateText}>
                      Start recording attendance for your team
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Modal Component */}
      <CreateReportModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        navigation={navigation}
      />
    </SafeAreaView>
  );
}

function CreateReportModal({ visible, onClose, navigation }: any) {
    const { selectedReport, isLoading, clearSelectedReport } = useEccStore(state => state);

  const [scaleAnim] = useState(new Animated.Value(0.95));
  const { setFileName } = useFileName();

  const generateDefaultFileName = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `CMVR ${year}-${month}-${day} ${hours}${minutes}`;
  };

  const handleCreateCMVR = async () => {
    try {
      const defaultFileName = generateDefaultFileName();
      await setFileName(defaultFileName);
      onClose();
      setTimeout(() => {
        navigation.navigate("CMVRReport", {
          submissionId: null,
          projectId: null,
          projectName: "",
          fileName: defaultFileName,
        });
      }, 120);
    } catch (error) {
      console.error("Error starting CMVR report:", error);
      onClose();
    }
  };

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackdrop}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View
              style={[
                styles.modalContent,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create New Report</Text>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.modalCloseButton}
                >
                  <X size={24} color={theme.colors.textLight} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalOptionsContainer}>
                <ModalButton
                  icon={ShieldCheck}
                  title="ECC Monitoring"
                  onPress={() => {
                    onClose();
                    setTimeout(() => {
                      clearSelectedReport();
                      navigation.navigate("ECCMonitoring",{id:''});
                    }, 120);
                  }}
                />
                <ModalButton
                  icon={ClipboardList}
                  title="CMVR"
                  onPress={handleCreateCMVR}
                />
                <ModalButton
                  icon={AlertTriangle}
                  title="EPEP"
                  onPress={() => {
                    onClose();
                    setTimeout(() => {
                      navigation.navigate("EPEP");
                    }, 120);
                  }}
                />
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

function ModalButton({ icon: Icon, title, onPress }: any) {
  return (
    <TouchableOpacity style={styles.modalButton} onPress={onPress}>
      <View style={styles.modalButtonIcon}>
        <Icon color={theme.colors.primaryDark} size={22} />
      </View>
      <Text style={styles.modalButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}

function ActionButton({ icon: Icon, title, subtitle, onPress }: any) {
  return (
    <TouchableOpacity
      style={styles.actionCard}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.actionIconCircle}>
        <Icon color={theme.colors.primaryDark} size={20} />
      </View>
      <View style={styles.actionTextContainer}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>
      <ChevronRight color={theme.colors.textLight} size={18} />
    </TouchableOpacity>
  );
}

function ReportCard({ report, navigation }: any) {
  return (
    <TouchableOpacity
      style={styles.reportCard}
      activeOpacity={0.8}
      onPress={() => {
        // Open CMVR export/edit screen for this report
        navigation.navigate("CMVRDocumentExport", {
          cmvrReportId: report.id,
          fileName: report.title,
        });
      }}
    >
      <View style={styles.reportContent}>
        <View style={styles.reportHeader}>
          <Text style={styles.reportTitle} numberOfLines={1}>
            {report.title}
          </Text>
          <View style={styles.reportTypeBadge}>
            <Text style={styles.reportTypeText}>{report.type}</Text>
          </View>
        </View>
        <View style={styles.reportMeta}>
          <Calendar color={theme.colors.textLight} size={12} />
          <Text style={styles.reportMetaText}>{report.date}</Text>
        </View>
      </View>
      <ChevronRight color={theme.colors.textLight} size={18} />
    </TouchableOpacity>
  );
}

function DraftCard({ draft, navigation}: any) {
  const { setFileName } = useFileName();

  const handleOpenDraft = async () => {
    if (draft.isLocalDraft) {
      // Load draft data from AsyncStorage
      try {
        const draftData = await getDraft(draft.id);
        if (draftData) {
          const resolvedFileName =
            draftData.fileName ||
            draftData.generalInfo?.projectName ||
            draftData.generalInfo?.projectNameCurrent ||
            draft.projectName ||
            draft.title;
          await setFileName(resolvedFileName);
          // Navigate directly to the last page (Export screen) with draft data
          navigation.navigate("CMVRDocumentExport", {
            submissionId: null,
            projectId: null,
            projectName:
              draftData.generalInfo?.projectName ||
              draftData.generalInfo?.projectNameCurrent ||
              draft.projectName ||
              "",
            fileName: resolvedFileName,
            // Spread all draft data as route params so the export screen can hydrate
            ...draftData,
          });
        }
      } catch (error) {
        console.error("Error loading draft:", error);
        alert("Failed to load draft. Please try again.");
      }
    } else {
      // Navigate to server-side draft
      await setFileName(draft.title);
      navigation.navigate("CMVRReport", {
        submissionId: draft.id,
        projectId: null,
        projectName: draft.title,
        fileName: draft.title,
      });
    }
  };

  return (
    <TouchableOpacity
      style={[styles.reportCard, styles.draftCard]}
      activeOpacity={0.8}
      onPress={handleOpenDraft}
    >
      <View style={styles.reportContent}>
        <View style={styles.reportHeader}>
          <Text style={styles.reportTitle} numberOfLines={1}>
            {draft.title}
          </Text>
          <View style={[styles.reportTypeBadge, styles.draftBadge]}>
            <Edit3 size={10} color={theme.colors.warning} />
            <Text style={[styles.reportTypeText, styles.draftBadgeText]}>
              Draft
            </Text>
          </View>
        </View>
        <View style={styles.reportMeta}>
          <Calendar color={theme.colors.textLight} size={12} />
          <Text style={styles.reportMetaText}>Last edited: {draft.date}</Text>
        </View>
      </View>
      <ChevronRight color={theme.colors.textLight} size={18} />
    </TouchableOpacity>
  );
}


function EccDraftCard({ draft, navigation}: any) {

    const {loadDraftById} = useEccDraftStore();
    const {setSelectedReport} = useEccStore();

  const handleOpenDraft = async () => {
  const data = await loadDraftById(draft.id);
  setSelectedReport(data);
  navigation.navigate("ECCMonitoring",{id:draft.id});
};
  return (
    <TouchableOpacity
      style={[styles.reportCard, styles.draftCard]}
      activeOpacity={0.8}
      onPress={handleOpenDraft}
    >
      <View style={styles.reportContent}>
        <View style={styles.reportHeader}>
          <Text style={styles.reportTitle} numberOfLines={1}>
            {draft.title}
          </Text>
          <View style={[styles.reportTypeBadge, styles.draftBadge]}>
            <Edit3 size={10} color={theme.colors.warning} />
            <Text style={[styles.reportTypeText, styles.draftBadgeText]}>
              Draft
            </Text>
          </View>
        </View>
        <View style={styles.reportMeta}>
          <Calendar color={theme.colors.textLight} size={12} />
          <Text style={styles.reportMetaText}>Last edited: {draft.date}</Text>
        </View>
      </View>
      <ChevronRight color={theme.colors.textLight} size={18} />
    </TouchableOpacity>
  );
}

function AttendanceCard({ record, navigation }: any) {
  const attendanceRate =
    record.totalCount > 0
      ? Math.round((record.presentCount / record.totalCount) * 100)
      : 0;

  return (
    <TouchableOpacity
      style={styles.reportCard}
      activeOpacity={0.8}
      onPress={() => {
        navigation.navigate("CreateAttendance", {
          attendanceId: record.id,
          mode: "edit",
        });
      }}
    >
      <View style={styles.reportContent}>
        <View style={styles.reportHeader}>
          <Text style={styles.reportTitle} numberOfLines={1}>
            {record.fileName || "Attendance Record"}
          </Text>
          <View style={[styles.attendanceStats]}>
            <Text style={styles.attendanceCount}>
              {record.presentCount}/{record.totalCount}
            </Text>
            <Text style={styles.attendanceRate}>({attendanceRate}%)</Text>
          </View>
        </View>
        <View style={styles.reportMeta}>
          <Calendar color={theme.colors.textLight} size={12} />
          <Text style={styles.reportMetaText}>{record.date}</Text>
        </View>
      </View>
      <ChevronRight color={theme.colors.textLight} size={18} />
    </TouchableOpacity>
  );
}
