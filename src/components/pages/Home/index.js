import { connect } from 'react-redux';
import { setOrigin, setDestination, setDistance, requestQuote, requestVehicleTypes, setVehicleType, setQuote, requestService } from './_actions';
import View from './Home';

function mapStateToProps({ origin, destination, distance, quote, vehicleTypes, vehicleType }) {
  return {
    origin,
    destination,
    distance,
    quote,
    vehicleTypes,
    vehicleType,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setOrigin: origin => dispatch(setOrigin(origin)),
    setDestination: destination => dispatch(setDestination(destination)),
    setDistance: distance => dispatch(setDistance(distance)),
    setVehicleType: vehicleType => dispatch(setVehicleType(vehicleType)),
    requestQuote: request => dispatch(requestQuote(request)),
    setQuote: quote => dispatch(setQuote(quote)),
    requestVehicleTypes: () => dispatch(requestVehicleTypes()),
    requestService: request => dispatch(requestService(request)),
  };
}

const Home = connect(
  mapStateToProps,
  mapDispatchToProps,
)(View);

export default Home;
