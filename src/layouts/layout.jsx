import PropTypes from 'prop-types';

import SideBar from '@/components/molecules/sidebar/sidebar';

import styles from './layout.module.scss';
import Wrapper from './wrapper/wrapper';

export default function Layout({ children, page }) {
  return (
    <div className={styles.container}>
       <SideBar />
      <Wrapper className={styles.content} from={page} left={0}>
        {children}
      </Wrapper>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
  page: PropTypes.string,
};
