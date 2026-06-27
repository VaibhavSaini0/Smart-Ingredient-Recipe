import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { colors, radius } from '../constants/theme';

export function DrawerMenuButton() {
  const navigation = useNavigation();

  const openDrawer = () => {
    const parent = navigation.getParent();
    if (parent) {
      parent.dispatch(DrawerActions.openDrawer());
      return;
    }
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <Pressable
      onPress={openDrawer}
      style={styles.btn}
      accessibilityLabel="Open menu"
      accessibilityRole="button"
    >
      <Ionicons name="menu" size={22} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
});
