import { ActiveFollowSession, TimerState } from '../types/recipe';

/** True while a step timer is active on the current step (running, paused, or awaiting stop). */
export function isTimerBlocking(
  followSession: ActiveFollowSession | null,
  activeTimer: TimerState | null,
): boolean {
  if (!followSession || !activeTimer) return false;

  const currentStep = followSession.recipe.steps[followSession.currentStepIndex];
  if (!currentStep.timerMinutes || activeTimer.stepId !== currentStep.id) {
    return false;
  }

  return true;
}

export function timerBlockingMessage(activeTimer: TimerState | null): string {
  if (activeTimer?.awaitingStop) {
    return 'Tap Stop Timer to continue';
  }
  return 'Finish or cancel the timer to continue';
}
