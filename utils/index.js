import * as Haptics from 'expo-haptics';
import { Platform, Vibration } from 'react-native';

const ANDROID_PULSES = 4;
const PULSE_GAP_MS = 160;

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function vibrate() {
  // if (Platform.OS !== 'android') {
  //   Vibration.vibrate([0, 500, 200, 500, 200, 500]);
  //   return;
  // }

  for (let pulse = 0; pulse < ANDROID_PULSES; pulse += 1) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await wait(PULSE_GAP_MS);
  }
}
