import { fireEvent, render, screen } from '@testing-library/react-native';

import { TextField } from '../TextField';

describe('<TextField />', () => {
  it('renders the label and forwards text changes', async () => {
    const onChangeText = jest.fn();
    await render(<TextField label="Name" onChangeText={onChangeText} />);
    expect(screen.getByText('Name')).toBeTruthy();
    await fireEvent.changeText(screen.getByLabelText('Name'), 'Alex');
    expect(onChangeText).toHaveBeenCalledWith('Alex');
  });

  it('shows the error and includes it in the accessibility label', async () => {
    await render(<TextField label="Height" error="Enter a number" />);
    expect(screen.getByText('Enter a number')).toBeTruthy();
    expect(screen.getByLabelText('Height, Enter a number')).toBeTruthy();
  });

  it('uses the number pad when numeric', async () => {
    await render(<TextField label="Height" numeric />);
    const input = screen.getByLabelText('Height');
    expect(input.props.keyboardType).toBe('decimal-pad');
    expect(input.props.inputMode).toBe('decimal');
  });
});
