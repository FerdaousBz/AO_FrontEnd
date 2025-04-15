import clsx from 'clsx';
import PropTypes from 'prop-types';

import styles from './heading.module.scss';

export default function Heading({
  as,
  bold,
  center,
  children,
  className,
  color,
  uppercase,
  ...rest
}) {
  const Comp = as;
  const classNames = clsx(
    styles[`${as}`],
    className,
    bold && styles.bold,
    uppercase && styles.uppercase,
    center && styles.center,
  );
  return (
    <Comp className={classNames} style={{ color }} {...rest}>
      {children}
    </Comp>
  );
}
Heading.propTypes = {
  as: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p']),
  bold: PropTypes.bool,
  center: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.string,
  uppercase: PropTypes.bool,
};
