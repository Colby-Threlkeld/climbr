import { fireEvent, render, screen } from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { size } from '@/theme/tokens';

import { Slider, valueToX, xToValue } from '../Slider';

jest.mock('@/lib/haptics', () => ({ haptics: { tap: jest.fn(), selection: jest.fn() } }));

// Finger dragging is checked in a real browser (touch); here we test the math and the
// screen-reader path, which is the same code a keyboard or VoiceOver user hits.
describe('Slider math', () => {
  const width = 200 + size.sliderThumb; // 200 pt of usable travel

  it('maps values to thumb positions and back', () => {
    expect(valueToX(140, 140, 220, width)).toBe(0);
    expect(valueToX(220, 140, 220, width)).toBe(200);
    expect(valueToX(180, 140, 220, width)).toBe(100);
    expect(xToValue(100, 140, 220, 1, width)).toBe(180);
  });

  it('snaps to the step and clamps to the range', () => {
    expect(xToValue(101, 0, 10, 5, width)).toBe(5);
    expect(xToValue(-50, 0, 10, 1, width)).toBe(0);
    expect(xToValue(999, 0, 10, 1, width)).toBe(10);
  });
});

describe('<Slider />', () => {
  const setup = async (props: Partial<React.ComponentProps<typeof Slider>> = {}) => {
    const onChange = jest.fn();
    const onChangeEnd = jest.fn();
    // Same wrapper the app's root layout provides; gestures require it.
    await render(
      <GestureHandlerRootView>
        <Slider
          accessibilityLabel="Wingspan"
          min={140}
          max={220}
          value={180}
          onChange={onChange}
          onChangeEnd={onChangeEnd}
          formatValue={(v) => `${v} centimeters`}
          {...props}
        />
      </GestureHandlerRootView>,
    );
    return { onChange, onChangeEnd, slider: screen.getByRole('adjustable', { name: 'Wingspan' }) };
  };

  it('exposes range and spoken value to screen readers', async () => {
    const { slider } = await setup();
    expect(slider.props['aria-valuemin']).toBe(140);
    expect(slider.props['aria-valuemax']).toBe(220);
    expect(slider.props['aria-valuenow']).toBe(180);
    expect(slider.props['aria-valuetext']).toBe('180 centimeters');
  });

  it('steps up and down via accessibility actions', async () => {
    const { slider, onChange, onChangeEnd } = await setup();
    await fireEvent(slider, 'accessibilityAction', { nativeEvent: { actionName: 'increment' } });
    expect(onChange).toHaveBeenLastCalledWith(181);
    expect(onChangeEnd).toHaveBeenLastCalledWith(181);
    await fireEvent(slider, 'accessibilityAction', { nativeEvent: { actionName: 'decrement' } });
    expect(onChange).toHaveBeenLastCalledWith(179);
  });

  it('does not step past max', async () => {
    const { slider, onChange } = await setup({ value: 220 });
    await fireEvent(slider, 'accessibilityAction', { nativeEvent: { actionName: 'increment' } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('ignores input when disabled', async () => {
    const { slider, onChange } = await setup({ disabled: true });
    await fireEvent(slider, 'accessibilityAction', { nativeEvent: { actionName: 'increment' } });
    expect(onChange).not.toHaveBeenCalled();
    expect(slider.props['aria-disabled']).toBe(true);
  });
});
