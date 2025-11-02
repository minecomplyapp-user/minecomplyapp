import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  SafeAreaView,
  RefreshControl,
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
import { apiGet, apiDelete, getApiBaseUrl, getJwt } from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AttendanceRecordItem = {
  id: string;
  fileName: string;
  title?: string | null;
  meetingDate?: string | null; // may be date-only string (YYYY-MM-DD)
  createdAt?: string | null; // ISO date string
};

export default function AttendanceRecordScreen({ navigation }: any) {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecordItem[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const hasRecords = attendanceRecords.length > 0;
  const [scaleAnim] = useState(new Animated.Value(1));

  const fmtDate = (d?: string | null): string => {
    if (!d) return "";
    // If already a YYYY-MM-DD date-only string, show as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    // Otherwise attempt to parse ISO
    try {
      const dt = new Date(d);
      if (!isNaN(dt.getTime())) {
        const yyyy = dt.getFullYear();
        const mm = String(dt.getMonth() + 1).padStart(2, "0");
        const dd = String(dt.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      }
    } catch {}
    return String(d);
  };

  const fetchRecords = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await apiGet<AttendanceRecordItem[]>(
        `/attendance/creator/${user.id}`
      );
      setAttendanceRecords(Array.isArray(data) ? data : []);
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to load attendance records.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchRecords();
    }
  }, [user?.id, fetchRecords]);

  useFocusEffect(
    useCallback(() => {
      // Refresh when returning to this screen
      fetchRecords();
    }, [fetchRecords])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchRecords();
    } finally {
      setRefreshing(false);
    }
  }, [fetchRecords]);

  const handleDelete = (id: number | string) => {
    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this attendance record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await apiDelete(`/attendance/${id}`);
              setAttendanceRecords((prev) =>
                prev.filter((r) => r.id !== String(id))
              );
              Alert.alert("Deleted", "Attendance record has been deleted.");
            } catch (e: any) {
              Alert.alert("Delete failed", e?.message || "Unable to delete");
            }
          },
        },
      ]
    );
  };

  const handleDownload = async (id: string) => {
    const record = attendanceRecords.find((r) => r.id === id);
    const base = getApiBaseUrl();
    const url = `${base}/api/attendance/${id}/pdf`;
    const token = await getJwt();
    const rawName = (record?.title || record?.fileName || `attendance_${id}`)
      .toString()
      .replace(/[^a-z0-9._-]/gi, "_");
    const fsAny = FileSystem as any;
    const baseDir: string =
      fsAny.documentDirectory || fsAny.cacheDirectory || "";
    const localFileUri = `${baseDir}${rawName}.pdf`;

    try {
      // Download via fetch and write as base64 to avoid deprecated APIs
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/pdf",
        },
      });
      if (!res.ok) {
        throw new Error(`Download failed with status ${res.status}`);
      }
      const buffer = await res.arrayBuffer();
      const base64 = arrayBufferToBase64(buffer);

      if (
        Platform.OS === "android" &&
        (FileSystem as any).StorageAccessFramework
      ) {
        try {
          const savedPath = await savePdfToAndroidDownloads(
            `${rawName}.pdf`,
            base64
          );
          Alert.alert("Downloaded", `Saved to Downloads: ${savedPath}`);
        } catch (e: any) {
          // Clear saved dir so next attempt will re-prompt
          try {
            await AsyncStorage.removeItem(ANDROID_DOWNLOADS_DIR_KEY);
          } catch {}
          // Fallback: save internally and offer system share to let user choose a folder
          await FileSystem.writeAsStringAsync(localFileUri, base64, {
            encoding: (FileSystem as any).EncodingType?.Base64 || "base64",
          });
          try {
            await Sharing.shareAsync(localFileUri, {
              mimeType: "application/pdf",
              dialogTitle: "Save PDF",
              UTI: "com.adobe.pdf",
            } as any);
          } catch {}
          Alert.alert(
            "Downloaded",
            `Saved to app storage: ${localFileUri}\nSave-to-Downloads failed: ${e?.message || "Unknown error"}\nIf Android asked to choose another folder, open Downloads, create/select a subfolder (e.g. MineComply), then tap Use this folder -> Allow.`
          );
        }
      } else {
        // iOS and others: save in app storage
        await FileSystem.writeAsStringAsync(localFileUri, base64, {
          encoding: (FileSystem as any).EncodingType?.Base64 || "base64",
        });
        try {
          await Sharing.shareAsync(localFileUri, {
            mimeType: "application/pdf",
            dialogTitle: "Save PDF",
            UTI: "com.adobe.pdf",
          } as any);
        } catch {}
        Alert.alert("Downloaded", `Saved to app storage: ${localFileUri}`);
      }
    } catch (e: any) {
      Alert.alert("Download failed", e?.message || "Could not download PDF");
    }
  };

  const handleOpenRecord = (
    record: AttendanceRecordItem & { date?: string }
  ) => {
    // If you have a detail screen wired, navigate with the id
    try {
      navigation.navigate("AttendanceDetail", {
        record: {
          id: record.id,
          title: record.title || record.fileName,
          date: record.date,
        },
      });
    } catch {
      Alert.alert(
        "Open Record",
        `Opening ${record.title || record.fileName}...`
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <CustomHeader showSave={false} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
            Animated.spring(scaleAnim, {
              toValue: 0.97,
              useNativeDriver: true,
            }).start();
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
            <Plus
              color={theme.colors.primaryDark}
              size={20}
              strokeWidth={2.5}
            />
            <Text style={styles.actionButtonText}>Create New Record</Text>
          </Animated.View>
        </TouchableOpacity>

        {/* Saved Records Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved Records</Text>
          </View>

          <View style={styles.recordsContainer}>
            {loading ? (
              <View style={styles.emptyStateCard}>
                <View style={styles.emptyState}>
                  <ClipboardList color={theme.colors.textLight} size={48} />
                  <Text style={styles.emptyStateTitle}>Loading…</Text>
                  <Text style={styles.emptyStateText}>
                    Fetching your attendance records.
                  </Text>
                </View>
              </View>
            ) : hasRecords ? (
              attendanceRecords.map((record) => (
                <AnimatedRecordCard
                  key={record.id}
                  record={{
                    ...record,
                    // Normalize display fields
                    title: record.title || record.fileName,
                    date: fmtDate(
                      record.meetingDate || record.createdAt || null
                    ),
                  }}
                  onDelete={(id: string) => handleDelete(id)}
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

// Minimal base64 encoder for ArrayBuffer (avoids deprecated download APIs)
const _b64chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let base64 = "";
  let i = 0;
  for (; i + 2 < bytes.length; i += 3) {
    base64 += _b64chars[bytes[i] >> 2];
    base64 += _b64chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
    base64 += _b64chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
    base64 += _b64chars[bytes[i + 2] & 63];
  }
  if (i < bytes.length) {
    base64 += _b64chars[bytes[i] >> 2];
    if (i === bytes.length - 1) {
      base64 += _b64chars[(bytes[i] & 3) << 4];
      base64 += "==";
    } else {
      base64 += _b64chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      base64 += _b64chars[(bytes[i + 1] & 15) << 2];
      base64 += "=";
    }
  }
  return base64;
}

// Persist and reuse the chosen Downloads folder permission (Android SAF)
const ANDROID_DOWNLOADS_DIR_KEY = "DOWNLOAD_DIR_URI";

async function ensureAndroidDownloadsDir(): Promise<string> {
  const fsAny = FileSystem as any;
  const existing = await AsyncStorage.getItem(ANDROID_DOWNLOADS_DIR_KEY);
  if (existing) return existing;

  const perm =
    await fsAny.StorageAccessFramework.requestDirectoryPermissionsAsync();
  if (!perm.granted || !perm.directoryUri) {
    throw new Error("Storage permission not granted");
  }
  await AsyncStorage.setItem(ANDROID_DOWNLOADS_DIR_KEY, perm.directoryUri);
  return perm.directoryUri;
}

async function savePdfToAndroidDownloads(
  filename: string,
  base64Data: string
): Promise<string> {
  const fsAny = FileSystem as any;
  const dirUri = await ensureAndroidDownloadsDir();
  // Create the file in the chosen directory (recommend selecting Downloads once)
  const fileUri = await fsAny.StorageAccessFramework.createFile(
    dirUri,
    filename,
    "application/pdf"
  );
  await FileSystem.writeAsStringAsync(fileUri, base64Data, {
    encoding: (FileSystem as any).EncodingType?.Base64 || "base64",
  });
  return fileUri;
}

/* ---------- Animated Record Card ---------- */
function AnimatedRecordCard({ record, onDelete, onDownload, onOpen }: any) {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
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
    <Animated.View
      style={[styles.recordCard, { transform: [{ scale: scaleAnim }] }]}
    >
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
