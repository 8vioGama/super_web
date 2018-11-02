import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

import { origin, destination, distance, quote, vehicleTypes, vehicleType } from './components/pages/Home/_reducers';

const reducers = combineReducers({
  origin,
  destination,
  distance,
  quote,
  vehicleTypes,
  vehicleType,
});

const Store = createStore(reducers, applyMiddleware(thunk));

export default Store;
