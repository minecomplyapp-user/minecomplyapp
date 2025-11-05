import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  SafeAreaView,
  RefreshControl,
  Linking,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Camera, Upload, Download, Trash2, ClipboardList } from "lucide-react-native";
import { CustomHeader } from "../../components/CustomHeader";
import { theme } from "../../theme/theme";
import { epepStyles as styles } from "./styles/epepScreen";
import {
  createSignedDownloadUrl,
  uploadFileFromUri,
  uploadAttachment,
} from "../../lib/storage";
import { deleteFiles } from "../../lib/api";

type EpepDoc = {
  id: string;
  fileName: string;
  createdAt?: string | null;
  url?: string;
  path?: string;
};

export default function EPEPScreen({ navigation }: any) {
  const STORAGE_KEY = "@epep_docs";

  const [docs, setDocs] = useState<EpepDoc[]>([]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  const persistDocs = async (items: EpepDoc[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to persist EPEP docs:", e);
    }
  };

  const loadDocs = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: EpepDoc[] = JSON.parse(raw);
        setDocs(parsed || []);
      }
    } catch (e) {
      console.warn("Failed to load EPEP docs:", e);
    }
  };

  React.useEffect(() => {
    loadDocs();
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert("Delete Document", "Are you sure you want to delete this document?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const doc = docs.find((d) => d.id === id);
          // Optimistically remove from UI
          const updated = docs.filter((d) => d.id !== id);
          setDocs(updated);
          await persistDocs(updated);

          // Try to delete from storage if we have a stored path
          try {
            if (doc?.path) {
              await deleteFiles([doc.path]);
            }
          } catch (e) {
            console.warn("Failed to delete file from storage:", e);
          }
        },
      },
    ]);
  };

  const handleDownload = (doc: EpepDoc) => {
    // UI-only: just notify the user. Real download will be implemented later.
    (async () => {
      try {
        if (doc.path) {
          const { url } = await createSignedDownloadUrl(doc.path, 60);
          const can = await Linking.canOpenURL(url);
          if (can) {
            await Linking.openURL(url);
          } else {
            Alert.alert("Download", "Unable to open the download URL.");
          }
        } else if (doc.url) {
          const can = await Linking.canOpenURL(doc.url);
          if (can) await Linking.openURL(doc.url);
          else Alert.alert("Download", "Unable to open the file URL.");
        } else {
          Alert.alert("Download", "No download path available for this document.");
        }
      } catch (e: any) {
        Alert.alert("Download failed", e?.message || "Could not start download");
      }
    })();
  };

  const handleOpen = (doc: EpepDoc) => {
    // UI-only: simulate open. If doc.url is present you could open with Linking.openURL
    (async () => {
      try {
        if (doc.path) {
          const { url } = await createSignedDownloadUrl(doc.path, 60);
          const can = await Linking.canOpenURL(url);
          if (can) await Linking.openURL(url);
          else Alert.alert("Open", "Cannot open file URL");
        } else if (doc.url) {
          const can = await Linking.canOpenURL(doc.url);
          if (can) await Linking.openURL(doc.url);
          else Alert.alert("Open", "Cannot open file URL");
        } else {
          Alert.alert("Open", `Opening ${doc.fileName}`);
        }
      } catch (e: any) {
        Alert.alert("Open failed", e?.message || "Could not open file");
      }
    })();
  };

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["*/*"],
        copyToCacheDirectory: true,
      } as any);

      // Support both legacy and new result shapes
      const asset = (result as any).assets ? (result as any).assets[0] : result;
      if (!asset || (result as any).canceled === true || (result as any).type === "cancel") {
        return;
      }

      const uri = asset.uri;
      const fileName = asset.name || uri.split("/").pop() || `file-${Date.now()}`;
      const mimeType = asset.mimeType || asset.type || undefined;

      Alert.alert("Uploading", `Uploading ${fileName}...`);

      const uploadRes = await uploadFileFromUri({ uri, fileName, contentType: mimeType });

      const newDoc: EpepDoc = {
        id: Date.now().toString(),
        fileName,
        createdAt: new Date().toISOString(),
        path: uploadRes.path,
      };

      const updated = [newDoc, ...docs];
      setDocs(updated);
      await persistDocs(updated);

      Alert.alert("Upload complete", `${fileName} uploaded successfully.`);
    } catch (e: any) {
      console.error("Upload failed:", e);
      Alert.alert("Upload failed", e?.message || "Could not upload file");
    }
  };

  const handleScan = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Camera permission is required to scan documents.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      } as any);

      const asset = (result as any).assets ? (result as any).assets[0] : result;
      if (!asset || (result as any).canceled === true) return;

      const uri = asset.uri;
      const fileName = `photo-${Date.now()}.jpg`;

      Alert.alert("Uploading", `Uploading ${fileName}...`);
      // Use uploadAttachment helper for images
      const uploadRes = await uploadAttachment(uri);

      const newDoc: EpepDoc = {
        id: Date.now().toString(),
        fileName,
        createdAt: new Date().toISOString(),
        path: uploadRes.path,
      };

      const updated = [newDoc, ...docs];
      setDocs(updated);
      await persistDocs(updated);

      Alert.alert("Upload complete", `${fileName} uploaded successfully.`);
    } catch (e: any) {
      console.error("Scan/upload failed:", e);
      Alert.alert("Scan failed", e?.message || "Could not scan/upload photo");
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <CustomHeader showSave={false} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>APEP/EPEP Documents</Text>
          <Text style={styles.headerSubtitle}>Scan, upload or manage your AEPEP/EPEP documents.</Text>
        </View>

        <View style={styles.actionRowTop}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.9} onPress={handleScan}> 
            <Camera color={theme.colors.primaryDark} size={18} />
            <Text style={styles.actionButtonText}>SCAN DOCUMENTS</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} activeOpacity={0.9} onPress={handleUpload}> 
            <Upload color={theme.colors.primaryDark} size={18} />
            <Text style={styles.actionButtonText}>UPLOAD DOCUMENTS</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved EPEP Documents</Text>
          </View>

          <View style={styles.recordsContainer}>
            {docs.length === 0 ? (
              <View style={styles.emptyStateCard}>
                <View style={styles.emptyState}>
                  <ClipboardList color={theme.colors.textLight} size={48} />
                  <Text style={styles.emptyStateTitle}>No documents</Text>
                  <Text style={styles.emptyStateText}>You don't have any saved EPEP documents yet.</Text>
                </View>
              </View>
            ) : (
              docs.map((doc) => (
                <DocCard
                  key={doc.id}
                  doc={doc}
                  onDelete={() => handleDelete(doc.id)}
                  onDownload={() => handleDownload(doc)}
                  onOpen={() => handleOpen(doc)}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DocCard({ doc, onDelete, onDownload, onOpen }: any) {
  const [scaleAnim] = useState(new Animated.Value(1));

  const pressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  };
  const pressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[styles.recordCard, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity activeOpacity={0.9} onPressIn={pressIn} onPressOut={pressOut} onPress={onOpen} style={styles.recordInner}>
        <View style={styles.recordInfo}>
          <Text style={styles.recordTitle} numberOfLines={1}>{doc.fileName}</Text>
          <Text style={styles.recordMetaText}>{doc.createdAt}</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.iconButton, styles.downloadButton]} onPress={onDownload}>
            <Download size={18} color={theme.colors.primaryDark} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.iconButton, styles.deleteButton]} onPress={onDelete}>
            <Trash2 size={18} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
