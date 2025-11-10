import React, { useState, useRef, useEffect } from "react";
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
  Modal,
  ActivityIndicator,
} from "react-native";
import SignatureScreen from "react-native-signature-canvas";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Location from "expo-location";
import { Feather } from "@expo/vector-icons";
import { theme } from "../../theme/theme";
import { createAttendanceStyles as styles } from "./styles/createAttendanceScreen";
import { CustomHeader } from "../../components/CustomHeader";
import { apiPost, apiGet, apiPatch } from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";
import * as ImagePicker from "expo-image-picker";
import {
  uploadFileFromUri,
  uploadSignature,
  createSignedDownloadUrl,
} from "../../lib/storage";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as FileSystem from "expo-file-system/legacy";

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

export default function CreateAttendanceScreen({ navigation, route }: any) {
  const { user } = useAuth();
  const attendanceId = route?.params?.attendanceId;
  const isEditMode = !!attendanceId;

  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [meetingDate, setMeetingDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [location, setLocation] = useState("");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [attendees, setAttendees] = useState([
    {
      id: 1,
      name: "",
      agency: "",
      position: "",
      attendance: "",
      signatureUrl: "",
      signaturePath: "",
    },
  ]);

  const [signatureModalVisible, setSignatureModalVisible] = useState(false);
  const [currentAttendeeId, setCurrentAttendeeId] = useState<number | null>(
    null
  );
  const [uploadingSignature, setUploadingSignature] = useState(false);
  const [newlyUploadedPaths, setNewlyUploadedPaths] = useState<string[]>([]);

  const [isSigning, setIsSigning] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const signatureCanvasRef = useRef<any>(null);
  const [scaleAnim] = useState(new Animated.Value(1));

  // Load existing attendance record if in edit mode
  useEffect(() => {
    if (isEditMode && attendanceId) {
      loadAttendanceRecord();
    }
  }, [attendanceId, isEditMode]);

  const loadAttendanceRecord = async () => {
    try {
      setLoading(true);
      const record = await apiGet<any>(`/attendance/${attendanceId}`);

      // Populate fields
      setFileName(record.fileName || "");
      setTitle(record.title || "");
      setDescription(record.description || "");
      setLocation(record.location || "");

      if (record.meetingDate) {
        setMeetingDate(new Date(record.meetingDate));
      }

      // Parse attendees
      if (record.attendees) {
        const parsedAttendees = Array.isArray(record.attendees)
          ? record.attendees
          : JSON.parse(record.attendees);

        // Load attendees with signed URLs for signatures
        const attendeesWithSignedUrls = await Promise.all(
          parsedAttendees.map(async (att: any, index: number) => {
            // Map attendanceStatus to the radio button values
            let attendance = "Absent";
            if (att.attendanceStatus === "IN_PERSON") {
              attendance = "In Person";
            } else if (att.attendanceStatus === "ONLINE") {
              attendance = "Online";
            }

            // Get signed URL for signature if it exists
            let signatureUrl = "";
            const signaturePath = att.signatureUrl || "";
            if (signaturePath) {
              try {
                const { url } = await createSignedDownloadUrl(
                  signaturePath,
                  60
                );
                signatureUrl = url;
              } catch (error) {
                console.log("Failed to load signature URL:", error);
              }
            }

            return {
              id: index + 1,
              name: att.name || "",
              agency: att.agency || "",
              position: att.position || "",
              attendance: attendance,
              signatureUrl: signatureUrl,
              signaturePath: signaturePath,
            };
          })
        );

        setAttendees(attendeesWithSignedUrls);
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        "Failed to load attendance record: " +
          (error.message || "Unknown error")
      );
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

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
        signatureUrl: "",
        signaturePath: "",
      },
    ]);
  };

  const removeAttendee = (id: number) => {
    setAttendees(attendees.filter((a) => a.id !== id));
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

  // --- Signature Handlers ---
  const handleAddSignature = (id: number) => {
    setCurrentAttendeeId(id);
    setSignatureModalVisible(true);
  };

  const handleSignatureOK = async (signature: string) => {
    if (currentAttendeeId === null) return;

    try {
      setUploadingSignature(true);
      const base64Data = signature.replace(/^data:image\/\w+;base64,/, "");
      const tempFilePath = `${
        FileSystem.cacheDirectory
      }temp-signature-${Date.now()}.png`;

      await FileSystem.writeAsStringAsync(tempFilePath, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const manipulatedImage = await manipulateAsync(
        tempFilePath,
        [{ resize: { width: 400 } }],
        { compress: 0.5, format: SaveFormat.PNG }
      );

      const { path } = await uploadSignature(manipulatedImage.uri);

      // Get a signed URL for immediate preview
      const { url } = await createSignedDownloadUrl(path, 60);

      // Track the newly uploaded path for potential cleanup
      setNewlyUploadedPaths((prev) => [...prev, path]);

      // Update the attendee with the signature path for submission and the URL for preview
      const currentId = currentAttendeeId;
      setAttendees((prev) =>
        prev.map((a) =>
          a.id === currentId
            ? { ...a, signatureUrl: url, signaturePath: path }
            : a
        )
      );

      await FileSystem.deleteAsync(tempFilePath, { idempotent: true });

      setSignatureModalVisible(false);
      setCurrentAttendeeId(null);
      Alert.alert("Success", "Signature added successfully.");
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to upload signature.");
    } finally {
      setUploadingSignature(false);
    }
  };

  const handleRemoveSignature = async (id: number) => {
    const attendee = attendees.find((a) => a.id === id);
    const signaturePath =
      (attendee as any)?.signaturePath || attendee?.signatureUrl;

    if (signaturePath) {
      try {
        // Delete from storage bucket
        await apiPost("/storage/delete-files", {
          paths: [signaturePath],
        });

        // If the signature being removed was just uploaded, untrack it
        setNewlyUploadedPaths((prev) =>
          prev.filter((p) => p !== signaturePath)
        );
      } catch (error) {
        console.error("Failed to delete signature from storage:", error);
        // Continue with removal even if deletion fails
      }
    }

    updateField(id, "signatureUrl", "");
    updateField(id, "signaturePath", "");
  };

  const handleSignatureClear = () => {
    signatureCanvasRef.current?.clearSignature();
  };

  const handleSignatureEnd = () => {
    signatureCanvasRef.current?.readSignature();
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
      if (
        attendee.attendance.toLowerCase() !== "absent" &&
        !attendee.signatureUrl?.trim()
      ) {
        attendeeErrors.signatureUrl = true;
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

  React.useEffect(() => {
    const handleBeforeRemove = (e: any) => {
      if (newlyUploadedPaths.length === 0 || saving) {
        return;
      }

      e.preventDefault();

      Alert.alert(
        "Discard Changes?",
        "You have unsaved uploads. Are you sure you want to leave and discard them?",
        [
          { text: "Don't Leave", style: "cancel", onPress: () => {} },
          {
            text: "Discard",
            style: "destructive",
            onPress: async () => {
              try {
                await apiPost("/storage/delete-files", {
                  paths: newlyUploadedPaths,
                });
              } catch (error) {
                console.error("Failed to delete orphaned files:", error);
              }
              navigation.dispatch(e.data.action);
            },
          },
        ]
      );
    };

    navigation.addListener("beforeRemove", handleBeforeRemove);

    return () => {
      navigation.removeListener("beforeRemove", handleBeforeRemove);
    };
  }, [navigation, newlyUploadedPaths, saving]);

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
      attendees: attendees.map((a) => ({
        name: a.name.trim(),
        agency: a.agency?.trim() || undefined,
        office: a.agency?.trim() || undefined,
        position: a.position?.trim() || undefined,
        signatureUrl:
          (a as any).signaturePath?.trim() ||
          a.signatureUrl?.trim() ||
          undefined,
        attendanceStatus: mapAttendanceStatus(a.attendance),
      })),
    };

    if (isEditMode && attendanceId) {
      // Update existing record
      await apiPatch(`/attendance/${attendanceId}`, payload);
      setNewlyUploadedPaths([]);
      Alert.alert("Success", "Attendance record updated!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } else {
      // Create new record
      const res = await apiPost<{ id: string }>("/attendance", payload);
      setNewlyUploadedPaths([]);
      Alert.alert("Success", "Attendance record saved!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <CustomHeader showSave={false} />
        <View
          style={[
            styles.scrollContent,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <ActivityIndicator size="large" color={theme.colors.primaryDark} />
          <Text style={[styles.headerSubtitle, { marginTop: 16 }]}>
            Loading attendance record...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.headerTitle}>
            {isEditMode ? "Edit Attendance Record" : "Create Attendance Record"}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isEditMode
              ? "Update attendance details below."
              : "Fill out attendance details below."}
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
                    errors.attendees?.[attendee.id]?.signatureUrl &&
                      styles.labelError,
                  ]}
                >
                  Signature
                </Text>
                {attendee.signatureUrl ? (
                  <View style={styles.signaturePreviewContainer}>
                    <Image
                      source={{ uri: attendee.signatureUrl }}
                      style={styles.signaturePreview}
                      resizeMode="contain"
                    />
                    <TouchableOpacity
                      style={styles.removeSignatureButton}
                      onPress={() => handleRemoveSignature(attendee.id)}
                    >
                      <Feather name="x" size={16} color={theme.colors.error} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.addSignatureButton}
                    onPress={() => handleAddSignature(attendee.id)}
                  >
                    <Feather
                      name="edit-3"
                      size={18}
                      color={theme.colors.primaryDark}
                    />
                    <Text style={styles.addSignatureText}>Add Signature</Text>
                  </TouchableOpacity>
                )}
                {errors.attendees?.[attendee.id]?.signatureUrl && (
                  <Text style={styles.errorText}>Signature is required</Text>
                )}
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

      {/* Signature Modal */}
<Modal
  visible={signatureModalVisible}
  animationType="slide"
  transparent={false}
  onRequestClose={() => setSignatureModalVisible(false)}
>
  <SafeAreaView style={styles.signatureModalContainer}>
    <View style={styles.signatureModalHeader}>
      <Text style={styles.signatureModalTitle}>Add Signature</Text>
      <TouchableOpacity onPress={() => setSignatureModalVisible(false)}>
        <Feather name="x" size={24} color={theme.colors.primaryDark} />
      </TouchableOpacity>
    </View>

    {/* Canvas */}
    <View style={styles.signatureModalCanvas}>
      <SignatureScreen
        ref={signatureCanvasRef}
        onOK={handleSignatureOK}
        onEmpty={() => Alert.alert("Error", "Please draw a signature")}
        descriptionText="Sign above"
        clearText="Clear"
        confirmText="Save"
        style={{ flex: 1, width: "100%" }}
        webStyle={`
          .m-signature-pad {
            box-shadow: none;
            border: 2px solid ${theme.colors.border};
            border-radius: ${theme.radii.md}px; /* 12px */
            height: 100%;
          }
          .m-signature-pad--body { height: 100%; }
          .m-signature-pad--body canvas {
            width: 100% !important;
            height: 100% !important;
          }
          .m-signature-pad--footer { display: none; }
        `}
      />
    </View>

    {/* --- NEW CLEAR BUTTON --- */}
    <View style={styles.clearButtonContainer}>
      <TouchableOpacity
        style={styles.clearButton}
        onPress={handleSignatureClear}
      >
        <Feather name="trash-2" size={18} color={theme.colors.primaryDark} />
        <Text style={styles.clearButtonText}>Clear</Text>
      </TouchableOpacity>
    </View>

    {/* Footer with only Cancel and Save */}
    <View style={styles.signatureModalFooter}>
      <View style={styles.signatureModalButtons}>
        <TouchableOpacity
          style={[
            styles.signatureModalButton,
            styles.signatureModalCancelButton,
          ]}
          onPress={() => setSignatureModalVisible(false)}
          disabled={uploadingSignature}
        >
          <Text style={styles.signatureModalButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.signatureModalButton,
            styles.signatureModalSaveButton,
          ]}
          onPress={handleSignatureEnd}
          disabled={uploadingSignature}
        >
          {uploadingSignature ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text
              style={[
                styles.signatureModalButtonText,
                styles.signatureModalSaveText,
              ]}
            >
              Save
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  </SafeAreaView>
</Modal>
    </SafeAreaView>
  );
}
