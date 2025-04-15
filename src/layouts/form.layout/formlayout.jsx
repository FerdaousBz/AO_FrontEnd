import PropTypes from 'prop-types';
import React from 'react';

import styles from './formlayout.module.scss';

const FormLayout = ({ children, formTitle, imageSrc, onSubmit }) => (
  <form className={styles.form} onSubmit={onSubmit}>
    <img src={imageSrc} alt={formTitle} className={styles.logoAO} />
    {children}
  </form>
);
FormLayout.propTypes = {
  children: PropTypes.node.isRequired,
  imageSrc: PropTypes.string,
  formTitle: PropTypes.string,
  onSubmit: PropTypes.func,
};
FormLayout.defaultProps = {
  imageSrc: 'public/images/logo-AO.png',
  formTitle: 'Form',
};
