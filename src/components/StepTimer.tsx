import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';
import { Button } from './Button';

interface StepTimerProps {
  minutes: number;
  stepId: string;
  activeStepId?: string;
  remainingSeconds?: number;
  totalSeconds?: number;
  isRunning?: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function StepTimer({
  minutes,
  stepId,
  activeStepId,
  remainingSeconds,
  totalSeconds,
  isRunning,
  onStart,
  onPause,
  onReset,
}: StepTimerProps) {
  const isActive = activeStepId === stepId;
  const displaySeconds = isActive && remainingSeconds !== undefined
    ? remainingSeconds
    : minutes * 60;
  const progress = isActive && totalSeconds
    ? 1 - displaySeconds / totalSeconds
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="timer-outline" size={18} color={colors.primary} />
        <Text style={styles.title}>Step timer · {minutes} min</Text>
      </View>

      <Text style={styles.time}>{formatTime(displaySeconds)}</Text>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.actions}>
        {isActive && isRunning ? (
          <Button label="Pause" onPress={onPause} variant="outline" style={styles.actionBtn} />
        ) : (
          <Button label="Start Timer" onPress={onStart} variant="secondary" style={styles.actionBtn} />
        )}
        {isActive ? (
          <Button label="Reset" onPress={onReset} variant="ghost" style={styles.actionBtn} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
    backgroundColor: '#FFF4E6',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#FFD8A8',
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
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#FFE8CC',
    borderRadius: radius.full,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
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
