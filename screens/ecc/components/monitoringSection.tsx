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
    const remarks =
      status && cond.descriptions[status]
        ? cond.descriptions[status]
        : "No remarks.";

    section += 1; // increment section count

    return {
      nested_to: cond.nested_to ? parseInt(cond.nested_to as string, 10) : undefined,
      section, 
      condition_number: index + 1,
      condition: cond.title,
      status,
      remarks,
      remark_list: [
        cond.descriptions.complied,
        cond.descriptions.partial,
        cond.descriptions.not,
      ],
    };
  });

  return {conditions};
};

  useEffect(() => {
      const formatted = toConditionOutput();
      console.log(currentList)

    onChange({ edits, customs, selections, formatted  });

    
  }, [edits, customs, selections]);

  const currentList = useMemo(() => {
    // Apply edits over DEFAULTS 
    const toMap = Array.isArray(toDisplay) ? toDisplay : DEFAULTS;

    const list: BaseCondition[] =toMap.map((d) => {
      const e = edits[d.id];
      if (!e) return { ...d };
      return {
        ...d,
        nested_to:d.nested_to,
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
          <View style={styles.instructionPill}>
            <Text style={styles.instructionText}>
              Choose only one (1) of the following statements that best applies
              to the project status.
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
