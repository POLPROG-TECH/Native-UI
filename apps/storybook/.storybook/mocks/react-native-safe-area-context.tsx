/**
 * Web mock for react-native-safe-area-context.
 * Provides default safe area insets for browser rendering.
 */
import React, { createContext, useContext } from 'react';
import { View } from 'react-native';

const defaultInsets = { top: 0, right: 0, bottom: 0, left: 0 };
const defaultFrame = { x: 0, y: 0, width: 0, height: 0 };
const defaultMetrics = { insets: defaultInsets, frame: defaultFrame };

const SafeAreaInsetsContext = createContext(defaultInsets);
const SafeAreaFrameContext = createContext(defaultFrame);

export function SafeAreaProvider({ children, ...rest }: any) {
  return (
    <SafeAreaInsetsContext.Provider value={defaultInsets}>
      <SafeAreaFrameContext.Provider value={defaultFrame}>
        <View style={{ flex: 1 }} {...rest}>
          {children}
        </View>
      </SafeAreaFrameContext.Provider>
    </SafeAreaInsetsContext.Provider>
  );
}

export function SafeAreaView({ children, style, edges, ...rest }: any) {
  return (
    <View style={[{ flex: 1 }, style]} {...rest}>
      {children}
    </View>
  );
}

export function useSafeAreaInsets() {
  return useContext(SafeAreaInsetsContext);
}

export function useSafeAreaFrame() {
  return useContext(SafeAreaFrameContext);
}

export function initialWindowMetrics() {
  return defaultMetrics;
}

export { SafeAreaInsetsContext, SafeAreaFrameContext };
export default { SafeAreaProvider, SafeAreaView, useSafeAreaInsets };
