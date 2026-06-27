import { Ionicons } from '@expo/vector-icons';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { colors, radius, spacing } from '../constants/theme';

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { state, navigation } = props;
  const activeRoute = state.routes[state.index].name;

  const handleLogout = () => {
    Alert.alert('Log out?', 'You will need to sign in again.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => void logout(),
      },
    ]);
  };

  const items = [
    { name: 'Main' as const, label: 'Home', icon: 'home-outline' as const },
    { name: 'RecipeHistory' as const, label: 'Recipe History', icon: 'time-outline' as const },
    { name: 'Profile' as const, label: 'Profile', icon: 'person-outline' as const },
  ];

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top + spacing.md },
      ]}
    >
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={28} color={colors.primary} />
        </View>
        <Text style={styles.userName}>{user?.name ?? 'Chef'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={styles.menu}>
        {items.map((item) => (
          <DrawerItem
            key={item.name}
            label={item.label}
            focused={activeRoute === item.name}
            activeTintColor={colors.primary}
            inactiveTintColor={colors.text}
            activeBackgroundColor="#FFF4E6"
            icon={({ color, size }) => (
              <Ionicons name={item.icon} size={size} color={color} />
            )}
            onPress={() => navigation.navigate(item.name)}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <DrawerItem
          label="Log out"
          inactiveTintColor={colors.error}
          icon={({ size }) => (
            <Ionicons name="log-out-outline" size={size} color={colors.error} />
          )}
          onPress={handleLogout}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: '#FFF4E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  menu: {
    flex: 1,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.md,
  },
});
