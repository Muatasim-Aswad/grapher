import { render, screen, fireEvent } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import Graph from './Graph';
import type { GrapherState } from './model';

vi.mock('./Chart', () => ({ default: () => null }));

function fixture(): GrapherState {
  return {
    mathFunction: {
      id: 'speedScore',
      defaultVariable: 'x',
      parameters: [
        { name: 'x', defaultValue: 0, defaultMin: 0, defaultMax: 1 },
      ],
      fn: ({ x }) => ({ first: x, second: x * 2 }),
    },
    variableParam: 'x',
    rangeMin: 0,
    rangeMax: 1,
    step: 0.1,
    staticParams: {},
  };
}

it('preserves hidden outputs when the range changes', () => {
  const state = fixture();
  const { rerender } = render(<Graph state={state} />);
  fireEvent.click(screen.getByRole('checkbox', { name: 'first' }));
  expect(screen.getByRole('checkbox', { name: 'first' })).not.toBeChecked();
  rerender(<Graph state={{ ...state, rangeMax: 2 }} />);
  expect(screen.getByRole('checkbox', { name: 'first' })).not.toBeChecked();
});

it('preserves choices through an invalid range and recovery', () => {
  const state = fixture();
  const { rerender } = render(<Graph state={state} />);
  fireEvent.click(screen.getByRole('checkbox', { name: 'first' }));
  rerender(<Graph state={{ ...state, step: 0 }} />);
  expect(screen.getByRole('alert')).toHaveTextContent('positive step');
  rerender(<Graph state={state} />);
  expect(screen.getByRole('checkbox', { name: 'first' })).not.toBeChecked();
});

it('lets users toggle a single numeric output', () => {
  const state = fixture();
  state.mathFunction.fn = ({ x }) => x;
  render(<Graph state={state} />);
  const checkbox = screen.getByRole('checkbox', { name: 'Speed score' });
  expect(checkbox).toBeChecked();
  fireEvent.click(checkbox);
  expect(checkbox).not.toBeChecked();
});
