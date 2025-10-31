// ECCMonitoringScreen2.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../theme/theme";
import {
  scale,
  verticalScale,
  moderateScale,
  normalizeFont,
} from "../../utils/responsive";
import { CustomHeader } from "../../components/CustomHeader";
import { ChoiceKey, CondID, BaseCondition, StoredState, PermitHolder } from "./types/eccMonitoring";
import { loadStored, saveStored } from "./utils/storage/eccMonitoringStorage";
import { ECCMonitoringSection } from "../ecc/components/monitoringSection";
import { styles } from "../ecc/styles/eccMonitoringScreen2";

export default function ECCMonitoringScreen2() {
  const [permitHolders, setPermitHolders] = useState<PermitHolder[]>([]);
  const [showDatePicker, setShowDatePicker] = useState<{
    id: string | null;
    show: boolean;
  }>({ id: null, show: false });

  useEffect(() => {
    (async () => {
      const stored = await loadStored();
      if (stored?.permitHolders) setPermitHolders(stored.permitHolders);
    })();
  }, []);

  useEffect(() => {
    saveStored({ permitHolders });
  }, [permitHolders]);

  const addPermitHolder = (type: "ECC" | "ISAG") => {
    const id = `${type}-${Date.now()}`;
    const newHolder: PermitHolder = {
      id,
      type,
      name: "",
      permitNumber: "",
      issuanceDate: null,
      monitoringState: { edits: {}, customs: [], selections: {} },
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

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <CustomHeader showSave />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>ECC Monitoring Report</Text>
            <Text style={styles.headerSubtitle}>
              Add permit holders and fill monitoring data
            </Text>
          </View>

          {/* Permit Holder Buttons */}
          <View style={styles.section}>
            <View style={styles.permitButtonRow}>
              <TouchableOpacity
                style={[styles.permitButton]}
                onPress={() => addPermitHolder("ECC")}
                activeOpacity={0.8}
              >
                <View style={styles.permitButtonContent}>
                  <Ionicons
                    name="add-circle-outline"
                    size={moderateScale(18)}
                    color="#fff"
                  />
                  <Text style={styles.permitButtonText}>
                    Add ECC Permit Holder
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.permitButton]}
                onPress={() => addPermitHolder("ISAG")}
                activeOpacity={0.8}
              >
                <View style={styles.permitButtonContent}>
                  <Ionicons
                    name="add-circle-outline"
                    size={moderateScale(18)}
                    color="#fff"
                  />
                  <Text style={styles.permitButtonText}>
                    Add ISAG Permit Holder
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Permit Holder Cards */}
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
                    {holder.type === "ECC" ? "ECC Permit" : "ISAG Permit"} #
                    {idx + 1}
                  </Text>
                  <TouchableOpacity
                    onPress={() => removePermitHolder(holder.id)}
                    style={styles.iconButton}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={moderateScale(18)}
                      color={theme.colors.error}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Name of Permit Holder</Text>
                  <TextInput
                    placeholder="Enter permit holder name"
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
                  <Text style={styles.label}>
                    {holder.type === "ECC"
                      ? "ECC Number"
                      : "ISAG Permit Number"}
                  </Text>
                  <TextInput
                    placeholder={
                      holder.type === "ECC"
                        ? "Enter ECC number"
                        : "Enter ISAG permit number"
                    }
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

                <View style={[styles.inputContainer, { marginBottom: 0 }]}>
                  <Text style={styles.label}>Date of Issuance</Text>
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() =>
                      setShowDatePicker({ id: holder.id, show: true })
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

                  {/* iOS inline / Android default */}
                  {showDatePicker.show &&
                    showDatePicker.id === holder.id &&
                    Platform.OS === "ios" && (
                      <View style={styles.datePickerWrapper}>
                        <View style={styles.datePickerContainer}>
                          <DateTimePicker
                            value={
                              holder.issuanceDate
                                ? new Date(holder.issuanceDate)
                                : new Date()
                            }
                            mode="date"
                            display="inline"
                            onChange={(_e, d) => {
                              if (d)
                                setPermitHolders((p) =>
                                  p.map((h) =>
                                    h.id === holder.id
                                      ? { ...h, issuanceDate: d.toISOString() }
                                      : h
                                  )
                                );
                            }}
                            style={styles.datePicker}
                          />
                        </View>
                        <TouchableOpacity
                          onPress={() =>
                            setShowDatePicker({ id: null, show: false })
                          }
                          style={styles.datePickerDoneButton}
                        >
                          <Text style={styles.datePickerDoneText}>Done</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                  {showDatePicker.show &&
                    showDatePicker.id === holder.id &&
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
                          setShowDatePicker({ id: null, show: false });
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

                <View style={{ marginTop: verticalScale(12) }}>
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
                </View>
              </View>
            );
          })}

          {/* bottom spacing */}
          <View style={{ height: verticalScale(80) }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

