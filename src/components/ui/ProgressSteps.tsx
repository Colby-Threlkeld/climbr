import { StyleSheet, View } from 'react-native';

import { borderWidth, radii, size, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { Text } from './Text';

export type ProgressStage = { key: string; label: string };

export type ProgressStepsProps =
  // Onboarding: "step 2 of 4" as a segmented bar. `current` is 1-based.
  | { variant: 'bar'; total: number; current: number; accessibilityLabel?: string }
  // Processing: named stages from the worker's job `stage`, plus real % from `progress`
  // (CLAUDE.md rule 11: loading shows real progress, never a fake spinner).
  | {
      variant: 'stages';
      stages: readonly ProgressStage[];
      activeIndex: number;
      percent?: number;
      accessibilityLabel?: string;
    };

export function ProgressSteps(props: ProgressStepsProps) {
  return props.variant === 'bar' ? <Bar {...props} /> : <Stages {...props} />;
}

function Bar({
  total,
  current,
  accessibilityLabel,
}: Extract<ProgressStepsProps, { variant: 'bar' }>) {
  const { colors } = useTheme();
  const step = Math.min(Math.max(current, 0), total);
  return (
    <View
      // `accessible` makes VoiceOver/TalkBack read the bar as one element with its value.
      accessible
      role="progressbar"
      aria-label={accessibilityLabel ?? 'Progress'}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={step}
      aria-valuetext={`Step ${step} of ${total}`}
      style={styles.bar}
    >
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          testID={`segment-${i}`}
          style={[
            styles.segment,
            { backgroundColor: i < step ? colors.accent : colors.surfaceAlt },
          ]}
        />
      ))}
    </View>
  );
}

function Stages({
  stages,
  activeIndex,
  percent,
  accessibilityLabel,
}: Extract<ProgressStepsProps, { variant: 'stages' }>) {
  const { colors } = useTheme();
  const pct = percent === undefined ? undefined : Math.round(Math.min(Math.max(percent, 0), 100));
  const active = stages[activeIndex];

  return (
    <View style={styles.stages}>
      {pct !== undefined ? (
        <View
          accessible
          role="progressbar"
          aria-label={accessibilityLabel ?? 'Processing'}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-valuetext={active ? `${active.label}, ${pct}%` : `${pct}%`}
          style={[styles.track, { backgroundColor: colors.surfaceAlt }]}
        >
          <View
            testID="stages-fill"
            style={[styles.trackFill, { width: `${pct}%`, backgroundColor: colors.accent }]}
          />
        </View>
      ) : null}
      {stages.map((stage, i) => {
        const state = i < activeIndex ? 'done' : i === activeIndex ? 'active' : 'pending';
        return (
          <View key={stage.key} style={styles.stageRow} testID={`stage-${stage.key}-${state}`}>
            <View
              aria-hidden
              style={[
                styles.dot,
                state === 'done' && { backgroundColor: colors.textPrimary },
                state === 'active' && {
                  borderColor: colors.accent,
                  borderWidth: borderWidth.thick,
                },
                state === 'pending' && { backgroundColor: colors.surfaceAlt },
              ]}
            >
              {state === 'done' ? (
                <Text variant="footnote" color="inverse" dense>
                  ✓
                </Text>
              ) : null}
            </View>
            <Text
              style={styles.stageLabel}
              variant={state === 'active' ? 'headline' : 'body'}
              color={state === 'pending' ? 'textSecondary' : 'textPrimary'}
            >
              {stage.label}
            </Text>
            {state === 'active' && pct !== undefined ? (
              <Text variant="numeric" color="textSecondary">
                {pct}%
              </Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', gap: spacing.xxs },
  segment: { flex: 1, height: size.progressBar, borderRadius: radii.full },
  stages: { gap: spacing.sm },
  track: { height: size.progressBar, borderRadius: radii.full, overflow: 'hidden' },
  trackFill: { height: '100%' },
  stageRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: {
    width: size.stageDot,
    height: size.stageDot,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageLabel: { flex: 1 },
});
