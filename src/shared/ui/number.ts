export function parseNumber(value: string): number | null {
  const normalized = value.trim().replace(',', '.');
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(normalized))
    return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}
