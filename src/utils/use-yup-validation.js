import { useCallback } from 'react';

export default function useYupValidation(validationSchema) {
  return useCallback(
    async (data) => {
      try {
        // Validation réussie
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });

        return {
          errors: {},
          values,
        };
      } catch (validationError) {
        // Erreurs de validation
        const errors = validationError.inner.reduce(
          (allErrors, currentError) => ({
            ...allErrors,
            [currentError.path]: {
              message: currentError.message,
              type: currentError.type ?? 'validation',
            },
          }),
          {},
        );

        return {
          errors,
          values: {},
        };
      }
    },
    [validationSchema],
  );
}
