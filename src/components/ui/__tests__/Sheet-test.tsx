import { fireEvent, render, screen } from '@testing-library/react-native';

import { Sheet } from '../Sheet';
import { Text } from '../Text';

describe('<Sheet />', () => {
  it('renders title and content when visible', async () => {
    await render(
      <Sheet visible onClose={() => {}} title="Adjust wingspan">
        <Text>Inside</Text>
      </Sheet>,
    );
    expect(screen.getByText('Adjust wingspan')).toBeTruthy();
    expect(screen.getByText('Inside')).toBeTruthy();
  });

  it('renders nothing when hidden', async () => {
    await render(
      <Sheet visible={false} onClose={() => {}} title="Hidden">
        <Text>Inside</Text>
      </Sheet>,
    );
    expect(screen.queryByText('Inside')).toBeNull();
  });

  it('closes when the backdrop is tapped', async () => {
    const onClose = jest.fn();
    await render(
      <Sheet visible onClose={onClose} title="T">
        <Text>Inside</Text>
      </Sheet>,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
