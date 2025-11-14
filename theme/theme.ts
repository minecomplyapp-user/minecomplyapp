export const theme = {
  colors: {
    // Primary
    primaryLight: '#2196F3', 
    primaryDark: '#02217C', 
    
    // Secondary
    secondary: '#00BCD4', 
    secondaryDark: '#00838F',

    // Neutrals
    background: '#F5F6F4',
    surface: '#FFFFFF',
    border: '#6b7280',
    title: '#1a1a1a',

    // Text
    text: '#2C3E50', 
    textLight: '#6b7280',

    // Status Colors
    success: '#4CAF50',
    warning: '#FFC107', 
    error: '#F44336', 

    // Additional colors
    iconBackground: '#E3F2FD',
    divider: '#6b7280',
    card: '#FFFFFF',
  },

  gradients: {
    // Gradient from Primary to PrimaryDark
    buttonPrimary: ['#2196F3', '#0D47A1'],
    directionStart: { x: 0, y: 0 },
    directionEnd: { x: 1, y: 0 },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  radii: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 999,
  },

  // --- UPDATED SHADOWS OBJECT ---
  shadows: {

    light: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.00,
      elevation: 1, // Android
    },

    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4, // Android
    },

    strong: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8, // Android
    },

    buttonPrimary: {

      shadowColor: '#0D47A1', 
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 7.49,
      elevation: 12,
    }
  },
  // -------------------------

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
      xxl: 32,
    },
  },
};