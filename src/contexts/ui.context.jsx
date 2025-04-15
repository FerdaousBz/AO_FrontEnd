import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { authentication } from '@/service/auth'; // Assurez-vous que le chemin est correct
import {
  CLOSE_MODAL,
  IMAGE_URL,
  LOGIN,
  LOGOUT,
  OPENSIDEBAR,
  OPEN_MODAL,
  SUBMENU,
  USERNAME,
} from '@/utils/consts';

const initialState = {
  isAuthenticated: false,
  modalContent: null,
  displayModal: false,
  urlImage: '',
  userName: '',
  sidebaropen: true,
  submenus: false,
};

export const UiContext = createContext(initialState);
UiContext.displayName = 'ui-context';

const reducer = (state, action) => {
  switch (action.type) {
    case OPEN_MODAL: {
      return {
        ...state,
        displayModal: true,
        modalContent: action?.payload,
      };
    }
    case CLOSE_MODAL: {
      return {
        ...state,
        displayModal: true,
        modalContent: null,
      };
    }
    case LOGIN: {
      return {
        ...state,
        isAuthenticated: true,
        ...action.payload,
      };
    }
    case LOGOUT: {
      return {
        ...state,
        isAuthenticated: false,
        urlImage: '',
        userName: '',
      };
    }
    case IMAGE_URL: {
      return {
        ...state,
        urlImage: action?.payload,
      };
    }
    case USERNAME: {
      return {
        ...state,
        userName: action?.payload,
      };
    }
    case OPENSIDEBAR: {
      return {
        ...state,
        sidebaropen: action?.payload,
      };
    }
    case SUBMENU: {
      return {
        ...state,
        submenus: action?.payload,
      };
    }
    default:
      return state;
  }
};

const UiContextProvider = UiContext.Provider;

export function UiProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const openModal = (input) =>
    dispatch({
      payload: input,
      type: OPEN_MODAL,
    });
  const openSubmenu = (input) =>
    dispatch({
      payload: input,
      type: SUBMENU,
    });
  const ocsidebar = (opener) =>
    dispatch({
      payload: opener,
      type: OPENSIDEBAR,
    });
  const closeModal = (input) => dispatch({ type: CLOSE_MODAL });
  // const login = async (email, password) => {
  //   console.log('login ui context', email, password);
  //   try {
  //     const userData = await authentication({
  //       email,
  //       password,
  //     }); // Utilisez la méthode authentication
  //     if (userData) {
  //       const { accessToken, username, profileImageUrl } = userData.data; // Ajustez selon la structure de votre réponse
  //       localStorage.setItem('accessToken', accessToken); // Stockez le token
  //       dispatch({
  //         type: LOGIN,
  //         payload: {
  //           userName: username,
  //           urlImage: profileImageUrl,
  //         },
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Error logging in and fetching user data:', error);
  //     handleToast('error', 'Login failed. Please try again.'); // Informer l'utilisateur
  //   }
  // };
  const login = async (email, password) => {
    console.log('login ui context', email, password);
    try {
      const userData = await authentication({ email, password }); // Use the static authentication function
      if (userData) {
        const { accessToken, username, profileImageUrl } = userData.data; // Adjusted according to static response
  
        localStorage.setItem('accessToken', accessToken); // Store the token
  
        // Dispatch login action
        dispatch({
          type: LOGIN,
          payload: {
            userName: username,
            urlImage: profileImageUrl,
          },
        });
  
        // Optionally handle the success (e.g., redirect or show a success message)
        console.log('Login successful');
      }
    } catch (error) {
      console.error('Error logging in and fetching user data:', error);
      handleToast('error', 'Login failed. Please try again.'); // Inform the user
    }
  };
  
  const logout = () => {
    // Supprimer le token et les données utilisateur du localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user'); // Si vous avez stocké des informations utilisateur
    localStorage.removeItem('email'); // Si vous avez stocké des informations utilisateur

    // Dispatcher l'action de déconnexion
    dispatch({ type: LOGOUT });
  };
  const urlimage = (opener) =>
    dispatch({
      payload: opener,
      type: IMAGE_URL,
    });
  const username = (opener) =>
    dispatch({
      payload: opener,
      type: USERNAME,
    });
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken'); // Utilisez localStorage
    if (accessToken) {
      dispatch({ type: LOGIN }); // Mettez à jour l'état d'authentification
    } else {
      dispatch({ type: LOGOUT }); // Mettez à jour l'état d'authentification si l'utilisateur n'est pas connecté
    }
  }, []);
  const value = useMemo(
    () => ({
      ...state,
      openModal,
      closeModal,
      login,
      logout,
      urlimage,
      username,
      openSubmenu,
      ocsidebar,
    }),
    [state],
  );
  return <UiContextProvider value={value}>{children}</UiContextProvider>;
}

UiProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useUi = () => {
  const context = useContext(UiContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
