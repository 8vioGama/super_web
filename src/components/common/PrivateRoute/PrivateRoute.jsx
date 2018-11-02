import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ path, Component, isAuthenticated }) => {
  return (
    <Route
      exac
      path={path}
      render={props => (
      isAuthenticated === true
        ? <Component {...props} />
      : <Redirect to="/login" />
    )}
    />
  );
};

PrivateRoute.propTypes = {
  Component: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

export default PrivateRoute;
