import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../theme/theme";

interface CustomHeaderProps {
  onSave?: () => void;
  saveDisabled?: boolean;
  showSave?: boolean;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({
  onSave,
  saveDisabled = false,
  showSave = true,
}) => {
  const navigation = useNavigation();

  const handleBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* ✅ Match iPhone notch & Android status bar color */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />

      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.primaryDark} />
        </TouchableOpacity>

        {/* Save Button (conditionally visible) */}
        {showSave && (
          <TouchableOpacity
            onPress={onSave}
            style={styles.saveButton}
            disabled={saveDisabled}
          >
            <Text
              style={[
                styles.saveButtonText,
                { color: theme.colors.primaryDark },
                saveDisabled && { opacity: 0.5 },
              ]}
            >
              Save
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background, 
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 56,
  },
  backButton: {
    padding: 4,
    width: 60,
    alignItems: "flex-start",
  },
  saveButton: {
    width: 60,
    alignItems: "flex-end",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
