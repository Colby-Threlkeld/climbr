import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AccessibilityInfo, Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp, ReduceMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { motion, radii, shadow, spacing, touch } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { Button } from './Button';
import { Material } from './Material';
import { Text } from './Text';

export type ToastTone = 'info' | 'success' | 'error';

export type ToastOptions = {
  message: string;
  tone?: ToastTone;
  action?: { label: string; onPress: () => void };
};

type ToastState = ToastOptions & { id: number };

const ToastContext = createContext<((options: ToastOptions) => void) | null>(null);

// Replaces Alert.alert everywhere: `const toast = useToast(); toast({ message: 'Saved' })`.
export function useToast() {
  const show = useContext(ToastContext);
  if (!show) throw new Error('useToast must be used inside <ToastProvider>');
  return show;
}

// One toast at a time; a new one replaces the current one. Shown at the top so it never
// covers the bottom-anchored primary actions.
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const nextId = useRef(0);

  const show = useCallback((options: ToastOptions) => {
    nextId.current += 1;
    setToast({ ...options, id: nextId.current });
    // iOS VoiceOver ignores live regions on native, so announce explicitly.
    if (Platform.OS !== 'web') AccessibilityInfo.announceForAccessibility(options.message);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), motion.toast);
    return () => clearTimeout(timer);
  }, [toast]);

  const value = useMemo(() => show, [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? <ToastView key={toast.id} toast={toast} onDismiss={() => setToast(null)} /> : null}
    </ToastContext.Provider>
  );
}

function ToastView({ toast, onDismiss }: { toast: ToastState; onDismiss: () => void }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const tone = toast.tone ?? 'info';
  const dotColor = {
    info: colors.textSecondary,
    success: colors.success,
    error: colors.danger,
  }[tone];

  return (
    <Animated.View
      // Layout animations follow the system Reduce Motion setting (instant when it's on).
      entering={FadeInUp.duration(motion.screen).reduceMotion(ReduceMotion.System)}
      exiting={FadeOutUp.duration(motion.screen).reduceMotion(ReduceMotion.System)}
      pointerEvents="box-none"
      style={[styles.host, { top: insets.top + spacing.xs }]}
    >
      <Pressable
        role={tone === 'error' ? 'alert' : 'status'}
        aria-live={tone === 'error' ? 'assertive' : 'polite'}
        accessibilityHint="Tap to dismiss"
        onPress={onDismiss}
        style={[styles.shape, { boxShadow: shadow.raised }]}
      >
        {/* Toasts float over whatever screen is underneath, so they're glass (decision D1).
            Only textPrimary sits on glass; secondary gray fails contrast there. */}
        <Material variant="regular" style={[styles.shape, styles.toast]}>
          {/* Status color only on the dot (a badge), never on the text. */}
          <View style={[styles.dot, { backgroundColor: dotColor }]} aria-hidden />
          <Text style={styles.message}>{toast.message}</Text>
          {toast.action ? (
            <Button
              label={toast.action.label}
              variant="ghost"
              onPress={() => {
                // Dismiss first: the action may show a new toast, which must not be wiped.
                onDismiss();
                toast.action?.onPress();
              }}
            />
          ) : null}
        </Material>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: spacing.screen,
    right: spacing.screen,
  },
  shape: { borderRadius: radii.card },
  toast: {
    minHeight: touch.min,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingLeft: spacing.md,
    paddingVertical: spacing.xs,
  },
  dot: { width: spacing.xs, height: spacing.xs, borderRadius: radii.full },
  message: { flex: 1, paddingRight: spacing.md },
});
