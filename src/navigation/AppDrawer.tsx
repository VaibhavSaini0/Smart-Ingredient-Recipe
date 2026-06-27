import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { UserProfileScreen } from '../screens/profile/UserProfileScreen';
import { FollowRecipeScreen } from '../screens/recipe/FollowRecipeScreen';
import { HomeScreen } from '../screens/recipe/HomeScreen';
import { RecipeDetailScreen } from '../screens/recipe/RecipeDetailScreen';
import { RecipeHistoryScreen } from '../screens/recipe/RecipeHistoryScreen';
import { CustomDrawerContent } from './CustomDrawerContent';
import { DrawerParamList, MainStackParamList } from './types';

const Stack = createNativeStackNavigator<MainStackParamList>();

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
      <Stack.Screen
        name="FollowRecipe"
        component={FollowRecipeScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
    </Stack.Navigator>
  );
}

const Drawer = createDrawerNavigator<DrawerParamList>();

export function AppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: { width: 280 },
      }}
    >
      <Drawer.Screen
        name="Main"
        component={MainStack}
        options={{ drawerLabel: 'Home' }}
      />
      <Drawer.Screen name="RecipeHistory" component={RecipeHistoryScreen} />
      <Drawer.Screen name="Profile" component={UserProfileScreen} />
    </Drawer.Navigator>
  );
}
