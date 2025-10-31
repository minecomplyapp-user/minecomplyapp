import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../theme/theme";
import { CustomHeader } from "../../components/CustomHeader";
import { ECCMonitoringSection } from "../ecc/components/monitoringSection";
import { styles } from "../ecc/styles/eccStyles"; // reuse styles from both screens
import { scale, verticalScale, moderateScale } from "../../utils/responsive";

export default function ECCMonitoringScreen({ navigation }: any) {
  // === General Information ===
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [status, setStatus] = useState<"Active" | "Inactive" | null>(null);

  const onChangeDate = (_event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    if (Platform.OS === "android") setShowDatePicker(false);
    setDate(currentDate);
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
  const [permitHolders, setPermitHolders] = useState<any[]>([]);
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

  return (
    <SafeAreaView style={styles.safeContainer}>
      <CustomHeader showSave />
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
              placeholderTextColor="#C0C0C0"
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
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                placeholder="Enter location"
                placeholderTextColor="#C0C0C0"
                style={styles.input}
              />
            </View>
            <TouchableOpacity
              style={[styles.gpsButton, styles.inputContainer]}
              onPress={() => alert("Capture GPS Location")}
            >
              <Ionicons
                name="location-outline"
                size={moderateScale(18)}
                color="#fff"
              />
              <Text style={styles.gpsButtonText}>Capture GPS Location</Text>
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
                <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
              </TouchableOpacity>

              {showDatePicker && Platform.OS === "ios" && (
                <View style={styles.datePickerWrapper}>
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="inline"
                    onChange={onChangeDate}
                    style={styles.datePicker}
                  />
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(false)}
                    style={styles.datePickerDoneButton}
                  >
                    <Text style={styles.datePickerDoneText}>Done</Text>
                  </TouchableOpacity>
                </View>
              )}

              {showDatePicker && Platform.OS === "android" && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                />
              )}
            </View>
          </View>
        </View>

        {/* === Multipartite Monitoring Team === */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Multipartite Monitoring Team</Text>
          <View style={styles.card}>
            {teamFields.map((label, index) => (
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
                />
                {label === "Email Address" && (
                  <TouchableOpacity style={styles.autoPopulateButton}>
                    <Ionicons
                      name="sync"
                      size={16}
                      color={theme.colors.primaryDark}
                    />
                    <Text style={styles.autoPopulateText}>
                      Auto-populate with your saved info
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* === Permit Holders === */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permit Holders</Text>
          <View style={styles.permitSection}>
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

          {permitHolders.map((holder, idx) => {
            const issuanceDateDisplay = holder.issuanceDate
              ? new Date(holder.issuanceDate).toLocaleDateString()
              : null;
            return (
              <View key={holder.id} style={styles.card}>
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

                {/* Permit Issuance Date */}
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

                  {showPermitDatePicker.show &&
                    showPermitDatePicker.id === holder.id &&
                    Platform.OS === "android" && (
                      <DateTimePicker
                        value={
                          holder.issuanceDate
                            ? new Date(holder.issuanceDate)
                            : new Date()
                        }
                        mode="date"
                        display="default"
                        onChange={(_e, d) => {
                          setShowPermitDatePicker({ id: null, show: false });
                          if (d)
                            setPermitHolders((p) =>
                              p.map((h) =>
                                h.id === holder.id
                                  ? { ...h, issuanceDate: d.toISOString() }
                                  : h
                              )
                            );
                        }}
                      />
                    )}
                </View>

                {/* Monitoring Section */}
                <ECCMonitoringSection
                  initialState={holder.monitoringState}
                  onChange={(s) =>
                    setPermitHolders((p) =>
                      p.map((h) =>
                        h.id === holder.id ? { ...h, monitoringState: s } : h
                      )
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
        >
          <Text style={styles.saveButtonText}>Generate ECC Report</Text>
          <Ionicons
            name="arrow-forward"
            size={moderateScale(18)}
            color="#fff"
          />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
