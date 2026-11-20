import { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { borderWidth, fontFamily, radii, spacing, touch, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { Text } from './Text';

export type TextFieldProps = Omit<TextInputProps, 'style' | 'keyboardType' | 'inputMode'> & {
  label: string;
  error?: string;
  // Number pad on phones (native keyboardType + web inputMode), e.g. height/wingspan in cm.
  numeric?: boolean;
};

export function TextField({
  label,
  error,
  numeric = false,
  onFocus,
  onBlur,
  ...rest
}: TextFieldProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const ringColor = error ? colors.danger : focused ? colors.accent : 'transparent';

  return (
    <View style={styles.wrapper}>
      <Text variant="subhead" color="textSecondary">
        {label}
      </Text>
      <TextInput
        // Screen readers announce the label and, if present, the error with the field.
        accessibilityLabel={error ? `${label}, ${error}` : label}
        keyboardType={numeric ? 'decimal-pad' : 'default'}
        inputMode={numeric ? 'decimal' : 'text'}
        placeholderTextColor={colors.textSecondary}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          styles.input,
          type.body,
          fontFamily ? { fontFamily } : null,
          { backgroundColor: colors.surfaceAlt, color: colors.textPrimary, borderColor: ringColor },
        ]}
        {...rest}
      />
      {error ? (
        <Text variant="footnote" color="danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  input: {
    minHeight: touch.min,
    paddingHorizontal: spacing.md,
    borderRadius: radii.control,
    // Always reserve the ring width so focusing doesn't shift the layout.
    borderWidth: borderWidth.thick,
  },
});
