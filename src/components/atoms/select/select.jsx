import clsx from 'clsx';
import PropTypes from 'prop-types';

import { Error } from '@/components/atoms/icons';

import styles from './select.module.scss';

export default function Select({
  className,
  disabled,
  hasError,
  label,
  name,
  onBlur,
  onChange,
  onFocus,
  options,
  value,
  ...rest
}) {
  const selectClassName = clsx(styles.select__select, hasError && styles.error);

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={clsx(styles.select, className)}>
      {label && (
        <label className={styles.select__label} htmlFor={name}>
          {label}
        </label>
      )}

      <select
        className={selectClassName}
        name={name}
        onChange={handleChange}
        value={value}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        {...rest}
      >
        {options.map((item) => (
          <option key={item?.key} value={item?.key}>
            {item?.value}
          </option>
        ))}
      </select>
      {hasError && <Error className={styles.select__error} />}
    </div>
  );
}

Select.defaultProps = {
  className: '',
  disabled: false,
  hasError: false,
  onBlur: () => {},
  onChange: () => {},
  onFocus: () => {},
};

Select.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  id: PropTypes.string,

  label: PropTypes.string,

  name: PropTypes.string,

  onBlur: PropTypes.func,

  onChange: PropTypes.func,

  onFocus: PropTypes.func,

  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),

  pattern: PropTypes.string,

  type: PropTypes.string,

  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
