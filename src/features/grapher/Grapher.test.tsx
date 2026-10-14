import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import Grapher from './Grapher';

vi.mock('./Chart', () => ({ default: () => null }));

it('starts with consistent defaults and switches functions and variables', () => {
  render(<Grapher />);
  expect(screen.getByLabelText('Variable parameter')).toHaveValue('answerTime');
  expect(screen.getByLabelText('Minimum')).toHaveValue('0');
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Select function'), {
    target: { value: 'streakBonus' },
  });
  expect(screen.getByLabelText('Variable parameter')).toHaveValue('streak');
  expect(screen.getByLabelText('Maximum')).toHaveValue('15');
  fireEvent.change(screen.getByLabelText('Variable parameter'), {
    target: { value: 'threshold' },
  });
  expect(screen.getByLabelText('Maximum')).toHaveValue('10');
  expect(screen.getByLabelText('Current streak')).toHaveValue('5');
});

it('reports invalid inputs and recovers without hiding their text', () => {
  render(<Grapher />);
  const step = screen.getByLabelText('Step');
  fireEvent.change(step, { target: { value: '0' } });
  expect(screen.getByRole('alert')).toHaveTextContent('positive step');
  fireEvent.change(step, { target: { value: 'abc' } });
  expect(step).toHaveValue('abc');
  expect(step).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByRole('alert')).toHaveTextContent('finite number');
  fireEvent.change(step, { target: { value: '50' } });
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

it('clears invalid fixed fields when changing functions', () => {
  render(<Grapher />);
  fireEvent.change(screen.getByLabelText('Item length (characters)'), {
    target: { value: '-' },
  });
  expect(screen.getByRole('alert')).toHaveTextContent('finite number');
  fireEvent.change(screen.getByLabelText('Select function'), {
    target: { value: 'streakBonus' },
  });
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
