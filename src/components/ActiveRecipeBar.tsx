import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadows, spacing } from '../constants/theme';
import { useRecipe } from '../context/RecipeContext';
import { RootStackParamList } from '../navigation/types';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function ActiveRecipeBar() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { followSession, activeTimer, stopFollowing } = useRecipe();

  if (!followSession) return null;

  const { recipe, currentStepIndex } = followSession;
  const currentStep = recipe.steps[currentStepIndex];
  const totalSteps = recipe.steps.length;
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  const handleStop = () => {
    Alert.alert(
      'Stop following?',
      'Your cooking progress will be lost.',
      [
        { text: 'Keep cooking', style: 'cancel' },
        { text: 'Stop', style: 'destructive', onPress: stopFollowing },
      ],
    );
  };

  return (
    <Pressable
      onPress={() => navigation.navigate('FollowRecipe')}
      style={[styles.container, { bottom: Math.max(insets.bottom, 12) }]}
    >
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons name="restaurant" size={22} color="#fff" />
        </View>

        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {recipe.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            Step {currentStepIndex + 1} of {totalSteps}
            {currentStep ? ` · ${currentStep.instruction.slice(0, 40)}...` : ''}
          </Text>
          {activeTimer?.isRunning ? (
            <Text style={styles.timer}>
              Timer running: {formatTime(activeTimer.remainingSeconds)}
            </Text>
          ) : null}
        </View>

        <Pressable onPress={handleStop} hitSlop={12} style={styles.closeBtn}>
          <Ionicons name="close" size={20} color={colors.textMuted} />
        </Pressable>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.bar,
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
  },
  timer: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 2,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  progressTrack: {
    height: 3,
    backgroundColor: '#F3F4F6',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.secondary,
  },
});
