import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  SafeAreaView,
} from "react-native";
import {
  Calendar,
  ClipboardList,
  Plus,
  Trash2,
  Download,
} from "lucide-react-native";
import { theme } from "../../theme/theme";
import { attendanceRecordStyles as styles } from "./styles/attendanceRecordScreen";
import { CustomHeader } from "../../components/CustomHeader";

// sample data only
const sampleAttendance = [
  { id: 1, title: "Attendance Report - September", date: "2024-09-30" },
  { id: 2, title: "Attendance Report - October", date: "2024-10-31" },
  { id: 3, title: "Attendance Report - November", date: "2024-11-15" },
  { id: 4, title: "Attendance Report - December", date: "2024-12-01" },
  { id: 5, title: "Attendance Report - January", date: "2025-01-15" },
  { id: 6, title: "Attendance Report - February", date: "2025-02-10" },
];

export default function AttendanceRecordScreen({ navigation }: any) {
  const [attendanceRecords, setAttendanceRecords] = useState(sampleAttendance);
  const hasRecords = attendanceRecords.length > 0;
  const [scaleAnim] = useState(new Animated.Value(1));

  const handleDelete = (id: number) => {
    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this attendance record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            setAttendanceRecords(attendanceRecords.filter((r) => r.id !== id)),
        },
      ]
    );
  };

  const handleDownload = (id: number) => {
    const record = attendanceRecords.find((r) => r.id === id);
    if (record) {
      Alert.alert("Download PDF", `Downloading ${record.title} as PDF...`);
    }
  };

  const handleOpenRecord = (record: any) => {
    Alert.alert("Open Record", `Opening ${record.title}...`);
    // navigation.navigate("AttendanceDetails", { record });
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <CustomHeader showSave={false} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Attendance Records</Text>
          <Text style={styles.headerSubtitle}>
            Manage, create, and download attendance reports.
          </Text>
        </View>

        {/* Create New Attendance Record */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={() => {
            Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
          }}
          onPressOut={() => {
            Animated.spring(scaleAnim, {
              toValue: 1,
              friction: 4,
              tension: 50,
              useNativeDriver: true,
            }).start();
          }}
          onPress={() => {
            navigation.navigate("CreateAttendance");
          }}
          style={styles.actionButtonWrapper}
        >
          <Animated.View
            style={[styles.actionButton, { transform: [{ scale: scaleAnim }] }]}
          >
            <Plus color={theme.colors.primaryDark} size={20} strokeWidth={2.5} />
            <Text style={styles.actionButtonText}>Create New Record</Text>
          </Animated.View>
        </TouchableOpacity>


        {/* Saved Records Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved Records</Text>
          </View>

          <View style={styles.recordsContainer}>
            {hasRecords ? (
              attendanceRecords.map((record) => (
                <AnimatedRecordCard
                  key={record.id}
                  record={record}
                  onDelete={handleDelete}
                  onDownload={handleDownload}
                  onOpen={handleOpenRecord}
                />
              ))
            ) : (
              <View style={styles.emptyStateCard}>
                <View style={styles.emptyState}>
                  <ClipboardList color={theme.colors.textLight} size={48} />
                  <Text style={styles.emptyStateTitle}>No attendance yet</Text>
                  <Text style={styles.emptyStateText}>
                    Create your first attendance record to get started
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Animated Record Card ---------- */
function AnimatedRecordCard({ record, onDelete, onDownload, onOpen }: any) {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.recordCard, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onOpen(record)}
        style={styles.recordInner}
      >
        <View style={styles.recordInfo}>
          <Text style={styles.recordTitle} numberOfLines={1}>
            {record.title}
          </Text>
          <View style={styles.recordMeta}>
            <Calendar color={theme.colors.textLight} size={14} />
            <Text style={styles.recordMetaText}>{record.date}</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.iconButton, styles.downloadButton]}
            onPress={() => onDownload(record.id)}
          >
            <Download size={18} color={theme.colors.primaryDark} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, styles.deleteButton]}
            onPress={() => onDelete(record.id)}
          >
            <Trash2 size={18} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
