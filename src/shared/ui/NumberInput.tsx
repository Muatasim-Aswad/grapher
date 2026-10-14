import { useEffect, useRef } from 'react';
import { parseNumber } from './number';

type NumberInputProps = {
  id: string;
  value: number | null;
  onChange: (value: number | null) => void;
  className?: string;
};

export default function NumberInput({
  id,
  value,
  onChange,
  className,
}: NumberInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (input && parseNumber(input.value) !== value)
      input.value = value === null ? '' : String(value);
  }, [value]);

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      inputMode="decimal"
      defaultValue={value ?? ''}
      aria-invalid={value === null}
      onChange={(event) => onChange(parseNumber(event.target.value))}
      onBlur={(event) => {
        const parsed = parseNumber(event.target.value);
        if (parsed !== null) event.target.value = String(parsed);
      }}
      className={className}
    />
  );
}
