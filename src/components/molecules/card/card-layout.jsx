/* eslint-disable sort-destructure-keys/sort-destructure-keys */
import { clsx } from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './card.module.scss';

function Card({ className, body, footer, header, headerClass, bodyClass, footerClass  }) {
  return (
    <div className={clsx(styles.card, className)}>
      {header && <div className={clsx(styles.cardHeader,headerClass)}>{header}</div>}
      {body && <div className={clsx(styles.cardBody,bodyClass)}>{body}</div>}
      {footer && <div className={clsx(styles.cardFooter,footerClass)}>{footer}</div>}
    </div>
  );
}

Card.propTypes = {
  header: PropTypes.node,
  body: PropTypes.node,
  footer: PropTypes.node,
  className: PropTypes.string,
  headerClass: PropTypes.string,
  bodyClass: PropTypes.string,
  footerClass: PropTypes.string,
};

export default Card;
