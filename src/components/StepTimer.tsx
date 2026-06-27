import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';
import { formatTime } from '../utils/formatTime';
import { Button } from './Button';

interface StepTimerProps {
  minutes: number;
  stepId: string;
  activeStepId?: string;
  remainingSeconds?: number;
  totalSeconds?: number;
  isRunning?: boolean;
  awaitingStop?: boolean;
  stepTimerFinished?: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  onStop: () => void;
}

export function StepTimer({
  minutes,
  stepId,
  activeStepId,
  remainingSeconds,
  totalSeconds,
  isRunning,
  awaitingStop,
  stepTimerFinished,
  onStart,
  onPause,
  onResume,
  onCancel,
  onStop,
}: StepTimerProps) {
  const isActive = activeStepId === stepId;
  const isPaused =
    isActive &&
    !isRunning &&
    !awaitingStop &&
    remainingSeconds !== undefined &&
    totalSeconds !== undefined &&
    remainingSeconds > 0 &&
    remainingSeconds < totalSeconds;

  const displaySeconds =
    isActive && remainingSeconds !== undefined
      ? remainingSeconds
      : minutes * 60;

  const progress =
    isActive && totalSeconds
      ? 1 - displaySeconds / totalSeconds
      : stepTimerFinished
        ? 1
        : 0;

  if (stepTimerFinished && !isActive) {
    return (
      <View style={[styles.container, styles.finishedContainer]}>
        <View style={styles.finishedRow}>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <Text style={styles.finishedText}>Step timer completed</Text>
        </View>
        <Button
          label="Restart Timer"
          onPress={onStart}
          variant="outline"
          style={styles.restartBtn}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, awaitingStop && isActive && styles.containerAlert]}>
      {awaitingStop && isActive ? (
        <View style={styles.completeBanner}>
          <Ionicons name="alarm-outline" size={22} color={colors.primary} />
          <Text style={styles.completeTitle}>Timer finished!</Text>
          <Text style={styles.completeSubtitle}>
            Tap Stop when you are ready to move on.
          </Text>
        </View>
      ) : (
        <View style={styles.header}>
          <Ionicons name="timer-outline" size={18} color={colors.primary} />
          <Text style={styles.title}>Step timer · {minutes} min</Text>
        </View>
      )}

      <Text style={[styles.time, awaitingStop && isActive && styles.timeAlert]}>
        {formatTime(displaySeconds)}
      </Text>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.min(progress * 100, 100)}%` },
            (awaitingStop && isActive) || stepTimerFinished
              ? styles.progressFillDone
              : null,
          ]}
        />
      </View>

      <View style={styles.actions}>
        {awaitingStop && isActive ? (
          <Button label="Stop Timer" onPress={onStop} style={styles.actionBtn} />
        ) : isActive && isRunning ? (
          <>
            <Button label="Pause" onPress={onPause} variant="outline" style={styles.actionBtn} />
            <Button label="Cancel" onPress={onCancel} variant="ghost" style={styles.actionBtn} />
          </>
        ) : isPaused ? (
          <>
            <Button label="Resume" onPress={onResume} variant="secondary" style={styles.actionBtn} />
            <Button label="Cancel" onPress={onCancel} variant="ghost" style={styles.actionBtn} />
          </>
        ) : (
          <Button label="Start Timer" onPress={onStart} variant="secondary" style={styles.actionBtn} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  containerAlert: {
    borderColor: colors.primary,
  },
  finishedContainer: {
    backgroundColor: colors.successBg,
    borderColor: colors.successBorder,
  },
  finishedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  finishedText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.success,
  },
  restartBtn: {
    minHeight: 44,
  },
  completeBanner: {
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  completeTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
  },
  completeSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  time: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.text,
    marginVertical: spacing.sm,
    letterSpacing: 1,
    textAlign: 'center',
  },
  timeAlert: {
    color: colors.primary,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.primaryTrack,
    borderRadius: radius.full,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  progressFillDone: {
    backgroundColor: colors.success,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    minHeight: 44,
  },
});
