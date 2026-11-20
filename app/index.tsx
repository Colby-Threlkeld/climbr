import { router } from 'expo-router';
import { View } from 'react-native';

import { Button, Text } from '@/components/ui';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

// Placeholder until the tab shell (step 06) exists. Styled with tokens only.
export default function Index() {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        padding: spacing.screen,
        backgroundColor: colors.bg,
      }}
    >
      <Text variant="largeTitle">Cruxshot</Text>
      <Text variant="subhead" color="textSecondary">
        Suggested beta for indoor bouldering
      </Text>
      {/* Dev-only entry point: Expo Go has no URL bar to type /_dev/gallery into. */}
      {__DEV__ ? (
        <Button
          label="Component gallery"
          variant="ghost"
          onPress={() => router.push('/_dev/gallery')}
        />
      ) : null}
    </View>
  );
}
