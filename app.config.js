try {
  require("dotenv").config();
} catch {}

export default {
  expo: {
    name: "MineComply",
    slug: "minecomplyapp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,

    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },

    android: {
      package: "com.anonymous.minecomplyapp",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      permissions: [
        "WRITE_EXTERNAL_STORAGE",
        "READ_EXTERNAL_STORAGE",
        "CAMERA",
        "RECORD_AUDIO",
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
      ],
    },

    ios: {
      supportsTablet: true,
      infoPlist: {
        NSCameraUsageDescription:
          "This app needs access to the camera to upload photos.",
        NSMicrophoneUsageDescription:
          "This app needs access to the microphone for video recording.",
        NSPhotoLibraryUsageDescription:
          "This app needs access to the photo library to upload images.",
        NSLocationWhenInUseUsageDescription:
          "This app uses your location to provide location-based services.",
        NSLocationAlwaysAndWhenInUseUsageDescription:
          "This app may need your location even when not in use for better service accuracy.",
      },
    },

    web: {
      favicon: "./assets/favicon.png",
    },

    plugins: [
      "expo-font",
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/splash-icon.png",
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      "expo-camera",
      "expo-image-picker",
      "expo-location",
      "expo-secure-store",
    ],

    extra: {
      eas: {
        projectId: "30d8e4cc-d22b-49c7-8458-453bb24cf613"
      },
      // Supabase configuration (REQUIRED for app to function)
      supabaseUrl:
        process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "",
      supabaseAnonKey:
        process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.SUPABASE_ANON_KEY ||
        "",
      localApiBaseUrl: process.env.EXPO_PUBLIC_LOCAL_API_BASE_URL ?? process.env.LOCAL_API_BASE_URL ?? null,
      productionApiBaseUrl: process.env.EXPO_PUBLIC_PRODUCTION_API_BASE_URL ?? process.env.PRODUCTION_API_BASE_URL ?? null,
      // Where Supabase should redirect users after they click the
      // "Verify email" button in the confirmation email.
      confirmationRedirectUrl:
        process.env.EXPO_PUBLIC_CONFIRMATION_REDIRECT_URL ||
        process.env.CONFIRMATION_REDIRECT_URL ||
        "https://kwiruu.github.io/minecomplyconfirmpage/",
    },
  },
};
