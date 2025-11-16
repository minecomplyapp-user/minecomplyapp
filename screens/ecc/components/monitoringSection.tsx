import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../../theme/theme";
import { styles } from "../styles/eccMonitoringScreen";
import { Alert as RNAlert } from "react-native";
import { ConditionModal } from "./conditionModal";
import {
  BaseCondition,
  StoredState,
  ChoiceKey,
  CondID,
} from "../types/eccMonitoring";
import { DEFAULTS } from "../constants/defaultConditions";

const colorFor = (k: ChoiceKey) =>
  k === "complied"
    ? theme.colors.success
    : k === "partial"
      ? theme.colors.warning
      : theme.colors.error;

export const ECCMonitoringSection = ({
  initialState,
  onChange,
  toDisplay,
}: {
  initialState: StoredState;
  onChange: (s: StoredState) => void;
  toDisplay: BaseCondition[];
}) => {
  const [edits, setEdits] = useState<Record<CondID, Partial<BaseCondition>>>(
    initialState.edits || {}
  );
  const [customs, setCustoms] = useState<BaseCondition[]>(
    initialState.customs || []
  );
  const [selections, setSelections] = useState<
    Record<CondID, ChoiceKey | null>
  >(initialState.selections || {});

  const [remarks, setRemarks] = useState<Record<CondID, string | null>>(
    initialState.remarks || {}
  );
  // dynamic heights for remarks per condition so the card/container grows with content
  const [remarkHeights, setRemarkHeights] = useState<Record<CondID, number>>({});
  const MIN_REMARK_HEIGHT = 80; // minimum visible height for the textarea
  const MAX_REMARK_HEIGHT = 300; // maximum height before enabling internal scrolling
  const setRemarkHeight = (id: CondID, height: number) =>
    setRemarkHeights((p) => ({ ...p, [id]: height }));

  const [removedDefaults, setRemovedDefaults] = useState<CondID[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  // modal for add/edit
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editing, setEditing] = useState<BaseCondition | null>(null);

  let section = 0;

  const toConditionOutput = () => {
    const conditions = currentList.map((cond, index) => {
      const status = selections[cond.id] || "";
      const remark = remarks[cond.id] || "";
      section += 1; // increment section count
      const nestedTo =
        cond.nested_to !== undefined && cond.nested_to !== null
          ? String(cond.nested_to)
          : undefined;

      return {
        nested_to: nestedTo,
        section,
        condition_number: index + 1,
        condition: `Condition ${cond.id}: ${cond.title}`,
        status,
        remarks: remark,
        remark_list: [
          cond.descriptions.complied,
          cond.descriptions.partial,
          cond.descriptions.not,
        ],
      };
    });

    return { conditions };
  };

  useEffect(() => {
    const formatted = toConditionOutput();
    console.log(formatted); // 🟢 ADD 'remarks' to the saved state object

    onChange({ edits, customs, selections, remarks, formatted }); // 🟢 ADD 'remarks' to the dependency array
  }, [edits, customs, selections, remarks]);

  const currentList = useMemo(() => {
    // Apply edits over DEFAULTS
    const toMap = Array.isArray(toDisplay) ? toDisplay : DEFAULTS;

    const list: BaseCondition[] = toMap.map((d) => {
      const e = edits[d.id];
      if (!e) return { ...d };
      return {
        ...d,
        nested_to: d.nested_to,
        title: (e.title as string) ?? d.title,
        descriptions: (e.descriptions as any) ?? d.descriptions,
      };
    });

    const filtered = list.filter((c) => !removedDefaults.includes(c.id));
    return filtered.concat(customs);
  }, [edits, customs, removedDefaults]);

  // display items
  const displayItems = useMemo(() => {
    const items: { cond: BaseCondition; displayLabel: string }[] = [];
    let idx = 1;
    for (const c of currentList) {
      const isChild = !!c.nested_to;
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
    if (cond.nested_to === "7") {
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
                  c.nested_to === "7" &&
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

  const setRemark = (id: CondID, text: string) => {
    setRemarks((r) => ({ ...r, [id]: text }));
    console.log(remarks);
  };

  return (
    <View>
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
          {/* First Pill (Standard) */}
          <View style={styles.instructionPill}>
            <Text style={styles.instructionText}>
              Choose only one (1) of the following statements that best applies
              to the project status.
            </Text>
          </View>

          {/* Second Pill (Noticeable Note) */}
          <View style={styles.notePill}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={theme.colors.warning}
            />
            <Text style={styles.noteText}>
              Note: Delete the condition if not applicable to avoid rendering in
              the document.
            </Text>
          </View>

          {displayItems.map(({ cond, displayLabel }) => {
            // console.log(displayItems)
            const isChild = !!cond.nested_to;
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
                          <Text style={styles.conditionIndex}>
                            Condition {displayLabel}
                          </Text>
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
                                  {/* <Text style={styles.radioDescription}>
                                    {cond.descriptions[k]}
                                  </Text> */}
                                </View>
                              </TouchableOpacity>
                            </View>
                          );
                        }
                      )}
                    </View>
                  </>
                )}
                
                <TextInput
                  style={[
                    styles.remarkInput,
                    {
                      // clamp rendered height between MIN and MAX, add small offset for padding
                      height: Math.max(
                        MIN_REMARK_HEIGHT,
                        Math.min(
                          (remarkHeights[cond.id] || MIN_REMARK_HEIGHT) + 6,
                          MAX_REMARK_HEIGHT
                        )
                      ),
                    },
                  ]}
                  value={remarks[cond.id] ?? ""}
                  onChangeText={(text) => setRemark(cond.id, text)}
                  placeholder="Enter remarks here..."
                  placeholderTextColor="#94A3B8"
                  keyboardType="default"
                  autoCapitalize="sentences"
                  multiline={true}
                  blurOnSubmit={false} // allow Enter/new line on both platforms
                  returnKeyType="default"
                  // enable internal scrolling when content grows beyond MAX_REMARK_HEIGHT
                  scrollEnabled={(remarkHeights[cond.id] || 0) > MAX_REMARK_HEIGHT}
                  // update measured content height so we can grow the input
                  onContentSizeChange={(e) => {
                    const h = Math.ceil(e.nativeEvent.contentSize.height);
                    // store raw measured height (will be clamped when rendering)
                    setRemarkHeight(cond.id, h);
                  }}
                />
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
      <ConditionModal
        visible={modalVisible}
        mode={modalMode}
        editing={editing}
        onChange={setEditing}
        onCancel={() => setModalVisible(false)}
        onSave={saveModal}
      />
    </View>
  );
};
