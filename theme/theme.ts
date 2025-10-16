// theme/theme.ts

export const theme = {
  // ✅ Core color system — elegant green palette
  colors: {
    primary: '#2F855A',        // Main green — calm and natural
    primaryLight: '#48BB78',   // Soft, vibrant green
    primaryDark: '#22543D',    // Deep forest green for contrast
    background: '#F5F6F4',     // Light neutral background
    surface: '#FFFFFF',        // Card/section white
    text: '#1A1A1A',           // Default text color (dark gray)
    textLight: '#6B7280',      // Muted/subtext color
    border: '#E5E7EB',         // Soft neutral border
    error: '#E53E3E',          // Red error tone
    success: '#38A169',        // Success green
  },

  // ✅ Gradients — subtle depth and variation in green tones
  gradients: {
    primary: ['#2F855A', '#48BB78'],   // Deep to light green gradient
    success: ['#38A169', '#68D391'],   // Success gradient
  },

  // ✅ Typography — Lexend Deca family
  typography: {
    regular: 'LexendDeca_400Regular',
    medium: 'LexendDeca_500Medium',
    semibold: 'LexendDeca_600SemiBold',
    bold: 'LexendDeca_700Bold',

    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
      '2xl': 32,
    },
  },

  // ✅ Spacing — consistent paddings & margins
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
  },

  // ✅ Rounded corners for UI consistency
  radii: {
    sm: 6,
    md: 10,
    lg: 16,
    xl: 24,
  },

  // ✅ Shadows — subtle depth for cards & buttons
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 3,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 5,
    },
  },
} as const;
