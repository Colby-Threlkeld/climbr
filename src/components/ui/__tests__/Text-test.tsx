import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { colors, textScale, type } from '@/theme/tokens';

import { Text } from '../Text';

// Jest has no device color scheme, so useTheme() resolves to light here.
describe('<Text />', () => {
  it('defaults to body + textPrimary', async () => {
    await render(<Text>Hello</Text>);
    const style = StyleSheet.flatten(screen.getByText('Hello').props.style);
    expect(style).toMatchObject({ ...type.body, color: colors.light.textPrimary });
  });

  it('applies the variant and color', async () => {
    await render(
      <Text variant="largeTitle" color="textSecondary">
        Title
      </Text>,
    );
    const style = StyleSheet.flatten(screen.getByText('Title').props.style);
    expect(style).toMatchObject({ fontSize: 34, color: colors.light.textSecondary });
  });

  it('caps accessibility scaling only when dense', async () => {
    await render(
      <>
        <Text dense>Dense</Text>
        <Text>Normal</Text>
      </>,
    );
    expect(screen.getByText('Dense').props.maxFontSizeMultiplier).toBe(textScale.denseMax);
    expect(screen.getByText('Normal').props.maxFontSizeMultiplier).toBeUndefined();
  });

  it('leaves fontFamily unset on native (decision G11)', async () => {
    await render(<Text>Native</Text>);
    const style = StyleSheet.flatten(screen.getByText('Native').props.style);
    expect(style.fontFamily).toBeUndefined();
  });
});
