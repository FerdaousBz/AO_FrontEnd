import PropTypes from 'prop-types';
import { cloneElement } from 'react';
import { useForm } from "react-hook-form";

export default function Form({ initialValues, onSubmit, render, reset, schema, ...rest }) {
    const formProps = useForm({
      ...(initialValues && { defaultValues: { ...initialValues } }),
      ...(schema && {
        resolver: validationSchema(schema),
      }),
    });
  
    return cloneElement(render, {
      ...formProps,
      ...rest,
      ...(onSubmit && { onSubmit }),
    });
  }
  
  Form.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    initialValues: PropTypes.object,
    onSubmit: PropTypes.func,
    render: PropTypes.node,
    // eslint-disable-next-line react/forbid-prop-types
    schema: PropTypes.object,
  };
  