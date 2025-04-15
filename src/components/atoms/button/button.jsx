import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './button.module.scss';

const variantsClass = {
  dark: 'btn-dark',
  light: 'btn-light',
  link: 'btn-link',
  noOutline: 'btn-noOutline',
  outline: 'btn-outline',
  primary: 'btn-primary',
  secondary: 'btn-secondary',
};
const sizeClass = {
  large: 'btn-l',
  medium: 'btn-m',
  small: 'btn-s',
};

const iconClass = {
  icon: 'icon',
  iconOnly: 'only-icon',
};

const positionClass = {
  center: 'margin',
  left: 'marginRight',
  right: 'marginLeft',
};
export default function Button({
  as,
  children,
  className,
  disabled,
  icon,
  onClick,
  position,
  size,
  type,
  variant,
  ...rest
}) {
  const classNames = clsx(
    styles.button,
    styles?.[variantsClass?.[variant]],
    styles?.[sizeClass?.[size]],
    styles?.[iconClass?.[icon]],
    className,
  );
  const Comp = as || 'button';
  return (
    <Comp
      type={type ? 'submit' : 'button'}
      className={classNames}
      onClick={onClick}
      disabled={!!disabled}
      style={{ ...(position && { [`${positionClass?.[position]}`]: 'auto' }) }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
Button.defaultProps = {
  disabled: false,
  variant: 'primary',
};
Button.propTypes = {
  as: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.oneOf(['icon', 'iconOnly']),
  onClick: PropTypes.func,
  position: PropTypes.oneOf(['center', 'left', 'right']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  type: PropTypes.string,
  variant: PropTypes.oneOf(['light', 'dark', 'primary', 'secondary', 'noOutline', 'outline']),
};
// const Button = ({ type, className, children }) => (
//   <button type={type} className={`${styles.button} ${className}`}>
//     {children}
//   </button>
// );

// Button.propTypes = {
//   type: PropTypes.string.isRequired,
//   className: PropTypes.string,
//   children: PropTypes.node.isRequired,
// };

// Button.defaultProps = {
//   className: '',
// };

// export default Button;
