import {
  BACKEND_GEN_SUMMARY,
  BACKEND_GET_RESUME,
  BACKEND_OPPORT_SUMMARY,
  BACKEND_UPLOAD_FILE,
} from '@/utils/consts';
import { getCookie } from '@/utils/cookies';
import axios from 'axios';
import Cookies from 'js-cookie';

// Upload file to the back-end
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URI}${BACKEND_UPLOAD_FILE}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    console.log('File uploaded successfully:', response);
    return response.data;
  } catch (error) {
    console.error('Error in uploading file:', error);
    throw error;
  }
};

// Generate summary based on file ID
export const generateSummary = async (fileId) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URI}${BACKEND_GEN_SUMMARY}`, {
      fileId,
    });
    console.log('Summary generated successfully:', response);
    return response.data;
  } catch (error) {
    console.error('Error in generating summary:', error);
    throw error;
  }
};

// Fetch resume by fileId (GET request)
// export const getResumeByFileId = async (fileId) => {
//   try {
//     const accessToken = Cookies.get('accessToken'); // Extract token from cookies
//     console.log('Access Token:', accessToken);
//     console.log('File ID:', fileId);
//     const response = await axios.get(`${import.meta.env.VITE_API_URI}${BACKEND_GET_RESUME}`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`, // Include token in headers
//       },
//       params: { fileId }, // Send fileId as a query parameter
//     });
//     console.log('Resume fetched successfully:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching resume:', error);
//     throw error;
//   }
// };
//Get Resume by fileid
export const getResumeByFileId = async (fileId) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken);
    console.log('File ID:', fileId);
    const response = await axios.get(
      `${import.meta.env.VITE_API_URI}${BACKEND_GET_RESUME}/${fileId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include token in headers
        },
      },
    );
    console.log('Resume fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching resume:', error);
    throw error;
  }
};
