import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  Modal,
  TextInput,
  InteractionManager,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../theme/theme";
import {
  scale,
  verticalScale,
  normalizeFont,
  moderateScale,
} from "../../utils/responsive";
import { supabase } from "../../lib/supabase";
import { uploadQRCode } from "../../lib/storage";

export const GuestDashboardScreen = () => {
  const navigation = useNavigation();
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [qrPath, setQrPath] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [linkModalVisible, setLinkModalVisible] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Logout navigation
  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "RoleSelection" as never }],
    });
  };

  // Handle QR image selection + Supabase upload
  const handlePickImage = async () => {
  let result: any;
  try {
      // Request permission (use request directly to simplify flow)
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (perm.status !== "granted") {
        Alert.alert(
          "Permission Needed",
          "Please allow access to your photos so you can upload your QR code.",
          [{ text: "Open Settings", onPress: () => Linking.openSettings() }, { text: "Cancel", style: "cancel" }]
        );
        return;
      }

      // ✅ Pick the QR code image
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

  if (result.canceled || !result.assets?.length) return;

    } catch (permErr) {
      console.warn("Image picker permission/error:", permErr);
      Alert.alert("Error", "Could not open image picker.");
      return;
    }
    const imageUri = result.assets[0].uri;
    const fileName = `qr_${Date.now()}.jpg`;

    try {
      const { path } = await uploadQRCode(imageUri, fileName, true);
      if (qrPath && qrPath !== path) {
        try {
          await supabase.storage.from("minecomplyapp-bucket").remove([qrPath]);
        } catch (removeErr) {
          // non-fatal
          console.warn("Failed to remove previous QR file", removeErr);
        }
      }

      const { data: publicUrlData } = supabase.storage
        .from("minecomplyapp-bucket")
        .getPublicUrl(path);

      const publicUrl = publicUrlData?.publicUrl ?? null;

      if (publicUrl) {
        setQrImage(publicUrl);
        setQrPath(path);

        await AsyncStorage.setItem("guest_qr_public_url", publicUrl);
        await AsyncStorage.setItem("guest_qr_path", path);
        Alert.alert("Success", "QR code uploaded successfully!");
      } else {
        throw new Error("Failed to get public URL");
      }
    } catch (err: any) {
      console.error("QR Upload Error:", err);
      Alert.alert("Upload Failed", err.message || "Something went wrong.");
    }
  };

  // Generate QR image from a link, download it locally then upload to Supabase
  const handleGenerateFromLink = async (link: string) => {
    if (!link) {
      Alert.alert("Invalid link", "Please provide a link to convert to QR.");
      return;
    }

    // ensure link is a URL
    let normalized = link;
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = `https://${normalized}`;
    }

    // Use qrserver API to generate PNG
    const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(
      normalized
    )}`;

    const fileName = `qr_link_${Date.now()}.png`;
    const localDir = (FileSystem as any).cacheDirectory || (FileSystem as any).documentDirectory || "";
    const localPath = `${localDir}${fileName}`;

    try {
      // Download generated QR to local path
      const dl = await FileSystem.downloadAsync(qrApi, localPath);
      if (!dl || !dl.uri) throw new Error("Failed to download generated QR image");

      // Upload downloaded file to Supabase
      const { path } = await uploadQRCode(dl.uri, fileName, true);

      // Remove previous if exists
      if (qrPath && qrPath !== path) {
        try {
          await supabase.storage.from("minecomplyapp-bucket").remove([qrPath]);
        } catch (removeErr) {
          console.warn("Failed to remove previous QR file", removeErr);
        }
      }

      const { data: publicUrlData } = supabase.storage
        .from("minecomplyapp-bucket")
        .getPublicUrl(path);
      const publicUrl = publicUrlData?.publicUrl ?? null;

      if (publicUrl) {
        setQrImage(publicUrl);
        setQrPath(path);
        await AsyncStorage.setItem("guest_qr_public_url", publicUrl);
        await AsyncStorage.setItem("guest_qr_path", path);
        Alert.alert("Success", "QR code generated and uploaded successfully!");
      } else {
        throw new Error("Failed to get public URL for generated QR");
      }
    } catch (err: any) {
      console.error("QR generation/upload error:", err);
      Alert.alert("Failed", err.message || "Could not generate/upload QR image.");
    }
  };

  // Load persisted QR on mount
  useEffect(() => {
    (async () => {
      try {
        const savedUrl = await AsyncStorage.getItem("guest_qr_public_url");
        const savedPath = await AsyncStorage.getItem("guest_qr_path");
        if (savedUrl) setQrImage(savedUrl);
        if (savedPath) setQrPath(savedPath);
      } catch (e) {
        console.warn("Failed to load saved guest QR", e);
      }
    })();
  }, []);

  const isQrSet = !!qrImage;

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons
            name="chevron-back"
            size={22}
            color={theme.colors.primaryDark}
          />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        {/* Debug button to open picker directly */}
        <TouchableOpacity
          style={styles.debugButton}
          onPress={async () => {
            console.log("Debug: opening image picker");
            await handlePickImage();
          }}
        >
          <Text style={styles.debugButtonText}>Debug: Open Picker</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <Text style={styles.greeting}>Hi, MMT Member/Guest!</Text>

        <View style={styles.qrPromptBox}>
          <Text style={styles.qrPromptText}>Scan the code to add remarks.</Text>
        </View>

        {/* Show uploaded QR */}
        {isQrSet && (
          <>
            <View style={{ marginTop: 20, alignItems: "center" }}>
              {imageLoading && (
                <ActivityIndicator
                  size="small"
                  color={theme.colors.primaryDark}
                />
              )}

              <Image
                source={{ uri: qrImage! }}
                style={{
                  width: 300, // ✅ Increased size
                  height: 300, // ✅ Increased size
                  borderRadius: 30,
                  backgroundColor: "transparent",
                }}
                resizeMode="contain"
                onLoadStart={() => {
                  setImageLoading(true);
                  setImageError(null);
                }}
                onLoadEnd={() => setImageLoading(false)}
                onError={async () => {
                  setImageLoading(false);
                  setImageError(
                    "Failed to load public URL, attempting signed URL..."
                  );

                  try {
                    if (qrPath) {
                      const { data, error } = await (supabase.storage as any)
                        .from("minecomplyapp-bucket")
                        .createSignedUrl(qrPath, 60);

                      if (error) {
                        console.warn("createSignedUrl error:", error);
                        setImageError("Failed to generate signed URL");
                        return;
                      }

                      const signed =
                        data?.signedUrl ??
                        data?.signedURL ??
                        (data as any)?.signed_url ??
                        null;
                      if (signed) {
                        setQrImage(signed);
                        await AsyncStorage.setItem(
                          "guest_qr_public_url",
                          signed
                        );
                        setImageError(null);
                        return;
                      }
                    }
                    setImageError("Image not available");
                  } catch (e) {
                    console.warn("Error trying signed URL:", e);
                    setImageError("Image not available");
                  }
                }}
              />
              {imageError ? (
                <Text style={[styles.qrStatusText, { color: "#d9534f", marginTop: 8 }]}>
                  {imageError}
                </Text>
              ) : null}
            </View>
          </>
        )}

        {/* Add/Edit QR Button */}
        <TouchableOpacity
          style={styles.autoPopulateButton}
          onPress={() => setOptionsVisible(true)}
        >
          <Ionicons
            name={isQrSet ? "create-outline" : "add-circle-outline"}
            size={18}
            color={theme.colors.primaryDark}
          />
          <Text style={styles.autoPopulateText}>
            {isQrSet ? "Edit QR Code" : "Add QR Code"}
          </Text>
        </TouchableOpacity>
        
{/* Options Modal: Upload Image or Enter Link */}
<Modal visible={optionsVisible} transparent animationType="fade">
  <View style={styles.modalOverlay}>
    <View style={styles.modalCard}>
      <Text style={styles.modalTitle}>Add or edit QR</Text>

      <TouchableOpacity
        onPress={() => {
          setOptionsVisible(false);
          // Wait until modal dismissal and interactions finish, then open picker
          InteractionManager.runAfterInteractions(() => {
            handlePickImage();
          });
        }}
        style={styles.optionButton}
      >
        <View style={styles.optionRow}>
          <View style={styles.optionIconWrap}>
            <Ionicons
              name="image-outline"
              size={20}
              color={theme.colors.primaryDark}
            />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionText}>Upload image</Text>
            <Text style={styles.optionSubText}>
              Choose a photo from your device
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setOptionsVisible(false);
          setLinkModalVisible(true);
        }}
        style={styles.optionButton}
      >
        <View style={styles.optionRow}>
          <View style={styles.optionIconWrap}>
            <Ionicons
              name="link-outline"
              size={20}
              color={theme.colors.primaryDark}
            />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionText}>Enter link</Text>
            <Text style={styles.optionSubText}>
              Paste a URL and we’ll generate a QR image
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* ✅ WRAP YOUR CANCEL BUTTON IN A modalButtonRow FOR CONSISTENT ALIGNMENT */}
      <View style={styles.modalButtonRow}>
        <TouchableOpacity
          onPress={() => setOptionsVisible(false)}
          style={[styles.modalAction, styles.cancelButton]}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

{/* Link input modal */}
<Modal visible={linkModalVisible} transparent animationType="fade">
  <View style={styles.modalOverlay}>
    <View style={styles.modalCard}>
      <Text style={styles.modalTitle}>Paste link to convert to QR</Text>
<TextInput
  value={linkInput}
  onChangeText={setLinkInput}
  placeholder="https://example.com"
  placeholderTextColor="#9CA3AF" // ✅ ADD THIS (a medium gray)
  autoCapitalize="none"
  keyboardType="url"
  style={styles.input}
/>

      <View style={styles.modalButtonRow}>
        <TouchableOpacity
          onPress={() => {
            setLinkModalVisible(false);
            setLinkInput("");
          }}
          style={[styles.modalAction, styles.cancelButton]}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            setSubmitting(true);
            try {
              await handleGenerateFromLink(linkInput.trim());
            } catch (e) {
              console.warn(e);
            } finally {
              setSubmitting(false);
              setLinkModalVisible(false);
              setLinkInput("");
            }
          }}
          style={styles.modalAction}
        >
          <Text style={styles.convertButtonText}>
            {submitting ? "..." : "Convert"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: scale(theme.spacing.lg),
    paddingTop: verticalScale(theme.spacing.lg),
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(theme.typography.sizes.sm),
    color: theme.colors.primaryDark,
    marginLeft: 6,
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(theme.spacing.lg),
  },
  greeting: {
    fontFamily: theme.typography.bold,
    fontSize: normalizeFont(theme.typography.sizes.xxl),
    color: theme.colors.primaryDark,
    textAlign: "center",
    marginBottom: verticalScale(theme.spacing.lg),
  },
  qrPromptBox: {
    backgroundColor: theme.colors.primaryLight + "15",
    borderRadius: moderateScale(theme.radii.md),
    paddingVertical: verticalScale(theme.spacing.md),
    paddingHorizontal: scale(theme.spacing.lg),
    ...theme.shadows.light,
  },

  qrPromptText: {
    fontFamily: theme.typography.semibold,
    fontSize: normalizeFont(theme.typography.sizes.md),
    color: theme.colors.primaryDark,
    textAlign: "center",
  },
  autoPopulateButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "auto",
    marginTop: verticalScale(10),
  },
  autoPopulateText: {
    color: theme.colors.primaryDark,
    fontWeight: "500",
    marginLeft: 6,
    fontSize: 13,
  },
  debugButton: {
    marginTop: verticalScale(12),
    backgroundColor: "#f3f4f6",
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(8),
  },
  debugButtonText: {
    color: theme.colors.primaryDark,
    fontFamily: theme.typography.semibold,
  },
  qrStatusText: {
    marginTop: verticalScale(theme.spacing.md),
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(theme.typography.sizes.sm),
    color: theme.colors.success || "#28a745",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "90%",
    maxWidth: 450,
    minWidth: 280,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    ...theme.shadows.light,
  },
  modalTitle: {
    fontSize: normalizeFont(theme.typography.sizes.lg), 
    fontFamily: theme.typography.semibold,
    color: theme.colors.primaryDark,
    marginBottom: verticalScale(24), 
  },
  optionButton: {
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 10,
    width: "100%",
    maxWidth: 400,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  optionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primaryLight + "20",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  optionTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  optionText: {
    fontSize: normalizeFont(theme.typography.sizes.md),
    fontFamily: theme.typography.semibold,
    color: theme.colors.primaryDark,
  },
  optionSubText: {
    fontSize: normalizeFont(theme.typography.sizes.sm),
    fontFamily: theme.typography.regular,
    color: "#6b7280",
    marginTop: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
    color: "#111827", 
  },
  modalAction: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 80, 
    justifyContent: "center", 
    alignItems: "center", 
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: verticalScale(24), 
    gap: 12, 
  },
  cancelButton: {
    backgroundColor: "transparent",
  },
  cancelText: {
    color: "#888",
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(theme.typography.sizes.md),
  },
  convertButtonText: {
    // ✅ NEW STYLE
    color: theme.colors.primaryDark,
    fontSize: normalizeFont(theme.typography.sizes.md), // Same size as cancel
    fontFamily: theme.typography.regular, // As requested
  },
});

export default GuestDashboardScreen;
