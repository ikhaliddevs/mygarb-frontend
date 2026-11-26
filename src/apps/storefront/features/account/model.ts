import { z } from 'zod';
export const idSchema = z.string().regex(/^[a-fA-F0-9]{24}$/);
export const profileSchema = z.object({
  id: idSchema,
  name: z.string(),
  phone: z.string(),
});
export const profileInputSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name.').max(100),
  phone: z
    .string()
    .trim()
    .max(30)
    .refine(
      (value) =>
        !value || (value.length >= 3 && /^\+?[0-9 ().-]+$/.test(value)),
      'Enter a valid phone number or leave it blank.',
    ),
});
export type ProfileInput = z.infer<typeof profileInputSchema>;
export const measurementInputSchema = z
  .object({
    unit: z.enum(['cm', 'in']),
    values: z
      .array(
        z.object({
          label: z.string().trim().min(1, 'Enter a measurement name.').max(60),
          value: z.number().positive('Enter a positive value.').max(1000),
        }),
      )
      .max(50),
  })
  .superRefine((data, context) => {
    const labels = new Set<string>();
    data.values.forEach((item, index) => {
      const label = item.label.toLowerCase();
      if (labels.has(label))
        context.addIssue({
          code: 'custom',
          path: ['values', index, 'label'],
          message: 'Measurement names must be unique.',
        });
      labels.add(label);
    });
  });
export type MeasurementInput = z.infer<typeof measurementInputSchema>;
export const measurementsSchema = z.object({
  unit: z.enum(['cm', 'in']),
  values: z.array(z.object({ label: z.string(), value: z.number() })),
  updatedAt: z.string(),
});
export type Measurements = z.infer<typeof measurementsSchema>;
export function convertMeasurement(
  value: number,
  from: 'cm' | 'in',
  to: 'cm' | 'in',
) {
  return from === to ? value : from === 'cm' ? value / 2.54 : value * 2.54;
}
