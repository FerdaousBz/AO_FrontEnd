/* eslint-disable react/function-component-definition */
/* eslint-disable sort-destructure-keys/sort-destructure-keys */

import PropTypes from 'prop-types';
import React from 'react';

import { Input } from '@/components/atoms';
import Label from '@/components/atoms/label/label';

import styles from './inputfield.module.scss';

const InputField = ({ label, type, id, name, placeholder }) => (
  <div className={styles.inputField}>
    <Label htmlFor={id}>{label}</Label>
    <Input type={type} id={id} name={name} placeholder={placeholder} />
  </div>
);

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
};

export default InputField;
