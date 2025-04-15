import {
  BACKEND_ADD_PARTICIPANT,
  BACKEND_ALL_PARTICIPANT,
} from '@/utils/consts';
import axios from 'axios';



// Add a new participant to the opportunity
export const addParticipant = async (participantData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URI}${BACKEND_ADD_PARTICIPANT}`,
      participantData,
    );
    console.log('Participant added successfully:', response);
    return response.data;
  } catch (error) {
    console.error('Error adding participant:', error);
    throw error;
  }
};
//Get all participant
export const getParticipant = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URI}${BACKEND_ALL_PARTICIPANT}`);
    console.log('Participant :', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting participant:', error);
    throw error;
  }
};
