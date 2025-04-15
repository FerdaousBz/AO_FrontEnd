import { BACKEND_SEND_RESUME_EMAIL } from '@/utils/consts';
import axios from 'axios';
import Cookies from 'js-cookie';

export const sendResumeEmail = async (email, fileId, additionalResourceEmails = []) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken);

    // Prepare the payload to send to the API
    const payload = {
      email,
      fileId,
      additionalResourceEmails:
        additionalResourceEmails.length > 0 ? additionalResourceEmails : undefined,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_API_URI}${BACKEND_SEND_RESUME_EMAIL}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include token in headers
        },
      },
    );

    // Return the response data
    return response.data;
  } catch (error) {
    console.error('Error in sending resume email:', error.response?.data || error.message);
    throw error; // Rethrow error for handling in the calling component
  }
};
function formatObjectToQueryString(obj) {
  return Object.entries(obj)
    .map(([key, value]) => {
      if (value !== undefined) {
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      }
      return null;
    })
    .filter(Boolean)
    .join('&');
}

export const sendResumeEmailrefacot = async (email, fileId, additionalResourceEmails = []) => {
  try {
    console.log('Email:', email);
    console.log('File ID:', fileId);
    console.log('Additional Emails:', additionalResourceEmails);

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('Access token is missing');
      throw new Error('Unauthorized: Missing access token');
    }
    console.log('Access Token:', accessToken);

    // Prepare the payload for the query string
    const payload = {
      email, // Include `email` in the query string
      fileId,
      additionalResourceEmails: additionalResourceEmails.join(','), // Convert array to a comma-separated string
    };

    // Format the query string
    const queryString = formatObjectToQueryString(payload);

    // Construct the URL
    const url = `${import.meta.env.VITE_API_URI}${BACKEND_SEND_RESUME_EMAIL}?${queryString}`;
    console.log('URL:', url);

    // Make the POST request
    const response = await axios.post(
      url,
      null, // No request body as parameters are in the query string
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json', // Ensure headers are set correctly
        },
      }
    );

    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in sending resume email:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.error('Authentication failed. Please check the token or API credentials.');
    }
    throw error;
  }
};
