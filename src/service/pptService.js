import { BACKEND_GEN_PPT, BACKEND_GET_PPT } from '@/utils/consts';
import axios from 'axios';

//Get PPT already generated
export const getPPTgenerated = async ({ summary_id }) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(
      `${import.meta.env.VITE_API_URI}${BACKEND_GET_PPT}${summary_id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include token in headers
        },
      },
    );
    console.log('respppp', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching summary and opportunity data:',
      error.response || error.message || error,
    );
    throw error;
  }
};

export const generatePPT = async ({ fileId }) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.post(
      `${import.meta.env.VITE_API_URI}${BACKEND_GEN_PPT}${fileId}`,
      {}, // Corps de la requête (peut être un objet vide si non nécessaire)
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include token in headers
        },
      },
    );
    console.log('response pptService.generatePPT', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'response pptService.generatePPT: Error fetching summary and opportunity data:',
      error.response || error.message || error,
    );
    throw error;
  }
};
