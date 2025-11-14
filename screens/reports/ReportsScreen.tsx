import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { FileText, Calendar, Download, Trash2 } from "lucide-react-native";
import { theme } from "../../theme/theme";
import { reportScreenStyles as styles } from "./styles/reportsScreen";
import { CustomHeader } from "../../components/CustomHeader";
import { useAuth } from "../../contexts/AuthContext";
import { apiGet } from "../../lib/api";
import { deleteCMVRReport } from "../../lib/cmvr";

export default function ReportsScreen({ navigation }: any) {
  const { user } = useAuth();
  const [reports, setReports] = useState<
    Array<{ id: string; title: string; date: string }>
  >([]);

  useEffect(() => {
    void fetchReports();
  }, []);

  async function fetchReports() {
    try {
      if (!user?.id) return setReports([]);
      const submissions = await apiGet<any[]>(`/cmvr/user/${user.id}`);
      const mapped = (submissions || []).map((sub) => {
        // Use only fileName, with "Untitled" as fallback
        const title = sub.fileName || "Untitled";
        const dt = new Date(sub.updatedAt || sub.createdAt).toLocaleDateString(
          "en-US",
          { month: "short", day: "numeric", year: "numeric" }
        );
        return { id: sub.id as string, title, date: dt };
      });
      setReports(mapped);
    } catch (e) {
      console.log("Failed to load reports:", e);
      setReports([]);
    }
  }

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Report",
      "Are you sure you want to delete this report? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCMVRReport(id);
              setReports((prev) => prev.filter((r) => r.id !== id));
            } catch (e: any) {
              Alert.alert("Delete Failed", e?.message || String(e));
            }
          },
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
                onOpen={() =>
                  navigation.navigate("CMVRDocumentExport", {
                    cmvrReportId: report.id,
                    fileName: report.title,
                  })
                }
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

const ReportCard = ({
  report,
  onOpen,
  onDelete,
}: {
  report: any;
  onOpen: () => void;
  onDelete: () => void;
}) => {
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
            onPress={onOpen}
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
