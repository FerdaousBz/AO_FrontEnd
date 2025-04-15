/* eslint-disable camelcase */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable consistent-return */
import { authentication, getUserDetails } from '@/service/auth';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import { navigate } from 'use-history';

const useAuth = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [user, setUser] = useState({});
  const email = localStorage.getItem('email');

  // Function to update user details
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    setProfileImageUrl(updatedUser.profileImageUrl);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Decode token and set user state if token is valid
  useEffect(() => {
    if (accessToken && accessToken.split('.').length === 3) {
      try {
        const decodedToken = jwtDecode(accessToken);

        if (decodedToken.exp * 1000 < Date.now()) {
          // Token expired
          logout();
        } else {
          const savedUser = localStorage.getItem('user');
          setUser(savedUser ? JSON.parse(savedUser) : decodedToken);
        }
      } catch (error) {
        console.error('Failed to decode access token:', error.message, accessToken);
        logout(); // Clear if decoding fails
      }
    } else {
      console.error('Invalid access token format:', accessToken);
      logout();
    }
  }, [accessToken]);

  // Fetch user details when accessToken or email changes
  useEffect(() => {
    if (email && accessToken) {
      const fetchUserDetails = async () => {
        try {
          const userDetails = await getUserDetails(email);
          setProfileImageUrl(userDetails.thumbnail || '');
          localStorage.setItem('user', JSON.stringify(userDetails));
        } catch (error) {
          console.error('Error fetching user details', error);
        }
      };
      fetchUserDetails();
    }
  }, [email, accessToken]);

  const login = async (email, password) => {
    try {
      const response = await authentication({
        email,
        password,
      });
      const { accessToken, id, username, level } = response.data;

      // Store accessToken and user info
      localStorage.setItem('email', email);
      localStorage.setItem('accessToken', accessToken);

      const userData = { id, username, email, level };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setAccessToken(accessToken);
      return true;
    } catch (error) {
      console.error('Login failed:', error.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser({});
    setAccessToken(null);
    setProfileImageUrl(''); // Clear profile picture URL
  };

  return { accessToken, email, login, logout, profileImageUrl, updateUser, user };
};

export default useAuth;
