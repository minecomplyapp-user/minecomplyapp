import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import {
  HelpCircle,
  Bug,
  FileText as FileTextIcon,
  Info,
  LogOut,
  ChevronRight,
  Edit3,
} from "lucide-react-native";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { theme } from "../../theme/theme";
import styles from "./styles/profileScreen";
import { CustomHeader } from "../../components/CustomHeader";

const emptyProfile = {
  id: null,
  first_name: "",
  last_name: "",
  position: "",
  mailing_address: "",
  telephone: "",
  phone_number: "",
  fax: "",
  email: "",
};

const ProfileScreen = ({ navigation }: any) => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>({
    ...emptyProfile,
    email: user?.email || "",
  });

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  async function fetchProfile() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error && (error as any).code !== "PGRST116") throw error;

      if (data) {
        const { full_name, first_name, last_name, ...restData } = data;
        let finalFirstName = first_name;
        let finalLastName = last_name;
        if (full_name && !first_name && !last_name) {
          const nameParts = full_name.split(" ");
          finalFirstName = nameParts[0] || "";
          finalLastName = nameParts.slice(1).join(" ") || "";
        }
        setProfile({
          ...emptyProfile,
          ...restData,
          first_name: finalFirstName,
          last_name: finalLastName,
          email: user?.email || "",
        });
      }
    } catch (err: any) {
      console.error("Error fetching profile", err);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch (error: any) {
            Alert.alert("Error", error.message);
          }
        },
      },
    ]);
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

  const fullName =
    `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
    "No Name";
  const phoneDisplay = (profile.phone_number || profile.telephone || "").trim();
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <CustomHeader showSave={false} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header - REBUILT */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {fullName}
            </Text>
            <Text style={styles.userRole} numberOfLines={1}>
              {profile.email || "No email"}
            </Text>
          </View>
          {/* NEW Edit Profile Button */}
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Edit3 size={16} color="#fff" />
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Account Information Card - REBUILT */}
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.sectionTitle}>Account Information</Text>
            </View>
            <DisplayField label="First Name" value={profile.first_name} />
            <DisplayField label="Last Name" value={profile.last_name} />
            <DisplayField label="Position" value={profile.position} />
            <DisplayField
              label="Mailing Address"
              value={profile.mailing_address}
            />
            <DisplayField label="Phone Number" value={phoneDisplay} />
            <DisplayField label="Fax" value={profile.fax} />
            <DisplayField label="Email" value={profile.email} />
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.card}>
            <MenuItem icon={HelpCircle} title="Help & FAQ" />
            <View style={styles.divider} />
            <MenuItem icon={Bug} title="Report a Bug" />
            <View style={styles.divider} />
            <MenuItem icon={FileTextIcon} title="Terms & Privacy" />
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <MenuItem
              icon={Info}
              title="App Version"
              rightContent="1.0.0 (Beta)"
            />
          </View>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <LogOut size={20} color={theme.colors.error} />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>MineComply © 2024</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const DisplayField = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <Text style={styles.fieldValue}>{value || "—"}</Text>
  </View>
);

type MenuItemProps = {
  icon: React.ElementType;
  title: string;
  rightContent?: string;
};

const MenuItem = ({ icon: Icon, title, rightContent }: MenuItemProps) => (
  <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
    <View style={styles.menuItemIcon}>
      <Icon size={20} color={theme.colors.primaryDark} />
    </View>
    <Text style={styles.menuItemText}>{title}</Text>
    {rightContent ? (
      <Text style={styles.menuItemRightText}>{rightContent}</Text>
    ) : (
      <ChevronRight size={20} color={theme.colors.textLight} />
    )}
  </TouchableOpacity>
);

export default ProfileScreen;
