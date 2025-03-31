import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders main heading', () => {
  render(<App />);
  const headingElement = screen.getByRole('heading', { name: /Vite \+ React/i });
  expect(headingElement).toBeInTheDocument();
});