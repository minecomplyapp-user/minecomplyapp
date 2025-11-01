// hooks/useResponsive.ts
import { useMemo } from "react";
import {
  scale,
  verticalScale,
  moderateScale,
  normalizeFont,
  responsiveIconSize,
  layoutScale,
  textScale,
  isTablet,
  isLargeTablet,
  isLargeAndroidPhone,
  isSmallAndroidPhone,
  isLargeIPhone,
  isSmallIPhone,
  isIPad,
} from "../utils/responsive";

export const useResponsive = () => {
  return useMemo(
    () => ({
      scale,
      verticalScale,
      moderateScale,
      normalizeFont,
      responsiveIconSize,
      layoutScale,
      textScale,
      isTablet,
      isLargeTablet,
      isLargeAndroidPhone,
      isSmallAndroidPhone,
      isLargeIPhone,
      isSmallIPhone,
      isIPad,
    }),
    []
  );
};
