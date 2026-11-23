import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import {
  Button,
  GlassBackdrop,
  Material,
  SegmentedControl,
  Sheet,
  Text,
  useMaterialMode,
  type MaterialVariant,
} from '@/components/ui';
import { brand, colors, motion, overlay, radii, size, spacing } from '@/theme/tokens';

// Dev-only: glass materials over a real gym-wall photo (worst-case contrast) or an animated
// busy background (stand-in for live video until expo-video lands in step 33), with an FPS
// meter so performance can be read on real phones. Photo credit: assets/dev/ATTRIBUTION.md.

const wall = require('../../assets/dev/gym-wall.jpg');

const backgrounds = [
  { value: 'photo', label: 'Gym wall' },
  { value: 'moving', label: 'Moving (video stand-in)' },
] as const;

const panes: { variant: MaterialVariant; title: string; note: string }[] = [
  { variant: 'regular', title: 'Regular glass', note: 'Toasts, tab bar, short sheets' },
  { variant: 'thin', title: 'Thin glass', note: 'Small floating controls' },
  { variant: 'solid', title: 'Solid (before)', note: 'Fallback + Reduce Transparency' },
];

export function MaterialsDemo() {
  const [bg, setBg] = useState<'photo' | 'moving'>('photo');
  const [sheetOpen, setSheetOpen] = useState(false);
  const mode = useMaterialMode('regular');

  return (
    <View style={styles.section}>
      <Text variant="title2">Materials</Text>
      <Text variant="subhead" color="textSecondary">
        Rendering: {mode}
      </Text>
      <SegmentedControl
        accessibilityLabel="Background"
        options={backgrounds}
        value={bg}
        onChange={setBg}
      />
      <GlassBackdrop testID="materials-stage" style={styles.stage}>
        {bg === 'photo' ? (
          <Image source={wall} style={StyleSheet.absoluteFill} resizeMode="cover" />
        ) : (
          <MovingBackground />
        )}
        <View style={styles.panes}>
          {panes.map((p) => (
            <Material
              key={p.variant}
              testID={`pane-${p.variant}`}
              variant={p.variant}
              style={styles.pane}
            >
              <Text variant="headline">{p.title}</Text>
              {/* textPrimary only: textSecondary fails AA on glass (material-test.ts). */}
              <Text variant="subhead">{p.note}</Text>
            </Material>
          ))}
          <View style={styles.row}>
            <Button label="Glass" variant="glass" onPress={() => {}} />
            <Button label="Primary" onPress={() => {}} />
          </View>
        </View>
        <FpsMeter />
      </GlassBackdrop>
      <Text variant="footnote" color="textSecondary">
        Photo: Ka23 13, CC BY-SA 4.0 (Wikimedia Commons)
      </Text>
      <Button label="Open glass sheet" variant="secondary" onPress={() => setSheetOpen(true)} />
      <Sheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Glass sheet"
        material="glass"
      >
        <Text>Short sheet over media. Forms stay on solid sheets.</Text>
        <Button label="Done" onPress={() => setSheetOpen(false)} />
      </Sheet>
    </View>
  );
}

// Saturated blobs sliding back and forth: the expensive case for blur (it must re-sample
// every frame). Colors come from tokens: limb overlay colors + brand + status colors.
const blobColors = [
  overlay.limb.LH,
  overlay.limb.RH,
  brand.orange,
  colors.light.success,
  colors.light.warning,
  brand.white,
  brand.ink,
];

function MovingBackground() {
  const t = useSharedValue(0);
  useEffect(() => {
    t.set(withRepeat(withTiming(1, { duration: motion.avatarMove * 3 }), -1, true));
  }, [t]);
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.light.surfaceAlt }]}>
      {blobColors.map((c, i) => (
        <Blob key={c + i} color={c} index={i} t={t} />
      ))}
    </View>
  );
}

function Blob({ color, index, t }: { color: string; index: number; t: { get: () => number } }) {
  const style = useAnimatedStyle(() => {
    const p = t.get();
    const dir = index % 2 === 0 ? 1 : -1;
    return {
      transform: [
        { translateX: dir * (p - 0.5) * spacing.xxxl * 6 },
        { translateY: (index - 3) * spacing.xxxl + dir * p * spacing.xl },
      ],
    };
  });
  return (
    <Animated.View
      style={[
        styles.blob,
        { backgroundColor: color, left: `${(index * 13) % 80}%`, top: '40%' },
        style,
      ]}
    />
  );
}

// Frames per second on the UI thread (JS thread on web), refreshed twice a second.
function FpsMeter() {
  const [fps, setFps] = useState(0);
  const frames = useSharedValue(0);
  const since = useSharedValue(0);
  useFrameCallback((info) => {
    'worklet';
    if (since.get() === 0) since.set(info.timestamp);
    frames.set(frames.get() + 1);
    const elapsed = info.timestamp - since.get();
    if (elapsed >= 500) {
      scheduleOnRN(setFps, Math.round((frames.get() * 1000) / elapsed));
      frames.set(0);
      since.set(info.timestamp);
    }
  });
  return (
    <Material variant="solid" testID="fps" style={styles.fps}>
      <Text variant="numeric" dense>
        {fps} fps
      </Text>
    </Material>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.sm },
  stage: {
    aspectRatio: 0.75,
    borderRadius: radii.card,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  panes: { gap: spacing.sm, padding: spacing.md },
  pane: { borderRadius: radii.card, padding: spacing.md, gap: spacing.xxs },
  row: { flexDirection: 'row', gap: spacing.sm },
  blob: {
    position: 'absolute',
    width: size.stageDot * 5,
    height: size.stageDot * 5,
    borderRadius: radii.full,
  },
  fps: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: radii.control,
  },
});
