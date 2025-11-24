import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/executiveSummary.styles";
import type { ExecutiveSummaryProps } from "../types/executiveSummary.types";

export const ExecutiveSummarySection: React.FC<ExecutiveSummaryProps> = ({
  executiveSummary,
  updateExecutiveSummary,
  toggleEpepCompliance,
  toggleComplaintsManagement,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.iconContainer}>
          <Ionicons name="document-text" size={24} color="#02217C" />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <Text style={styles.sectionSubtitle}>
            Summary of Compliance Status
          </Text>
        </View>
      </View>

      <View style={styles.sectionContent}>
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#02217C" />
          <Text style={styles.infoText}>
            Unticked checkboxes are considered 'No' or 'Not Complied'.
          </Text>
        </View>

        {/* --- EPEP --- */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Compliance with EPEP Commitments</Text>
          <View style={styles.checkboxGroup}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => toggleEpepCompliance("safety")}
            >
              <View
                style={[
                  styles.checkbox,
                  executiveSummary.epepCompliance.safety &&
                    styles.checkboxChecked,
                ]}
              >
                {executiveSummary.epepCompliance.safety && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Safety</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => toggleEpepCompliance("social")}
            >
              <View
                style={[
                  styles.checkbox,
                  executiveSummary.epepCompliance.social &&
                    styles.checkboxChecked,
                ]}
              >
                {executiveSummary.epepCompliance.social && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Social</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => toggleEpepCompliance("rehabilitation")}
            >
              <View
                style={[
                  styles.checkbox,
                  executiveSummary.epepCompliance.rehabilitation &&
                    styles.checkboxChecked,
                ]}
              >
                {executiveSummary.epepCompliance.rehabilitation && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Rehabilitation</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.labelSmall}>EPEP REMARKS</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={executiveSummary.epepRemarks}
            onChangeText={(text) => updateExecutiveSummary("epepRemarks", text)}
            placeholder="Enter remarks for EPEP compliance..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.divider} />

        {/* --- SDMP --- */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Compliance with SDMP Commitments</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() =>
                updateExecutiveSummary("sdmpCompliance", "complied")
              }
            >
              <View
                style={[
                  styles.checkbox,
                  executiveSummary.sdmpCompliance === "complied" &&
                    styles.checkboxChecked,
                ]}
              >
                {executiveSummary.sdmpCompliance === "complied" && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Complied</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() =>
                updateExecutiveSummary("sdmpCompliance", "not-complied")
              }
            >
              <View
                style={[
                  styles.checkbox,
                  executiveSummary.sdmpCompliance === "not-complied" &&
                    styles.checkboxChecked,
                ]}
              >
                {executiveSummary.sdmpCompliance === "not-complied" && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Not Complied</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.labelSmall}>SDMP REMARKS</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={executiveSummary.sdmpRemarks}
            onChangeText={(text) => updateExecutiveSummary("sdmpRemarks", text)}
            placeholder="Enter remarks for SDMP compliance..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.divider} />

        {/* --- Complaints Management --- */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelWithAction}>
            <Text style={styles.label}>Complaints Management</Text>
            <TouchableOpacity
              style={styles.naButton}
              onPress={() => toggleComplaintsManagement("naForAll")}
            >
              <View
                style={[
                  styles.checkboxSmall,
                  executiveSummary.complaintsManagement.naForAll &&
                    styles.checkboxChecked,
                ]}
              >
                {executiveSummary.complaintsManagement.naForAll && (
                  <Ionicons name="checkmark" size={14} color="white" />
                )}
              </View>
              <Text style={styles.naButtonText}>N/A for all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.checkboxGroup}>
            {[
              {
                key: "complaintReceiving",
                label: "Complaint receiving set-up",
              },
              { key: "caseInvestigation", label: "Case investigation" },
              {
                key: "implementationControl",
                label: "Implementation of control",
              },
              {
                key: "communicationComplainant",
                label: "Communication with complainant/public",
              },
              {
                key: "complaintDocumentation",
                label: "Complaint documentation",
              },
            ].map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.checkboxRow,
                  executiveSummary.complaintsManagement.naForAll &&
                    styles.disabledCheckboxRow,
                ]}
                onPress={() =>
                  toggleComplaintsManagement(
                    item.key as keyof typeof executiveSummary.complaintsManagement
                  )
                }
                disabled={executiveSummary.complaintsManagement.naForAll}
              >
                <View
                  style={[
                    styles.checkbox,
                    executiveSummary.complaintsManagement[
                      item.key as keyof typeof executiveSummary.complaintsManagement
                    ] &&
                      !executiveSummary.complaintsManagement.naForAll &&
                      styles.checkboxChecked,
                    executiveSummary.complaintsManagement.naForAll &&
                      styles.disabledCheckbox,
                  ]}
                >
                  {executiveSummary.complaintsManagement[
                    item.key as keyof typeof executiveSummary.complaintsManagement
                  ] &&
                    !executiveSummary.complaintsManagement.naForAll && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                </View>
                <Text
                  style={[
                    styles.checkboxLabel,
                    executiveSummary.complaintsManagement.naForAll &&
                      styles.disabledCheckboxLabel,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 🔒 Complaints Remarks (disabled when N/A) */}
        <View style={styles.fieldGroup}>
          <Text style={styles.labelSmall}>COMPLAINTS REMARKS</Text>
          <View
            pointerEvents={
              executiveSummary.complaintsManagement.naForAll ? "none" : "auto"
            }
          >
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                executiveSummary.complaintsManagement.naForAll &&
                  styles.disabledInput,
              ]}
              value={executiveSummary.complaintsRemarks}
              onChangeText={(text) =>
                updateExecutiveSummary("complaintsRemarks", text)
              }
              placeholder="Enter remarks for complaints management..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              editable={!executiveSummary.complaintsManagement.naForAll}
            />
          </View>
        </View>

        <View style={styles.divider} />

        {/* --- Accountability --- */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Accountability</Text>
          <Text style={styles.sublabel}>
            Qualified personnel are charged with routine monitoring (education,
            training, knowledge, experience).
          </Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() =>
                updateExecutiveSummary("accountability", "complied")
              }
            >
              <View
                style={[
                  styles.checkbox,
                  executiveSummary.accountability === "complied" &&
                    styles.checkboxChecked,
                ]}
              >
                {executiveSummary.accountability === "complied" && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Complied</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() =>
                updateExecutiveSummary("accountability", "not-complied")
              }
            >
              <View
                style={[
                  styles.checkbox,
                  executiveSummary.accountability === "not-complied" &&
                    styles.checkboxChecked,
                ]}
              >
                {executiveSummary.accountability === "not-complied" && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Not Complied</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.labelSmall}>ACCOUNTABILITY REMARKS</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={executiveSummary.accountabilityRemarks}
            onChangeText={(text) =>
              updateExecutiveSummary("accountabilityRemarks", text)
            }
            placeholder="Enter remarks for accountability..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.divider} />

        {/* --- Others --- */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelWithAction}>
            <Text style={styles.label}>Others</Text>
            <TouchableOpacity
              style={styles.naButton}
              onPress={() =>
                updateExecutiveSummary("othersNA", !executiveSummary.othersNA)
              }
            >
              <View
                style={[
                  styles.checkboxSmall,
                  executiveSummary.othersNA && styles.checkboxChecked,
                ]}
              >
                {executiveSummary.othersNA && (
                  <Ionicons name="checkmark" size={14} color="white" />
                )}
              </View>
              <Text style={styles.naButtonText}>N/A</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              executiveSummary.othersNA && styles.disabledInput,
            ]}
            value={executiveSummary.othersSpecify}
            onChangeText={(text) =>
              updateExecutiveSummary("othersSpecify", text)
            }
            placeholder="Specify other compliance matters..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
            editable={!executiveSummary.othersNA}
          />
        </View>
      </View>
    </View>
  );
};

export default ExecutiveSummarySection;
