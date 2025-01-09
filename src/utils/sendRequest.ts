import axios from 'axios';
import { env } from './env';

const API = env('DOMAIN');

export const sendRequest = async () => {
  try {
    const { data } = await axios.get<string>(API);
    console.log('Server Response:', data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error making request:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
  }
};
