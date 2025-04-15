import clsx from 'clsx';
import PropTypes from 'prop-types';

import styles from './wrapper.module.scss';

export default function Wrapper({ children, className, left }) {
  return (
    <div className={clsx(styles.wrapper, className)} style={{ '--left': `${left}%` }}>
      {children}
    </div>
  );
}

Wrapper.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  left: PropTypes.number,
};
