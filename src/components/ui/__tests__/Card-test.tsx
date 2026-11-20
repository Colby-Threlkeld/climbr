import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { brand } from '@/theme/tokens';

import { Card } from '../Card';
import { Text } from '../Text';

describe('<Card />', () => {
  it('renders children on a white surface in light mode', async () => {
    await render(
      <Card testID="card">
        <Text>Inside</Text>
      </Card>,
    );
    expect(screen.getByText('Inside')).toBeTruthy();
    expect(StyleSheet.flatten(screen.getByTestId('card').props.style).backgroundColor).toBe(
      brand.white,
    );
  });
});
