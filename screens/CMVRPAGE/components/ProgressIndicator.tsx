// ProgressIndicator.tsx
import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  BORDER_RADIUS,
  SHADOWS,
} from "../constants/sharedStyles";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepName: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepName,
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.infoRow}>
        <View style={styles.stepInfo}>
          <Ionicons name="list" size={18} color="#1E3A8A" />
          <Text style={styles.stepText}>
            Step {currentStep} of {totalSteps}
          </Text>
        </View>
        <Text style={styles.stepName}>{stepName}</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.percentageText}>
        {Math.round(progress)}% Complete
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.light,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  stepInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  stepText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  stepName: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textLight,
    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.blue,
    borderRadius: BORDER_RADIUS.xs,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xs,
  },
  percentageText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
    textAlign: "center",
    letterSpacing: TYPOGRAPHY.letterSpacing.wider,
  },
});

export default ProgressIndicator;
