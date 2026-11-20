import { fireEvent, render, screen } from '@testing-library/react-native';

import { SegmentedControl } from '../SegmentedControl';

jest.mock('@/lib/haptics', () => ({ haptics: { tap: jest.fn(), selection: jest.fn() } }));

const options = [
  { value: 'photo', label: 'Route photo' },
  { value: 'video', label: 'Video' },
] as const;

describe('<SegmentedControl />', () => {
  it('marks the selected segment', async () => {
    await render(
      <SegmentedControl
        accessibilityLabel="Capture type"
        options={options}
        value="photo"
        onChange={() => {}}
      />,
    );
    expect(screen.getByRole('radio', { name: 'Route photo' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Video' })).not.toBeChecked();
  });

  it('calls onChange with the new value, not for the current one', async () => {
    const onChange = jest.fn();
    await render(
      <SegmentedControl
        accessibilityLabel="Capture type"
        options={options}
        value="photo"
        onChange={onChange}
      />,
    );
    await fireEvent.press(screen.getByRole('radio', { name: 'Route photo' }));
    expect(onChange).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('radio', { name: 'Video' }));
    expect(onChange).toHaveBeenCalledWith('video');
  });
});
