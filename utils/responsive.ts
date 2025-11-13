// utils/responsive.ts
import { Dimensions, PixelRatio, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

//  Device classification
export const isIPad = (): boolean =>
  Platform.OS === "ios" &&
  ((Platform as any).isPad !== undefined && (Platform as any).isPad);

export const isTablet = (): boolean => {
  const aspectRatio = height / width;
  const largeScreen = width >= 768 && aspectRatio <= 1.6;
  return isIPad() || largeScreen;
};

export const isLargeTablet = (): boolean => width >= 1024;

// --- Android-specific ---
export const isAndroid = Platform.OS === "android";
export const isSmallAndroidPhone = (): boolean =>
  isAndroid && width < 360;
export const isLargeAndroidPhone = (): boolean =>
  isAndroid && width >= 420 && width < 600;

// --- iPhone-specific ---
export const isSmallIPhone = (): boolean =>
  Platform.OS === "ios" && width < 360;
export const isLargeIPhone = (): boolean =>
  Platform.OS === "ios" && width > 430;

// Scaling factors
const horizontalScaleFactor = width / BASE_WIDTH;
const verticalScaleFactor = height / BASE_HEIGHT;

// Cap scaling so layout doesn’t blow up on tablets.
// Keep tablet scaling conservative so UI doesn't appear "zoomed in" on large screens.
const LIMITS = {
  PHONE: 1.0, // no upscaling on most phones by default
  LARGE_PHONE: 1.05,
  TABLET: 1.08,
  LARGE_TABLET: 1.12,
};

let limit = LIMITS.PHONE;
if (isLargeAndroidPhone() || isLargeIPhone()) limit = LIMITS.LARGE_PHONE;
if (isTablet()) limit = LIMITS.TABLET;
if (isLargeTablet()) limit = LIMITS.LARGE_TABLET;

// Use the smaller of the horizontal scale and our conservative limit.
// This prevents huge multipliers on high-resolution tablets (keeps elements readable but not oversized).
const scaleFactor = Math.min(horizontalScaleFactor, limit);


export const scale = (size: number) => scaleFactor * size;

export const verticalScale = (size: number) =>
  Math.min(verticalScaleFactor, limit) * size;

export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;


// Font & icons
export const normalizeFont = (size: number) => {
  const newSize = scale(size);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const responsiveIconSize = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(scale(size)));


// Layout spacing
export const layoutScale = (size: number) => {
  if (isLargeTablet()) return scale(size * 1.15);
  if (isTablet()) return scale(size * 1.08);
  if (isLargeAndroidPhone() || isLargeIPhone()) return scale(size * 1.05);
  return scale(size);
};

// Text scaling
export const textScale = (size: number) => {
  if (isLargeTablet()) return size * 1.15;
  if (isTablet()) return size * 1.08;
  if (isLargeAndroidPhone() || isLargeIPhone()) return size * 1.05;
  if (isSmallAndroidPhone() || isSmallIPhone()) return size * 0.95;
  return size;
};


// Debug Helper
export const logDeviceInfo = () => {
  console.log("Device Info:", {
    width,
    height,
    platform: Platform.OS,
    isTablet: isTablet(),
    isLargeTablet: isLargeTablet(),
    isSmallAndroidPhone: isSmallAndroidPhone(),
    isLargeAndroidPhone: isLargeAndroidPhone(),
    isSmallIPhone: isSmallIPhone(),
    isLargeIPhone: isLargeIPhone(),
    scaleFactor,
  });
};
