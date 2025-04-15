import clsx from 'clsx';
import PropTypes from 'prop-types';

import styles from './divider.module.scss';

export default function Divider({ className, color, size }) {
  return (
    <div
      className={clsx(styles.divider, className, size && styles[`divider-${size}`])}
      style={{ ...(color && { '--diver-color': color }) }}
    />
  );
}

Divider.defaultProps = {
  size: 's',
};

Divider.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.oneOf(['s', 'm', 'l']),
};
