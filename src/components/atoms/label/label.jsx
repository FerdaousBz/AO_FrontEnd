/* eslint-disable sort-destructure-keys/sort-destructure-keys */
/* eslint-disable react/function-component-definition */
import PropTypes from 'prop-types';
import React from 'react';

import styles from './label.module.scss';

const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className={styles.label}>
    {children}
  </label>
);

Label.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Label;
