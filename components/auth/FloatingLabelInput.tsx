import React, { useState, useRef, useEffect } from "react";
import { View, TextInput, Animated } from "react-native";
import { theme } from "../../theme/theme";
import { styles } from "../../styles/authScreen";
import { moderateScale } from "../../utils/responsive";

interface FloatingLabelInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: string;
  autoCapitalize?: string;
  editable?: boolean;
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  editable = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: "absolute" as const,
    left: moderateScale(16),
    elevation: 2,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [moderateScale(20), moderateScale(-6)],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [moderateScale(16), moderateScale(12)],
    }),
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["#9ca3af", theme.colors.primaryDark],
    }),
    backgroundColor: theme.colors.background,
    paddingHorizontal: moderateScale(4),
  };

  return (
    <View style={styles.inputContainer}>
      <Animated.Text style={[styles.labelBase, labelStyle]}>
        {label}
      </Animated.Text>
      <TextInput
        placeholder={!isFocused && !value ? label : ""}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType as any}
        autoCapitalize={autoCapitalize as any}
        style={[styles.input, (isFocused || value) && styles.inputFocused]}
        editable={editable}
      />
    </View>
  );
};
