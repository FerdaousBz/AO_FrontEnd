import axios from 'axios';
import {
  BACKEND_GEN_PPT,
  BACKEND_GEN_SUMMARY,
  BACKEND_GET8RESUME,
  BACKEND_GET_PPT,
  BACKEND_OPPORTUNITIES_DROPDOWN,
  BACKEND_SIGNIN,
} from '@/utils/consts';

export function axiosGET(url, params, data) {
  const accessToken = localStorage.getItem('accessToken');
  return axios.get(url, {
    data,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: params,
  });
}

export function axiosPOST(url, params, data) {
  const accessToken = localStorage.getItem('accessToken');
  return axios.post(url, {
    data,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: params,
  });
}

export const authenticationApi = async (email, password) => {
  try {
    console.log('authenticationApi', email, password);
    return await axios.post(`${import.meta.env.VITE_API_URI}${BACKEND_SIGNIN}`, {
      email,
      password,
    });

    /*

        const url = `${import.meta.env.VITE_API_URI}${BACKEND_SIGNIN}`;
        const params = {};
        const data = {
          email,
          password,
        };
        const response = await axiosPOST(url, params, data);
        return response; */
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};
export const getDropdawonIdList = async (page, limit) => {
  try {
    const url = `${import.meta.env.VITE_API_URI}${BACKEND_OPPORTUNITIES_DROPDOWN}`;
    const params = {
      page: page,
      limit: limit,
    };
    const data = {};
    const response = await axiosGET(url, params, data);
    return response.data;
  } catch (error) {
    console.error("Error a la generation d'id du dropdown:", error);
    throw error;
  }
};

export const getGenerateSummary = async (fileId) => {
  try {
    const url = `${import.meta.env.VITE_API_URI}${BACKEND_GET8RESUME}/${fileId}`;
    const params = {};
    const data = {};
    const response = await axiosGET(url, params, data);
    return response.data;
  } catch (error) {
    console.error('Error in generating summary:', error);
  }
};
export const postGenerateSummary = async (fileId) => {
  try {
    const url = `${import.meta.env.VITE_API_URI}${BACKEND_GEN_SUMMARY}`;
    const params = {};
    const data = { fileId };
    const response = await axiosPOST(url, params, data);
    return response.data;
  } catch (error) {
    console.error('Error in generating summary:', error);
    throw error;
  }
};

export const getPPTgenerated = async (summary_id) => {
  try {
    const url = `${import.meta.env.VITE_API_URI}${BACKEND_GET_PPT}${summary_id}`;
    const params = {};
    const data = {};
    const response = await axiosGET(url, params, data);
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching summary and opportunity data:',
      error.response || error.message || error,
    );
    throw error;
  }
};

export const postGeneratePPT = async (fileId) => {
  try {
    const url = `${import.meta.env.VITE_API_URI}${BACKEND_GEN_PPT}${fileId}`;
    const params = {};
    const data = {};
    const response = await axiosPOST(url, params, data);
    return response.data.data;
  } catch (error) {
    console.error(
      'response pptService.generatePPT: Error fetching summary and opportunity data:',
      error.response || error.message || error,
    );
    throw error;
  }
};
