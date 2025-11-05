// styleHelpers.ts - Helper functions for consistent styling
import { Platform, ViewStyle, TextStyle } from "react-native";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  BORDER_RADIUS,
  SHADOWS,
  OPACITY,
} from "../constants/sharedStyles";

/**
 * Creates a card style with consistent styling
 */
export const createCardStyle = (options?: {
  padding?: number;
  borderRadius?: number;
  shadow?: keyof typeof SHADOWS;
  borderColor?: string;
}): ViewStyle => ({
  backgroundColor: COLORS.surface,
  borderRadius: options?.borderRadius ?? BORDER_RADIUS.xl,
  borderWidth: 1,
  borderColor: options?.borderColor ?? COLORS.border,
  padding: options?.padding ?? SPACING.xl,
  ...(options?.shadow ? SHADOWS[options.shadow] : SHADOWS.medium),
});

/**
 * Creates a button style with consistent styling
 */
export const createButtonStyle = (options?: {
  backgroundColor?: string;
  paddingVertical?: number;
  paddingHorizontal?: number;
  borderRadius?: number;
  shadow?: keyof typeof SHADOWS;
  disabled?: boolean;
}): ViewStyle => ({
  backgroundColor: options?.backgroundColor ?? COLORS.primary,
  paddingVertical: options?.paddingVertical ?? SPACING.lg,
  paddingHorizontal: options?.paddingHorizontal ?? SPACING.xl,
  borderRadius: options?.borderRadius ?? BORDER_RADIUS.xl,
  alignItems: "center",
  justifyContent: "center",
  opacity: options?.disabled ? OPACITY.disabled : 1,
  ...(options?.shadow ? SHADOWS[options.shadow] : SHADOWS.primaryMedium),
});

/**
 * Creates an input field style with consistent styling
 */
export const createInputStyle = (options?: {
  borderRadius?: number;
  minHeight?: number;
  fontSize?: number;
  multiline?: boolean;
}): ViewStyle & TextStyle => ({
  borderWidth: 1.5,
  borderColor: COLORS.borderDark,
  borderRadius: options?.borderRadius ?? BORDER_RADIUS.md,
  paddingHorizontal: SPACING.lg,
  paddingVertical: SPACING.md,
  fontSize: options?.fontSize ?? TYPOGRAPHY.fontSize.base,
  backgroundColor: COLORS.surface,
  minHeight: options?.minHeight ?? 50,
  color: COLORS.textPrimary,
  lineHeight: TYPOGRAPHY.lineHeight.relaxed,
  ...(options?.multiline && { textAlignVertical: "top" as const }),
});

/**
 * Creates a section header style with consistent styling
 */
export const createSectionHeaderStyle = (options?: {
  backgroundColor?: string;
  borderColor?: string;
  padding?: number;
}): ViewStyle => ({
  backgroundColor: options?.backgroundColor ?? COLORS.blueLight,
  paddingVertical: SPACING.lg,
  paddingHorizontal: options?.padding ?? SPACING.xl,
  borderRadius: BORDER_RADIUS.lg,
  borderWidth: 1,
  borderColor: options?.borderColor ?? COLORS.blueBorder,
  marginBottom: SPACING.xl,
  ...SHADOWS.light,
});

/**
 * Creates a heading text style with consistent styling
 */
export const createHeadingStyle = (
  level: 1 | 2 | 3 | 4,
  options?: {
    color?: string;
    letterSpacing?: number;
  }
): TextStyle => {
  const fontSizes = {
    1: TYPOGRAPHY.fontSize.huge,
    2: TYPOGRAPHY.fontSize.xxl,
    3: TYPOGRAPHY.fontSize.xl,
    4: TYPOGRAPHY.fontSize.lg,
  };

  const letterSpacings = {
    1: TYPOGRAPHY.letterSpacing.tight,
    2: TYPOGRAPHY.letterSpacing.tighter,
    3: TYPOGRAPHY.letterSpacing.normal,
    4: TYPOGRAPHY.letterSpacing.wide,
  };

  return {
    fontSize: fontSizes[level],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: options?.color ?? COLORS.textPrimary,
    letterSpacing: options?.letterSpacing ?? letterSpacings[level],
  };
};

/**
 * Creates a body text style with consistent styling
 */
export const createBodyStyle = (
  size: "small" | "regular" | "large",
  options?: {
    color?: string;
    lineHeight?: number;
  }
): TextStyle => {
  const fontSizes = {
    small: TYPOGRAPHY.fontSize.sm,
    regular: TYPOGRAPHY.fontSize.md,
    large: TYPOGRAPHY.fontSize.base,
  };

  const lineHeights = {
    small: TYPOGRAPHY.lineHeight.tight,
    regular: TYPOGRAPHY.lineHeight.normal,
    large: TYPOGRAPHY.lineHeight.relaxed,
  };

  return {
    fontSize: fontSizes[size],
    color: options?.color ?? COLORS.textSecondary,
    lineHeight: options?.lineHeight ?? lineHeights[size],
  };
};

/**
 * Creates an icon button style with consistent styling
 */
export const createIconButtonStyle = (options?: {
  size?: number;
  backgroundColor?: string;
  shadow?: keyof typeof SHADOWS;
}): ViewStyle => {
  const size = options?.size ?? 42;
  return {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: options?.backgroundColor ?? COLORS.primaryLight + "25",
    alignItems: "center",
    justifyContent: "center",
    ...(options?.shadow ? SHADOWS[options.shadow] : SHADOWS.light),
  };
};

/**
 * Creates a container style with consistent padding
 */
export const createContainerStyle = (options?: {
  padding?: number;
  backgroundColor?: string;
}): ViewStyle => ({
  paddingHorizontal: options?.padding ?? SPACING.xl,
  backgroundColor: options?.backgroundColor ?? COLORS.background,
});

/**
 * Creates a divider style
 */
export const createDividerStyle = (options?: {
  height?: number;
  color?: string;
  marginVertical?: number;
}): ViewStyle => ({
  height: options?.height ?? 1,
  backgroundColor: options?.color ?? COLORS.border,
  marginVertical: options?.marginVertical ?? SPACING.lg,
});

/**
 * Creates an empty state style
 */
export const createEmptyStateStyle = (): {
  container: ViewStyle;
  title: TextStyle;
  message: TextStyle;
} => ({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.massive,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
    letterSpacing: TYPOGRAPHY.letterSpacing.tighter,
  },
  message: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
    textAlign: "center",
    lineHeight: TYPOGRAPHY.lineHeight.relaxed,
  },
});

/**
 * Creates a Platform-specific shadow
 */
export const createShadow = (options: {
  color?: string;
  offsetHeight?: number;
  opacity?: number;
  radius?: number;
  elevation?: number;
}): ViewStyle => {
  return Platform.select({
    ios: {
      shadowColor: options.color ?? "#000",
      shadowOffset: { width: 0, height: options.offsetHeight ?? 4 },
      shadowOpacity: options.opacity ?? 0.08,
      shadowRadius: options.radius ?? 12,
    },
    android: {
      elevation: options.elevation ?? 4,
    },
  }) as ViewStyle;
};

/**
 * Applies responsive spacing based on screen size
 */
export const responsiveSpacing = (
  baseSize: number,
  isTablet?: boolean
): number => {
  return isTablet ? baseSize * 1.5 : baseSize;
};

/**
 * Creates a badge/pill style
 */
export const createBadgeStyle = (options?: {
  backgroundColor?: string;
  textColor?: string;
  size?: "small" | "medium" | "large";
}): { container: ViewStyle; text: TextStyle } => {
  const sizes = {
    small: {
      paddingVertical: SPACING.xs,
      paddingHorizontal: SPACING.sm,
      fontSize: TYPOGRAPHY.fontSize.xs,
    },
    medium: {
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md,
      fontSize: TYPOGRAPHY.fontSize.sm,
    },
    large: {
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.lg,
      fontSize: TYPOGRAPHY.fontSize.base,
    },
  };

  const size = options?.size ?? "medium";

  return {
    container: {
      backgroundColor: options?.backgroundColor ?? COLORS.primary,
      paddingVertical: sizes[size].paddingVertical,
      paddingHorizontal: sizes[size].paddingHorizontal,
      borderRadius: BORDER_RADIUS.round,
      alignSelf: "flex-start",
    },
    text: {
      color: options?.textColor ?? COLORS.surface,
      fontSize: sizes[size].fontSize,
      fontWeight: TYPOGRAPHY.fontWeight.bold,
      letterSpacing: TYPOGRAPHY.letterSpacing.wide,
    },
  };
};
