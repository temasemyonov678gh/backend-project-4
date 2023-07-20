import axios from 'axios';

const getResponse = (url) => axios.get(url);
const getData = (response) => response.data;

export { getResponse, getData };
