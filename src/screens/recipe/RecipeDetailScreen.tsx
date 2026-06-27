import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { colors, radius, shadows, spacing } from '../../constants/theme';
import { useRecipe } from '../../context/RecipeContext';
import { MainStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'RecipeDetail'>;

export function RecipeDetailScreen({ navigation }: Props) {
  const { latestRecipe, startFollowing, followSession } = useRecipe();
  const recipe = latestRecipe;

  if (!recipe) {
    return (
      <ScreenWrapper>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No recipe generated yet.</Text>
          <Button label="Go Home" onPress={() => navigation.navigate('Home')} />
        </View>
      </ScreenWrapper>
    );
  }

  const isFollowing = followSession?.recipe.id === recipe.id;

  return (
    <ScreenWrapper bottomPadding={followSession ? 110 : 24}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>

        <View style={styles.hero}>
          <View style={styles.badge}>
            <Ionicons name="time-outline" size={14} color={colors.primary} />
            <Text style={styles.badgeText}>{recipe.prepTime}</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="people-outline" size={14} color={colors.primary} />
            <Text style={styles.badgeText}>{recipe.servings} servings</Text>
          </View>
        </View>

        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.subtitle}>
          Made with: {recipe.inputIngredients.join(', ')}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe.ingredients.map((item, index) => (
            <View key={item} style={styles.listItem}>
              <View style={styles.bullet} />
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {recipe.steps.map((step, index) => (
            <View key={step.id} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepText}>{step.instruction}</Text>
                {step.timerMinutes ? (
                  <View style={styles.timerTag}>
                    <Ionicons name="timer-outline" size={14} color={colors.primary} />
                    <Text style={styles.timerTagText}>{step.timerMinutes} min timer</Text>
                  </View>
                ) : null}
              </View>
            </View>
          ))}
        </View>

        <Button
          label={isFollowing ? 'Continue Following' : 'Follow This Recipe'}
          onPress={() => {
            if (!isFollowing) {
              startFollowing(recipe);
            }
            navigation.navigate('FollowRecipe');
          }}
          style={styles.followBtn}
        />
        <Button
          label="Generate Another"
          onPress={() => navigation.navigate('Home')}
          variant="outline"
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textMuted,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'flex-start',
  },
  hero: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF4E6',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 22,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
    marginTop: 7,
  },
  listText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  stepRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  stepContent: {
    flex: 1,
    gap: spacing.sm,
  },
  stepText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  timerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#FFF4E6',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  timerTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  followBtn: {
    marginTop: spacing.sm,
  },
});
