import React from 'react';
import { isLoggedIn } from '../common/utility';

import {
    Route,
    Redirect
  } from "react-router-dom";

const ProtectedRoute = ({children, ...rest}) => (
    <Route
      {...rest}
      render={() =>
        isLoggedIn() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
            }}
          />
        )
      }
    />
);

export default ProtectedRoute;