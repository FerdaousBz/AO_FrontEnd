import clsx from 'clsx';
import PropTypes from 'prop-types';
import { cloneElement } from 'react';

import styles from './icon-wrapper.module.scss';

export default function Icon({ children, className, color, size, style, ...otherProps }) {
  return cloneElement(children, {
    ...otherProps,
    className: clsx(children.props.className, styles.icon, styles[`icon--size${size}`], className),
    focusable: 'false',
    role: 'img',
    size,
    style: {
      ...children.props.style,
      ...style,
      ...(color && { '--svg-color': color }),
      ...(color && { fill: color }),
    },
  });
}

Icon.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.oneOf(['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl']),
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
};
