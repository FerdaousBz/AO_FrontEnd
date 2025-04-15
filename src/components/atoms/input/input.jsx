import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

import Button from '@/components/atoms/button/button';
import usePasswordToggle from '@/components/hooks/use-password-toggle';

import styles from './input.module.scss';

import { Error, EyeHide, EyeShow } from '../icons';

const Input = forwardRef(
  (
    {
      className,
      disabled,
      hasError,
      label,
      name,
      onBlur,
      onChange,
      onFocus,
      pattern,
      placeholder,
      type,
      value,
      ...rest
    },
    ref,
  ) => {
    const inputClassName = clsx(styles.input__input, hasError && styles.input__error);
    const { onPasswordToggle, shwoPassword } = usePasswordToggle();
    const handleBlur = (e) => {
      if (onBlur) {
        onBlur(e);
      }
      e.target.placeholder = placeholder;
    };

    const handleFocus = (e) => {
      if (onFocus) {
        onFocus(e);
      }
      e.target.placeholder = '';
    };
    const typePassword = shwoPassword?.[name] ? 'text' : 'password';
    return (
      <div id={name} className={className}>
        {label && (
          <label className={styles.input__label} htmlFor={name}>
            {label}
          </label>
        )}

        <div className={styles.input}>
          <input
            className={inputClassName}
            ref={ref}
            id={name}
            type={type === 'password' ? typePassword : type}
            name={name}
            placeholder={placeholder}
            onChange={onChange}
            value={value}
            onBlur={handleBlur}
            onFocus={handleFocus}
            disabled={disabled}
            pattern={pattern}
            {...rest}
          />

          {type === 'password' && (
            <div style={{ right: hasError ? '45px' : '20px' }} className={styles.input_eye}>
              <Button
                id={name}
                icon="iconOnly"
                variant="noOutline"
                onClick={() => onPasswordToggle(name)}
              >
                {shwoPassword?.[name] ? <EyeShow size="xs" /> : <EyeHide size="xs" />}
              </Button>
            </div>
          )}

          {hasError && <Error className={styles['input__error--icon']} />}
        </div>

        {hasError && <p className={styles['input__error--text']}>{hasError}</p>}
      </div>
    );
  },
);
Input.defaultProps = {
  className: '',
  disabled: false,
  hasError: '',
  onBlur: () => {},
  onChange: () => {},
  onFocus: () => {},
  placeholder: '',
  type: 'text',
};

Input.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  hasError: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  pattern: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
export default Input;
