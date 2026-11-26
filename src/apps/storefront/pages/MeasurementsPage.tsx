import { useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useMeasurementsQuery,
  useSaveMeasurementsMutation,
} from '@/services/api/customerApi';
import {
  measurementInputSchema,
  convertMeasurement,
  type MeasurementInput,
  type Measurements,
} from '../features/account/model';
import { DataFeedback } from '@/shared/components/feedback/DataFeedback';
import { authError } from '@/features/auth/model';
function MeasurementEditor({ saved }: { saved: Measurements | null }) {
  const [save] = useSaveMeasurementsMutation();
  const [feedback, setFeedback] = useState('');
  const [failed, setFailed] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<MeasurementInput>({
    resolver: zodResolver(measurementInputSchema),
    defaultValues: saved ?? { unit: 'cm', values: [] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'values' });
  const unit = useWatch({ control, name: 'unit' });
  return (
    <form
      className="card p-4"
      noValidate
      onSubmit={handleSubmit(async (data) => {
        setFeedback('');
        setFailed(false);
        try {
          const result = await save(data).unwrap();
          if (!result) throw new Error('Invalid save response');
          reset({ unit: result.unit, values: result.values });
          setFeedback(
            'Measurements saved. Existing requests and orders keep their agreed snapshots.',
          );
        } catch (error) {
          setFailed(true);
          setFeedback(authError(error));
        }
      })}
    >
      {feedback && <p role={failed ? 'alert' : 'status'}>{feedback}</p>}
      {saved && (
        <p className="small">
          Last recorded: {new Date(saved.updatedAt).toLocaleDateString()}
        </p>
      )}
      <label className="form-label" htmlFor="measurement-unit">
        Unit
      </label>
      <select
        id="measurement-unit"
        className="form-select mb-3"
        value={unit}
        disabled={isSubmitting}
        onChange={(event) => {
          const next = event.target.value === 'in' ? 'in' : 'cm';
          const previous = getValues('unit');
          getValues('values').forEach((item, index) =>
            setValue(
              `values.${index}.value`,
              convertMeasurement(item.value, previous, next),
              { shouldDirty: true },
            ),
          );
          setValue('unit', next, { shouldDirty: true, shouldValidate: true });
        }}
      >
        <option value="cm">Centimetres (cm)</option>
        <option value="in">Inches (in)</option>
      </select>
      {!fields.length && (
        <p>No measurements recorded. Add the measurements you have taken.</p>
      )}
      {fields.map((field, index) => (
        <div key={field.id} className="row g-2 mb-3 align-items-end">
          <div className="col-12 col-md-6">
            <label htmlFor={'label-' + field.id} className="form-label">
              Measurement {index + 1}
            </label>
            <input
              id={'label-' + field.id}
              className="form-control"
              {...register(`values.${index}.label`)}
              aria-invalid={Boolean(errors.values?.[index]?.label)}
              aria-describedby={'error-' + field.id}
            />
          </div>
          <div className="col-8 col-md-4">
            <label htmlFor={'value-' + field.id} className="form-label">
              Value ({unit})
            </label>
            <input
              id={'value-' + field.id}
              className="form-control"
              type="number"
              step="any"
              {...register(`values.${index}.value`, { valueAsNumber: true })}
              aria-invalid={Boolean(errors.values?.[index]?.value)}
              aria-describedby={'error-' + field.id}
            />
          </div>
          <div className="col-4 col-md-2">
            <button
              type="button"
              className="btn btn-outline-danger"
              disabled={isSubmitting}
              onClick={() => remove(index)}
              aria-label={'Remove measurement ' + (index + 1)}
            >
              Remove
            </button>
          </div>
          <p className="text-danger small mb-0" id={'error-' + field.id}>
            {errors.values?.[index]?.label?.message ||
              errors.values?.[index]?.value?.message}
          </p>
        </div>
      ))}
      <div className="d-flex flex-wrap gap-3">
        <button
          type="button"
          className="btn btn-outline-primary"
          disabled={fields.length >= 50 || isSubmitting}
          onClick={() => append({ label: '', value: 0 })}
        >
          Add measurement
        </button>
        <button className="btn btn-primary" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? 'Saving…' : 'Save measurements'}
        </button>
      </div>
      {fields.length === 0 && saved && (
        <p className="mt-3 mb-0">
          Saving an empty list clears your saved measurements.
        </p>
      )}
    </form>
  );
}
export function MeasurementsPage() {
  const query = useMeasurementsQuery();
  return (
    <>
      <h1>My measurements</h1>
      <p>
        Use a flexible tape without pulling it tight. Ask your designer which
        measurements your garment needs. Changing the unit converts the values.
      </p>
      {query.isLoading || query.error || query.data === undefined ? (
        <DataFeedback
          loading={query.isLoading}
          error={query.error}
          retry={query.refetch}
        />
      ) : (
        <MeasurementEditor saved={query.data} />
      )}
      <p className="small mt-3">
        These values are private. Designer review and category-specific
        measurement guidance are not available yet.
      </p>
    </>
  );
}
