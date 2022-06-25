import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import App from './App';

const AppWithRouter = () => <BrowserRouter><App /></BrowserRouter>
test('renders learn react link', () => {
  render(<AppWithRouter />);
  const linkElement = screen.getByText(/shop/i);
  expect(linkElement).toBeInTheDocument();
});
