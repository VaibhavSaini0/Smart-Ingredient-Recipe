import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Button } from '../components/Button';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { colors, radius, shadows, spacing } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useRecipe } from '../context/RecipeContext';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const SUGGESTIONS = [
  'chicken, broccoli, soy sauce, rice',
  'eggs, spinach, cheese, onion',
  'tomato, pasta, garlic, olive oil',
];

export function HomeScreen({ navigation }: Props) {
  const { user, logout } = useAuth();
  const { generateRecipe, isGenerating, generateError, followSession } = useRecipe();
  const [ingredients, setIngredients] = useState('');

  const handleGenerate = async () => {
    const success = await generateRecipe(ingredients);
    if (success) {
      navigation.navigate('RecipeDetail');
    }
  };

  const handleLogout = () => {
    Alert.alert('Log out?', 'You will need to sign in again.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScreenWrapper bottomPadding={followSession ? 110 : 24}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name ?? 'Chef'} 👋</Text>
            <Text style={styles.subGreeting}>What ingredients do you have today?</Text>
          </View>
          <Pressable onPress={handleLogout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={22} color={colors.textMuted} />
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="basket-outline" size={22} color={colors.primary} />
            <Text style={styles.cardTitle}>Your ingredients</Text>
          </View>
          <Text style={styles.cardHint}>
            Enter 3–4 items separated by commas
          </Text>

          <TextInput
            value={ingredients}
            onChangeText={setIngredients}
            placeholder="e.g. chicken, broccoli, soy sauce, rice"
            placeholderTextColor={colors.textMuted}
            multiline
            style={styles.textarea}
            textAlignVertical="top"
          />

          {generateError ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={colors.error} />
              <Text style={styles.errorText}>{generateError}</Text>
            </View>
          ) : null}

          <Button
            label={isGenerating ? 'Generating recipe...' : 'Generate Recipe'}
            onPress={handleGenerate}
            loading={isGenerating}
            disabled={!ingredients.trim()}
          />
        </View>

        <Text style={styles.suggestionsTitle}>Quick try</Text>
        <View style={styles.chips}>
          {SUGGESTIONS.map((item) => (
            <Pressable
              key={item}
              onPress={() => setIngredients(item)}
              style={styles.chip}
            >
              <Text style={styles.chipText}>{item}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="sparkles" size={20} color={colors.secondary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Frontend preview mode</Text>
            <Text style={styles.infoText}>
              Recipe generation uses mock data for now. Backend + real AI integration
              will be added in the next step.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  subGreeting: {
    fontSize: 15,
    color: colors.textMuted,
    marginTop: 4,
  },
  logoutBtn: {
    padding: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  cardHint: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: -spacing.sm,
  },
  textarea: {
    minHeight: 110,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#FEF2F2',
    padding: spacing.md,
    borderRadius: radius.md,
  },
  errorText: {
    flex: 1,
    color: colors.error,
    fontSize: 14,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  chips: {
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    fontSize: 14,
    color: colors.text,
  },
  infoCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: '#E8F5E9',
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
    gap: 4,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
  },
  infoText: {
    fontSize: 13,
    color: colors.secondary,
    lineHeight: 18,
  },
});
