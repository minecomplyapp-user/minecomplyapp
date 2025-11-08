import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ComplaintsSectionProps } from '../types/ComplaintsSection.types';
import { styles } from '../styles/ComplaintsSection.styles';

export const ComplaintsSection: React.FC<ComplaintsSectionProps> = ({
  complaints,
  updateComplaint,
  addComplaint,
  removeComplaint,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.iconContainer}>
          <Ionicons name="chatbox-ellipses" size={24} color='#02217C' />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.sectionNumber}>7.</Text>
          <Text style={styles.sectionTitle}>Complaints Verification</Text>
        </View>
      </View>

      <View style={styles.sectionContent}>
        {complaints.map((complaint, index) => (
          <View key={complaint.id} style={[styles.complaintCard, index > 0 && styles.complaintCardMargin]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Complaint #{index + 1}</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.naButton}
                  onPress={() => updateComplaint(complaint.id, 'isNA', !complaint.isNA)}
                >
                  <View style={[styles.checkbox, complaint.isNA && styles.checkboxChecked]}>
                    {complaint.isNA && <Ionicons name="checkmark" size={14} color="white" />}
                  </View>
                  <Text style={styles.naButtonText}>N/A</Text>
                </TouchableOpacity>
                {complaints.length > 1 && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => removeComplaint(complaint.id)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#DC2626" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={[styles.contentWrapper, complaint.isNA && styles.disabledContent]}>
              <View style={styles.fieldGroup}>
                <Text style={styles.labelSmall}>DATE FILED</Text>
                <TextInput
                  style={[styles.input, complaint.isNA && styles.disabledInput]}
                  value={complaint.dateFiled}
                  onChangeText={(text) => updateComplaint(complaint.id, 'dateFiled', text)}
                  placeholder="MM/DD/YYYY"
                  placeholderTextColor="#94A3B8"
                  editable={!complaint.isNA}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.labelSmall}>WHERE IS IT FILED?</Text>
                <View style={styles.radioGroup}>
                  {(['DENR', 'Company', 'MMT', 'Others'] as const).map((loc) => (
                    <TouchableOpacity
                      key={loc}
                      style={styles.radioOption}
                      onPress={() => updateComplaint(complaint.id, 'filedLocation', loc)}
                      disabled={complaint.isNA}
                    >
                      <View style={[
                        styles.radio,
                        complaint.filedLocation === loc && styles.radioSelected,
                        complaint.isNA && styles.disabledRadio
                      ]}>
                        {complaint.filedLocation === loc && <View style={styles.radioDot} />}
                      </View>
                      <Text style={[styles.optionLabel, complaint.isNA && styles.disabledText]}>
                        {loc === 'Others' ? 'Others' : loc}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {complaint.filedLocation === 'Others' && (
                  <TextInput
                    style={[styles.input, styles.specifyInput, complaint.isNA && styles.disabledInput]}
                    value={complaint.othersSpecify}
                    onChangeText={(text) => updateComplaint(complaint.id, 'othersSpecify', text)}
                    placeholder="Please specify..."
                    placeholderTextColor="#94A3B8"
                    editable={!complaint.isNA}
                  />
                )}
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.labelSmall}>NATURE OF COMPLAINT</Text>
                <TextInput
                  style={[styles.input, styles.textArea, complaint.isNA && styles.disabledInput]}
                  value={complaint.nature}
                  onChangeText={(text) => updateComplaint(complaint.id, 'nature', text)}
                  placeholder="Describe the nature of complaint..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={3}
                  editable={!complaint.isNA}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.labelSmall}>RESOLUTIONS MADE</Text>
                <TextInput
                  style={[styles.input, styles.textArea, complaint.isNA && styles.disabledInput]}
                  value={complaint.resolutions}
                  onChangeText={(text) => updateComplaint(complaint.id, 'resolutions', text)}
                  placeholder="Describe resolutions..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={3}
                  editable={!complaint.isNA}
                />
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addComplaint}>
          <Ionicons name="add-circle" size={20} color='#02217C' />
          <Text style={styles.addButtonText}>Add More Complaint</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};