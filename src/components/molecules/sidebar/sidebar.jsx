import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChatSidebar,
  Chevron,
  Chevronl,
  Home,
  Setting,
  UserNoProfile,
} from '@/components/atoms/icons';
import { useUi } from '@/contexts/ui.context';
import styles from './sidebar.module.scss';
import useAuth from '@/components/hooks/use-auth';
import { LOGOUT } from '@/utils/consts.js';

const menus = [
  {
    title: 'MAIN',
    items: [
      {
        icon: Home,
        url: '/dashboard',
      },
      {
        icon: ChatSidebar,
        url: '/chatbot',
      },
    ],
  },
  {
    title: 'OTHER',
    items: [
      {
        icon: Setting,
        url: '/profile',
      },
    ],
  },
];

export default function SideBar() {
  const location = useLocation();
  const navigate = useNavigate(); // Initialisez useNavigate
  const { logout, ocsidebar, sidebaropen } = useUi(); // Assurez-vous que la fonction logout est accessible ici
  const { profileImageUrl } = useAuth();
  const [redirect, setRedirect] = useState(false);

  const prevProfileImageUrlRef = useRef();
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    if (profileImageUrl !== prevProfileImageUrlRef.current) {
      prevProfileImageUrlRef.current = profileImageUrl;
    }
  }, [profileImageUrl]);

  const getBase64Image = (base64String) => {
    if (base64String.startsWith('data:image')) {
      return base64String;
    } else {
      return `data:image/jpeg;base64,${base64String}`;
    }
  };
  const handleLogout = async () => {
    try {
      await logout(); // Appel de la fonction de déconnexion
      console.info('Déconnexion....');

      setShowLogout(false); // Masquer le bouton de déconnexion après la déconnexion
      setRedirect(true); // Déclenche la redirection
    } catch (error) {
      console.error('Error during logout:', error);
      // Afficher un message d'erreur à l'utilisateur ici si nécessaire
    }
  };

  useEffect(() => {
    if (redirect) {
      console.log('sidebar 80');
      navigate('/signin'); // Redirection après déconnexion
    }
  }, [redirect, navigate]);

  return (
    <div className={styles.sidebarContainer}>
      <div
        className={clsx(
          styles.sidebar,
          sidebaropen ? styles.sidebar_opened : styles.sidebar_closed,
        )}
      >
        <img
          className={sidebaropen ? styles.sidebar__logo : styles.sidebar__logo_closed}
          src="/images/logo-AO.png"
          alt="logo"
        />
        <div className={styles.sidebar__divider} />
        {menus.map(({ items, title }) => (
          <div key={title} className={styles.sidebar__section}>
            <h3
              className={clsx(
                styles.sidebar__section_title,
                sidebaropen && styles.sidebar__section_title__opened,
              )}
            >
              {title}
            </h3>
            <div className={styles.sidebar__links}>
              {items.map(({ icon: Icon, url }) => {
                const isActive =
                  location.pathname === url || (location.pathname === '/' && url === '/dashboard');
                return (
                  <Link
                    to={url}
                    key={url}
                    className={clsx(styles.sidebar__link, isActive && styles.sidebar__link_active)}
                  >
                    <div
                      className={clsx(
                        sidebaropen
                          ? isActive && styles.sidebar__indicator
                          : isActive && styles.sidebar__indicator__closed,
                      )}
                    />
                    <Icon className={isActive ? styles.icon_active : styles.icon} size="xs" />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
        <div className={styles.sidebar__bottom}>
          <div className={styles.sidebar__divider_bottom} />
          <div className={styles.profile_link}>
            <button
              type="button"
              className={styles.avatar_logo}
              onClick={() => setShowLogout(!showLogout)} // Toggle the logout button display
            >
              {profileImageUrl ? (
                <img
                  src={getBase64Image(profileImageUrl)}
                  alt="User  Profile"
                  loading="lazy"
                  className={styles.avatar_image}
                />
              ) : (
                <UserNoProfile color="#8686865c" alt="No Profile" className={styles.avatar_icon} />
              )}
            </button>
            {showLogout && (
              <button type="button" className={styles.logout_button} onClick={handleLogout}>
                <LOGOUT></LOGOUT>Logout
              </button>
            )}
          </div>
        </div>
      </div>
      <button
        type="button"
        className={clsx(styles.sidebar__chevron, sidebaropen && styles.sidebar__chevron_opened)}
        onClick={() => ocsidebar(!sidebaropen)}
      >
        {sidebaropen ? (
          <Chevronl className={styles.chevron_opened} />
        ) : (
          <Chevron className={styles.chevron_opened} />
        )}
      </button>
    </div>
  );
}
