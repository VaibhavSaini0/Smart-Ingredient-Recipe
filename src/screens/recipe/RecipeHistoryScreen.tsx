import { Ionicons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ApiError } from '../../api/client';
import { getRecipesApi } from '../../api/recipes';
import { DrawerMenuButton } from '../../components/DrawerMenuButton';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { colors, radius, shadows, spacing } from '../../constants/theme';
import { useRecipe } from '../../context/RecipeContext';
import { DrawerParamList, MainStackParamList } from '../../navigation/types';
import { Recipe } from '../../types/recipe';

type Props = CompositeScreenProps<
  DrawerScreenProps<DrawerParamList, 'RecipeHistory'>,
  NativeStackScreenProps<MainStackParamList>
>;

export function RecipeHistoryScreen({ navigation }: Props) {
  const { openRecipe, followSession } = useRecipe();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecipes = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);

    setError(null);

    try {
      const data = await getRecipesApi();
      setRecipes(data);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Failed to load recipe history.';
      setError(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      void loadRecipes();
    });
    return unsubscribe;
  }, [navigation, loadRecipes]);

  const handleOpen = (recipe: Recipe) => {
    openRecipe(recipe);
    navigation.navigate('Main', { screen: 'RecipeDetail' });
  };

  const renderItem = ({ item }: { item: Recipe }) => (
    <Pressable
      onPress={() => handleOpen(item)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.cardIcon}>
        <Ionicons name="restaurant-outline" size={22} color={colors.primary} />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.cardMeta} numberOfLines={1}>
          {item.inputIngredients.join(', ')}
        </Text>
        <Text style={styles.cardMeta}>
          {item.prepTime} · {item.servings} servings · {item.steps.length} steps
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </Pressable>
  );

  return (
    <ScreenWrapper bottomPadding={followSession ? 110 : 24}>
      <View style={styles.header}>
        <DrawerMenuButton />
        <View style={styles.headerText}>
          <Text style={styles.title}>My Recipes</Text>
          <Text style={styles.subtitle}>Your saved recipe history</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons name="cloud-offline-outline" size={40} color={colors.textMuted} />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={() => loadRecipes()} style={styles.retryBtn}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : recipes.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="book-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No recipes yet</Text>
          <Text style={styles.emptyText}>
            Generate your first recipe from the home screen. It will appear here automatically.
          </Text>
        </View>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => loadRecipes(true)}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  list: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  cardPressed: {
    opacity: 0.9,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: '#FFF4E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  cardMeta: {
    fontSize: 13,
    color: colors.textMuted,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  errorText: {
    fontSize: 15,
    color: colors.error,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  retryText: {
    color: '#fff',
    fontWeight: '700',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
