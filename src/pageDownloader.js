import axios from 'axios';
import debug from 'axios-debug-log';

debug.addLogger(axios);

export const getResponse = (link) => axios.get(link);
export const getResponsesOfLinks = (links) => {
  const arr = Object.values(links).flat();
  return arr.map(([link]) => getResponse(link));
};
export const getResponseImg = (url) => axios.get(url, { responseType: 'arraybuffer' });
export const getData = (response) => response.data;
