import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { colors } from '@/theme/tokens';

import { ProgressSteps } from '../ProgressSteps';

const stages = [
  { key: 'upload', label: 'Uploading' },
  { key: 'holds', label: 'Finding holds' },
  { key: 'beta', label: 'Suggesting beta' },
] as const;

const bg = (testID: string) =>
  StyleSheet.flatten(screen.getByTestId(testID).props.style).backgroundColor;

describe('<ProgressSteps variant="bar" />', () => {
  it('fills completed segments with the accent and reports the step', async () => {
    await render(<ProgressSteps variant="bar" total={4} current={2} />);
    expect([0, 1, 2, 3].map((i) => bg(`segment-${i}`))).toEqual([
      colors.light.accent,
      colors.light.accent,
      colors.light.surfaceAlt,
      colors.light.surfaceAlt,
    ]);
    const bar = screen.getByRole('progressbar');
    expect(bar.props['aria-valuenow']).toBe(2);
    expect(bar.props['aria-valuetext']).toBe('Step 2 of 4');
  });

  it('clamps current to the range', async () => {
    await render(<ProgressSteps variant="bar" total={3} current={9} />);
    expect(screen.getByRole('progressbar').props['aria-valuenow']).toBe(3);
  });
});

describe('<ProgressSteps variant="stages" />', () => {
  it('marks done / active / pending stages and shows the real percent', async () => {
    await render(<ProgressSteps variant="stages" stages={stages} activeIndex={1} percent={42.4} />);
    expect(screen.getByTestId('stage-upload-done')).toBeTruthy();
    expect(screen.getByTestId('stage-holds-active')).toBeTruthy();
    expect(screen.getByTestId('stage-beta-pending')).toBeTruthy();
    expect(screen.getByText('42%')).toBeTruthy();
    const bar = screen.getByRole('progressbar');
    expect(bar.props['aria-valuenow']).toBe(42);
    expect(bar.props['aria-valuetext']).toBe('Finding holds, 42%');
    expect(StyleSheet.flatten(screen.getByTestId('stages-fill').props.style).width).toBe('42%');
  });

  it('clamps percent to 0–100 and hides the bar without a percent', async () => {
    const { rerender } = await render(
      <ProgressSteps variant="stages" stages={stages} activeIndex={0} percent={140} />,
    );
    expect(screen.getByRole('progressbar').props['aria-valuenow']).toBe(100);
    await rerender(<ProgressSteps variant="stages" stages={stages} activeIndex={0} />);
    expect(screen.queryByRole('progressbar')).toBeNull();
  });
});
