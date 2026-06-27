import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AppDrawer } from './AppDrawer';
import { AuthStack } from './AuthStack';
import { LoadingScreen } from './LoadingScreen';

export function AppNavigator() {
  const { user, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer key={user ? 'app' : 'auth'}>
      {user ? <AppDrawer /> : <AuthStack />}
    </NavigationContainer>
  );
}
