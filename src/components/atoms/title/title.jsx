import clsx from 'clsx';
import PropTypes from 'prop-types';

import styles from './title.module.scss';

export default function TitleBlock({ children, className, ...rest }) {
  return (
    <div className={clsx(styles.title, className)} {...rest}>
      {children}
    </div>
  );
}
TitleBlock.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
