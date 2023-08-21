import axios from 'axios';

const getResponseHTML = (url) => axios.get(url);
const getResponseImg = (url) => axios.get(url, { responseType: 'arraybuffer' });
const getData = (response) => response.data;

export { getResponseHTML, getData, getResponseImg };
