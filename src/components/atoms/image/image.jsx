import clsx from 'clsx';
import PropTypes from 'prop-types';

import styles from './image.module.scss';

export default function Image({ alt, center, className, height, size, src, width }) {
  return (
    <img
      src={src}
      alt={alt}
      className={clsx(styles.img, className, size && styles[`img-${size}`])}
      style={{
        ...(center && { margin: 'auto' }),
        ...(width && { '--img-width': `${width}em` }),
        ...(height && { '--img-height': `${height}em` }),
      }}
    />
  );
}

Image.propTypes = {
  alt: PropTypes.string,
  center: PropTypes.bool,
  className: PropTypes.string,
  height: PropTypes.number,
  size: PropTypes.oneOf(['x-small', 'small', 'medium', 'large', 'x-large']),
  src: PropTypes.string,
  width: PropTypes.number,
};
