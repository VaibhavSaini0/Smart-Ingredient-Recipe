import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../constants/theme';
import { ActiveRecipeBar } from './ActiveRecipeBar';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  showActiveBar?: boolean;
  bottomPadding?: number;
}

export function ScreenWrapper({
  children,
  style,
  showActiveBar = true,
  bottomPadding = 100,
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }, style]}>
      <View style={[styles.content, { paddingBottom: showActiveBar ? bottomPadding : spacing.lg }]}>
        {children}
      </View>
      {showActiveBar ? <ActiveRecipeBar /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});
