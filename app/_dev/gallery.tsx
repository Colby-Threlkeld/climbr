import { Redirect } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Button,
  Card,
  Chip,
  ProgressSteps,
  SegmentedControl,
  Sheet,
  Slider,
  Text,
  TextField,
  useToast,
} from '@/components/ui';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

// Dev-only component gallery. __DEV__ is false in production bundles (web export, store
// builds), so real users who guess the URL are sent home. Flip the phone's dark mode to check both themes.
export default function GalleryRoute() {
  if (!__DEV__) return <Redirect href="/" />;
  return <Gallery />;
}

const climbStyles = ['Slab', 'Crimp', 'Overhang', 'Dyno', 'Compression'] as const;
const captureOptions = [
  { value: 'photo', label: 'Route photo' },
  { value: 'video', label: 'Video' },
] as const;
const routeStages = [
  { key: 'upload', label: 'Uploading' },
  { key: 'holds', label: 'Finding holds' },
  { key: 'beta', label: 'Suggesting beta' },
  { key: 'done', label: 'Ready' },
] as const;

function Gallery() {
  const { colors, scheme } = useTheme();
  const insets = useSafeAreaInsets();
  const [picked, setPicked] = useState<Set<string>>(new Set(['Slab']));
  const [capture, setCapture] = useState<'photo' | 'video'>('photo');
  const [height, setHeight] = useState('');
  const [loading, setLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [wingspan, setWingspan] = useState(178);
  const [savedWingspan, setSavedWingspan] = useState(178);
  const [step, setStep] = useState(2);
  const [job, setJob] = useState({ stage: 1, percent: 35 });
  const toast = useToast();

  const heightError = height !== '' && !/^\d+(\.\d+)?$/.test(height) ? 'Enter a number in cm' : '';

  return (
    <ScrollView
      style={{ backgroundColor: colors.bg }}
      contentContainerStyle={{
        gap: spacing.xl,
        paddingHorizontal: spacing.screen,
        paddingTop: insets.top + spacing.md,
        paddingBottom: insets.bottom + spacing.xxl,
      }}
    >
      <View style={{ gap: spacing.xxs }}>
        <Text variant="largeTitle">Gallery</Text>
        <Text variant="subhead" color="textSecondary">
          Theme: {scheme} (follows the device)
        </Text>
      </View>

      <Section title="Button">
        <Button label="Primary" onPress={() => {}} />
        <Button label="Secondary" variant="secondary" onPress={() => {}} />
        <Button label="Ghost" variant="ghost" onPress={() => {}} />
        <Button label="Disabled" disabled onPress={() => {}} />
        <Button
          label={loading ? 'Loading' : 'Tap to load'}
          loading={loading}
          onPress={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1500);
          }}
        />
      </Section>

      <Section title="Card">
        <Card style={{ gap: spacing.xs }}>
          <Text variant="headline">Card title</Text>
          <Text color="textSecondary">White on cream in light mode, surface in dark mode.</Text>
        </Card>
      </Section>

      <Section title="TextField">
        <TextField label="Name" placeholder="Your name" autoCapitalize="words" />
        <TextField
          label="Height (cm)"
          placeholder="175"
          numeric
          value={height}
          onChangeText={setHeight}
          error={heightError}
        />
        <TextField label="Always errored" error="This field has an error" defaultValue="oops" />
      </Section>

      <Section title="Chip (multi-select)">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }}>
          {climbStyles.map((s) => (
            <Chip
              key={s}
              label={s}
              selected={picked.has(s)}
              onToggle={(on) =>
                setPicked((prev) => {
                  const next = new Set(prev);
                  if (on) next.add(s);
                  else next.delete(s);
                  return next;
                })
              }
            />
          ))}
          <Chip label="Disabled" selected={false} disabled onToggle={() => {}} />
        </View>
      </Section>

      <Section title="SegmentedControl">
        <SegmentedControl
          accessibilityLabel="Capture type"
          options={captureOptions}
          value={capture}
          onChange={setCapture}
        />
      </Section>

      <Section title="Slider">
        <Text variant="numeric">
          Wingspan {wingspan} cm (saved {savedWingspan})
        </Text>
        <Slider
          accessibilityLabel="Wingspan"
          min={140}
          max={220}
          value={wingspan}
          onChange={setWingspan}
          onChangeEnd={setSavedWingspan}
          formatValue={(v) => `${v} centimeters`}
        />
        <Slider
          accessibilityLabel="Disabled slider"
          min={0}
          max={10}
          value={4}
          disabled
          onChange={() => {}}
        />
      </Section>

      <Section title="ProgressSteps">
        <ProgressSteps variant="bar" total={4} current={step} accessibilityLabel="Onboarding" />
        <View style={{ flexDirection: 'row', gap: spacing.xs }}>
          <Button
            label="Back"
            variant="secondary"
            onPress={() => setStep((s) => Math.max(0, s - 1))}
          />
          <Button
            label="Next"
            variant="secondary"
            onPress={() => setStep((s) => Math.min(4, s + 1))}
          />
        </View>
        <ProgressSteps
          variant="stages"
          stages={routeStages}
          activeIndex={job.stage}
          percent={job.percent}
        />
        <Button
          label="Advance job"
          variant="secondary"
          onPress={() =>
            setJob(({ stage, percent }) =>
              percent >= 100
                ? { stage: 0, percent: 0 }
                : {
                    stage: Math.min(routeStages.length - 1, stage + 1),
                    percent: Math.min(100, percent + 25),
                  },
            )
          }
        />
      </Section>

      <Section title="Toast">
        <Button
          label="Info toast"
          variant="secondary"
          onPress={() => toast({ message: 'Photo saved' })}
        />
        <Button
          label="Success toast"
          variant="secondary"
          onPress={() => toast({ message: 'Profile updated', tone: 'success' })}
        />
        <Button
          label="Error toast with action"
          variant="secondary"
          onPress={() =>
            toast({
              message: 'Upload failed',
              tone: 'error',
              action: { label: 'Retry', onPress: () => toast({ message: 'Retrying…' }) },
            })
          }
        />
      </Section>

      <Section title="Sheet">
        <Button label="Open sheet" onPress={() => setSheetOpen(true)} />
      </Section>

      <Sheet visible={sheetOpen} onClose={() => setSheetOpen(false)} title="Adjust wingspan">
        <Text color="textSecondary">Drag down, tap outside, or press Done to close.</Text>
        <Slider
          accessibilityLabel="Wingspan in sheet"
          min={140}
          max={220}
          value={wingspan}
          onChange={setWingspan}
        />
        <Button label="Done" onPress={() => setSheetOpen(false)} />
      </Sheet>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: spacing.sm }}>
      <Text variant="title2">{title}</Text>
      {children}
    </View>
  );
}
