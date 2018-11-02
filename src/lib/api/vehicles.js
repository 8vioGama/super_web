import axios from 'axios';
import { API_BASE_URL } from '../config';

function getVehicleTypes() {
  const url = `${API_BASE_URL}/api/vehicleTypes`;
  return axios.get(url)
    .then(response => response.data)
    .catch((error) => {
      console.log('error', error);
    });
}

export {
  getVehicleTypes,
};
