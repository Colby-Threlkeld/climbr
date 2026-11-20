import * as Haptics from 'expo-haptics';

// Fire-and-forget: a missed buzz (Low Power Mode, haptics off in settings) must never break a press.
const ignore = () => {};

export const haptics = {
  tap(): void {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(ignore);
  },
  selection(): void {
    Haptics.selectionAsync().catch(ignore);
  },
};
