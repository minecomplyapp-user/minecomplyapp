import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal, 
  TouchableWithoutFeedback, 
  StyleSheet,
  Animated,
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
} from "lucide-react-native";
import { theme } from "../../theme/theme";
import { styles } from "../../styles/dashboardScreen";
import { useAuth } from "../../contexts/AuthContext";

// SAMPLE RANI HA PWEDE NI TANG2ON
const sampleReports = [
  { id: 1, title: "Environmental Compliance Report", date: "Oct 10, 2025" },
  { id: 2, title: "Mine Site Safety Inspection", date: "Oct 8, 2025" },
  { id: 3, title: "Quarterly Water Quality Assessment", date: "Oct 1, 2025" },
];


export default function DashboardScreen({ navigation }: any) {
  const { user } = useAuth();
  const [reports] = useState<any[]>(sampleReports);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const hasReports = reports.length > 0;

  const userName =
    (user as any)?.user_metadata?.full_name ||
    (user as any)?.user_metadata?.name ||
    (user as any)?.email?.split("@")[0] ||
    "User";

  return (
  
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.subGreeting}>Welcome back,</Text>
            <Text style={styles.greeting}>{userName}</Text>
          </View>
          <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate('Profile')}>
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
              onPress={() => console.log("Duplicate Report")}
            />
          </View>
        </View>

        {/* RECENT REPORTS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Recent Reports</Text>
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
                {reports.slice(0, 3).map((report, index) => (
                  <React.Fragment key={report.id}>
                    <ReportCard report={report} />
                    {index < reports.slice(0, 3).length - 1 && (
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
                <Text style={styles.emptyStateTitle}>No reports yet</Text>
                <Text style={styles.emptyStateText}>
                  Create your first compliance report to get started
                </Text>
              </View>
            )}
          </View>
        </View>
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
  const [scaleAnim] = useState(new Animated.Value(0.95));

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
            <Animated.View style={[styles.modalContent, { transform: [{ scale: scaleAnim }] }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create New Report</Text>
                <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
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
                      navigation.navigate('ECCMonitoring');
                    }, 120);
                  }}
                />
                <ModalButton
                  icon={ClipboardList}
                  title="CMVR"
                  onPress={() => {
                    try {
                      onClose();
                      setTimeout(() => {
                        navigation.navigate('CMVRReport', {
                          submissionId: null,
                          projectId: null,
                          projectName: 'New Project',
                        });
                      }, 120);
                    } catch (err) {
                      console.error('Error navigating to CMVRReport from modal', err);
                      onClose();
                    }
                  }}
                />
                <ModalButton
                  icon={AlertTriangle}
                  title="EPEP / AEPEP"
                  onPress={() => {
                    console.log("EPEP / AEPEP");
                    onClose();
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
    <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.9}>
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

function ReportCard({ report }: any) {
  return (
    <TouchableOpacity style={styles.reportCard} activeOpacity={0.8}>
      <View style={styles.reportContent}>
        <Text style={styles.reportTitle} numberOfLines={1}>{report.title}</Text>
        <View style={styles.reportMeta}>
          <Calendar color={theme.colors.textLight} size={12} />
          <Text style={styles.reportMetaText}>{report.date}</Text>
        </View>
      </View>
      <ChevronRight color={theme.colors.textLight} size={18} />
    </TouchableOpacity>
  );
}