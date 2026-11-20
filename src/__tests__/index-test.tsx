import { render, screen } from '@testing-library/react-native';

// Lives in src/ (not app/) because every file under app/ becomes a route.
import Index from '../../app/index';

describe('<Index />', () => {
  it('renders the placeholder', async () => {
    await render(<Index />);
    expect(screen.getByText('Cruxshot')).toBeTruthy();
  });
});
