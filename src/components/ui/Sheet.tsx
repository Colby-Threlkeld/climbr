import { useEffect, useState, type ReactNode } from 'react';
import { Modal, Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import {
  GestureDetector,
  GestureHandlerRootView,
  usePanGesture,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { motion, radii, size, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { Material } from './Material';
import { Text } from './Text';

export type SheetProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  // Solid by default: most sheets hold forms (sliders, fields), and glass hurts readability
  // there. Use 'glass' only for short sheets over a photo/video (decision D1).
  material?: 'solid' | 'glass';
};

// Drag down further than this (pt) or flick faster than this (pt/s) to dismiss.
const DISMISS_DISTANCE = 80;
const DISMISS_VELOCITY = 800;

// Bottom sheet: springs up in ~300 ms, clears the home indicator, closes on backdrop tap,
// swipe down, Android back, or Esc on web. Reduce Motion → appears/disappears instantly.
export function Sheet({ visible, onClose, title, children, material = 'solid' }: SheetProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const reduceMotion = useReducedMotion();

  // Stay mounted while the close animation runs, then unmount. Mounting is adjusted during
  // render (React's recommended pattern) rather than in an effect, to avoid an extra render pass.
  const [mounted, setMounted] = useState(visible);
  if (visible && !mounted) setMounted(true);
  if (!visible && mounted && reduceMotion) setMounted(false);

  // Shared values use .get()/.set() (not `.value =`) so React's compiler lint rules accept them.
  const translateY = useSharedValue(screenHeight);
  const backdrop = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.set(reduceMotion ? 0 : withSpring(0, { duration: motion.sheet, dampingRatio: 1 }));
      backdrop.set(reduceMotion ? 1 : withTiming(1, { duration: motion.sheet }));
      return;
    }
    if (reduceMotion) return;
    backdrop.set(withTiming(0, { duration: motion.screen }));
    translateY.set(
      withTiming(screenHeight, { duration: motion.screen }, (finished) => {
        if (finished) scheduleOnRN(setMounted, false);
      }),
    );
  }, [visible, reduceMotion, screenHeight, translateY, backdrop]);

  const pan = usePanGesture({
    activeOffsetY: [-10, 10],
    onUpdate: (e) => {
      'worklet';
      // Only follow the finger downward; the sheet never lifts above its resting spot.
      translateY.set(Math.max(0, e.translationY));
    },
    onDeactivate: (e) => {
      'worklet';
      if (e.translationY > DISMISS_DISTANCE || e.velocityY > DISMISS_VELOCITY) {
        scheduleOnRN(onClose);
      } else {
        translateY.set(withSpring(0, { duration: motion.sheet, dampingRatio: 1 }));
      }
    },
  });

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.get() }] }));
  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.get() }));

  return (
    <Modal transparent visible={mounted} animationType="none" onRequestClose={onClose}>
      {/* Android Modals render outside the app root, so gestures need their own root here. */}
      <GestureHandlerRootView style={styles.fill}>
        <Animated.View style={[StyleSheet.absoluteFill, backdropStyle]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={onClose}
            style={[styles.fill, { backgroundColor: colors.scrim }]}
          />
        </Animated.View>
        <GestureDetector gesture={pan}>
          <Animated.View
            testID="sheet"
            // On web, <Modal> already renders role="dialog" aria-modal; a second one would
            // nest dialogs for screen readers. On native, this view is the dialog.
            role={Platform.OS === 'web' ? undefined : 'dialog'}
            aria-label={title}
            accessibilityViewIsModal
            style={[
              styles.sheet,
              {
                backgroundColor: material === 'glass' ? 'transparent' : colors.surface,
                paddingBottom: insets.bottom + spacing.md,
              },
              material === 'glass' && styles.clip,
              sheetStyle,
            ]}
          >
            {/* Android note: a Modal is its own window, so glass sheets show the tint only there. */}
            {material === 'glass' ? (
              <Material variant="regular" style={[StyleSheet.absoluteFill, styles.topCorners]} />
            ) : null}
            <View style={[styles.handle, { backgroundColor: colors.textSecondary }]} aria-hidden />
            {title ? <Text variant="headline">{title}</Text> : null}
            {children}
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  clip: { overflow: 'hidden' },
  topCorners: { borderTopLeftRadius: radii.sheet, borderTopRightRadius: radii.sheet },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    gap: spacing.md,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xs,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
  },
  handle: {
    alignSelf: 'center',
    width: size.sheetHandle.width,
    height: size.sheetHandle.height,
    borderRadius: radii.full,
  },
});
