import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import NumberInput from './NumberInput';
import { parseNumber } from './number';

it.each(['', '-', '.', '1e', 'Infinity', '1e999', '12abc', '1,2,3'])(
  'rejects invalid or partial number %s',
  (value) => {
    expect(parseNumber(value)).toBeNull();
  },
);

it.each([
  ['1,25', 1.25],
  ['-0.5', -0.5],
  ['1e-3', 0.001],
  ['1.', 1],
])('accepts complete numeric input %s', (value, expected) => {
  expect(parseNumber(value as string)).toBe(expected);
});

it('preserves focus and incomplete drafts while typing, then accepts a decimal', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<NumberInput id="number" value={null} onChange={onChange} />);
  const input = screen.getByRole('textbox');
  await user.type(input, '-');
  expect(input).toHaveFocus();
  expect(input).toHaveValue('-');
  expect(onChange).toHaveBeenLastCalledWith(null);
  await user.type(input, '0,5');
  expect(onChange).toHaveBeenLastCalledWith(-0.5);
});

it('updates an external reset and keeps an invalid draft visible until reset', () => {
  const onChange = vi.fn();
  const { rerender } = render(
    <NumberInput id="number" value={2} onChange={onChange} />,
  );
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'abc' } });
  rerender(<NumberInput id="number" value={null} onChange={onChange} />);
  expect(input).toHaveValue('abc');
  rerender(<NumberInput id="number" value={5} onChange={onChange} />);
  expect(input).toHaveValue('5');
});
