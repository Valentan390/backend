import axios from 'axios';

export const sendRequest = async () => {
  try {
    const { data } = await axios.get<string>('http://localhost:3000/');
    console.log('Server Response:', data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error making request:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
  }
};
