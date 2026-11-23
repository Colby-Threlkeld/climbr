import { useReduceTransparency } from '@/lib/useReduceTransparency';

import {
  BlurSurface,
  SolidSurface,
  type MaterialMode,
  type MaterialProps,
  type MaterialVariant,
} from './MaterialSurface';

// Web + Android + fallback. Web: CSS backdrop-filter (via expo-blur). Android: blur inside a
// <GlassBackdrop> on Android 12+, tint-only otherwise. iOS uses Material.native.tsx instead.

export function useMaterialMode(variant: MaterialVariant = 'regular'): MaterialMode {
  const reduce = useReduceTransparency();
  return variant === 'solid' || reduce ? 'solid' : 'blur';
}

export function Material({ variant = 'regular', ...rest }: MaterialProps) {
  const mode = useMaterialMode(variant);
  if (mode === 'solid' || variant === 'solid') return <SolidSurface {...rest} />;
  return <BlurSurface variant={variant} {...rest} />;
}
