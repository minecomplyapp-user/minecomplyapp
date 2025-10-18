import { Dimensions, PixelRatio, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

export const isTablet = (): boolean => {
  const aspectRatio = height / width;
  const isIPad =
    Platform.OS === "ios" &&
    (Platform as any).isPad !== undefined &&
    (Platform as any).isPad;
  const largeScreen = width >= 768 && aspectRatio <= 1.6;
  return isIPad || largeScreen;
};

//adjust the limit for scaling on tablets
const baseLimit = isTablet() ? 1.8 : 1.6;

const horizontalScaleFactor = Math.min(width / BASE_WIDTH, baseLimit);
const verticalScaleFactor = Math.min(height / BASE_HEIGHT, baseLimit);

export const scale = (size: number) => horizontalScaleFactor * size;
export const verticalScale = (size: number) => verticalScaleFactor * size;
export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export const normalizeFont = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(scale(size)));

export const responsiveIconSize = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(scale(size)));

// Used for layout padding/margins
export const layoutScale = (size: number) =>
  isTablet() ? scale(size * 1.1) : scale(size);


export const textScale = (size: number) => {
  const scaleFactor = width / BASE_WIDTH;
  if (width >= 768) {
    // tablet
    return size * 0.85; // make 15% smaller on tablets
  }
  return size * scaleFactor;
};