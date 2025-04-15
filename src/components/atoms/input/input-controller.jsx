/* eslint-disable react/forbid-prop-types */

import PropTypes from 'prop-types';
import { useController } from 'react-hook-form';

import { Input } from '@/components/atoms';

export default function InputController({ control, defaultValue, name, onBlur, ...rest }) {
  const {
    field: { ref, value, ...restField },
  } = useController({
    control,
    defaultValue,
    name,
  });
  const handleOnBlur = (e) => {
    onBlur?.(e);
    restField?.onBlur(e);
  };

  return <Input ref={ref} value={value} {...restField} {...rest} onBlur={handleOnBlur} />;
}
InputController.propTypes = {
  control: PropTypes.object,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  onBlur: PropTypes.func,
};
