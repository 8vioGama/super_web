import axios from 'axios';
import { API_BASE_URL } from '../config';

function getQuote(data) {
  const url = `${API_BASE_URL}/api/quotes/calculate`;
  return axios.post(url, data)
    .then(response => response.data.data.totalPrice)
    .catch((error) => {
      console.log('error', error);
    });
}

function postQuote(params) {
  const url = `${API_BASE_URL}/api/quotes/new`;
  return axios.post(url, params)
    .then(response => response.data)
    .catch((error) => {
      console.log('error', error);
    });
}

export {
  getQuote,
  postQuote,
};
