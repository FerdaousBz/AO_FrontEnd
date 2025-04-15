import { BACK_END_FILTER_NAVBAR, BACK_END_OPP_ID_VALUES } from '@/utils/consts';
import axios from 'axios';
import { axiosGET } from '@/service/apiServices';

export const getValueFromDict = async () => {
  try {
    const url = `${import.meta.env.VITE_API_URI}${BACK_END_FILTER_NAVBAR}`;
    const params = {};
    const data = {};
    const response = await axiosGET(url, params, data);
    console.log('filters', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching Filter:', error);
    throw error;
  }
};
export const getValueFromDictForOpp = async ({ oppID }) => {
  try {
    const url = `${import.meta.env.VITE_API_URI}${BACK_END_OPP_ID_VALUES}${oppID}`;
    const params = {};
    const data = {};
    const response = await axiosGET(url, params, data);
    console.log('filters OPP', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching Filter for opportunity:', error);
    throw error;
  }
};
