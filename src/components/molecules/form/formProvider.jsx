import PropTypes from 'prop-types';

import validationSchema from '@/utils/use-yup-validation';
import { FormProvider, useForm } from 'react-hook-form';
import { cloneElement } from 'react';

export default function FormProviderCustom({ initialValues, onSubmit, render, schema, ...rest }) {
  const methods = useForm({
    ...(initialValues && { defaultValues: { ...initialValues } }),
    ...(schema && {
      resolver: validationSchema(schema),
    }),
  });

  const renderedElement = cloneElement(render, {
    ...rest,
    ...(onSubmit && { onSubmit: methods.handleSubmit(onSubmit) }),
  });

  return (
    <FormProvider onSubmit={onSubmit} {...methods}>
      {renderedElement}
    </FormProvider>
  );
}

FormProviderCustom.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  render: PropTypes.node,
  // eslint-disable-next-line react/forbid-prop-types
  schema: PropTypes.object,
};
