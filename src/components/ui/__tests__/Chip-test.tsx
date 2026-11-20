import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { touch } from '@/theme/tokens';

import { Chip } from '../Chip';

jest.mock('@/lib/haptics', () => ({ haptics: { tap: jest.fn(), selection: jest.fn() } }));

describe('<Chip />', () => {
  it('exposes checked state and a 48 pt target', async () => {
    await render(<Chip label="Slab" selected onToggle={() => {}} />);
    const chip = screen.getByRole('checkbox', { name: 'Slab' });
    expect(chip).toBeChecked();
    expect(StyleSheet.flatten(chip.props.style).minHeight).toBe(touch.min);
  });

  it('reports the next state on press', async () => {
    const onToggle = jest.fn();
    await render(<Chip label="Slab" selected={false} onToggle={onToggle} />);
    await fireEvent.press(screen.getByRole('checkbox', { name: 'Slab' }));
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('ignores presses when disabled', async () => {
    const onToggle = jest.fn();
    await render(<Chip label="Slab" selected={false} disabled onToggle={onToggle} />);
    await fireEvent.press(screen.getByRole('checkbox', { name: 'Slab' }));
    expect(onToggle).not.toHaveBeenCalled();
  });
});
