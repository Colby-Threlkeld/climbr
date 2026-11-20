import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { haptics } from '@/lib/haptics';
import { brand, colors, touch } from '@/theme/tokens';

import { Button } from '../Button';

jest.mock('@/lib/haptics', () => ({ haptics: { tap: jest.fn(), selection: jest.fn() } }));

describe('<Button />', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders an accessible button with a 48 pt minimum height', async () => {
    await render(<Button label="Save" onPress={() => {}} />);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(StyleSheet.flatten(button.props.style).minHeight).toBe(touch.min);
  });

  it('calls onPress and fires a haptic', async () => {
    const onPress = jest.fn();
    await render(<Button label="Save" onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Save' }));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(haptics.tap).toHaveBeenCalledTimes(1);
  });

  it('ignores presses when disabled', async () => {
    const onPress = jest.fn();
    await render(<Button label="Save" disabled onPress={onPress} />);
    const button = screen.getByRole('button', { name: 'Save' });
    await fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  it('ignores presses and reports busy while loading', async () => {
    const onPress = jest.fn();
    await render(<Button label="Save" loading onPress={onPress} />);
    const button = screen.getByRole('button', { name: 'Save' });
    await fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
    expect(button).toBeBusy();
  });

  it('uses ink text on orange for primary, never white', async () => {
    await render(<Button label="Go" onPress={() => {}} />);
    const textColor = StyleSheet.flatten(screen.getByText('Go').props.style).color;
    expect(textColor).toBe(colors.light.onAccent);
    expect(textColor).toBe(brand.ink);
    expect(textColor).not.toBe(brand.white);
    const bg = StyleSheet.flatten(screen.getByRole('button').props.style).backgroundColor;
    expect(bg).toBe(brand.orange);
  });

  it('uses a custom accessibility label when given', async () => {
    await render(<Button label="Edit" accessibilityLabel="Edit height" onPress={() => {}} />);
    expect(screen.getByRole('button', { name: 'Edit height' })).toBeTruthy();
  });
});
