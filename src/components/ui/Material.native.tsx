import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';
import { Platform, StyleSheet } from 'react-native';

import { useReduceTransparency } from '@/lib/useReduceTransparency';
import { material, withAlpha } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import {
  BlurSurface,
  radiusOf,
  SheenOverlay,
  SolidSurface,
  type MaterialMode,
  type MaterialProps,
  type MaterialVariant,
} from './MaterialSurface';

// Checked once: true only on iOS 26+ builds where Apple's glass API really exists
// (some iOS 26 betas crash without the runtime check; see expo/expo#40911).
const liquidGlass =
  Platform.OS === 'ios' && isGlassEffectAPIAvailable() && isLiquidGlassAvailable();

export function useMaterialMode(variant: MaterialVariant = 'regular'): MaterialMode {
  const reduce = useReduceTransparency();
  if (variant === 'solid' || reduce) return 'solid';
  return liquidGlass ? 'liquid-glass' : 'blur';
}

// iOS 26+: Apple's Liquid Glass, tinted with our brand color at the same contrast floor.
// Older iOS and Android: frosted blur. Reduce Transparency: solid.
export function Material({
  variant = 'regular',
  style,
  children,
  sheen = true,
  ...rest
}: MaterialProps) {
  const mode = useMaterialMode(variant);
  const { scheme } = useTheme();
  if (mode === 'solid' || variant === 'solid') {
    return (
      <SolidSurface style={style} sheen={sheen} {...rest}>
        {children}
      </SolidSurface>
    );
  }
  if (mode === 'blur') {
    return (
      <BlurSurface variant={variant} style={style} sheen={sheen} {...rest}>
        {children}
      </BlurSurface>
    );
  }
  const glass = material[scheme][variant];
  return (
    <GlassView
      glassEffectStyle={variant === 'thin' ? 'clear' : 'regular'}
      tintColor={withAlpha(glass.tint, glass.alpha)}
      colorScheme={scheme}
      style={[styles.clip, style]}
      {...rest}
    >
      {children}
      {sheen ? <SheenOverlay style={radiusOf(style)} /> : null}
    </GlassView>
  );
}

const styles = StyleSheet.create({ clip: { overflow: 'hidden' } });
