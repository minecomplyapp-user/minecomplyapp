import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  SafeAreaView,
  Alert,
} from "react-native";
import SignatureScreen from "react-native-signature-canvas";
import { Feather } from "@expo/vector-icons";
import { theme } from "../../theme/theme";
import { createAttendanceStyles as styles } from "../../styles/createAttendanceScreen";
import { CustomHeader } from "../../components/CustomHeader";

// RadioButton component (gi tapol ko ug separate gamay rakayo sila bitaw)
const RadioButton = ({ label, value, selectedValue, onSelect, hasError, containerStyle }: any) => {
  const isSelected = value === selectedValue;
  return (
    <TouchableOpacity style={[styles.radioButtonContainer, containerStyle]} onPress={() => onSelect(value)}>
      <View style={[
        styles.radioButton,
        isSelected && styles.radioButtonSelected,
        hasError && styles.radioError,
      ]}>
        {isSelected && <View style={styles.radioButtonInner} />}
      </View>
      <Text style={[styles.radioButtonLabel, hasError && styles.labelError]}>{label}</Text>
    </TouchableOpacity>
  );
};


export default function CreateAttendanceScreen({ navigation }: any) {
  const [fileName, setFileName] = useState("");
  const [attendees, setAttendees] = useState([
    { id: 1, name: "", agency: "", position: "", attendance: "", signature: "" },
  ]);

  const [isSigning, setIsSigning] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const signatureRefs = useRef<{ [key: number]: any }>({});
  const [scaleAnim] = useState(new Animated.Value(1));

  // --- Animation Handlers ---
  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
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
      { id: Date.now(), name: "", agency: "", position: "", attendance: "", signature: "" },
    ]);
  };

  const removeAttendee = (id: number) => {
    setAttendees(attendees.filter((a) => a.id !== id));
    delete signatureRefs.current[id];
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

    // Clear error for this specific field
    if (errors.attendees?.[id]?.[field]) {
      setErrors((prevErrors: any) => {
        const newErrors = { ...prevErrors };
        if (newErrors.attendees?.[id]) {
          delete newErrors.attendees[id][field];
          if (Object.keys(newErrors.attendees[id]).length === 0) {
            delete newErrors.attendees[id];
          }
        }
        return newErrors;
      });
    }
  };


  const handleClearSignature = (id: number) => {
    if (signatureRefs.current[id]) {
      signatureRefs.current[id].clearSignature();
    }
    updateField(id, "signature", ""); // This will also clear the error
  };

  // --- Validation and Save ---
  const validate = () => {
    const newErrors: any = { attendees: {} };
    let isValid = true;

    if (!fileName.trim()) {
      newErrors.fileName = true;
      isValid = false;
    }

    attendees.forEach(attendee => {
      const attendeeErrors: any = {};
      if (!attendee.name.trim()) { attendeeErrors.name = true; isValid = false; }
      if (!attendee.agency.trim()) { attendeeErrors.agency = true; isValid = false; }
      if (!attendee.position.trim()) { attendeeErrors.position = true; isValid = false; }
      if (!attendee.attendance.trim()) { attendeeErrors.attendance = true; isValid = false; }
      if (!attendee.signature.trim()) { attendeeErrors.signature = true; isValid = false; }

      if (Object.keys(attendeeErrors).length > 0) {
        newErrors.attendees[attendee.id] = attendeeErrors;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (validate()) {
      console.log("Save attendance", { fileName, attendees });
      Alert.alert("Success", "Attendance record saved!");
      // Add your save logic here
    } else {
      Alert.alert("Error", "Please fill in all required fields highlighted in red.");
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <CustomHeader onSave={handleSave} showSave />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={!isSigning}
      >
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create Attendance Record</Text>
          <Text style={styles.headerSubtitle}>Fill out attendance details below.</Text>
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
                errors.fileName && styles.inputError
              ]}
              placeholderTextColor="#C0C0C0"
            />
            {errors.fileName && <Text style={styles.errorText}>File Name is required</Text>}
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
                    <Feather name="trash-2" size={16} color={theme.colors.error} />
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
                    errors.attendees?.[attendee.id]?.name && styles.inputError
                  ]}
                  placeholderTextColor="#C0C0C0"
                />
                {errors.attendees?.[attendee.id]?.name && <Text style={styles.errorText}>Name is required</Text>}
              </View>

              {/* Agency */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Agency / Office</Text>
                <TextInput
                  placeholder="Enter agency or office"
                  value={attendee.agency}
                  onChangeText={(val) => updateField(attendee.id, "agency", val)}
                  style={[
                    styles.input,
                    attendee.agency && styles.inputFilled,
                    errors.attendees?.[attendee.id]?.agency && styles.inputError
                  ]}
                  placeholderTextColor="#C0C0C0"
                />
                {errors.attendees?.[attendee.id]?.agency && <Text style={styles.errorText}>Agency/Office is required</Text>}
              </View>

              {/* Position */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Position</Text>
                <TextInput
                  placeholder="Enter position"
                  value={attendee.position}
                  onChangeText={(val) => updateField(attendee.id, "position", val)}
                  style={[
                    styles.input,
                    attendee.position && styles.inputFilled,
                    errors.attendees?.[attendee.id]?.position && styles.inputError
                  ]}
                  placeholderTextColor="#C0C0C0"
                />
                {errors.attendees?.[attendee.id]?.position && <Text style={styles.errorText}>Position is required</Text>}
              </View>

              {/* Meeting Attendance */}
              <View style={styles.inputContainer}>
                <Text style={[
                  styles.label,
                  errors.attendees?.[attendee.id]?.attendance && styles.labelError
                ]}>
                  Meeting Attendance
                </Text>
                <View style={styles.radioGroup}>
                  {["In Person", "Online", "Absent"].map((type, index, arr) => (
                    <RadioButton
                      key={type}
                      label={type}
                      value={type}
                      selectedValue={attendee.attendance}
                      onSelect={(val: string) => updateField(attendee.id, "attendance", val)}
                      hasError={errors.attendees?.[attendee.id]?.attendance}
                      containerStyle={index === arr.length - 1 ? { marginRight: 0 } : {}}
                    />
                  ))}
                </View>
                {errors.attendees?.[attendee.id]?.attendance && <Text style={styles.errorText}>Please select an attendance type</Text>}
              </View>

              {/* Signature */}
              <View style={styles.inputContainer}>
                <Text style={[
                  styles.label,
                  errors.attendees?.[attendee.id]?.signature && styles.labelError
                ]}>
                  Signature
                </Text>
                <View style={styles.signatureWrapper}>
                  <View style={[
                    styles.signatureContainer,
                    errors.attendees?.[attendee.id]?.signature && styles.inputError
                  ]}>
                    <SignatureScreen
                      ref={(ref) => {
                        if (ref) {
                          signatureRefs.current[attendee.id] = ref;
                        }
                      }}
                      webStyle={`.m-signature-pad { box-shadow: none; border: none; } 
                                 .m-signature-pad--body { border: none; }
                                 .m-signature-pad--footer { display: none; margin: 0px; }`}
                      onBegin={() => setIsSigning(true)}
                      onEnd={() => setIsSigning(false)}
                      onOK={(sig) => {
                        updateField(attendee.id, "signature", sig);
                        setIsSigning(false);
                      }}
                      onEmpty={() => {
                        updateField(attendee.id, "signature", "");
                        setIsSigning(false);
                      }}
                      autoClear={false}
                      backgroundColor="#fff"
                      penColor={'black'}
                    />
                  </View>
                </View>
                {errors.attendees?.[attendee.id]?.signature && <Text style={styles.errorText}>Signature is required</Text>}

                <View style={styles.signatureActions}>
                  <TouchableOpacity
                    style={styles.sigActionButton}
                    onPress={() => handleClearSignature(attendee.id)}
                  >
                    <Feather name="x" size={16} color={theme.colors.primaryDark} />
                    <Text style={styles.sigActionText}>Clear</Text>
                  </TouchableOpacity>
                </View>
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
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Feather name="save" size={20} color="#fff" />
            <Text style={styles.saveButtonText}>Save Attendance</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

