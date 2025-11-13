import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import {
  BaseCondition,
  StoredState,
  ChoiceKey,
  CondID,
} from "./types/eccMonitoring";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../theme/theme";
import { CustomHeader } from "../../components/CustomHeader";
import { ECCMonitoringSection } from "../ecc/components/monitoringSection";
import { styles } from "../ecc/styles/eccStyles"; // reuse styles from both screens
import { scale, verticalScale, moderateScale } from "../../utils/responsive";
// import {clearAppStorage} from "conditions.tsx"
import * as FileSystem from "expo-file-system/legacy"; // Correct
import * as Sharing from "expo-sharing";
import { useEccStore } from "../../store/eccStore.js";
import { useAuth } from "../../contexts/AuthContext";
import { useEccDraftStore } from "../../store/eccDraftStore";
import * as Location from "expo-location";
import { supabase } from "../../lib/supabase";

export default function ECCMonitoringScreen({ navigation, route }: any) {
  const { id } = route.params || {};
  const { saveDraft, updateDraft } = useEccDraftStore();
  const { user, session } = useAuth();
  const token = session?.access_token;

  const { selectedReport, isLoading, clearSelectedReport } = useEccStore(
    (state) => state
  );

  const { addReport, createAndDownloadReport } = useEccStore();
  // navigation is available via props; ensure its type
  // *** Make sure your import looks like this in your file: ***
  // import * as FileSystem from 'expo-file-system/legacy';
  // import * as Sharing from 'expo-sharing';

  const loadMonitoringData = (report: any) => {
    if (!report) return;

    // console.log("report"+report)
    // General Info
    setFileName(report.filename || "");
    setCompanyName(report.generalInfo?.companyName || "");
    setStatus(report.generalInfo?.status || null);
    setDate(
      report.generalInfo?.date ? new Date(report.generalInfo.date) : null
    );

    // MMT Info
    setContactPerson(report.mmtInfo?.contactPerson || "");
    setMmtPosition(report.mmtInfo?.position || "");
    setMailingAddress(report.mmtInfo?.mailingAddress || "");
    setTelNo(report.mmtInfo?.telNo || "");
    setFaxNo(report.mmtInfo?.faxNo || "");
    setEmailAddress(report.mmtInfo?.emailAddress || "");

    // Permit Holders
    setPermitHolders(report.permit_holders || []);
    // console.log("permit holdersasadasdasdasdasdas",permit_holders)
    // Recommendations
    // Ensure recommendations is an array of strings, defaulting to [""]
    setRecommendations(report.recommendations || [""]);
  };
  const handleGenerateAndDownload = async (
    reportData: any,
    // Accept an optional function to update the loading state
    onLoadingChange: (isLoading: boolean) => void = () => {}
  ) => {
    // 1. Initiate the report creation and download.
    // Pass the loading callback down to the API function (createAndDownloadReport)
    const result = await createAndDownloadReport(reportData, token);

    if (result.success && result.fileBlob) {
      const { fileBlob, filename } = result;

      // **NOTE:** createAndDownloadReport has already set loading to false
      // when the Blob was received. We re-enable it for the heavy file-writing phase.
      onLoadingChange(true);

      // 1. Convert the Blob (from fetch) to a Base64 string
      const reader = new FileReader();
      reader.readAsDataURL(fileBlob);

      reader.onloadend = async () => {
        const base64data = (reader.result as string).split(",")[1];

        // 2. Define the local URI path
        const fileUri = FileSystem.documentDirectory + filename;

        try {
          // 3. Write the Base64 data to a local file
          await FileSystem.writeAsStringAsync(fileUri, base64data, {
            encoding: "base64",
          });

          // 4. Share the file
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri, {
              mimeType:
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });
          } else {
            alert(`File saved to ${fileUri}`);
          }

          // Stop loading after success
          onLoadingChange(false);
        } catch (e) {
          console.error("File system error:", e);
          alert("Failed to save or share the file.");

          // Stop loading after error
          onLoadingChange(false);
        }
      };
      reader.onerror = (e) => {
        console.error("FileReader error:", e);
        alert("File reading failed.");
        onLoadingChange(false);
      };
    } else if (result.error) {
      alert(`Error: ${result.error}`);
      // Loading state is handled by createAndDownloadReport in this error path
    }
  };

  const getMonitoringData = () => {
    const permit_holder_with_conditions = { permit_holders };

    return {
      filename,
      generalInfo: {
        companyName,
        status,
        date: date ? date.toISOString() : null,
      },
      mmtInfo: {
        contactPerson,
        position: mmtPosition,
        mailingAddress,
        telNo,
        faxNo,
        emailAddress,
      },
      permit_holders,

      topass: {
        filename,
        generalInfo: {
          companyName,
          status,
          date: date ? date.toISOString() : null,
        },
        mmtInfo: {
          contactPerson,
          position: mmtPosition,
          mailingAddress,
          telNo,
          faxNo,
          emailAddress,
        },
        permit_holder_with_conditions,
        conditions: permit_holders
          .map((holder) => holder.monitoringState.formatted)
          .filter(Boolean)
          .flatMap((formattedData) => formattedData.conditions || []),

        permit_holders: permit_holders.map(
          (holder) =>
            `${holder.name || "Unnamed"}– (${holder.type || "Unknown"}Permit Holder)`
        ),
        remarks_list: permit_holders.reduce((acc, holder, index) => {
          // Determine the remarks format
          const remarks = Array.isArray(holder.remarks)
            ? holder.remarks
            : holder.remarks
              ? [holder.remarks]
              : ["No remarks"];

          // Assign the array of remarks to a key named after the index
          acc[index.toString()] = remarks;

          // Return the accumulating object for the next iteration
          return acc;
        }, {}), // <-- Start with an empty object {}
        recommendations,
        createdById: user?.email,
      },

      recommendations,
    };
  };

  // === General Information ===
  //field for filename
  const [filename, setFileName] = useState("");
  //fields for general info
  const [date, setDate] = useState<Date | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [permit_holders, setPermitHolders] = useState<any[]>([]);
  const [status, setStatus] = useState<"Active" | "Inactive" | null>(null);

  //MMT fields

  const [contactPerson, setContactPerson] = useState<string>("");
  const [mmtPosition, setMmtPosition] = useState<string>(""); // Renamed from 'position' to avoid conflict if needed
  const [mailingAddress, setMailingAddress] = useState<string>("");
  const [telNo, setTelNo] = useState<string>("");
  const [faxNo, setFaxNo] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  // Location state
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [location, setLocation] = useState<string>("");
  // Auto-populate state
  const [isAutoPopulating, setIsAutoPopulating] = useState(false);

  useEffect(() => {
    if (selectedReport) {
      loadMonitoringData(selectedReport);
    }
  }, [selectedReport]);

  const onChangeDate = (_event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date || new Date();
    if (Platform.OS === "android") setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleConfirmDate = (selectedDate: Date) => {
    setDate(selectedDate || date || new Date());
    setShowDatePicker(false);
  };

  // === Multipartite Monitoring Team ===
  const teamFields = [
    "Contact Person",
    "Position",
    "Mailing Address",
    "Telephone No.",
    "Fax No.",
    "Email Address",
  ];

  // === Permit Holders ===
  const [showPermitDatePicker, setShowPermitDatePicker] = useState<{
    id: string | null;
    show: boolean;
  }>({ id: null, show: false });

  const addPermitHolder = (type: "ECC" | "ISAG") => {
    const id = `${type}-${Date.now()}`;
    const newHolder = {
      id,
      type,
      name: "",
      permitNumber: "",
      issuanceDate: null,
      monitoringState: { edits: {}, customs: [], selections: {} },
      remarks: [""],
    };
    setPermitHolders((p) => [...p, newHolder]);
  };

  const removePermitHolder = (id: string) => {
    Alert.alert(
      "Remove Permit Holder",
      "Delete this permit holder and its monitoring data?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            setPermitHolders((p) => p.filter((ph) => ph.id !== id)),
        },
      ]
    );
  };

  // === Recommendations ===
  const [recommendations, setRecommendations] = useState<string[]>([""]);

  const handleAddRecommendation = () => {
    setRecommendations((prev) => [...prev, ""]);
  };

  const handleRecommendationChange = (index: number, text: string) => {
    setRecommendations((prev) => {
      const updated = [...prev];
      updated[index] = text;
      return updated;
    });
  };

  const saveToDraft = async () => {
    // console.log("Save button clicked, starting draft save process.");

    // --- START of Local Error Handling ---
    try {
      const draftData = getMonitoringData();
      let result = null;
      if (id !== undefined) {
        // If 'id' exists, update the existing draft.
        result = await updateDraft(id, draftData);
      } else {
        // If 'id' is empty/new, save a new draft.
        result = await saveDraft(draftData);
      }

      console.log("MONITORING DATAs:", id, "save result:", result);

      // Defensive checks for the result shape
      if (!result || typeof result !== "object") {
        console.error("Unexpected saveDraft/updateDraft return value:", result);
        alert(
          "Failed to save draft (unexpected response). See console for details."
        );
        return;
      }

      if (result.success) {
        Alert.alert("Draft saved", "Your ECC draft was saved locally.", [
          { text: "OK", onPress: () => navigation.navigate("ECCDraftScreen") },
        ]);
      } else {
        // If updateDraft failed because the draft was not found (e.g., route id
        // pointed to a non-local report), fallback to creating a new draft.
        const errMsg = result.error || "Failed to save draft.";
        console.warn("Draft save failed:", result);

        if (
          result.error === "Draft not found" ||
          result.error === "No drafts stored"
        ) {
          // Attempt to create a new draft instead
          try {
            const createResult = await saveDraft(draftData);
            if (createResult && createResult.success) {
              Alert.alert("Draft saved", "Your ECC draft was saved.", [
                { text: "OK" },
              ]);
              return;
            }
            const createErr =
              (createResult && createResult.error) || "Failed to save draft.";
            Alert.alert("Save failed", createErr);
          } catch (e) {
            console.error("Fallback saveDraft failed", e);
            Alert.alert(
              "Save failed",
              "Unable to save draft. See console for details."
            );
          }
        } else {
          Alert.alert("Save failed", errMsg);
        }
      }
    } catch (error) {
      // 🚨 This will catch the crash from getMonitoringData() or any sync error
      console.error("Critical synchronous error in saveToDraft:", error);
      alert(" Failed to prepare data for draft. See console for details.");
    }
    // --- END of Local Error Handling ---
  };

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

  const autoPopulate = async () => {
    if (!user) {
      Alert.alert(
        "Not signed in",
        "No user is signed in to populate data from."
      );
      return;
    }

    setIsAutoPopulating(true);
    try {
      // Always try to fetch the latest profile row first (this ensures updated profile changes are reflected immediately)
      let profileData: any = null;
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select(
            "first_name,last_name,full_name,mailing_address,phone_number,fax,position,email"
          )
          .eq("id", user.id)
          .single();
        if (!error && data) profileData = data;
      } catch (e) {
        // ignore and fall back to metadata
        console.warn("Failed to fetch profile row for auto-populate", e);
      }

      const meta = (user as any).user_metadata || {};

      if (profileData) {
        setContactPerson(
          profileData.full_name ||
            [profileData.first_name, profileData.last_name]
              .filter(Boolean)
              .join(" ") ||
            user.email?.split("@")[0] ||
            ""
        );
        setMmtPosition(profileData.position || "");
        setMailingAddress(profileData.mailing_address || "");
        setTelNo(profileData.phone_number || "");
        setFaxNo(profileData.fax || "");
        setEmailAddress(profileData.email || user.email || "");
        return;
      }

      // Fallback to metadata if profile row not available
      const fullName =
        meta.full_name ||
        [meta.first_name, meta.last_name].filter(Boolean).join(" ");
      setContactPerson(fullName || user.email?.split("@")[0] || "");
      setMmtPosition(meta.position || "");
      setMailingAddress(meta.mailing_address || "");
      setTelNo(meta.phone_number || "");
      setFaxNo(meta.fax || "");
      setEmailAddress(user.email || "");
    } catch (err) {
      console.warn("Auto-populate failed", err);
      Alert.alert("Auto-populate error", "Could not fetch profile data.");
    } finally {
      setIsAutoPopulating(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <CustomHeader
        onSave={saveToDraft}
        showSave={true}
        saveDisabled={false}
        showFileName={true}
        fileName={filename}
        onChangeFileName={setFileName}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* === Header === */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ECC Monitoring Report</Text>
          <Text style={styles.headerSubtitle}>
            Fill out details, add permit holders, and recommendations
          </Text>
        </View>

        {/* === File Information === */}
        <View style={styles.fileInfoSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>File Name</Text>
            <TextInput
              placeholder="Enter file name"
              value={filename} // synced with header
              onChangeText={setFileName}
              style={styles.input}
            />
          </View>
        </View>

        {/* === General Information === */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General Information</Text>
          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Company Name</Text>
              <TextInput
                placeholder="Enter company name"
                placeholderTextColor="#C0C0C0"
                style={styles.input}
                value={companyName}
                onChangeText={setCompanyName}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                placeholder="Enter location"
                placeholderTextColor="#C0C0C0"
                style={styles.input}
                value={location}
                onChangeText={setLocation}
              />
            </View>
            <TouchableOpacity
              onPress={useCurrentLocation}
              disabled={isFetchingLocation}
              style={{
                marginBottom: 12,
                alignSelf: "flex-end",
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
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.radioGroup}>
                {(["Active", "Inactive"] as const).map((item) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => setStatus(item)}
                    style={styles.radioButtonContainer}
                  >
                    <View
                      style={[
                        styles.radioButton,
                        status === item && styles.radioButtonSelected,
                      ]}
                    >
                      {status === item && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                    <Text style={styles.radioButtonLabel}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Date Picker */}
            <View style={[styles.inputContainer, { marginBottom: 0 }]}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons
                  name="calendar-outline"
                  size={moderateScale(20)}
                  color={theme.colors.primaryDark}
                />
                <Text style={styles.dateText}>
                  {date ? date.toLocaleDateString() : "Select Date"}
                </Text>
              </TouchableOpacity>

              {/* Use modal date picker for both platforms for a consistent pop-up UX */}
              <DateTimePickerModal
                isVisible={showDatePicker}
                mode="date"
                date={date || new Date()}
                onConfirm={handleConfirmDate}
                onCancel={() => setShowDatePicker(false)}
                display={Platform.OS === "ios" ? "spinner" : "default"}
              />
            </View>
          </View>
        </View>

        {/* === Multipartite Monitoring Team === */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Multipartite Monitoring Team</Text>
          <View style={styles.card}>
            {teamFields.map((label, index) => {
              // 1. Determine the current value and setter for the field
              let value: string;
              let setter: (text: string) => void;

              switch (label) {
                case "Contact Person":
                  value = contactPerson;
                  setter = setContactPerson;
                  break;
                case "Position":
                  value = mmtPosition;
                  setter = setMmtPosition;
                  break;
                case "Mailing Address":
                  value = mailingAddress;
                  setter = setMailingAddress;
                  break;
                case "Telephone No.":
                  value = telNo;
                  setter = setTelNo;
                  break;
                case "Fax No.":
                  value = faxNo;
                  setter = setFaxNo;
                  break;
                case "Email Address":
                  value = emailAddress;
                  setter = setEmailAddress;
                  break;
                default:
                  // Fallback to ensure 'value' and 'setter' are always defined
                  value = "";
                  setter = () => {};
              }

              return (
                <View
                  key={index}
                  style={[
                    styles.inputContainer,
                    index === teamFields.length - 1 && { marginBottom: 0 },
                  ]}
                >
                  <Text style={styles.label}>{label}</Text>
                  <TextInput
                    placeholder={`Enter ${label.toLowerCase()}`}
                    placeholderTextColor="#C0C0C0"
                    style={styles.input}
                    // 👇 STATE BINDING: Use the determined value and setter
                    value={value}
                    onChangeText={setter}
                  />
                  {label === "Email Address" && (
                    <TouchableOpacity
                      style={styles.autoPopulateButton}
                      onPress={autoPopulate}
                      disabled={isAutoPopulating}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={isAutoPopulating ? "refresh" : "sync"}
                        size={16}
                        color={theme.colors.primaryDark}
                      />
                      <Text style={styles.autoPopulateText}>
                        {isAutoPopulating
                          ? "Populating..."
                          : "Auto-populate with your saved info"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* === Permit Holders === */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permit Holders</Text>
          {permit_holders.map((holder, idx) => {
            const toDisplay = (holder?.monitoringState ??
              []) as BaseCondition[];

            const issuanceDateDisplay = holder.issuanceDate
              ? new Date(holder.issuanceDate).toLocaleDateString()
              : null;

            return (
              <View key={holder.id} style={styles.card}>
                {/* Header */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: verticalScale(8),
                  }}
                >
                  <Text style={styles.permitTitle}>
                    {holder.type} Permit #{idx + 1}
                  </Text>
                  <TouchableOpacity
                    onPress={() => removePermitHolder(holder.id)}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={moderateScale(18)}
                      color={theme.colors.error}
                    />
                  </TouchableOpacity>
                </View>

                {/* Holder Info */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    placeholder="Enter name"
                    placeholderTextColor="#C0C0C0"
                    style={styles.input}
                    value={holder.name}
                    onChangeText={(t) =>
                      setPermitHolders((p) =>
                        p.map((h) =>
                          h.id === holder.id ? { ...h, name: t } : h
                        )
                      )
                    }
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Permit Number</Text>
                  <TextInput
                    placeholder="Enter permit number"
                    placeholderTextColor="#C0C0C0"
                    style={styles.input}
                    value={holder.permitNumber}
                    onChangeText={(t) =>
                      setPermitHolders((p) =>
                        p.map((h) =>
                          h.id === holder.id ? { ...h, permitNumber: t } : h
                        )
                      )
                    }
                  />
                </View>

                {/* Date of Issuance */}
                <View style={[styles.inputContainer, { marginBottom: 0 }]}>
                  <Text style={styles.label}>Date of Issuance</Text>
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() =>
                      setShowPermitDatePicker({ id: holder.id, show: true })
                    }
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={moderateScale(20)}
                      color={theme.colors.primaryDark}
                    />
                    <Text style={styles.dateText}>
                      {issuanceDateDisplay ?? "Select Date of Issuance"}
                    </Text>
                  </TouchableOpacity>

                  {/* date picker uses centralized modal (rendered after list) */}
                </View>

                {/* Monitoring Section */}

                <ECCMonitoringSection
                  initialState={holder.monitoringState}
                  toDisplay={toDisplay}
                  onChange={(s) =>
                    setPermitHolders((p) =>
                      p.map((h, index) => {
                        if (h.id === holder.id) {
                          // ensure all conditions inside this holder get the same section number
                          const section = index + 1;
                          return {
                            ...h,
                            monitoringState: {
                              ...s,
                              formatted: {
                                ...s.formatted,
                                conditions:
                                  s.formatted?.conditions?.map((cond) => ({
                                    ...cond,
                                    section,
                                  })) || [],
                              },
                            },
                          };
                        }
                        return h;
                      })
                    )
                  }
                />

                {/* Remarks */}
                <View>
                  <Text style={styles.permitTitle}>Remarks</Text>
                  {(holder.remarks ?? [""]).map(
                    (remark: string, rIdx: number) => (
                      <View
                        key={rIdx}
                        style={{
                          flexDirection: "row",
                          alignItems: "flex-start",
                          marginBottom: verticalScale(12),
                        }}
                      >
                        <View style={{ flex: 1 }}>
                          <Text
                            style={[
                              styles.label,
                              {
                                marginTop: verticalScale(8),
                                marginBottom: verticalScale(6),
                              },
                            ]}
                          >
                            Remark {rIdx + 1}
                          </Text>
                          <TextInput
                            placeholder="Enter remark"
                            placeholderTextColor="#C0C0C0"
                            style={styles.input}
                            multiline
                            value={remark}
                            onChangeText={(text) => {
                              setPermitHolders((p) =>
                                p.map((h) => {
                                  if (h.id === holder.id) {
                                    const updatedRemarks: string[] = [
                                      ...(h.remarks ?? [""]),
                                    ];
                                    updatedRemarks[rIdx] = text;
                                    return { ...h, remarks: updatedRemarks };
                                  }
                                  return h;
                                })
                              );
                            }}
                          />
                        </View>

                        {rIdx > 0 && (
                          <TouchableOpacity
                            onPress={() => {
                              setPermitHolders((p) =>
                                p.map((h) => {
                                  if (h.id === holder.id) {
                                    const updatedRemarks: string[] = [
                                      ...(h.remarks ?? []),
                                    ];
                                    updatedRemarks.splice(rIdx, 1);
                                    return { ...h, remarks: updatedRemarks };
                                  }
                                  return h;
                                })
                              );
                            }}
                            style={styles.remarkDeleteButton}
                          >
                            <Ionicons
                              name="trash-outline"
                              size={moderateScale(20)}
                              color={theme.colors.error}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    )
                  )}

                  <TouchableOpacity
                    style={[styles.addBtn, { marginTop: verticalScale(6) }]}
                    onPress={() => {
                      setPermitHolders((p) =>
                        p.map((h) =>
                          h.id === holder.id
                            ? { ...h, remarks: [...(h.remarks || [""]), ""] }
                            : h
                        )
                      );
                    }}
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={moderateScale(18)}
                      color={theme.colors.primaryDark}
                    />
                    <Text style={styles.addText}>Add new remark</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          {/* Add buttons here so they're below the list of permit holders */}
          <View
            style={[styles.permitSection, { marginTop: verticalScale(20) }]}
          >
            <View style={styles.permitButtonRow}>
              <TouchableOpacity
                style={styles.permitButton}
                onPress={() => addPermitHolder("ECC")}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={moderateScale(18)}
                  color="#fff"
                />
                <Text style={styles.permitButtonText}>
                  Add ECC Permit Holder
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.permitButton}
                onPress={() => addPermitHolder("ISAG")}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={moderateScale(18)}
                  color="#fff"
                />
                <Text style={styles.permitButtonText}>
                  Add ISAG Permit Holder
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Centralized Date Picker Modal for permit issuance (both platforms) */}
          {showPermitDatePicker.show && (
            <DateTimePickerModal
              isVisible={showPermitDatePicker.show}
              mode="date"
              date={
                permit_holders.find((h) => h.id === showPermitDatePicker.id)
                  ?.issuanceDate
                  ? new Date(
                      permit_holders.find(
                        (h) => h.id === showPermitDatePicker.id
                      )!.issuanceDate
                    )
                  : new Date()
              }
              onConfirm={(d) => {
                setShowPermitDatePicker({ id: null, show: false });
                if (d) {
                  setPermitHolders((p) =>
                    p.map((h) =>
                      h.id === showPermitDatePicker.id
                        ? { ...h, issuanceDate: d.toISOString() }
                        : h
                    )
                  );
                }
              }}
              onCancel={() => setShowPermitDatePicker({ id: null, show: false })}
              display={Platform.OS === "ios" ? "spinner" : "default"}
            />
          )}
        </View>

        {/* === Recommendations === */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          <View style={styles.card}>
            {(recommendations ?? [""]).map((rec: string, rIdx: number) => (
              <View
                key={rIdx}
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginBottom: verticalScale(12),
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.label,
                      {
                        marginTop: verticalScale(8),
                        marginBottom: verticalScale(6),
                      },
                    ]}
                  >
                    Recommendation {rIdx + 1}
                  </Text>
                  <TextInput
                    placeholder="Enter recommendation"
                    placeholderTextColor="#C0C0C0"
                    style={styles.input}
                    multiline
                    value={rec}
                    onChangeText={(text) =>
                      handleRecommendationChange(rIdx, text)
                    }
                  />
                </View>

                {rIdx > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setRecommendations((prev) => {
                        const updated = [...prev];
                        updated.splice(rIdx, 1);
                        return updated;
                      });
                    }}
                    style={styles.remarkDeleteButton} // reuse the same trash style
                  >
                    <Ionicons
                      name="trash-outline"
                      size={moderateScale(20)}
                      color={theme.colors.error}
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            <TouchableOpacity
              style={[styles.addBtn, { marginTop: verticalScale(6) }]}
              onPress={() => setRecommendations((prev) => [...prev, ""])}
            >
              <Ionicons
                name="add-circle-outline"
                size={moderateScale(18)}
                color={theme.colors.primaryDark}
              />
              <Text style={styles.addText}>Add new recommendation</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* === Generate ECC Compliance Monitoring Report Button === */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => handleGenerateAndDownload(getMonitoringData().topass)} // ✅ correct
        >
          <Text style={styles.saveButtonText}>Generate ECC Report</Text>
          <Ionicons
            name="arrow-forward"
            size={moderateScale(18)}
            color="#fff"
          />
        </TouchableOpacity>
                {/* filler gap ts not advisable tbh*/}   
                <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
