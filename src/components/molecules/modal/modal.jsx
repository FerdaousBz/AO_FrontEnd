/* eslint-disable react/function-component-definition */
/* eslint-disable sort-destructure-keys/sort-destructure-keys */
/* eslint-disable react/button-has-type */
import PropTypes from 'prop-types';
import React from 'react';

import styles from './modal.module.scss';
import { Close } from '@/components/atoms/icons';
import { Divider, Label } from '@/components/atoms';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <Label className={styles.emailLabel}> Send Email to Participants</Label>
        <Close className={styles.closeButton} onClick={onClose}/>
        <Divider/>
          {children}
          
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
