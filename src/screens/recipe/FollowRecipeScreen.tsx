import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { StepTimer } from '../../components/StepTimer';
import { colors, radius, shadows, spacing } from '../../constants/theme';
import { useRecipe } from '../../context/RecipeContext';
import { MainStackParamList } from '../../navigation/types';
import { timerBlockingMessage } from '../../utils/timerBlocking';

type Props = NativeStackScreenProps<MainStackParamList, 'FollowRecipe'>;

export function FollowRecipeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const {
    followSession,
    activeTimer,
    nextStep,
    prevStep,
    goToStep,
    startTimer,
    pauseTimer,
    resumeTimer,
    cancelTimer,
    stopCompletedTimer,
    stopFollowing,
    timerBlockingNavigation,
  } = useRecipe();

  if (!followSession) {
    return (
      <ScreenWrapper showActiveBar={false}>
        <View style={styles.empty}>
          <Ionicons name="restaurant-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No active recipe</Text>
          <Text style={styles.emptyText}>
            Generate a recipe and tap &quot;Follow This Recipe&quot; to start cooking.
          </Text>
          <Button label="Go Home" onPress={() => navigation.navigate('Home')} />
        </View>
      </ScreenWrapper>
    );
  }

  const { recipe, currentStepIndex } = followSession;
  const currentStep = recipe.steps[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === recipe.steps.length - 1;
  const progress = ((currentStepIndex + 1) / recipe.steps.length) * 100;
  const awaitingStop = Boolean(activeTimer?.awaitingStop);
  const stepTimerFinished = followSession.finishedTimerStepIds.includes(currentStep.id);

  const handleFinish = () => {
    if (timerBlockingNavigation) {
      Alert.alert('Timer in progress', timerBlockingMessage(activeTimer));
      return;
    }

    Alert.alert('All done', 'Nice work — back to home?', [
      {
        text: 'Done',
        onPress: () => {
          stopFollowing();
          navigation.navigate('Home');
        },
      },
    ]);
  };

  const handleStop = () => {
    Alert.alert('Stop following?', 'Your cooking progress will be lost.', [
      { text: 'Keep cooking', style: 'cancel' },
      {
        text: 'Stop',
        style: 'destructive',
        onPress: () => {
          stopFollowing();
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScreenWrapper showActiveBar={false} bottomPadding={0}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
              <Ionicons name="chevron-down" size={22} color={colors.text} />
            </Pressable>
            <View style={styles.headerCenter}>
              <Text style={styles.headerLabel}>Following recipe</Text>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {recipe.title}
              </Text>
            </View>
            <Pressable onPress={handleStop} style={styles.iconBtn}>
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </Pressable>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressLabels}>
              <Text style={styles.stepCount}>
                Step {currentStepIndex + 1} of {recipe.steps.length}
              </Text>
              <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          </View>

          <View style={styles.currentStepCard}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>{currentStepIndex + 1}</Text>
            </View>
            <Text style={styles.instruction}>{currentStep.instruction}</Text>

            {currentStep.timerMinutes ? (
              <StepTimer
                minutes={currentStep.timerMinutes}
                stepId={currentStep.id}
                activeStepId={activeTimer?.stepId}
                remainingSeconds={activeTimer?.remainingSeconds}
                totalSeconds={activeTimer?.totalSeconds}
                isRunning={activeTimer?.isRunning}
                awaitingStop={activeTimer?.awaitingStop}
                stepTimerFinished={stepTimerFinished}
                onStart={() => startTimer(currentStep.id, currentStep.timerMinutes!)}
                onPause={pauseTimer}
                onResume={resumeTimer}
                onCancel={cancelTimer}
                onStop={stopCompletedTimer}
              />
            ) : null}
          </View>

          <View style={styles.stepList}>
            <Text style={styles.stepListTitle}>All steps</Text>
            {recipe.steps.map((step, index) => {
              const isCurrent = index === currentStepIndex;
              const isDone = index < currentStepIndex;

              return (
                <Pressable
                  key={step.id}
                  onPress={() => goToStep(index)}
                  style={[
                    styles.stepListItem,
                    isCurrent && styles.stepListItemActive,
                    isDone && styles.stepListItemDone,
                  ]}
                >
                  <View
                    style={[
                      styles.stepListDot,
                      isCurrent && styles.stepListDotActive,
                      isDone && styles.stepListDotDone,
                    ]}
                  >
                    {isDone ? (
                      <Ionicons name="checkmark" size={12} color="#fff" />
                    ) : (
                      <Text style={styles.stepListDotText}>{index + 1}</Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepListText,
                      isCurrent && styles.stepListTextActive,
                    ]}
                    numberOfLines={2}
                  >
                    {step.instruction}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, spacing.md) },
          ]}
        >
          {timerBlockingNavigation ? (
            <View style={styles.blockingBanner}>
              <Ionicons
                name={awaitingStop ? 'alarm-outline' : 'timer-outline'}
                size={16}
                color={colors.primary}
              />
              <Text style={styles.blockingText}>
                {timerBlockingMessage(activeTimer)}
              </Text>
            </View>
          ) : null}

          <View style={styles.navButtons}>
            <Button
              label="Previous"
              onPress={prevStep}
              variant="outline"
              disabled={isFirst || timerBlockingNavigation}
              style={styles.navBtn}
            />
            {isLast ? (
              <Button
                label="Finish Cooking"
                onPress={handleFinish}
                disabled={timerBlockingNavigation}
                style={styles.navBtn}
              />
            ) : (
              <Button
                label="Next Step"
                onPress={nextStep}
                disabled={timerBlockingNavigation}
                style={styles.navBtn}
              />
            )}
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.lg,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
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
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  progressSection: {
    gap: spacing.sm,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: radius.full,
  },
  currentStepCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.card,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  stepBadge: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  stepBadgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  instruction: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 26,
  },
  stepList: {
    gap: spacing.sm,
  },
  stepListTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  stepListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepListItemActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  stepListItemDone: {
    opacity: 0.7,
  },
  stepListDot: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepListDotActive: {
    backgroundColor: colors.primary,
  },
  stepListDotDone: {
    backgroundColor: colors.success,
  },
  stepListDotText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  stepListText: {
    flex: 1,
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  stepListTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.bar,
  },
  blockingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
  blockingText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  navButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  navBtn: {
    flex: 1,
  },
});
