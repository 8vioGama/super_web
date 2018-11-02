import { SET_ORIGIN, SET_DESTINATION, SET_DISTANCE, SET_QUOTE, SET_VEHICLETYPES, SET_VEHICLETYPE } from './_types';

function origin(state = {}, { type, payload }) {
  switch (type) {
    case SET_ORIGIN:
      return payload;
    default:
      return state;
  }
}

function destination(state = {}, { type, payload }) {
  switch (type) {
    case SET_DESTINATION:
      return payload;
    default:
      return state;
  }
}

function distance(state = {}, { type, payload }) {
  switch (type) {
    case SET_DISTANCE:
      return payload;
    default:
      return state;
  }
}

function quote(state = '', { type, payload }) {
  switch (type) {
    case SET_QUOTE:
      return payload;
    default:
      return state;
  }
}

function vehicleTypes(state = [], { type, payload }) {
  switch (type) {
    case SET_VEHICLETYPES:
      return payload;
    default:
      return state;
  }
}

function vehicleType(state = {}, { type, payload }) {
  switch (type) {
    case SET_VEHICLETYPE:
      return payload;
    default:
      return state;
  }
}

export { origin, destination, distance, quote, vehicleTypes, vehicleType };
