import { Audio } from 'expo-av';

let loadedSound: Audio.Sound | null = null;

export async function playTimerCompleteSound(): Promise<void> {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    });

    await stopTimerSound();

    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/sounds/timer-complete.wav'),
    );
    loadedSound = sound;
    await sound.setIsLoopingAsync(true);
    await sound.playAsync();
  } catch (error) {
    console.warn('Could not play timer sound:', error);
  }
}

export async function stopTimerSound(): Promise<void> {
  if (!loadedSound) return;

  try {
    await loadedSound.stopAsync();
    await loadedSound.unloadAsync();
  } catch {
    // Sound may already be unloaded.
  } finally {
    loadedSound = null;
  }
}
