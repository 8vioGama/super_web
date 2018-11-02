import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Controls
// import PrivateRoute from './components/controls/PrivateRoute/PrivateRoute';
import NotFound from './components/common/NotFound/NotFound';

// Pages
import Home from './components/pages/Home';

export default () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      {/* <PrivateRoute exact path="/" Component={Summary} isAuthenticated={isLoggedIn} /> */}
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);
