import PropTypes from 'prop-types';

import { Background } from '@/components/atoms/icons';

import styles from './formwrapper.module.scss';

function FormWrapper({ children, formTitle, imageSrc, onSubmit }) {
  return (
    <div className={styles.screen__background}>
      <Background />

      <form className={styles.form} onSubmit={onSubmit}>
        <img src={imageSrc} alt={formTitle} className={styles.logoAO} />
        {children}
      </form>
    </div>
  );
}

FormWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  imageSrc: PropTypes.string,
  formTitle: PropTypes.string,
  onSubmit: PropTypes.func,
};

FormWrapper.defaultProps = {
  imageSrc: 'public/images/logo-AO.png',
  formTitle: 'Form',
};

export default FormWrapper;
