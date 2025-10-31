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
import { styles } from "../ecc/styles/eccMonitoringScreen2";

/* ---------------- Types ---------------- */
type ChoiceKey = "complied" | "partial" | "not";
type CondID = string;
type BaseCondition = {
  id: CondID;
  title: string;
  descriptions: Record<ChoiceKey, string>;
  isDefault?: boolean;
  parentId?: CondID | null;
};
type StoredState = {
  edits: Record<CondID, Partial<BaseCondition>>;
  customs: BaseCondition[];
  selections: Record<CondID, ChoiceKey | null>;
};
type PermitHolder = {
  id: string;
  type: "ECC" | "ISAG";
  name: string;
  permitNumber: string;
  issuanceDate: string | null; // ISO string
  monitoringState: StoredState;
};

/* ---------------- STORAGE KEY ---------------- */
const STORAGE_KEY = "ECC_MONITORING_V3";

/* ---------------- DEFAULTS (your conditions) ---------------- */
const DEFAULTS: BaseCondition[] = [
  {
    id: "1",
    title: "Condition 1: Secure all necessary Permits from concerned agencies",
    descriptions: {
      complied: "All necessary permits are secured.",
      partial:
        "Some permits are secured while others are still being processed.",
      not: "Still in the process of securing the necessary permits from concerned agencies.",
    },
    isDefault: true,
  },
  {
    id: "1.1",
    title:
      "Condition 1.1: That this Certificate shall cover the extraction and processing of 70,000 cu. m. sand, gravel and boulders annually and the installation of 2 units of sand and gravel classifiers with a production capacity of 80 cu. m./ hr; confined within an applied area of 19.9999 ha.",
    descriptions: {
      complied:
        "The project complies with the approved extraction and processing limit of 70,000 cu. m. annually and ensures that only 2 units of sand and gravel classifiers with a maximum production capacity of 80 cu. m./hr are installed and operated within the applied area of 19.9999 hectares.",
      partial:
        "The proponent adheres to the set annual extraction and processing volume of 70,000 cu. m. and limits the installation of sand and gravel classifiers to 2 units with a production capacity of 80 cu. m./hr within the 19.9999-hectare applied area.",
      not: "Still in the process of securing the necessary requirements for ECC EIS category application for MPSA Contract.",
    },
    isDefault: true,
    parentId: "1",
  },
  {
    id: "1.2",
    title:
      "Condition 1.2: Submission of semi-annual Compliance Monitoring Report (CMR)",
    descriptions: {
      complied: "CMRs are regularly submitted.",
      partial: "CMRs are submitted with occasional delay or minor deficiency.",
      not: "Still in the process of completing and preparing the necessary reports for submission.",
    },
    isDefault: true,
    parentId: "1",
  },
  {
    id: "2",
    title:
      "Condition 2: Provision of adequate drainage system and soil erosion control measures",
    descriptions: {
      complied: "Adequate drainage system is constructed.",
      partial:
        "Partial drainage system and soil erosion control measures are in place, with improvements ongoing.",
      not: "Still in the process of establishing adequate drainage system and soil erosion control measures",
    },
    isDefault: true,
  },
  {
    id: "3",
    title:
      "Condition 3: Implementation of regular sanitary housekeeping practices, proper collection of solid and hazardous waste",
    descriptions: {
      complied:
        "Permit to transport application is in process. The permittee attended the Technical Conference on May 19, 2025 regarding NOV issued for non-compliance with the provisions of RA 6969 and commitments will be undertaken until June 15, 2025.",
      partial:
        "Regular sanitary housekeeping practices are in place, with proper collection of solid waste observed; hazardous waste management is partially complied with pending permit issuance.",
      not: "Still in the process of fully implementing regular sanitary housekeeping practices, proper collection, and hazardous waste management measures",
    },
    isDefault: true,
  },
  {
    id: "4",
    title:
      "Condition 4: Conduct of Tree Planting and submission of annual report (if applicable)",
    descriptions: {
      complied:
        "Tree planting is regularly conducted and annual report is submitted",
      partial:
        "Tree planting activities are conducted but annual report submission is delayed or incomplete",
      not: "Still in the process of conducting tree planting activities and preparing the annual report",
    },
    isDefault: true,
  },
  {
    id: "5",
    title: "Condition 5: Secure Tree Cutting Permit",
    descriptions: {
      complied: "Tree Cutting Permit is secured",
      partial: "Application for Tree Cutting Permit is in process",
      not: "No cutting of trees involved",
    },
    isDefault: true,
  },
  {
    id: "6",
    title:
      "Condition 6: Conduct of Information, Education & Communication (IEC) Campaign and submission of annual report of compliance (if applicable)",
    descriptions: {
      complied:
        "IEC is regularly conducted with report submitted to this Office",
      partial:
        "IEC is conducted but annual report submission is delayed or incomplete",
      not: "Still in the process of conducting IEC and preparing the annual report for submission",
    },
    isDefault: true,
  },
  {
    id: "7",
    title:
      "Compliance with the provisions of RA 8749, RA 9275, RA 9003 and RA 6969",
    descriptions: { complied: "", partial: "", not: "" },
    isDefault: true,
  },
  {
    id: "7a",
    title: "Condition 7a: Secure a PTO and Discharge Permit",
    descriptions: {
      complied:
        "PTO-OL-R01-2021-02801-R valid until 05/06/2026 and DP-R01-20-02099 valid until 09/01/2025. WWDP requirements for domestic wastewater are in process. The permittee attended the Technical Conference on May 19, 2025 regarding NOV issued for non-compliance with the provisions of RA 9275 and commitments will be undertaken until June 15, 2025",
      partial:
        "PTO and Discharge Permit are secured, but renewal/application for WWDP requirements is ongoing",
      not: "Still in the process of securing PTO, Discharge Permit, and WWDP requirements",
    },
    isDefault: true,
    parentId: "7",
  },
  {
    id: "7b",
    title: "Condition 7b: Designate a PCO",
    descriptions: {
      complied: "With designated PCO. PCO accreditation renewal is in process",
      partial:
        "PCO is designated but accreditation has not yet been renewed/updated",
      not: "Still in the process of designating a PCO and securing accreditation",
    },
    isDefault: true,
    parentId: "7",
  },
  {
    id: "7c",
    title: "Condition 7c: Registration as a HW Generator",
    descriptions: {
      complied: "OL-GR-R1-28-012653 issued on 12-14-2024",
      partial:
        "Registration as HW Generator is secured but renewal/validation is in process",
      not: "Still in the process of securing registration as HW Generator",
    },
    isDefault: true,
    parentId: "7",
  },
  {
    id: "7d",
    title: "Condition 7d: Submission of SMR (if applicable)",
    descriptions: {
      complied: "SMRs are regularly and timely submitted",
      partial:
        "SMRs are submitted but with occasional delays or incomplete documentation",
      not: "Still in the process of preparing and submitting SMRs",
    },
    isDefault: true,
    parentId: "7",
  },
  {
    id: "7e",
    title: "Condition 7e: Submission of ROLA (if applicable)",
    descriptions: {
      complied:
        "ROLA is regularly submitted and passed the DENR Effluent Standards",
      partial:
        "ROLA is submitted but with delay or has minor deficiencies in meeting the DENR Effluent Standards",
      not: "Still in the process of preparing and submitting ROLA",
    },
    isDefault: true,
    parentId: "7",
  },
  {
    id: "7f",
    title:
      "Condition 7f: Secure Permit to Transport (PTT) and submission of HW-Manifest and Certificate of Treatment (COT) (if applicable)",
    descriptions: {
      complied:
        "PTT requirements are still in process. The permittee attended the Technical Conference on May 19, 2025 regarding NOV issued for non-compliance with the provisions of RA 9275 and commitments will be undertaken until June 15, 2025",
      partial:
        "PTT and HW-Manifest are secured, but Certificate of Treatment (COT) is pending/partially complied with",
      not: "Still in the process of securing PTT, HW-Manifest, and COT",
    },
    isDefault: true,
    parentId: "7",
  },
  {
    id: "8",
    title:
      "Condition 8: Submission of report on the implemented mitigating measures and the corresponding cost of such activities",
    descriptions: {
      complied: "Included in the submitted CMRs",
      partial:
        "Report on mitigating measures is prepared but submission is delayed or incomplete",
      not: "Still in the process of preparing and submitting report on mitigating measures and corresponding costs",
    },
    isDefault: true,
  },
  {
    id: "9",
    title:
      "Condition 9: Conduct of Information, Education & Communication (IEC) Campaign and submission of annual report of compliance (if applicable)",
    descriptions: {
      complied:
        "IEC is regularly conducted with report submitted to this Office",
      partial:
        "IEC is conducted but annual report submission is delayed or incomplete",
      not: "Still in the process of conducting IEC and preparing the annual report for submission",
    },
    isDefault: true,
  },
  {
    id: "10",
    title:
      "Condition 10: Creation of Environmental Unit and designation of PCO",
    descriptions: {
      complied: "With designated PCO. PCO accreditation renewal is in process",
      partial:
        "Environmental Unit is organized but PCO accreditation is still pending/for renewal",
      not: "Still in the process of creating an Environmental Unit and designating a PCO",
    },
    isDefault: true,
  },
  {
    id: "11",
    title:
      "Condition 11: Submit abandonment plan in case of abandonment, 3 months prior abandonment",
    descriptions: {
      complied:
        "Abandonment plan is prepared and submitted 3 months prior to project abandonment",
      partial: "Abandonment plan is being prepared but not yet submitted",
      not: "The management has no plans of abandoning the project",
    },
    isDefault: true,
  },
  {
    id: "12",
    title:
      "Condition 12: Project expansion and/or construction of additional structures, change in location shall be subject to a new EIA",
    descriptions: {
      complied:
        "Still in the process of securing the necessary requirements for ECC EIS category application for MPSA Contract",
      partial:
        "Application for new EIA requirements is prepared but pending submission/approval",
      not: "No project expansion, additional structures, or change in location undertaken that requires a new EIA",
    },
    isDefault: true,
  },
  {
    id: "13",
    title: "Condition 13: Land clearing within the project description",
    descriptions: {
      complied: "Land area developed is within the project description",
      partial:
        "Land clearing activities are ongoing but still within the approved project description",
      not: "Still in the process of securing confirmation that land clearing activities are within the approved project description",
    },
    isDefault: true,
  },
  {
    id: "14",
    title:
      "Condition 14: Notify EMB in case of transfer of ownership within 15 days from the date of transfer",
    descriptions: {
      complied: "No transfer of ownership",
      partial:
        "Transfer of ownership occurred, EMB was notified within 15 days",
      not: "Transfer of ownership occurred, but EMB notification is still in process / delayed",
    },
    isDefault: true,
  },
];

/* ---------------- AsyncStorage helpers ---------------- */
const loadStored = async (): Promise<{
  permitHolders?: PermitHolder[];
} | null> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { permitHolders?: PermitHolder[] };
  } catch (e) {
    console.warn("loadStored err", e);
    return null;
  }
};

const saveStored = async (payload: { permitHolders?: PermitHolder[] }) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn("saveStored err", e);
  }
};

/* ---------------- Utility: color for radio ---------------- */
const colorFor = (k: ChoiceKey) =>
  k === "complied"
    ? theme.colors.success
    : k === "partial"
      ? theme.colors.warning
      : theme.colors.error;

/* ---------------- ECCMonitoringSection (per-permit) ---------------- */
function ECCMonitoringSection({
  initialState,
  onChange,
}: {
  initialState: StoredState;
  onChange: (s: StoredState) => void;
}) {
  // same structure & behavior as your original monitoring section but self-contained per permit
  const [edits, setEdits] = useState<Record<CondID, Partial<BaseCondition>>>(
    initialState.edits || {}
  );
  const [customs, setCustoms] = useState<BaseCondition[]>(
    initialState.customs || []
  );
  const [selections, setSelections] = useState<
    Record<CondID, ChoiceKey | null>
  >(initialState.selections || {});
  const [removedDefaults, setRemovedDefaults] = useState<CondID[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  // modal for add/edit condition (local)
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editing, setEditing] = useState<BaseCondition | null>(null);

  useEffect(() => {
    onChange({ edits, customs, selections });
  }, [edits, customs, selections]);

  const currentList = useMemo(() => {
    // Apply edits over DEFAULTS in order, filter removed, append customs
    const list: BaseCondition[] = DEFAULTS.map((d) => {
      const e = edits[d.id];
      if (!e) return { ...d };
      return {
        ...d,
        title: (e.title as string) ?? d.title,
        descriptions: (e.descriptions as any) ?? d.descriptions,
      };
    });

    const filtered = list.filter((c) => !removedDefaults.includes(c.id));
    return filtered.concat(customs);
  }, [edits, customs, removedDefaults]);

  // display items (label logic follows original)
  const displayItems = useMemo(() => {
    const items: { cond: BaseCondition; displayLabel: string }[] = [];
    let idx = 1;
    for (const c of currentList) {
      const isChild = !!c.parentId;
      const label = isChild ? c.id : String(idx);
      items.push({ cond: c, displayLabel: label });
      if (!isChild) idx++;
    }
    return items;
  }, [currentList]);

  // modal helpers
  const openAdd = () => {
    const id = `custom-${Date.now()}`;
    const base: BaseCondition = {
      id,
      title: `Condition ${id}: Untitled`,
      descriptions: { complied: "", partial: "", not: "" },
      isDefault: false,
    };
    setModalMode("add");
    setEditing(base);
    setModalVisible(true);
  };

  const openEdit = (cond: BaseCondition) => {
    setModalMode("edit");
    setEditing(JSON.parse(JSON.stringify(cond)));
    setModalVisible(true);
  };

  const saveModal = () => {
    if (!editing) return;
    if (modalMode === "add") {
      setCustoms((p) => [...p, { ...editing, isDefault: false }]);
    } else {
      if (editing.isDefault) {
        setEdits((p) => ({
          ...p,
          [editing.id]: {
            title: editing.title,
            descriptions: editing.descriptions,
          },
        }));
      } else {
        setCustoms((p) => p.map((c) => (c.id === editing.id ? editing : c)));
      }
    }
    setModalVisible(false);
  };

  const deleteCondition = (cond: BaseCondition) => {
    if (cond.parentId === "7") {
      Alert.alert(
        "Delete Condition",
        "Delete this sub-condition permanently?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              if (cond.isDefault) {
                setRemovedDefaults((prev) => [...prev, cond.id]);
              } else {
                setCustoms((prev) => prev.filter((c) => c.id !== cond.id));
              }
              const remainingChildren = currentList.filter(
                (c) =>
                  c.parentId === "7" &&
                  c.id !== cond.id &&
                  !removedDefaults.includes(c.id)
              );
              if (remainingChildren.length === 0)
                setRemovedDefaults((prev) => [...prev, "7"]);
            },
          },
        ]
      );
      return;
    }

    if (cond.isDefault) {
      Alert.alert(
        "Remove default",
        "This removes the default from current view only. It will return when you reopen the screen. Continue?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: () => setRemovedDefaults((r) => [...r, cond.id]),
          },
        ]
      );
    } else {
      Alert.alert("Delete", "Delete this custom condition permanently?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            setCustoms((prev) => prev.filter((c) => c.id !== cond.id)),
        },
      ]);
    }
  };

  const setSelection = (id: CondID, choice: ChoiceKey) => {
    setSelections((s) => ({ ...s, [id]: choice }));
  };

  return (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setCollapsed((p) => !p)}
      >
        <Text style={styles.sectionTitle}>Monitoring Data</Text>
        <Ionicons
          name={collapsed ? "chevron-down" : "chevron-up"}
          size={20}
          color={theme.colors.primaryDark}
        />
      </TouchableOpacity>

      {!collapsed && (
        <>
          <View style={styles.instructionPill}>
            <Text style={styles.instructionText}>
              Choose only one (1) of the following statements that best applies
              to the project status.
            </Text>
          </View>

          {displayItems.map(({ cond, displayLabel }) => {
            const isChild = !!cond.parentId;
            const isTitleOnly = cond.id === "7";
            const selected = selections[cond.id] ?? null;

            return (
              <View
                key={cond.id}
                style={[styles.conditionCard, isChild && styles.childCard]}
              >
                {isTitleOnly ? (
                  <View style={styles.condition7Title}>
                    <View style={styles.condition7Strip} />
                    <Text style={styles.condition7Text}>{cond.title}</Text>
                  </View>
                ) : (
                  <>
<View style={styles.conditionHeader}>
  <View style={styles.headerTopRow}>
    <View style={styles.conditionIndexCircle}>
          <Text style={styles.conditionIndex}>Condition {displayLabel}</Text>
    </View>
    <View style={styles.actionRow}>
      <TouchableOpacity
        onPress={() => openEdit(cond)}
        style={styles.iconButton}
      >
        <Ionicons
          name="create-outline"
          size={18}
          color={theme.colors.primaryDark}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => deleteCondition(cond)}
        style={styles.iconButton}
      >
        <Ionicons
          name="trash-outline"
          size={18}
          color={theme.colors.error}
        />
      </TouchableOpacity>
    </View>
  </View>

  <Text style={styles.conditionTitle}>{cond.title}</Text>
</View>


                    <View style={styles.radioGroup}>
                      {(["complied", "partial", "not"] as ChoiceKey[]).map(
                        (k) => {
                          const isSelected = selected === k;
                          return (
                            <View key={k} style={styles.radioRow}>
                              <TouchableOpacity
                                onPress={() => setSelection(cond.id, k)}
                                style={styles.radioTouch}
                                activeOpacity={0.8}
                              >
                                <View
                                  style={[
                                    styles.radioOuter,
                                    isSelected && { borderColor: colorFor(k) },
                                  ]}
                                >
                                  {isSelected && (
                                    <View
                                      style={[
                                        styles.radioInner,
                                        { backgroundColor: colorFor(k) },
                                      ]}
                                    />
                                  )}
                                </View>

                                <View style={styles.radioLabelWrap}>
                                  <Text
                                    style={[
                                      styles.radioLabel,
                                      isSelected && { color: colorFor(k) },
                                    ]}
                                  >
                                    {k === "complied"
                                      ? "Complied"
                                      : k === "partial"
                                        ? "Partially Complied"
                                        : "Not Complied"}
                                  </Text>
                                  <Text style={styles.radioDescription}>
                                    {cond.descriptions[k]}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          );
                        }
                      )}
                    </View>
                  </>
                )}
              </View>
            );
          })}

          <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
            <Ionicons
              name="add-circle-outline"
              size={20}
              color={theme.colors.primaryDark}
            />
            <Text style={styles.addText}>Add Condition</Text>
          </TouchableOpacity>
        </>
      )}

      {/* add/edit modal */}
<Modal visible={modalVisible} transparent animationType="fade">
  <View style={styles.modalBackdrop}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <View style={styles.modalWrapper}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>
            {modalMode === "add" ? "Add Condition" : "Edit Condition"}
          </Text>

          <ScrollView
            style={styles.modalScrollArea}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.modalLabel}>Title</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Condition title"
              placeholderTextColor="#C0C0C0"
              value={editing?.title}
              onChangeText={(t) =>
                setEditing((s) => (s ? { ...s, title: t } : s))
              }
            />

            <Text style={styles.modalLabel}>Complied (description)</Text>
            <TextInput
              style={[styles.modalInput, styles.modalTextarea]}
              placeholder="Complied description"
              placeholderTextColor="#C0C0C0"
              value={editing?.descriptions.complied}
              onChangeText={(t) =>
                setEditing((s) =>
                  s
                    ? {
                        ...s,
                        descriptions: { ...s.descriptions, complied: t },
                      }
                    : s
                )
              }
              multiline
            />

            <Text style={styles.modalLabel}>
              Partially Complied (description)
            </Text>
            <TextInput
              style={[styles.modalInput, styles.modalTextarea]}
              placeholder="Partially complied description"
              placeholderTextColor="#C0C0C0"
              value={editing?.descriptions.partial}
              onChangeText={(t) =>
                setEditing((s) =>
                  s
                    ? {
                        ...s,
                        descriptions: { ...s.descriptions, partial: t },
                      }
                    : s
                )
              }
              multiline
            />

            <Text style={styles.modalLabel}>Not Complied (description)</Text>
            <TextInput
              style={[styles.modalInput, styles.modalTextarea]}
              placeholder="Not complied description"
              placeholderTextColor="#C0C0C0"
              value={editing?.descriptions.not}
              onChangeText={(t) =>
                setEditing((s) =>
                  s
                    ? { ...s, descriptions: { ...s.descriptions, not: t } }
                    : s
                )
              }
              multiline
            />
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalBtn, styles.modalCancel]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalBtn, styles.modalSave]}
              onPress={() => saveModal()}
            >
              <Text style={styles.modalSaveText}>
                {modalMode === "add" ? "Add" : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  </View>
</Modal>


    </View>
  );
}

/* ---------------- Main Screen ---------------- */
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

