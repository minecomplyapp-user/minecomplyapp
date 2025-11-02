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
    const { status, canAskAgain } =
      await ImagePicker.getMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      if (canAskAgain) {
        const { status: newStatus } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (newStatus !== "granted") {
          Alert.alert(
            "Permission Needed",
            "Please allow access to your photos so you can upload your QR code."
          );
          return;
        }
      } else {
        Alert.alert(
          "Permission Required",
          "Access to your photos is disabled. Please enable it in your settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }
    }

    // ✅ Pick the QR code image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled || !result.assets?.length) return;

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
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.4)",
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <View
              style={{
                width: "100%",
                backgroundColor: "white",
                borderRadius: 10,
                padding: 16,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}>
                Add or edit QR
              </Text>
              <TouchableOpacity
                onPress={async () => {
                  setOptionsVisible(false);
                  // call existing image picker flow
                  await handlePickImage();
                }}
                style={{ paddingVertical: 12 }}
              >
                <Text style={{ fontSize: 15 }}>Upload image</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setOptionsVisible(false);
                  setLinkModalVisible(true);
                }}
                style={{ paddingVertical: 12 }}
              >
                <Text style={{ fontSize: 15 }}>Enter link (convert → QR)</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setOptionsVisible(false)} style={{ paddingVertical: 12 }}>
                <Text style={{ fontSize: 15, color: "#888" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Link input modal */}
        <Modal visible={linkModalVisible} transparent animationType="fade">
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.4)",
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <View
              style={{
                width: "100%",
                backgroundColor: "white",
                borderRadius: 10,
                padding: 16,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
                Paste link to convert to QR
              </Text>
              <TextInput
                value={linkInput}
                onChangeText={setLinkInput}
                placeholder="https://example.com"
                autoCapitalize="none"
                keyboardType="url"
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  padding: 10,
                  borderRadius: 6,
                  marginBottom: 12,
                }}
              />

              <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <TouchableOpacity
                  onPress={() => {
                    setLinkModalVisible(false);
                    setLinkInput("");
                  }}
                  style={{ padding: 10, marginRight: 8 }}
                >
                  <Text style={{ color: "#888" }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={async () => {
                    // generate QR from link
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
                  style={{ padding: 10 }}
                >
                  <Text style={{ color: theme.colors.primaryDark }}>{submitting ? "..." : "Convert"}</Text>
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
  qrStatusText: {
    marginTop: verticalScale(theme.spacing.md),
    fontFamily: theme.typography.regular,
    fontSize: normalizeFont(theme.typography.sizes.sm),
    color: theme.colors.success || "#28a745",
  },
});

export default GuestDashboardScreen;
