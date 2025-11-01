import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  SafeAreaView,
  Alert,
  Image,
} from "react-native";
import SignatureScreen from "react-native-signature-canvas";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Location from "expo-location";
import { Feather } from "@expo/vector-icons";
import { theme } from "../../theme/theme";
import { createAttendanceStyles as styles } from "./styles/createAttendanceScreen";
import { CustomHeader } from "../../components/CustomHeader";
import { apiPost } from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { uploadFileFromUri } from "../../lib/storage";

// RadioButton component (gi tapol ko ug separate gamay rakayo sila bitaw)
const RadioButton = ({
  label,
  value,
  selectedValue,
  onSelect,
  hasError,
  containerStyle,
}: any) => {
  const isSelected = value === selectedValue;
  return (
    <TouchableOpacity
      style={[styles.radioButtonContainer, containerStyle]}
      onPress={() => onSelect(value)}
    >
      <View
        style={[
          styles.radioButton,
          isSelected && styles.radioButtonSelected,
          hasError && styles.radioError,
        ]}
      >
        {isSelected && <View style={styles.radioButtonInner} />}
      </View>
      <Text style={[styles.radioButtonLabel, hasError && styles.labelError]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default function CreateAttendanceScreen({ navigation }: any) {
  const { user } = useAuth();
  const [fileName, setFileName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [meetingDate, setMeetingDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [location, setLocation] = useState("");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [attachments, setAttachments] = useState<
    { uri: string; path?: string; uploading?: boolean }[]
  >([]);
  const [attendees, setAttendees] = useState([
    {
      id: 1,
      name: "",
      agency: "",
      position: "",
      attendance: "",
      signature: "",
    },
  ]);

  const [isSigning, setIsSigning] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const signatureRefs = useRef<{ [key: number]: any }>({});
  const [scaleAnim] = useState(new Animated.Value(1));

  // --- Animation Handlers ---
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

  // --- Attendee List Handlers ---
  const addAttendee = () => {
    setAttendees([
      ...attendees,
      {
        id: Date.now(),
        name: "",
        agency: "",
        position: "",
        attendance: "",
        signature: "",
      },
    ]);
  };

  const removeAttendee = (id: number) => {
    setAttendees(attendees.filter((a) => a.id !== id));
    delete signatureRefs.current[id];
  };

  const handleSetFileName = (text: string) => {
    setFileName(text);
    if (errors.fileName) {
      setErrors((prev: any) => ({ ...prev, fileName: false }));
    }
  };

  const updateField = (id: number, field: string, value: string) => {
    setAttendees((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );

    // Clear error for this specific field
    if (errors.attendees?.[id]?.[field]) {
      setErrors((prevErrors: any) => {
        const newErrors = { ...prevErrors };
        if (newErrors.attendees?.[id]) {
          delete newErrors.attendees[id][field];
          if (Object.keys(newErrors.attendees[id]).length === 0) {
            delete newErrors.attendees[id];
          }
        }
        return newErrors;
      });
    }
  };

  const handleClearSignature = (id: number) => {
    if (signatureRefs.current[id]) {
      signatureRefs.current[id].clearSignature();
    }
    updateField(id, "signature", ""); // This will also clear the error
  };

  // --- Attachments Handlers ---
  const processPickedAsset = async (asset: ImagePicker.ImagePickerAsset) => {
    const newItem = { uri: asset.uri, uploading: true } as {
      uri: string;
      path?: string;
      uploading?: boolean;
    };
    setAttachments((prev) => [...prev, newItem]);
    try {
      const nameFromPicker = (
        asset.fileName ??
        asset.uri.split("/").pop() ??
        "image.jpg"
      ).replace(/\?.*$/, "");
      const ext = nameFromPicker.includes(".")
        ? nameFromPicker.split(".").pop()
        : "jpg";
      const baseName = fileName?.trim()
        ? fileName.trim().replace(/[^a-zA-Z0-9._-]/g, "_")
        : "attendance";
      const finalName = `${baseName}_${Date.now()}.${ext}`;
      const contentType = asset.mimeType ?? "image/jpeg";
      const { path } = await uploadFileFromUri({
        uri: asset.uri,
        fileName: finalName,
        contentType,
        upsert: false,
      });
      setAttachments((prev) =>
        prev.map((a) =>
          a.uri === newItem.uri ? { ...a, path, uploading: false } : a
        )
      );
    } catch (e: any) {
      setAttachments((prev) => prev.filter((a) => a.uri !== newItem.uri));
      Alert.alert(
        "Upload failed",
        e?.message || "Could not upload the image. Please try again."
      );
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "We need access to your media library to attach images."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });
    if (result.canceled || !result.assets?.length) return;
    const asset = result.assets[0];
    await processPickedAsset(asset);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Camera permission is needed to take a photo."
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });
    if (result.canceled || !result.assets?.length) return;
    const asset = result.assets[0];
    await processPickedAsset(asset);
  };

  const removeAttachment = (uri: string) => {
    setAttachments((prev) => prev.filter((a) => a.uri !== uri));
  };

  // --- Date Picker Handlers ---
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirmDate = (date: Date) => {
    setMeetingDate(date);
    hideDatePicker();
  };

  const formatDateOnly = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // --- Location Handlers ---
  const useCurrentLocation = async () => {
    try {
      setIsFetchingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Location permission is needed to use your current location."
        );
        return;
      }

      const pos = await Location.getCurrentPositionAsync({});
      let pretty = `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`;
      try {
        const places = await Location.reverseGeocodeAsync({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        if (places && places[0]) {
          const p = places[0] as any;
          const bits = [
            p.name,
            p.street,
            p.city,
            p.region,
            p.postalCode,
            p.country,
          ]
            .filter(Boolean)
            .join(", ");
          if (bits) pretty = bits;
        }
      } catch {}
      setLocation(pretty);
    } catch (e: any) {
      Alert.alert(
        "Location error",
        e?.message || "Failed to fetch current location"
      );
    } finally {
      setIsFetchingLocation(false);
    }
  };

  // --- Validation and Save ---
  const validate = () => {
    const newErrors: any = { attendees: {} };
    let isValid = true;

    if (!fileName.trim()) {
      newErrors.fileName = true;
      isValid = false;
    }

    attendees.forEach((attendee) => {
      const attendeeErrors: any = {};
      if (!attendee.name.trim()) {
        attendeeErrors.name = true;
        isValid = false;
      }
      if (!attendee.agency.trim()) {
        attendeeErrors.agency = true;
        isValid = false;
      }
      if (!attendee.position.trim()) {
        attendeeErrors.position = true;
        isValid = false;
      }
      if (!attendee.attendance.trim()) {
        attendeeErrors.attendance = true;
        isValid = false;
      }
      if (!attendee.signature.trim()) {
        attendeeErrors.signature = true;
        isValid = false;
      }

      if (Object.keys(attendeeErrors).length > 0) {
        newErrors.attendees[attendee.id] = attendeeErrors;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (!validate()) {
      Alert.alert(
        "Error",
        "Please fill in all required fields highlighted in red."
      );
      return;
    }
    setSaving(true);
    submitAttendance()
      .catch((e) => {
        console.error("Failed to submit attendance", e);
        Alert.alert("Error", e?.message || "Failed to submit attendance");
      })
      .finally(() => setSaving(false));
  };

  const mapAttendanceStatus = (
    val: string
  ): "IN_PERSON" | "ONLINE" | "ABSENT" => {
    switch (val?.toLowerCase()) {
      case "in person":
      case "in-person":
      case "in_person":
        return "IN_PERSON";
      case "online":
        return "ONLINE";
      case "absent":
      default:
        return "ABSENT";
    }
  };

  const submitAttendance = async () => {
    const payload = {
      createdById: user?.id || undefined,
      fileName: fileName.trim(),
      title: title?.trim() || undefined,
      description: description?.trim() || undefined,
      // Send date-only (YYYY-MM-DD) without time
      meetingDate: meetingDate ? formatDateOnly(meetingDate) : undefined,
      location: location?.trim() || undefined,
      attachments:
        attachments.filter((a) => !!a.path).map((a) => a.path!) || undefined,
      attendees: attendees.map((a) => ({
        name: a.name.trim(),
        agency: a.agency?.trim() || undefined,
        office: a.agency?.trim() || undefined, // TODO: add separate Office field in UI
        position: a.position?.trim() || undefined,
        signatureUrl: a.signature?.trim() || undefined, // data URL for now; can be uploaded for a permanent URL
        attendanceStatus: mapAttendanceStatus(a.attendance),
      })),
    };

    const res = await apiPost<{ id: string }>("/attendance", payload);
    Alert.alert("Success", "Attendance record saved!", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <CustomHeader
        showSave={true}
        showFileName={true}
        fileName={fileName}
        onChangeFileName={setFileName}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={!isSigning}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create Attendance Record</Text>
          <Text style={styles.headerSubtitle}>
            Fill out attendance details below.
          </Text>
        </View>

        {/* File Name */}
        <View style={styles.topInputsContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>File Name</Text>
            <TextInput
              placeholder="Enter file name"
              value={fileName}
              onChangeText={handleSetFileName}
              style={[
                styles.input,
                fileName && styles.inputFilled,
                errors.fileName && styles.inputError,
              ]}
              placeholderTextColor="#C0C0C0"
            />
            {errors.fileName && (
              <Text style={styles.errorText}>File Name is required</Text>
            )}
          </View>

          {/* Title (optional) */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title (optional)</Text>
            <TextInput
              placeholder="Enter meeting title"
              value={title}
              onChangeText={setTitle}
              style={[styles.input, title && styles.inputFilled]}
              placeholderTextColor="#C0C0C0"
            />
          </View>

          {/* Description (optional) */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description (optional)</Text>
            <TextInput
              placeholder="Enter description"
              value={description}
              onChangeText={setDescription}
              style={[styles.input, description && styles.inputFilled]}
              placeholderTextColor="#C0C0C0"
              multiline
            />
          </View>

          {/* Meeting Date (optional) */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Meeting Date (optional)</Text>
            <TouchableOpacity
              onPress={() => setDatePickerVisibility(true)}
              style={[
                styles.input,
                meetingDate && styles.inputFilled,
                { justifyContent: "center" },
              ]}
              activeOpacity={0.8}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={[
                    styles.inputText,
                    { color: meetingDate ? theme.colors.text : "#C0C0C0" },
                  ]}
                >
                  {meetingDate
                    ? meetingDate.toLocaleDateString()
                    : "Select date"}
                </Text>
                <Feather
                  name="calendar"
                  size={18}
                  color={theme.colors.primaryDark}
                />
              </View>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              date={meetingDate ?? new Date()}
              onConfirm={handleConfirmDate}
              onCancel={() => setDatePickerVisibility(false)}
            />
          </View>

          {/* Location (optional) */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location (optional)</Text>
            <TextInput
              placeholder="Enter location"
              value={location}
              onChangeText={setLocation}
              style={[styles.input, location && styles.inputFilled]}
              placeholderTextColor="#C0C0C0"
            />
            <TouchableOpacity
              onPress={useCurrentLocation}
              disabled={isFetchingLocation}
              style={{
                marginTop: 8,
                alignSelf: "flex-start",
                flexDirection: "row",
                alignItems: "center",
              }}
              activeOpacity={0.8}
            >
              <Feather
                name="navigation"
                size={16}
                color={theme.colors.primaryDark}
              />
              <Text style={{ marginLeft: 6, color: theme.colors.primaryDark }}>
                {isFetchingLocation
                  ? "Getting current location..."
                  : "Use current location"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Attachments (optional) */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Attachments (optional)</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {attachments.map((att) => (
                <View key={att.uri} style={{ position: "relative" }}>
                  <Image
                    source={{ uri: att.uri }}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 8,
                      backgroundColor: "#eee",
                    }}
                  />
                  <View style={{ position: "absolute", top: -8, right: -8 }}>
                    <TouchableOpacity
                      onPress={() => removeAttachment(att.uri)}
                      style={{
                        backgroundColor: "#0008",
                        padding: 4,
                        borderRadius: 12,
                      }}
                    >
                      <Feather name="x" size={12} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  {att.uploading && (
                    <Text
                      style={{
                        fontSize: 12,
                        color: theme.colors.textLight,
                        marginTop: 4,
                      }}
                    >
                      Uploading…
                    </Text>
                  )}
                </View>
              ))}
            </View>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
              <TouchableOpacity
                onPress={pickImage}
                style={{
                  alignSelf: "flex-start",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  backgroundColor: theme.colors.primaryLight + "15",
                }}
              >
                <Feather
                  name="image"
                  size={16}
                  color={theme.colors.primaryDark}
                />
                <Text
                  style={{ marginLeft: 6, color: theme.colors.primaryDark }}
                >
                  Add image
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={takePhoto}
                style={{
                  alignSelf: "flex-start",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  backgroundColor: theme.colors.primaryLight + "15",
                }}
              >
                <Feather
                  name="camera"
                  size={16}
                  color={theme.colors.primaryDark}
                />
                <Text
                  style={{ marginLeft: 6, color: theme.colors.primaryDark }}
                >
                  Take photo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Attendees Section */}
        <View style={styles.section}>
          {attendees.map((attendee, index) => (
            <View key={attendee.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.sectionTitle}>Attendee {index + 1}</Text>
                {attendees.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeAttendee(attendee.id)}
                    style={styles.removeIconButton}
                  >
                    <Feather
                      name="trash-2"
                      size={16}
                      color={theme.colors.error}
                    />
                  </TouchableOpacity>
                )}
              </View>

              {/* Name */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  placeholder="Enter full name"
                  value={attendee.name}
                  onChangeText={(val) => updateField(attendee.id, "name", val)}
                  style={[
                    styles.input,
                    attendee.name && styles.inputFilled,
                    errors.attendees?.[attendee.id]?.name && styles.inputError,
                  ]}
                  placeholderTextColor="#C0C0C0"
                />
                {errors.attendees?.[attendee.id]?.name && (
                  <Text style={styles.errorText}>Name is required</Text>
                )}
              </View>

              {/* Agency */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Agency / Office</Text>
                <TextInput
                  placeholder="Enter agency or office"
                  value={attendee.agency}
                  onChangeText={(val) =>
                    updateField(attendee.id, "agency", val)
                  }
                  style={[
                    styles.input,
                    attendee.agency && styles.inputFilled,
                    errors.attendees?.[attendee.id]?.agency &&
                      styles.inputError,
                  ]}
                  placeholderTextColor="#C0C0C0"
                />
                {errors.attendees?.[attendee.id]?.agency && (
                  <Text style={styles.errorText}>
                    Agency/Office is required
                  </Text>
                )}
              </View>

              {/* Position */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Position</Text>
                <TextInput
                  placeholder="Enter position"
                  value={attendee.position}
                  onChangeText={(val) =>
                    updateField(attendee.id, "position", val)
                  }
                  style={[
                    styles.input,
                    attendee.position && styles.inputFilled,
                    errors.attendees?.[attendee.id]?.position &&
                      styles.inputError,
                  ]}
                  placeholderTextColor="#C0C0C0"
                />
                {errors.attendees?.[attendee.id]?.position && (
                  <Text style={styles.errorText}>Position is required</Text>
                )}
              </View>

              {/* Meeting Attendance */}
              <View style={styles.inputContainer}>
                <Text
                  style={[
                    styles.label,
                    errors.attendees?.[attendee.id]?.attendance &&
                      styles.labelError,
                  ]}
                >
                  Meeting Attendance
                </Text>
                <View style={styles.radioGroup}>
                  {["In Person", "Online", "Absent"].map((type, index, arr) => (
                    <RadioButton
                      key={type}
                      label={type}
                      value={type}
                      selectedValue={attendee.attendance}
                      onSelect={(val: string) =>
                        updateField(attendee.id, "attendance", val)
                      }
                      hasError={errors.attendees?.[attendee.id]?.attendance}
                      containerStyle={
                        index === arr.length - 1 ? { marginRight: 0 } : {}
                      }
                    />
                  ))}
                </View>
                {errors.attendees?.[attendee.id]?.attendance && (
                  <Text style={styles.errorText}>
                    Please select an attendance type
                  </Text>
                )}
              </View>

              {/* Signature */}
              <View style={styles.inputContainer}>
                <Text
                  style={[
                    styles.label,
                    errors.attendees?.[attendee.id]?.signature &&
                      styles.labelError,
                  ]}
                >
                  Signature
                </Text>
                <View style={styles.signatureWrapper}>
                  <View
                    style={[
                      styles.signatureContainer,
                      errors.attendees?.[attendee.id]?.signature &&
                        styles.inputError,
                    ]}
                  >
                    <SignatureScreen
                      ref={(ref) => {
                        if (ref) {
                          signatureRefs.current[attendee.id] = ref;
                        }
                      }}
                      webStyle={`.m-signature-pad { box-shadow: none; border: none; } 
                                 .m-signature-pad--body { border: none; }
                                 .m-signature-pad--footer { display: none; margin: 0px; }`}
                      onBegin={() => setIsSigning(true)}
                      onEnd={() => {
                        // Trigger signature capture so onOK receives the data URL
                        try {
                          signatureRefs.current[attendee.id]?.readSignature?.();
                        } catch {}
                        setIsSigning(false);
                      }}
                      onOK={(sig) => {
                        updateField(attendee.id, "signature", sig);
                        setIsSigning(false);
                      }}
                      onEmpty={() => {
                        updateField(attendee.id, "signature", "");
                        setIsSigning(false);
                      }}
                      autoClear={false}
                      backgroundColor="#fff"
                      penColor={"black"}
                    />
                  </View>
                </View>
                {errors.attendees?.[attendee.id]?.signature && (
                  <Text style={styles.errorText}>Signature is required</Text>
                )}

                <View style={styles.signatureActions}>
                  <TouchableOpacity
                    style={styles.sigActionButton}
                    onPress={() => handleClearSignature(attendee.id)}
                  >
                    <Feather
                      name="x"
                      size={16}
                      color={theme.colors.primaryDark}
                    />
                    <Text style={styles.sigActionText}>Clear</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Add Person Button */}
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={addAttendee}
            style={styles.actionButtonWrapper}
          >
            <Animated.View
              style={[
                styles.actionButton,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              <Feather name="plus" size={20} color={theme.colors.primaryDark} />
              <Text style={styles.actionButtonText}>Add Person</Text>
            </Animated.View>
          </TouchableOpacity>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, saving ? { opacity: 0.7 } : undefined]}
            onPress={handleSave}
            disabled={saving}
          >
            <Feather name="save" size={20} color="#fff" />
            <Text style={styles.saveButtonText}>
              {saving ? "Saving…" : "Save Attendance"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
