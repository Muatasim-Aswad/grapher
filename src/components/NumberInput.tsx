import { useState, useEffect } from "react";

type NumberInputProps = {
  id: string;
  value: number;
  onChange: (value: number) => void;
  className?: string;
};

function NumberInput({ id, value, onChange, className }: NumberInputProps) {
  const [inputValue, setInputValue] = useState(String(value));

  // Sync with external value changes
  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Allow empty, minus, decimal point, and incomplete decimals
    if (
      newValue === "" ||
      newValue === "-" ||
      newValue.endsWith(".") ||
      newValue.endsWith(",")
    ) {
      return;
    }

    // Replace comma with period for European decimal format
    const normalizedValue = newValue.replace(",", ".");
    const parsed = parseFloat(normalizedValue);

    if (!isNaN(parsed)) {
      onChange(parsed);
    }
  };

  const handleBlur = () => {
    // On blur, ensure the input shows a valid number
    const normalizedValue = inputValue.replace(",", ".");
    const parsed = parseFloat(normalizedValue);
    if (!isNaN(parsed)) {
      setInputValue(String(parsed));
    } else {
      setInputValue(String(value));
    }
  };

  return (
    <input
      id={id}
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
    />
  );
}

export default NumberInput;
