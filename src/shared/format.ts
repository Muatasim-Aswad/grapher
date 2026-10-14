const locale = 'en-GB';
const displayNumber = new Intl.NumberFormat(locale, {
  maximumFractionDigits: 4,
});
const displayInteger = new Intl.NumberFormat(locale, {
  maximumFractionDigits: 0,
});

export const formatNumber = (value: number) => displayNumber.format(value);
export const formatInteger = (value: number) => displayInteger.format(value);
