// sharedStyles.ts - Shared style constants for CMVRPAGE components
import { Platform } from "react-native";

// ============================================
// COLOR PALETTE
// ============================================
export const COLORS = {
  // Primary Colors
  primary: "#1E3A8A",
  primaryLight: "#3B82F6",
  primaryDark: "#1E40AF",

  // Background Colors
  background: "#F1F5F9",
  surface: "#FFFFFF",
  surfaceLight: "#F8FAFC",
  surfaceAccent: "#FAFBFC",

  // Text Colors
  textPrimary: "#0F172A",
  textSecondary: "#1E293B",
  textLight: "#64748B",
  textMuted: "#475569",

  // Border Colors
  border: "#E2E8F0",
  borderLight: "#F1F5F9",
  borderAccent: "#C7D2FE",
  borderDark: "#CBD5E1",

  // Accent Colors
  blue: "#DBEAFE",
  blueLight: "#EFF6FF",
  blueBorder: "#93C5FD",

  // Status Colors
  success: "#10B981",
  successLight: "#D1FAE5",
  warning: "#F59E0B",
  warningLight: "#FEF3C7",
  error: "#EF4444",
  errorLight: "#FEE2E2",
  info: "#3B82F6",
  infoLight: "#DBEAFE",
} as const;

// ============================================
// SPACING SYSTEM
// ============================================
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  huge: 32,
  massive: 40,
} as const;

// ============================================
// TYPOGRAPHY
// ============================================
export const TYPOGRAPHY = {
  fontSize: {
    xs: 12,
    sm: 13,
    md: 14,
    base: 15,
    lg: 16,
    xl: 17,
    xxl: 19,
    xxxl: 20,
    huge: 22,
    massive: 24,
  },
  fontWeight: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
  letterSpacing: {
    tight: -0.5,
    tighter: -0.3,
    normal: 0,
    wide: 0.2,
    wider: 0.3,
    widest: 0.5,
    superWide: 0.8,
  },
  lineHeight: {
    tight: 18,
    normal: 20,
    relaxed: 22,
    loose: 24,
  },
} as const;

// ============================================
// BORDER RADIUS
// ============================================
export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  xxl: 18,
  xxxl: 20,
  round: 999,
} as const;

// ============================================
// SHADOWS (Platform-specific)
// ============================================
export const SHADOWS = {
  none: Platform.select({
    ios: {
      shadowColor: "transparent",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
    },
    android: {
      elevation: 0,
    },
  }),

  light: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
    },
    android: {
      elevation: 2,
    },
  }),

  medium: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    android: {
      elevation: 4,
    },
  }),

  strong: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
    },
    android: {
      elevation: 5,
    },
  }),

  heavy: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
    },
    android: {
      elevation: 8,
    },
  }),

  // Primary color shadows
  primaryLight: Platform.select({
    ios: {
      shadowColor: "#1E3A8A",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    android: {
      elevation: 3,
    },
  }),

  primaryMedium: Platform.select({
    ios: {
      shadowColor: "#1E3A8A",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
    },
    android: {
      elevation: 5,
    },
  }),

  primaryStrong: Platform.select({
    ios: {
      shadowColor: "#1E3A8A",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 14,
    },
    android: {
      elevation: 8,
    },
  }),
} as const;

// ============================================
// COMMON COMPONENT STYLES
// ============================================
export const COMMON_STYLES = {
  // Cards
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xl,
  },

  cardAccent: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xxl,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
    padding: SPACING.xl,
  },

  // Buttons
  button: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },

  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },

  buttonSecondary: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // Input Fields
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.base,
    backgroundColor: COLORS.surface,
    minHeight: 50,
    color: COLORS.textPrimary,
  },

  // Headers
  sectionHeader: {
    backgroundColor: COLORS.blueLight,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.blueBorder,
    marginBottom: SPACING.xl,
  },

  // Text Styles
  heading1: {
    fontSize: TYPOGRAPHY.fontSize.huge,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    letterSpacing: TYPOGRAPHY.letterSpacing.tight,
  },

  heading2: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    letterSpacing: TYPOGRAPHY.letterSpacing.tighter,
  },

  heading3: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
  },

  bodyLarge: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.relaxed,
  },

  bodyRegular: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.normal,
  },

  bodySmall: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
    lineHeight: TYPOGRAPHY.lineHeight.tight,
  },

  label: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
} as const;

// ============================================
// ANIMATION DURATIONS
// ============================================
export const ANIMATION = {
  fast: 150,
  normal: 250,
  slow: 350,
} as const;

// ============================================
// OPACITY VALUES
// ============================================
export const OPACITY = {
  disabled: 0.5,
  pressed: 0.7,
  overlay: 0.5,
  subtle: 0.04,
  light: 0.08,
  medium: 0.15,
} as const;
