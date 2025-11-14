import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, ViewProps, ScrollViewProps, StyleProp, ViewStyle } from "react-native";
import { useSafeAreaWebContext } from "../contexts/SafeAreaWebContext";
import { verticalScale } from "../utils/responsive";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  scroll?: boolean;
  scrollProps?: ScrollViewProps;
} & ViewProps;

/**
 * ScreenWrapper: a small wrapper that provides SafeAreaView and an optional
 * ScrollView. It consumes web safe-area inset from `useSafeAreaWeb()` via
 * context and applies extra bottom padding so footers aren't hidden by the
 * Windows taskbar / browser overlays.
 */
export const ScreenWrapper: React.FC<Props> = ({
  children,
  style,
  contentStyle,
  scroll = true,
  scrollProps,
  ...rest
}) => {
  const { bottom } = useSafeAreaWebContext();

  const safeBottomPadding = bottom ? bottom + verticalScale(12) : undefined;

  if (scroll) {
    return (
      <SafeAreaView style={style} {...rest}>
        <ScrollView contentContainerStyle={[{ paddingBottom: safeBottomPadding || verticalScale(24) }, contentStyle]} {...scrollProps}>
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[style, { paddingBottom: safeBottomPadding }]} {...rest}>
      <View style={contentStyle}>{children}</View>
    </SafeAreaView>
  );
};

export default ScreenWrapper;
