import { describe, it, expect } from 'vitest';
import {
  convertMeasurement,
  measurementInputSchema,
  profileInputSchema,
} from './model';
describe('private account validation', () => {
  it('converts actual measurements in both directions', () => {
    expect(convertMeasurement(2.54, 'cm', 'in')).toBeCloseTo(1, 12);
    expect(convertMeasurement(10, 'in', 'cm')).toBeCloseTo(25.4, 12);
    expect(convertMeasurement(90, 'cm', 'cm')).toBe(90);
  });
  it('does not accumulate meaningful round-trip conversion error', () => {
    let value = 90;
    for (let i = 0; i < 50; i++)
      value = convertMeasurement(
        convertMeasurement(value, 'cm', 'in'),
        'in',
        'cm',
      );
    expect(value).toBeCloseTo(90, 10);
  });
  it.each([0, -1, 1001, NaN])('rejects invalid measurement %s', (value) => {
    expect(
      measurementInputSchema.safeParse({
        unit: 'cm',
        values: [{ label: 'Chest', value }],
      }).success,
    ).toBe(false);
  });
  it('rejects duplicate trimmed case-insensitive measurement labels', () => {
    expect(
      measurementInputSchema.safeParse({
        unit: 'cm',
        values: [
          { label: 'Chest', value: 90 },
          { label: ' chest ', value: 91 },
        ],
      }).success,
    ).toBe(false);
  });
  it('allows clearing measurements explicitly', () => {
    expect(measurementInputSchema.parse({ unit: 'in', values: [] })).toEqual({
      unit: 'in',
      values: [],
    });
  });
  it('rejects more than 50 measurements', () => {
    expect(
      measurementInputSchema.safeParse({
        unit: 'cm',
        values: Array.from({ length: 51 }, (_, i) => ({
          label: 'Value ' + i,
          value: 10,
        })),
      }).success,
    ).toBe(false);
  });
  it('accepts a blank optional phone and rejects invalid characters', () => {
    expect(
      profileInputSchema.safeParse({ name: 'Customer', phone: '' }).success,
    ).toBe(true);
    expect(
      profileInputSchema.safeParse({ name: 'Customer', phone: 'abc' }).success,
    ).toBe(false);
  });
});
