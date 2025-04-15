import axios from 'axios';
import Cookies from 'js-cookie';
import {
  BACKEND_FORGET_PASSWORD,
  BACKEND_GET_USERBYID,
  BACKEND_OTP_SENT,
  BACKEND_RESET_PASSWORD,
  BACKEND_SIGNIN,
  BACKEND_SIGNUP,
  BACKEND_UPDATE_PASS,
  BACKEND_UPDATE_USER,
  BACKEND_VERIF_OTP,
} from '@/utils/consts';

import { getCookie } from '@/utils/cookies';
import { jwtDecode } from 'jwt-decode';
import { authenticationApi } from '@/service/apiServices';

// Signin
// export const authentication = async ({ email, password }) => {
//   try {
//     const response = await authenticationApi(email, password);
//     if (response.data.status === 'SUCCESS') {
//       const { accessToken, email, id, level, profileImageUrl, username } = response.data.data;
//       localStorage.setItem('email', email);
//       localStorage.setItem('accessToken', accessToken);

//       // Store user data for easy access
//       const userData = {
//         email,
//         id,
//         level,
//         profileImageUrl,
//         username,
//       };
//       localStorage.setItem('user', JSON.stringify(userData));

//       return response.data;
//     } else {
//       throw new Error(response.data.message || 'Login failed');
//     }
//   } catch (error) {
//     throw new Error(error.response?.data?.message || 'Login failed');
//   }
// };
export const authentication = async ({ email, password }) => {
  try {
    // Static credentials for testing
    const staticEmail = "test@example.com";
    const staticPassword = "password123";
    
    // Check if the credentials match
    if (email === staticEmail && password === staticPassword) {
      // Simulate successful response
      const response = {
        data: {
          status: 'SUCCESS',
          data: {
            accessToken: 'dummy_access_token',
            email: staticEmail,
            id: '12345',
            level: 'user',
            profileImageUrl: 'https://example.com/profile.jpg',
            username: 'testuser',
          }
        }
      };
      
      // Store the returned static data in localStorage
      const { accessToken, email, id, level, profileImageUrl, username } = response.data.data;
      localStorage.setItem('email', email);
      localStorage.setItem('accessToken', accessToken);

      const userData = {
        email,
        id,
        level,
        profileImageUrl,
        username,
      };
      localStorage.setItem('user', JSON.stringify(userData));

      return response.data;
    } else {
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    throw new Error(error.message || 'Login failed');
  }
};

// Signup
export const createAccount = async (email, newPassword, confirmPassword) => {
  const verifmail = getCookie('verifiedEmail');
  const response = await axios.post(`${import.meta.env.VITE_API_URI}${BACKEND_SIGNUP}`, {
    email: verifmail,
    password: newPassword,
    confirmPassword,
  });

  return response.data;
};

// logout
export const logout = () => {
  Cookies.remove('token');
};

// generate otp and sent
export const generateOtp = async (email) => {
  try {
    const generate = await axios.post(`${import.meta.env.VITE_API_URI}${BACKEND_OTP_SENT}`, {
      email,
    });
    // console.log('generate', generate);
    return generate.data;
  } catch (error) {
    console.error('Error in generateOtp:', error);
    throw error;
  }
};

// verif otp
export const verifyOtp = async (email, otp) => {
  const verif = await axios.post(`${import.meta.env.VITE_API_URI}${BACKEND_VERIF_OTP}`, {
    email,
    otp,
  });
  return verif.data;
};
// send email
export const initiatePasswordReset = async (email) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URI}${BACKEND_FORGET_PASSWORD}`, {
      email,
    });
    // console.log('reponse', response.data);

    return response.data;
  } catch (error) {
    console.error('Error in sending email :', error);
    throw error;
  }
};

// Modify Password
export const updatePassword = async (token, newPassword, confirmPassword) => {
  const accessToken = localStorage.getItem('accessToken');
  const response = await axios.post(`${import.meta.env.VITE_API_URI}${BACKEND_RESET_PASSWORD}`, {
    token: resetToken,
    newPassword,
    confirmPassword,
  });

  return response.data;
};

// get user data
export const getUserDetails = async (email) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(
      `${import.meta.env.VITE_API_URI}${BACKEND_GET_USERBYID}${email}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    console.log('respooo', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error Getting User Details ', error.response?.data || error.message);
    throw error;
  }
};
export const changePassword = async (accessToken, currentPassword, newPassword) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URI}${BACKEND_UPDATE_PASS}`,
      {
        accessToken,
        currentPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Retrieve the token again if needed
        },
      },
    );

    console.log('Password update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating password:', error.response?.data || error.message);
    throw error;
  }
};
export const updateUserProfile = async (email, userRequest, profileImageUrl) => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    // Create FormData object to handle the multipart form-data request
    const formData = new FormData();

    // Append username and password from userRequest to formData
    formData.append('username', userRequest.username);
    formData.append('password', userRequest.password);

    // If a profile image URL exists, append it to formData
    if (profileImageUrl) {
      formData.append('profileImage', profileImageUrl); // profileImageUrl should be a file (e.g., a Blob or File object)
    }

    // Make PUT request to update user profile
    const response = await axios.put(
      `${import.meta.env.VITE_API_URI}${BACKEND_UPDATE_USER}${email}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    // Handle successful response
    if (response.data.status === 'Success') {
      return {
        status: 'success',
        data: response.data.data,
      };
    } else {
      return {
        status: 'error',
        message: response.data.message || 'Failed to update user profile.',
      };
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    return {
      status: 'error',
      message: 'Failed to update user profile.',
    };
  }
};
