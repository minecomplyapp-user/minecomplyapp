import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { CustomHeader } from "../../components/CustomHeader";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { theme } from "../../theme/theme";
import styles from "./styles/profileScreen";
import { FloatingLabelInput } from "../auth/components/FloatingLabelInput";

const EditProfileScreen = ({ navigation }: any) => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [position, setPosition] = useState("");
  const [mailingAddress, setMailingAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fax, setFax] = useState("");

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select(
            "first_name,last_name,position,mailing_address,phone_number,fax"
          )
          .eq("id", user.id)
          .single();
        if (error && (error as any).code !== "PGRST116") throw error;
        if (data) {
          setFirstName(data.first_name || "");
          setLastName(data.last_name || "");
          setPosition(data.position || "");
          setMailingAddress(data.mailing_address || "");
          setPhoneNumber(data.phone_number || "");
          setFax(data.fax || "");
        }
      } catch (e: any) {
        console.error("Failed to load profile for edit", e);
        Alert.alert("Error", "Failed to load your profile details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: firstName.trim() || null,
          last_name: lastName.trim() || null,
          position: position.trim() || null,
          mailing_address: mailingAddress.trim() || null,
          phone_number: phoneNumber.trim() || null,
          fax: fax.trim() || null,
        })
        .eq("id", user.id);

      if (error) throw error;

      Alert.alert("Saved", "Your profile has been updated.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      console.error("Failed to save profile", e);
      Alert.alert("Error", e.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={theme.colors.primaryDark} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <CustomHeader showSave onSave={handleSave} saveDisabled={saving} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.section}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.sectionTitle}>Edit Profile</Text>
              </View>

              <FloatingLabelInput
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
              />
              <FloatingLabelInput
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
              />
              <FloatingLabelInput
                label="Position"
                value={position}
                onChangeText={setPosition}
              />
              <FloatingLabelInput
                label="Mailing Address"
                value={mailingAddress}
                onChangeText={setMailingAddress}
              />
              <FloatingLabelInput
                label="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
              <FloatingLabelInput
                label="Fax"
                value={fax}
                onChangeText={setFax}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
