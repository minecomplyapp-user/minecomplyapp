# CMVRPAGE Design System

This document describes the standardized design system for all CMVRPAGE components.

## 📁 Structure

```
CMVRPAGE/
├── constants/
│   └── sharedStyles.ts      # Color palette, spacing, typography, shadows
├── utils/
│   ├── styleHelpers.ts      # Helper functions for consistent styling
│   └── cmvrSteps.ts         # CMVR flow step definitions
├── components/
│   ├── ProgressIndicator.tsx # Progress tracking component
│   └── ConfirmationDialog.tsx # Confirmation dialog component
└── index.ts                  # Centralized exports
```

## 🎨 Design Tokens

### Colors

Import from `sharedStyles.ts`:

```typescript
import { COLORS } from "@/screens/CMVRPAGE/constants/sharedStyles";

// Primary Colors
COLORS.primary; // #1E3A8A - Main brand color
COLORS.primaryLight; // #3B82F6 - Lighter variant
COLORS.primaryDark; // #1E40AF - Darker variant

// Background Colors
COLORS.background; // #F1F5F9 - Main background
COLORS.surface; // #FFFFFF - Card/surface background
COLORS.surfaceLight; // #F8FAFC - Subtle surface
COLORS.surfaceAccent; // #FAFBFC - Accent surface

// Text Colors
COLORS.textPrimary; // #0F172A - Primary text
COLORS.textSecondary; // #1E293B - Secondary text
COLORS.textLight; // #64748B - Light text
COLORS.textMuted; // #475569 - Muted text

// Status Colors
COLORS.success; // #10B981
COLORS.warning; // #F59E0B
COLORS.error; // #EF4444
COLORS.info; // #3B82F6
```

### Spacing

Consistent spacing scale:

```typescript
import { SPACING } from "@/screens/CMVRPAGE/constants/sharedStyles";

SPACING.xs; // 4px
SPACING.sm; // 8px
SPACING.md; // 12px
SPACING.lg; // 16px
SPACING.xl; // 20px
SPACING.xxl; // 24px
SPACING.xxxl; // 28px
SPACING.huge; // 32px
SPACING.massive; // 40px
```

### Typography

Font sizes, weights, and letter spacing:

```typescript
import { TYPOGRAPHY } from "@/screens/CMVRPAGE/constants/sharedStyles";

// Font Sizes
TYPOGRAPHY.fontSize.xs; // 12px
TYPOGRAPHY.fontSize.sm; // 13px
TYPOGRAPHY.fontSize.md; // 14px
TYPOGRAPHY.fontSize.base; // 15px
TYPOGRAPHY.fontSize.lg; // 16px
TYPOGRAPHY.fontSize.xl; // 17px
TYPOGRAPHY.fontSize.xxl; // 19px
TYPOGRAPHY.fontSize.huge; // 22px

// Font Weights
TYPOGRAPHY.fontWeight.regular; // 400
TYPOGRAPHY.fontWeight.semibold; // 600
TYPOGRAPHY.fontWeight.bold; // 700

// Letter Spacing
TYPOGRAPHY.letterSpacing.tight; // -0.5
TYPOGRAPHY.letterSpacing.normal; // 0
TYPOGRAPHY.letterSpacing.wide; // 0.2
TYPOGRAPHY.letterSpacing.superWide; // 0.8
```

### Shadows

Platform-specific shadows:

```typescript
import { SHADOWS } from "@/screens/CMVRPAGE/constants/sharedStyles";

SHADOWS.light; // Subtle shadow for cards
SHADOWS.medium; // Medium shadow for elevated elements
SHADOWS.strong; // Strong shadow for modals
SHADOWS.primaryMedium; // Primary-colored shadow for buttons
```

### Border Radius

Consistent corner rounding:

```typescript
import { BORDER_RADIUS } from "@/screens/CMVRPAGE/constants/sharedStyles";

BORDER_RADIUS.sm; // 8px
BORDER_RADIUS.md; // 12px
BORDER_RADIUS.lg; // 14px
BORDER_RADIUS.xl; // 16px
BORDER_RADIUS.xxl; // 18px
BORDER_RADIUS.round; // 999px - Fully rounded
```

## 🛠️ Style Helpers

### Create Card

```typescript
import { createCardStyle } from "@/screens/CMVRPAGE/utils/styleHelpers";

const styles = StyleSheet.create({
  card: createCardStyle({
    padding: 20,
    borderRadius: 16,
    shadow: "medium",
  }),
});
```

### Create Button

```typescript
import { createButtonStyle } from "@/screens/CMVRPAGE/utils/styleHelpers";

const styles = StyleSheet.create({
  button: createButtonStyle({
    backgroundColor: COLORS.primary,
    shadow: "primaryMedium",
  }),
});
```

### Create Input

```typescript
import { createInputStyle } from "@/screens/CMVRPAGE/utils/styleHelpers";

const styles = StyleSheet.create({
  input: createInputStyle({
    minHeight: 50,
    borderRadius: 12,
  }),
});
```

### Create Heading

```typescript
import { createHeadingStyle } from "@/screens/CMVRPAGE/utils/styleHelpers";

const styles = StyleSheet.create({
  h1: createHeadingStyle(1), // Large heading
  h2: createHeadingStyle(2), // Medium heading
  h3: createHeadingStyle(3), // Small heading
});
```

### Create Icon Button

```typescript
import { createIconButtonStyle } from "@/screens/CMVRPAGE/utils/styleHelpers";

const styles = StyleSheet.create({
  iconButton: createIconButtonStyle({
    size: 42,
    backgroundColor: COLORS.primaryLight + "25",
    shadow: "light",
  }),
});
```

## 📦 Components

### ProgressIndicator

Shows current step in CMVR flow:

```typescript
import { ProgressIndicator } from '@/screens/CMVRPAGE';

<ProgressIndicator
  currentStep={1}
  totalSteps={12}
  stepName="General Information"
/>
```

### ConfirmationDialog

Reusable confirmation modal:

```typescript
import { ConfirmationDialog } from '@/screens/CMVRPAGE';

<ConfirmationDialog
  visible={showDialog}
  title="Unsaved Changes"
  message="Are you sure you want to go back?"
  confirmText="Discard"
  cancelText="Stay"
  onConfirm={handleConfirm}
  onCancel={handleCancel}
  type="warning" // 'warning' | 'info' | 'danger'
/>
```

## 🔄 CMVR Flow Steps

Track progress through the CMVR process:

```typescript
import {
  CMVR_STEPS,
  getTotalSteps,
  getCurrentStepInfo,
} from "@/screens/CMVRPAGE";

// Get total number of steps
const total = getTotalSteps(); // 12

// Get current step info
const stepInfo = getCurrentStepInfo("CMVRReport");
// Returns: { step: 1, name: 'General Information', screenName: 'CMVRReport', ... }
```

## 📝 Usage Examples

### Example 1: Standardized Card

```typescript
import { StyleSheet } from "react-native";
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from "@/screens/CMVRPAGE";

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xl,
    ...SHADOWS.medium,
  },
});
```

### Example 2: Using Helper Functions

```typescript
import { StyleSheet } from "react-native";
import { createCardStyle, createButtonStyle, COLORS } from "@/screens/CMVRPAGE";

const styles = StyleSheet.create({
  card: createCardStyle(), // Uses defaults

  customCard: createCardStyle({
    padding: 24,
    shadow: "strong",
  }),

  primaryButton: createButtonStyle({
    backgroundColor: COLORS.primary,
    shadow: "primaryStrong",
  }),
});
```

### Example 3: Consistent Typography

```typescript
import { StyleSheet } from "react-native";
import { TYPOGRAPHY, COLORS } from "@/screens/CMVRPAGE";

const styles = StyleSheet.create({
  heading: {
    fontSize: TYPOGRAPHY.fontSize.huge,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    letterSpacing: TYPOGRAPHY.letterSpacing.tight,
  },

  body: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.relaxed,
  },
});
```

## ✅ Best Practices

1. **Always use constants** - Never hardcode colors, spacing, or shadows
2. **Use helper functions** - They ensure consistency and reduce code duplication
3. **Platform-specific shadows** - Always use SHADOWS constants for cross-platform support
4. **Semantic naming** - Use design token names that describe purpose, not appearance
5. **Consistent spacing** - Use the SPACING scale for all margins and padding
6. **Typography hierarchy** - Use TYPOGRAPHY constants for all text styling

## 🎯 Migration Guide

To migrate existing components:

1. Import shared constants:

   ```typescript
   import {
     COLORS,
     SPACING,
     TYPOGRAPHY,
     BORDER_RADIUS,
     SHADOWS,
   } from "@/screens/CMVRPAGE";
   ```

2. Replace hardcoded values:

   ```typescript
   // Before
   backgroundColor: "#1E3A8A";
   padding: 20;
   borderRadius: 16;

   // After
   backgroundColor: COLORS.primary;
   padding: SPACING.xl;
   borderRadius: BORDER_RADIUS.xl;
   ```

3. Use helper functions for complex styles:

   ```typescript
   // Before
   card: {
     backgroundColor: 'white',
     borderRadius: 16,
     padding: 20,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 4 },
     shadowOpacity: 0.08,
     shadowRadius: 12,
     elevation: 4,
   }

   // After
   card: createCardStyle()
   ```

## 📊 Design System Benefits

- ✅ **Consistency** - All components share the same visual language
- ✅ **Maintainability** - Update design tokens in one place
- ✅ **Developer Experience** - Clear, semantic naming conventions
- ✅ **Accessibility** - Proper contrast ratios and touch targets
- ✅ **Performance** - Reusable styles reduce memory overhead
- ✅ **Scalability** - Easy to extend and customize

## 🔍 Reference

All design tokens and helpers are documented with TypeScript types for autocomplete support. Import from the centralized index:

```typescript
import {
  // Constants
  COLORS,
  SPACING,
  TYPOGRAPHY,
  BORDER_RADIUS,
  SHADOWS,
  COMMON_STYLES,
  OPACITY,
  ANIMATION,

  // Helpers
  createCardStyle,
  createButtonStyle,
  createInputStyle,
  createHeadingStyle,
  createIconButtonStyle,
  createShadow,

  // Components
  ProgressIndicator,
  ConfirmationDialog,

  // CMVR Flow
  CMVR_STEPS,
  getTotalSteps,
  getCurrentStepInfo,
} from "@/screens/CMVRPAGE";
```
