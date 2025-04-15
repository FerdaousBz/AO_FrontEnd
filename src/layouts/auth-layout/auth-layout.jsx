import PropTypes from 'prop-types';

import Wrapper from '@/layouts/wrapper/wrapper';

import styles from './auth-layout.module.scss';

export default function AuthLayout({ children }) {
  return (
    <Wrapper left={0} from="signin">
      <div className={styles.container}>
        <div className={styles.content}>{children}</div>
      </div>
    </Wrapper>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.node,
};
