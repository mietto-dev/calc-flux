export enum SupportedOperations {
  NOOP,
  SUM = '+',
  SUBTRACTION = '-',
  MULTIPLICATION = 'x',
  DIVISION = '÷',
}

export const CalculatorOperations = new Map<
  SupportedOperations,
  (v: number[]) => number
>();

CalculatorOperations.set(SupportedOperations.NOOP, (v: number[]) => {
  return v.at(0) || 0;
});

CalculatorOperations.set(SupportedOperations.SUM, (v: number[]) => {
  return v.length === 2 ? v[0] + v[1] : v[0];
});

CalculatorOperations.set(SupportedOperations.SUBTRACTION, (v: number[]) => {
  return v.length === 2 ? v[0] - v[1] : v[0];
});

CalculatorOperations.set(SupportedOperations.MULTIPLICATION, (v: number[]) => {
  return v.length === 2 ? v[0] * v[1] : v[0];
});

CalculatorOperations.set(SupportedOperations.DIVISION, (v: number[]) => {
  return v.length === 2 ? v[0] / v[1] : v[0];
});
