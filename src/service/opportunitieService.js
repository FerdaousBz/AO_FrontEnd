import {
  BACKEND_NEW_OPPORTUNITIES,
  BACKEND_OPPORTUNITIES,
  BACKEND_OPPORTUNITIES_ID,
  BACKEND_OPPORT_SUMMARY,
  BACKEND_OPP_INFORMATION,
} from '@/utils/consts';
import axios from 'axios';
import Cookies from 'js-cookie';

//Get list of opportunities
export const getAllOpportunities = async (page, limit, accessToken) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URI}${BACKEND_OPPORTUNITIES}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Include token in headers
      },
      params: {
        page: page,
        limit: limit,
      },
    });
    console.log('response opp', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching summary and opportunity data:');
    throw error;
  }
};
//Get opportunities information and summary generated
export const getOppSummary = async (oppId) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(
      `${import.meta.env.VITE_API_URI}${BACKEND_OPPORT_SUMMARY}${oppId}/generate-summary`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include token in headers
        },
      },
    );
    console.log('response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching summary and opportunity data:',
      error.response || error.message || error,
    );
    throw error;
  }
};

// Create new opportunity
export const createOpportunity = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URI}${BACKEND_NEW_OPPORTUNITIES}`,
      data,
    );
    console.log('New opportunity created:', response);
    return response.data;
  } catch (error) {
    console.error('Error in creating new opportunity', error);
    throw error;
  }
};

// Get opportunity by ID
export const getOpportunityById = async (id) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URI}${BACKEND_OPPORTUNITIES_ID.replace('{id}', id)}`,
    );
    console.log(`Opportunity with ID ${id}:`, response);
    return response.data;
  } catch (error) {
    console.error(`Error in getting opportunity with ID ${id}`, error);
    throw error;
  }
};

// Get opportunity information by ID
export const getOpportunityInformation = async (id) => {
  try {
    // const response = await axios.get(
    //   `${import.meta.env.VITE_API_URI}${BACKEND_OPP_INFORMATION.replace('{id}', id)}`,
    // );
    const response = await axios.get(
      `${import.meta.env.VITE_API_URI}${BACKEND_OPP_INFORMATION}${id}/information`,
    );
    console.log('BACKEND_OPP_INFORMATION:', BACKEND_OPP_INFORMATION);
    console.log(`Opportunity information with ID ${id}:`, response);
    return response.data;
  } catch (error) {
    console.error(`Error in getting opportunity information with ID ${id}`, error);
    throw error;
  }
};
