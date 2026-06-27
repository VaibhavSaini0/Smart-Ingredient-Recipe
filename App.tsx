import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { RecipeProvider } from './src/context/RecipeContext';
import { AppNavigator } from './src/navigation/AppNavigator';

function AppRoot() {
  const { user } = useAuth();

  return (
    <RecipeProvider key={user?.id ?? 'guest'}>
      <StatusBar style="dark" />
      <AppNavigator />
    </RecipeProvider>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <AuthProvider>
            <AppRoot />
          </AuthProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
