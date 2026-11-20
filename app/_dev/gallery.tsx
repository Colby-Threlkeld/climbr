import { Redirect } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Card, Chip, SegmentedControl, Text, TextField } from '@/components/ui';
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

function Gallery() {
  const { colors, scheme } = useTheme();
  const insets = useSafeAreaInsets();
  const [picked, setPicked] = useState<Set<string>>(new Set(['Slab']));
  const [capture, setCapture] = useState<'photo' | 'video'>('photo');
  const [height, setHeight] = useState('');
  const [loading, setLoading] = useState(false);

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
