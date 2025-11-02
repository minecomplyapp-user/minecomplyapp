import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  RefreshControl,
  TextInput,
  ActivityIndicator,
} from "react-native";
import {
  Calendar,
  MapPin,
  Users,
  FileText,
  Trash2,
  Edit3,
  Save,
  X,
  Plus,
  Camera,
  ImageIcon,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CustomHeader } from "../../components/CustomHeader";
import { apiGet, apiDelete, apiPatch, apiPost } from "../../lib/api";
import { createSignedDownloadUrl, uploadFileFromUri } from "../../lib/storage";
import { theme } from "../../theme/theme";

interface Person {
  id: string;
  name: string;
  agency?: string;
  office?: string;
  position: string;
  status: string;
  signatureUrl?: string;
}

interface AttachmentWithCaption {
  url: string;
  caption?: string;
  path?: string;
}

interface EditableAttachment {
  uri: string;
  caption: string;
  path?: string;
  isNew?: boolean;
}

interface AttendanceDetailScreenProps {
  navigation: any;
  route: any;
}

const AttendanceDetailScreen: React.FC<AttendanceDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { record } = route.params || {};
  const recordId: string | undefined = record?.id;
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [attachments, setAttachments] = useState<AttachmentWithCaption[]>([]);
  const [people, setPeople] = useState<Person[]>([]);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedLocation, setEditedLocation] = useState("");
  const [editedDate, setEditedDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // Edit attachments state
  const [editedAttachments, setEditedAttachments] = useState<
    EditableAttachment[]
  >([]);

  // Edit attendees state
  const [editedAttendees, setEditedAttendees] = useState<Person[]>([]);

  const fetchAttendanceDetail = async () => {
    if (!recordId) return;
    try {
      setLoading(true);
      const data: any = await apiGet(`/attendance/${recordId}`);
      setAttendanceData(data);

      // Map attendees
      const mapped: Person[] = Array.isArray(data?.attendees)
        ? data.attendees.map((a: any, idx: number) => ({
            id: String(a.id ?? idx + 1),
            name: a.name ?? "Unknown",
            agency: a.agency || a.office,
            position: a.position ?? "",
            status: a.attendanceStatus || "ABSENT",
            signatureUrl: a.signatureUrl,
          }))
        : [];
      setPeople(mapped);

      // Load attachments
      if (Array.isArray(data?.attachments) && data.attachments.length) {
        try {
          const attachmentsWithUrls = await Promise.all(
            data.attachments.map(async (att: any) => {
              const path = typeof att === "string" ? att : att.path;
              const caption =
                typeof att === "object" && att?.caption
                  ? att.caption
                  : undefined;

              if (!path) return null;

              const { url } = await createSignedDownloadUrl(path, 600);
              return { url, caption, path };
            })
          );
          setAttachments(
            attachmentsWithUrls.filter(
              (a): a is AttachmentWithCaption => a !== null
            )
          );
        } catch (e) {
          console.error("Failed to load attachments:", e);
        }
      } else {
        setAttachments([]);
      }
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to load attendance details");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAttendanceDetail();
    setRefreshing(false);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Attendance",
      "Are you sure you want to delete this attendance record? This will also delete all attached images.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await apiDelete(`/attendance/${recordId}`);
              Alert.alert("Deleted", "Attendance record has been deleted.");
              navigation.goBack();
            } catch (e: any) {
              Alert.alert("Delete failed", e?.message || "Unable to delete");
            }
          },
        },
      ]
    );
  };

  const getStatusBadge = (status: string) => {
    const statusUpper = status.toUpperCase();
    if (statusUpper.includes("IN_PERSON") || statusUpper.includes("PERSON")) {
      return { label: "In Person", color: theme.colors.success };
    } else if (statusUpper.includes("ONLINE")) {
      return { label: "Online", color: theme.colors.primaryDark };
    } else {
      return { label: "Absent", color: theme.colors.error };
    }
  };

  const handleEdit = () => {
    // Populate edit fields from current data
    setEditedTitle(attendanceData?.title || "");
    setEditedDescription(attendanceData?.description || "");
    setEditedLocation(attendanceData?.location || "");
    if (attendanceData?.meetingDate) {
      setEditedDate(new Date(attendanceData.meetingDate));
    }

    // Populate attachments for editing
    const editableAttachments: EditableAttachment[] = attachments.map(
      (att) => ({
        uri: att.url,
        caption: att.caption || "",
        path: att.path,
        isNew: false,
      })
    );
    setEditedAttachments(editableAttachments);

    // Populate attendees for editing
    setEditedAttendees([...people]);

    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!recordId) return;

    setSaving(true);
    try {
      // Format date to YYYY-MM-DD for backend
      const formattedDate = editedDate
        ? editedDate.toISOString().split("T")[0]
        : undefined;

      // Upload new attachments
      const attachmentPayload: Array<{ path: string; caption?: string }> = [];

      for (const att of editedAttachments) {
        if (att.isNew) {
          // Upload new image
          const fileName = `attendance-${recordId}-${Date.now()}.jpg`;
          const uploadResult = await uploadFileFromUri({
            uri: att.uri,
            fileName: fileName,
            contentType: "image/jpeg",
          });
          attachmentPayload.push({
            path: uploadResult.path,
            caption: att.caption || undefined,
          });
        } else if (att.path) {
          // Keep existing attachment
          attachmentPayload.push({
            path: att.path,
            caption: att.caption || undefined,
          });
        }
      }

      // Format attendees for backend
      const attendeesPayload = editedAttendees.map((person) => ({
        name: person.name,
        agency: person.agency,
        office: person.office,
        position: person.position,
        attendanceStatus: person.status,
        signatureUrl: person.signatureUrl,
      }));

      const updatePayload: any = {
        title: editedTitle,
        description: editedDescription,
        location: editedLocation,
        attachments: attachmentPayload,
        attendees: attendeesPayload,
      };

      if (formattedDate) {
        updatePayload.meetingDate = formattedDate;
      }

      await apiPatch(`/attendance/${recordId}`, updatePayload);

      // Refresh data after save
      await fetchAttendanceDetail();
      setIsEditing(false);
      Alert.alert("Success", "Attendance record updated successfully.");
    } catch (e: any) {
      Alert.alert("Update failed", e?.message || "Unable to update record");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form fields and exit edit mode
    setEditedTitle("");
    setEditedDescription("");
    setEditedLocation("");
    setEditedDate(null);
    setEditedAttachments([]);
    setEditedAttendees([]);
    setIsEditing(false);
  };

  // Attachment management functions
  const handleAddAttachmentFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant gallery access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsMultipleSelection: false,
    });

    if (!result.canceled && result.assets[0]) {
      const newAttachment: EditableAttachment = {
        uri: result.assets[0].uri,
        caption: "",
        isNew: true,
      };
      setEditedAttachments([...editedAttachments, newAttachment]);
    }
  };

  const handleAddAttachmentFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera access.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets[0]) {
      const newAttachment: EditableAttachment = {
        uri: result.assets[0].uri,
        caption: "",
        isNew: true,
      };
      setEditedAttachments([...editedAttachments, newAttachment]);
    }
  };

  const handleUpdateAttachmentCaption = (index: number, caption: string) => {
    const updated = [...editedAttachments];
    updated[index].caption = caption;
    setEditedAttachments(updated);
  };

  const handleRemoveAttachment = (index: number) => {
    Alert.alert(
      "Remove Attachment",
      "Are you sure you want to remove this attachment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            const updated = editedAttachments.filter((_, i) => i !== index);
            setEditedAttachments(updated);
          },
        },
      ]
    );
  };

  // Attendee management functions
  const handleAddAttendee = () => {
    const newAttendee: Person = {
      id: `new-${Date.now()}`,
      name: "",
      agency: "",
      office: "",
      position: "",
      status: "ABSENT",
    };
    setEditedAttendees([...editedAttendees, newAttendee]);
  };

  const handleUpdateAttendee = (
    index: number,
    field: keyof Person,
    value: string
  ) => {
    const updated = [...editedAttendees];
    (updated[index] as any)[field] = value;
    setEditedAttendees(updated);
  };

  const handleRemoveAttendee = (index: number) => {
    Alert.alert(
      "Remove Attendee",
      "Are you sure you want to remove this attendee?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            const updated = editedAttendees.filter((_, i) => i !== index);
            setEditedAttendees(updated);
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchAttendanceDetail();
  }, [recordId]);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <CustomHeader showSave={false} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.titleContainer}>
              {isEditing ? (
                <TextInput
                  style={styles.titleInput}
                  value={editedTitle}
                  onChangeText={setEditedTitle}
                  placeholder="Enter title"
                  placeholderTextColor={theme.colors.textLight}
                />
              ) : (
                <Text style={styles.title}>
                  {attendanceData?.title ||
                    record?.title ||
                    "Attendance Record"}
                </Text>
              )}
              <Text style={styles.subtitle}>
                {attendanceData?.fileName || record?.fileName || ""}
              </Text>
            </View>

            <View style={styles.headerButtons}>
              {isEditing ? (
                <>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <ActivityIndicator
                        size="small"
                        color={theme.colors.success}
                      />
                    ) : (
                      <Save
                        size={20}
                        color={theme.colors.success}
                        strokeWidth={2}
                      />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={handleCancelEdit}
                    disabled={saving}
                  >
                    <X
                      size={20}
                      color={theme.colors.textLight}
                      strokeWidth={2}
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={handleEdit}
                  >
                    <Edit3
                      size={20}
                      color={theme.colors.primaryDark}
                      strokeWidth={2}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDelete}
                  >
                    <Trash2
                      size={20}
                      color={theme.colors.error}
                      strokeWidth={2}
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          {/* Meta Information */}
          <View style={styles.metaContainer}>
            {(attendanceData?.meetingDate || record?.date || isEditing) && (
              <View style={styles.metaRow}>
                <Calendar
                  size={16}
                  color={theme.colors.textLight}
                  strokeWidth={2}
                />
                {isEditing ? (
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setDatePickerVisibility(true)}
                  >
                    <Text style={styles.metaText}>
                      {editedDate
                        ? editedDate.toISOString().split("T")[0]
                        : "Select date"}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.metaText}>
                    {attendanceData?.meetingDate || record?.date}
                  </Text>
                )}
              </View>
            )}

            {(attendanceData?.location || isEditing) && (
              <View style={styles.metaRow}>
                <MapPin
                  size={16}
                  color={theme.colors.textLight}
                  strokeWidth={2}
                />
                {isEditing ? (
                  <TextInput
                    style={styles.metaInput}
                    value={editedLocation}
                    onChangeText={setEditedLocation}
                    placeholder="Enter location"
                    placeholderTextColor={theme.colors.textLight}
                  />
                ) : (
                  <Text style={styles.metaText}>{attendanceData.location}</Text>
                )}
              </View>
            )}

            <View style={styles.metaRow}>
              <Users size={16} color={theme.colors.textLight} strokeWidth={2} />
              <Text style={styles.metaText}>
                {people.length} {people.length === 1 ? "Attendee" : "Attendees"}
              </Text>
            </View>
          </View>

          {/* Description */}
          {(attendanceData?.description || isEditing) && (
            <View style={styles.descriptionContainer}>
              <View style={styles.descriptionHeader}>
                <FileText
                  size={16}
                  color={theme.colors.textLight}
                  strokeWidth={2}
                />
                <Text style={styles.descriptionLabel}>Description</Text>
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.descriptionInput}
                  value={editedDescription}
                  onChangeText={setEditedDescription}
                  placeholder="Enter description"
                  placeholderTextColor={theme.colors.textLight}
                  multiline
                  numberOfLines={4}
                />
              ) : (
                <Text style={styles.descriptionText}>
                  {attendanceData.description}
                </Text>
              )}
            </View>
          )}
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          date={editedDate || new Date()}
          onConfirm={(date) => {
            setEditedDate(date);
            setDatePickerVisibility(false);
          }}
          onCancel={() => setDatePickerVisibility(false)}
        />

        {/* Attachments */}
        {(isEditing
          ? editedAttachments.length > 0
          : attachments.length > 0) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Attachments</Text>
              {isEditing && (
                <View style={styles.addButtonsRow}>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddAttachmentFromGallery}
                  >
                    <ImageIcon
                      size={16}
                      color={theme.colors.primaryDark}
                      strokeWidth={2}
                    />
                    <Text style={styles.addButtonText}>Gallery</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddAttachmentFromCamera}
                  >
                    <Camera
                      size={16}
                      color={theme.colors.primaryDark}
                      strokeWidth={2}
                    />
                    <Text style={styles.addButtonText}>Camera</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.attachmentsGrid}>
              {(isEditing ? editedAttachments : attachments).map((att, idx) => {
                const imageUri = isEditing
                  ? (att as EditableAttachment).uri
                  : (att as AttachmentWithCaption).url;
                return (
                  <View
                    key={`${imageUri}-${idx}`}
                    style={styles.attachmentItem}
                  >
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.attachmentImage}
                      resizeMode="cover"
                    />
                    {isEditing ? (
                      <>
                        <TextInput
                          style={styles.attachmentCaptionInput}
                          value={att.caption}
                          onChangeText={(text) =>
                            handleUpdateAttachmentCaption(idx, text)
                          }
                          placeholder="Add caption..."
                          placeholderTextColor={theme.colors.textLight}
                          multiline
                        />
                        <TouchableOpacity
                          style={styles.removeAttachmentButton}
                          onPress={() => handleRemoveAttachment(idx)}
                        >
                          <X
                            size={16}
                            color={theme.colors.error}
                            strokeWidth={2}
                          />
                        </TouchableOpacity>
                      </>
                    ) : (
                      att.caption && (
                        <Text
                          style={styles.attachmentCaption}
                          numberOfLines={2}
                        >
                          {att.caption}
                        </Text>
                      )
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Add Attachments button when in edit mode and no attachments */}
        {isEditing && editedAttachments.length === 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attachments</Text>
            <View style={styles.addButtonsRow}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddAttachmentFromGallery}
              >
                <ImageIcon
                  size={16}
                  color={theme.colors.primaryDark}
                  strokeWidth={2}
                />
                <Text style={styles.addButtonText}>Add from Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddAttachmentFromCamera}
              >
                <Camera
                  size={16}
                  color={theme.colors.primaryDark}
                  strokeWidth={2}
                />
                <Text style={styles.addButtonText}>Take Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Attendees List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Attendees</Text>
            {isEditing && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddAttendee}
              >
                <Plus
                  size={16}
                  color={theme.colors.primaryDark}
                  strokeWidth={2}
                />
                <Text style={styles.addButtonText}>Add Attendee</Text>
              </TouchableOpacity>
            )}
          </View>

          {(isEditing ? editedAttendees : people).length === 0 ? (
            <View style={styles.emptyState}>
              <Users
                size={48}
                color={theme.colors.textLight}
                strokeWidth={1.5}
              />
              <Text style={styles.emptyStateText}>
                {isEditing
                  ? "No attendees. Tap 'Add Attendee' to add one."
                  : "No attendees recorded for this event"}
              </Text>
            </View>
          ) : (
            (isEditing ? editedAttendees : people).map((person, index) => {
              const statusBadge = getStatusBadge(person.status);
              return (
                <View
                  key={person.id}
                  style={[
                    styles.attendeeCard,
                    index ===
                      (isEditing ? editedAttendees : people).length - 1 &&
                      styles.lastAttendeeCard,
                  ]}
                >
                  {isEditing ? (
                    <>
                      <View style={styles.attendeeEditHeader}>
                        <TextInput
                          style={styles.attendeeInput}
                          value={person.name}
                          onChangeText={(text) =>
                            handleUpdateAttendee(index, "name", text)
                          }
                          placeholder="Name *"
                          placeholderTextColor={theme.colors.textLight}
                        />
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => handleRemoveAttendee(index)}
                        >
                          <X
                            size={20}
                            color={theme.colors.error}
                            strokeWidth={2}
                          />
                        </TouchableOpacity>
                      </View>
                      <TextInput
                        style={styles.attendeeInput}
                        value={person.position}
                        onChangeText={(text) =>
                          handleUpdateAttendee(index, "position", text)
                        }
                        placeholder="Position"
                        placeholderTextColor={theme.colors.textLight}
                      />
                      <TextInput
                        style={styles.attendeeInput}
                        value={person.agency || ""}
                        onChangeText={(text) =>
                          handleUpdateAttendee(index, "agency", text)
                        }
                        placeholder="Agency"
                        placeholderTextColor={theme.colors.textLight}
                      />
                      <View style={styles.statusPickerContainer}>
                        <Text style={styles.statusPickerLabel}>Status:</Text>
                        <View style={styles.statusPicker}>
                          {["IN_PERSON", "ONLINE", "ABSENT"].map((status) => (
                            <TouchableOpacity
                              key={status}
                              style={[
                                styles.statusOption,
                                person.status === status &&
                                  styles.statusOptionSelected,
                              ]}
                              onPress={() =>
                                handleUpdateAttendee(index, "status", status)
                              }
                            >
                              <Text
                                style={[
                                  styles.statusOptionText,
                                  person.status === status &&
                                    styles.statusOptionTextSelected,
                                ]}
                              >
                                {status === "IN_PERSON"
                                  ? "In Person"
                                  : status === "ONLINE"
                                    ? "Online"
                                    : "Absent"}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.attendeeHeader}>
                        <View style={styles.attendeeInfo}>
                          <Text style={styles.attendeeName}>{person.name}</Text>
                          {person.position && (
                            <Text style={styles.attendeePosition}>
                              {person.position}
                            </Text>
                          )}
                          {person.agency && (
                            <Text style={styles.attendeeAgency}>
                              {person.agency}
                            </Text>
                          )}
                        </View>

                        <View
                          style={[
                            styles.statusBadge,
                            { backgroundColor: statusBadge.color + "15" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusText,
                              { color: statusBadge.color },
                            ]}
                          >
                            {statusBadge.label}
                          </Text>
                        </View>
                      </View>

                      {person.signatureUrl && (
                        <View style={styles.signatureContainer}>
                          <Text style={styles.signatureLabel}>Signature:</Text>
                          <Image
                            source={{ uri: person.signatureUrl }}
                            style={styles.signatureImage}
                            resizeMode="contain"
                          />
                        </View>
                      )}
                    </>
                  )}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  headerCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    ...theme.shadows.light,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textLight,
    fontWeight: "500",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 8,
    backgroundColor: theme.colors.background,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.error + "10",
  },
  metaContainer: {
    gap: 8,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: theme.colors.textLight,
    fontWeight: "500",
  },
  dateButton: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: theme.colors.surface,
  },
  metaInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: "500",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 4,
    padding: 4,
    backgroundColor: theme.colors.background,
  },
  descriptionContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  descriptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  descriptionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textLight,
  },
  descriptionText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  descriptionInput: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 8,
    backgroundColor: theme.colors.background,
    minHeight: 80,
    textAlignVertical: "top",
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  addButtonsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.primaryDark,
  },
  attachmentsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  attachmentItem: {
    width: 160,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    overflow: "hidden",
    ...theme.shadows.light,
    position: "relative",
  },
  attachmentImage: {
    width: 160,
    height: 120,
    backgroundColor: theme.colors.surface,
  },
  attachmentCaption: {
    padding: 8,
    fontSize: 12,
    color: theme.colors.textLight,
    fontStyle: "italic",
    lineHeight: 16,
  },
  attachmentCaptionInput: {
    padding: 8,
    fontSize: 12,
    color: theme.colors.text,
    lineHeight: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    minHeight: 40,
    textAlignVertical: "top",
  },
  removeAttachmentButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.light,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginTop: 12,
    textAlign: "center",
  },
  attendeeCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...theme.shadows.light,
  },
  lastAttendeeCard: {
    marginBottom: 0,
  },
  attendeeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  attendeeInfo: {
    flex: 1,
    marginRight: 12,
  },
  attendeeName: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 4,
  },
  attendeePosition: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: 2,
  },
  attendeeAgency: {
    fontSize: 13,
    color: theme.colors.textLight,
    fontStyle: "italic",
  },
  attendeeEditHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  attendeeInput: {
    fontSize: 14,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 10,
    backgroundColor: theme.colors.surface,
    marginBottom: 8,
  },
  removeButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: theme.colors.error + "15",
  },
  statusPickerContainer: {
    marginTop: 4,
  },
  statusPickerLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textLight,
    marginBottom: 8,
  },
  statusPicker: {
    flexDirection: "row",
    gap: 8,
  },
  statusOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
  },
  statusOptionSelected: {
    backgroundColor: theme.colors.primaryDark + "15",
    borderColor: theme.colors.primaryDark,
  },
  statusOptionText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textLight,
  },
  statusOptionTextSelected: {
    color: theme.colors.primaryDark,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  signatureContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  signatureLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textLight,
    marginBottom: 8,
  },
  signatureImage: {
    width: "100%",
    height: 100,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});

export default AttendanceDetailScreen;
