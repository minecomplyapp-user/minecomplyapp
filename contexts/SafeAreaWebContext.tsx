import React, { createContext, useContext } from "react";
import useSafeAreaWeb from "../hooks/useSafeAreaWeb";
import { ViewStyle } from "react-native";

type SafeAreaContextValue = {
  bottom: number;
};

const SafeAreaWebContext = createContext<SafeAreaContextValue>({ bottom: 0 });

export const SafeAreaWebProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bottom } = useSafeAreaWeb();

  return (
    <SafeAreaWebContext.Provider value={{ bottom }}>{children}</SafeAreaWebContext.Provider>
  );
};

export const useSafeAreaWebContext = () => useContext(SafeAreaWebContext);

// Small convenience type for screen wrapper styles
export type ScreenStyles = {
  container?: ViewStyle;
  content?: ViewStyle;
};

export default SafeAreaWebContext;
