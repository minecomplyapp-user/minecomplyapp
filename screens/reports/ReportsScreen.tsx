import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import {
  FileText,
  Calendar,
  Download,
  Trash2,
} from "lucide-react-native";
import { theme } from "../../theme/theme";
import { reportScreenStyles as styles } from "./styles/reportsScreen";
import { CustomHeader } from "../../components/CustomHeader";

// SAMPLE RANI HA PWEDE NI TANG2ON
const sampleReports = [
  { id: 1, title: "Environmental Compliance Report", date: "Oct 10, 2025" },
  { id: 2, title: "Mine Site Safety Inspection", date: "Oct 8, 2025" },
  { id: 3, title: "Quarterly Water Quality Assessment", date: "Oct 1, 2025" },
  { id: 4, title: "Annual Equipment Maintenance Log", date: "Sep 25, 2025" },
  { id: 5, title: "Blast Site Vibration Monitoring", date: "Sep 15, 2025" },
];

export default function ReportsScreen() {
  const [reports, setReports] = useState(sampleReports);

  const handleDelete = (id: number) => {
    Alert.alert(
      "Delete Report",
      "Are you sure you want to delete this report? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => setReports(reports.filter((r) => r.id !== id)),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader showSave={false} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>All Reports</Text>
          <Text style={styles.subtitle}>
            View, download, or manage your compliance reports.
          </Text>
        </View>

        {reports.length > 0 ? (
          <View style={styles.reportList}>
            {reports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onDelete={() => handleDelete(report.id)}
              />
            ))}
          </View>
        ) : (
          <EmptyState />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const ReportCard = ({ report, onDelete }: { report: any; onDelete: () => void; }) => {
  return (
    <View style={styles.reportCard}>
      <View style={styles.cardInner}>
        <View style={styles.reportInfo}>
          <Text style={styles.reportTitle} numberOfLines={2}>
            {report.title}
          </Text>
          <View style={styles.reportMeta}>
            <Calendar size={14} color={theme.colors.textLight} />
            <Text style={styles.reportDate}>{report.date}</Text>
          </View>
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.iconButton, styles.downloadButton]}
            onPress={() => Alert.alert("Download", "Download functionality to be implemented.")}
          >
            <Download size={20} color={theme.colors.primaryDark} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, styles.deleteButton]}
            onPress={onDelete}
          >
            <Trash2 size={20} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const EmptyState = () => {
  return (
    <View style={styles.emptyState}>
      <FileText size={54} color={theme.colors.textLight} strokeWidth={1.5} />
      <Text style={styles.emptyStateTitle}>No Reports Found</Text>
      <Text style={styles.emptyStateText}>
        When you create reports, they will appear here.
      </Text>
    </View>
  );
};
