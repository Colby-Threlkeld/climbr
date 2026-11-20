import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { motion } from '@/theme/tokens';

import { Button } from '../Button';
import { ToastProvider, useToast, type ToastOptions } from '../Toast';

jest.mock('@/lib/haptics', () => ({ haptics: { tap: jest.fn(), selection: jest.fn() } }));

function Trigger({ options }: { options: ToastOptions }) {
  const toast = useToast();
  return <Button label="Show" onPress={() => toast(options)} />;
}

const setup = (options: ToastOptions) =>
  render(
    <ToastProvider>
      <Trigger options={options} />
    </ToastProvider>,
  );

describe('Toast', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows the message and dismisses itself after motion.toast', async () => {
    await setup({ message: 'Saved' });
    await fireEvent.press(screen.getByRole('button', { name: 'Show' }));
    expect(screen.getByText('Saved')).toBeTruthy();
    expect(screen.getByRole('status')).toBeTruthy();
    await act(() => jest.advanceTimersByTime(motion.toast));
    expect(screen.queryByText('Saved')).toBeNull();
  });

  it('uses an alert role for errors and runs the action', async () => {
    const onRetry = jest.fn();
    await setup({
      message: 'Upload failed',
      tone: 'error',
      action: { label: 'Retry', onPress: onRetry },
    });
    await fireEvent.press(screen.getByRole('button', { name: 'Show' }));
    expect(screen.getByRole('alert')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Upload failed')).toBeNull();
  });

  it('keeps a toast shown by the action (e.g. Retry → "Retrying…")', async () => {
    function RetryFlow() {
      const toast = useToast();
      return (
        <Button
          label="Fail"
          onPress={() =>
            toast({
              message: 'Upload failed',
              tone: 'error',
              action: { label: 'Retry', onPress: () => toast({ message: 'Retrying…' }) },
            })
          }
        />
      );
    }
    await render(
      <ToastProvider>
        <RetryFlow />
      </ToastProvider>,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Fail' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Retry' }));
    expect(screen.getByText('Retrying…')).toBeTruthy();
    expect(screen.queryByText('Upload failed')).toBeNull();
  });

  it('throws a clear error outside the provider', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(render(<Trigger options={{ message: 'x' }} />)).rejects.toThrow(
      'useToast must be used inside <ToastProvider>',
    );
  });
});
