import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  Modal,
  TextInput,
  InteractionManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../theme/theme";
import { supabase } from "../../lib/supabase";
import { uploadQRCode } from "../../lib/storage";
import { useAuth } from "../../contexts/AuthContext";
import { styles } from "./styles/guestDashboardScreen";

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
          [
            { text: "Open Settings", onPress: () => Linking.openSettings() },
            { text: "Cancel", style: "cancel" },
          ]
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

        // Save to profile so other devices see it
        try {
          if (user?.id) {
            await supabase
              .from("profiles")
              .update({ qr_path: path, qr_public_url: publicUrl })
              .eq("id", user.id);
          }
        } catch (e) {
          console.warn("Failed to update profile with QR info", e);
        }

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
    const localDir =
      (FileSystem as any).cacheDirectory ||
      (FileSystem as any).documentDirectory ||
      "";
    const localPath = `${localDir}${fileName}`;

    try {
      // Download generated QR to local path
      const dl = await FileSystem.downloadAsync(qrApi, localPath);
      if (!dl || !dl.uri)
        throw new Error("Failed to download generated QR image");

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
        // Update profile so other devices see it
        try {
          if (user?.id) {
            await supabase
              .from("profiles")
              .update({ qr_path: path, qr_public_url: publicUrl })
              .eq("id", user.id);
          }
        } catch (e) {
          console.warn("Failed to update profile with generated QR info", e);
        }

        await AsyncStorage.setItem("guest_qr_public_url", publicUrl);
        await AsyncStorage.setItem("guest_qr_path", path);
        Alert.alert("Success", "QR code generated and uploaded successfully!");
      } else {
        throw new Error("Failed to get public URL for generated QR");
      }
    } catch (err: any) {
      console.error("QR generation/upload error:", err);
      Alert.alert(
        "Failed",
        err.message || "Could not generate/upload QR image."
      );
    }
  };

  // Load persisted QR on mount
  const { user } = useAuth();

  // Load persisted QR on mount and subscribe to profile changes for real-time updates
  useEffect(() => {
    let channel: any;
    (async () => {
      try {
        // First try to load from profiles table for the logged in user
        if (user?.id) {
          const { data, error } = await supabase
            .from("profiles")
            .select("qr_path, qr_public_url")
            .eq("id", user.id)
            .maybeSingle();

          if (error) console.warn("Failed to load profile QR", error);
          if (data) {
            if (data.qr_public_url) setQrImage(data.qr_public_url);
            if (data.qr_path) setQrPath(data.qr_path);
          }

          // Subscribe to realtime updates on the profiles row (if supported)
          try {
            channel = supabase
              .channel(`profiles:${user.id}`)
              .on(
                "postgres_changes",
                {
                  event: "UPDATE",
                  schema: "public",
                  table: "profiles",
                  filter: `id=eq.${user.id}`,
                },
                (payload: any) => {
                  const newRow = payload.new || payload.record || {};
                  if (newRow.qr_public_url) setQrImage(newRow.qr_public_url);
                  if (newRow.qr_path) setQrPath(newRow.qr_path);
                }
              )
              .subscribe();
          } catch (subErr) {
            console.warn(
              "Realtime subscription failed (falling back to polling)",
              subErr
            );
            // fallback: simple polling every 15s
            channel = setInterval(async () => {
              try {
                const { data: d } = await supabase
                  .from("profiles")
                  .select("qr_path, qr_public_url")
                  .eq("id", user.id)
                  .maybeSingle();
                if (d) {
                  if (d.qr_public_url) setQrImage(d.qr_public_url);
                  if (d.qr_path) setQrPath(d.qr_path);
                }
              } catch (e) {
                // ignore
              }
            }, 15000);
          }
        } else {
          // Not logged in yet: fallback to AsyncStorage
          const savedUrl = await AsyncStorage.getItem("guest_qr_public_url");
          const savedPath = await AsyncStorage.getItem("guest_qr_path");
          if (savedUrl) setQrImage(savedUrl);
          if (savedPath) setQrPath(savedPath);
        }
      } catch (e) {
        console.warn("Failed to load saved guest QR", e);
      }
    })();

    return () => {
      try {
        if (channel?.unsubscribe) channel.unsubscribe();
        else if (channel) clearInterval(channel);
      } catch (e) {
        // ignore
      }
    };
  }, [user]);

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
        {/* ANDROID WORKS FINE BUT IOS DOES NOT HUHU */}
        {/* Debug button for IOS to open picker directly */}
        {/* <TouchableOpacity
          style={styles.debugButton}
          onPress={async () => {
            console.log("Debug: opening image picker");
            await handlePickImage();
          }}
        >
          <Text style={styles.debugButtonText}>Debug: Open Picker</Text>
        </TouchableOpacity> */}
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
                  width: 300, 
                  height: 300, 
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
                <Text
                  style={[
                    styles.qrStatusText,
                    { color: "#d9534f", marginTop: 8 },
                  ]}
                >
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


export default GuestDashboardScreen;
