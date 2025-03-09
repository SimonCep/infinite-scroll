import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./pages/Home/Home', () => () => (
  <div data-testid="home-page">Test1</div>
));

describe('App tests', () => {
  test('Should render the Home component', () => {
    render(<App />);
    const homeElement = screen.getByTestId('home-page');
    expect(homeElement).toBeInTheDocument();
    expect(homeElement).toHaveTextContent('Test1');
  });
});