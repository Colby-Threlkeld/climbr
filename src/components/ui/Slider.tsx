import { useEffect } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import {
  GestureDetector,
  useCompetingGestures,
  usePanGesture,
  useTapGesture,
} from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { haptics } from '@/lib/haptics';
import { opacity, radii, shadow, size, touch } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export type SliderProps = {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  // Fires once when the finger lifts: the place to save, not on every pixel.
  onChangeEnd?: (value: number) => void;
  accessibilityLabel: string;
  // Spoken value, e.g. (v) => `${v} centimeters`.
  formatValue?: (value: number) => string;
  disabled?: boolean;
};

const THUMB = size.sliderThumb;

// Pure helpers, marked as worklets so they can also run on the UI thread during a drag.
function clamp(n: number, lo: number, hi: number) {
  'worklet';
  return Math.min(hi, Math.max(lo, n));
}
function snap(n: number, min: number, max: number, step: number) {
  'worklet';
  return clamp(Math.round((n - min) / step) * step + min, min, max);
}
export function valueToX(value: number, min: number, max: number, width: number) {
  'worklet';
  const usable = Math.max(0, width - THUMB);
  return max === min ? 0 : ((clamp(value, min, max) - min) / (max - min)) * usable;
}
export function xToValue(x: number, min: number, max: number, step: number, width: number) {
  'worklet';
  const usable = Math.max(1, width - THUMB);
  return snap(min + (clamp(x, 0, usable) / usable) * (max - min), min, max, step);
}

// Custom slider (no native widget): drag the thumb or tap the track, with a 48 pt touch area.
// Dragging runs on the UI thread via Reanimated; onChange fires only when the stepped value changes.
export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  onChangeEnd,
  accessibilityLabel,
  formatValue,
  disabled = false,
}: SliderProps) {
  const { colors } = useTheme();
  // Shared values live on the UI thread during a drag. Use .get()/.set() (not `.value =`)
  // so React's compiler lint rules accept them.
  const width = useSharedValue(0);
  const x = useSharedValue(0);
  const current = useSharedValue(value);
  const dragging = useSharedValue(false);

  // Follow external value changes (e.g. a reset) when the user isn't dragging.
  useEffect(() => {
    current.set(value);
    if (!dragging.get()) x.set(valueToX(value, min, max, width.get()));
  }, [value, min, max, current, dragging, x, width]);

  const emit = (v: number) => {
    haptics.selection();
    onChange(v);
  };
  const emitEnd = (v: number) => onChangeEnd?.(v);

  const moveTo = (fingerX: number) => {
    'worklet';
    const usable = Math.max(0, width.get() - THUMB);
    const nextX = clamp(fingerX - THUMB / 2, 0, usable);
    x.set(nextX);
    const next = xToValue(nextX, min, max, step, width.get());
    if (next !== current.get()) {
      current.set(next);
      scheduleOnRN(emit, next);
    }
  };

  const settle = () => {
    'worklet';
    dragging.set(false);
    // Snap the thumb onto the exact step position.
    x.set(valueToX(current.get(), min, max, width.get()));
    scheduleOnRN(emitEnd, current.get());
  };

  const pan = usePanGesture({
    enabled: !disabled,
    // Horizontal intent only, so a vertical scroll over the slider still scrolls the page.
    activeOffsetX: [-4, 4],
    failOffsetY: [-12, 12],
    onActivate: (e) => {
      'worklet';
      dragging.set(true);
      moveTo(e.x);
    },
    onUpdate: (e) => {
      'worklet';
      moveTo(e.x);
    },
    onDeactivate: () => {
      'worklet';
      settle();
    },
  });

  const tap = useTapGesture({
    enabled: !disabled,
    onActivate: (e) => {
      'worklet';
      moveTo(e.x);
      settle();
    },
  });

  const gesture = useCompetingGestures(pan, tap);

  const thumbStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }] }));
  const fillStyle = useAnimatedStyle(() => ({ width: x.get() + THUMB / 2 }));

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    width.set(w);
    x.set(valueToX(current.get(), min, max, w));
  };

  const nudge = (dir: 1 | -1) => {
    if (disabled) return;
    const next = snap(value + dir * step, min, max, step);
    if (next === value) return;
    emit(next);
    onChangeEnd?.(next);
  };

  return (
    <GestureDetector gesture={gesture}>
      <View
        onLayout={onLayout}
        accessible
        // "adjustable" = slider for VoiceOver/TalkBack (swipe up/down) and role="slider" on web.
        accessibilityRole="adjustable"
        accessibilityLabel={accessibilityLabel}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(e) => nudge(e.nativeEvent.actionName === 'increment' ? 1 : -1)}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={formatValue ? formatValue(value) : String(value)}
        aria-disabled={disabled}
        focusable={!disabled}
        // Arrow keys on web (keyboard users).
        onKeyDown={(e) => {
          const key = (e.nativeEvent as { key?: string }).key;
          if (key === 'ArrowRight' || key === 'ArrowUp') nudge(1);
          if (key === 'ArrowLeft' || key === 'ArrowDown') nudge(-1);
        }}
        style={[styles.container, disabled && styles.disabled]}
      >
        <View style={[styles.track, { backgroundColor: colors.surfaceAlt }]}>
          <Animated.View style={[styles.fill, { backgroundColor: colors.accent }, fillStyle]} />
        </View>
        <Animated.View
          style={[
            styles.thumb,
            { backgroundColor: colors.textPrimary, boxShadow: shadow.raised },
            thumbStyle,
          ]}
        />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: { minHeight: touch.min, justifyContent: 'center' },
  track: {
    height: size.sliderTrack,
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  fill: { height: '100%' },
  thumb: {
    position: 'absolute',
    left: 0,
    width: THUMB,
    height: THUMB,
    borderRadius: radii.full,
  },
  disabled: { opacity: opacity.disabled },
});
