import { sendRequest } from './sendRequest.js';

export const startRequestInterval = (interval: number) => {
  setInterval(sendRequest, interval);

  sendRequest();
};
