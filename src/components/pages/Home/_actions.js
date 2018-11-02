import { SET_ORIGIN, SET_DESTINATION, SET_DISTANCE, SET_QUOTE, SET_VEHICLETYPES, SET_VEHICLETYPE } from './_types';
import { getQuote, getVehicleTypes, postQuote } from '../../../lib/api';

/*
 * action creators
 */
export function setOrigin(origin) {
  return (
    {
      type: SET_ORIGIN,
      payload: origin,
    }
  );
}

export function setDestination(destination) {
  return (
    {
      type: SET_DESTINATION,
      payload: destination,
    }
  );
}

export function setDistance(distance) {
  return (
    {
      type: SET_DISTANCE,
      payload: distance,
    }
  );
}

export function setQuote(quote) {
  return (
    {
      type: SET_QUOTE,
      payload: quote,
    }
  );
}

export function setVehicleType(vehicleType) {
  return (
    {
      type: SET_VEHICLETYPE,
      payload: vehicleType,
    }
  );
}

export function setVehicleTypes(vehicleTypes) {
  return (
    {
      type: SET_VEHICLETYPES,
      payload: vehicleTypes,
    }
  );
}


export function requestQuote(data) {
  return (dispatch) => {
    return new Promise(function(resolve, reject) {
      getQuote(data)
        .then((quote) => {
          dispatch(setQuote(quote));
          resolve(quote);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
}

export function requestService(data) {
  return () => {
    return new Promise(function(resolve, reject) {
      postQuote(data)
        .then((service) => {
          resolve(service);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
}

export function requestVehicleTypes() {
  return (dispatch) => {
    getVehicleTypes().then((vehicleTypes) => {
      dispatch(setVehicleTypes(vehicleTypes));
    });
  };
}